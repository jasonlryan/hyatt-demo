const PeakMetricsClient = require("../utils/peakMetricsClient");
const LRUCache = require("./LRUCache");
const {
  topNarratives,
  calculateTrendVelocity,
  calculateRiskScore,
  extractKeyInsights,
  getChannelDistribution,
  sentimentRisk,
} = require("../utils/metricsTransform");

class PeakMetricsDataService {
  constructor() {
    this.client = null;
    this.cache = new LRUCache({
      maxSize: 100,
      defaultTTL: 600000, // 10 minutes default
    });

    // TTL configurations for different data types
    this.ttlConfig = {
      brandOverview: 600000, // 10 minutes
      brandDetail: 600000, // 10 minutes
      narratives: 300000, // 5 minutes
      mentions: 300000, // 5 minutes
      trendInsights: 900000, // 15 minutes
    };

    // Rate limiting for API calls
    this._lastCallTime = {};
    this._minCallInterval = 5000; // 5 seconds between calls for same endpoint

    // Prevent repeated calls for same data
    this._lastCallResults = {};
    this._lastCallErrors = {};

    // Initialize client if feature enabled
    if (process.env.ENABLE_PEAK_METRICS === "true") {
      try {
        this.client = new PeakMetricsClient();
        console.log("✅ PeakMetricsDataService: Initialized successfully");
      } catch (error) {
        console.error(
          "❌ PeakMetricsDataService: Failed to initialize client:",
          error.message
        );
      }
    } else {
      console.log("ℹ️ PeakMetricsDataService: PeakMetrics feature disabled");
    }
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return this.client !== null;
  }

  /**
   * Check if we should rate limit a call
   */
  _shouldRateLimit(endpoint) {
    const now = Date.now();
    const lastCall = this._lastCallTime[endpoint];

    if (lastCall && now - lastCall < this._minCallInterval) {
      return true;
    }

    this._lastCallTime[endpoint] = now;
    return false;
  }

  /**
   * Get cached result for repeated calls
   */
  _getCachedResult(endpoint, cacheKey) {
    const now = Date.now();
    const lastCall = this._lastCallTime[endpoint];

    // If called within 10 seconds, return cached result
    if (lastCall && now - lastCall < 10000) {
      const cached = this._lastCallResults[cacheKey];
      if (cached) {
        console.log(
          `📋 PeakMetricsDataService: Returning cached result for ${endpoint}`
        );
        return cached;
      }
    }

    return null;
  }

  /**
   * Cache result for future calls
   */
  _cacheResult(endpoint, cacheKey, result) {
    this._lastCallResults[cacheKey] = result;
    this._lastCallTime[endpoint] = Date.now();
  }

  /**
   * Get all brands overview (lightweight list for dashboards)
   */
  async getAllBrandsOverview(options = {}) {
    if (!this.isAvailable()) {
      return this._createErrorResponse("PeakMetrics service not available");
    }

    // Rate limiting disabled for now
    // if (this._shouldRateLimit("brands:overview")) {
    //   console.log(
    //     "⏳ PeakMetricsDataService: Rate limiting brands overview request"
    //   );
    //   return this._createErrorResponse(
    //     "Rate limit exceeded, please try again in a few seconds"
    //   );
    // }

    const cacheKey = `brands:overview:${JSON.stringify(options)}`;

    // Check for recent cached result
    const recentCached = this._getCachedResult("brands:overview", cacheKey);
    if (recentCached) {
      return recentCached;
    }

    // Check LRU cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return this._createSuccessResponse(cached, true);
    }

    try {
      // Get all workspaces
      const workspaces = await this.client.getWorkspaces();
      console.log(
        `📋 PeakMetricsDataService: Found ${workspaces.length} workspaces:`,
        workspaces.map((w) => `${w.title} (${w.id})`)
      );

      // Transform to brand overviews with parallel processing
      const brandPromises = workspaces.map(async (workspace) => {
        try {
          // Get recent narratives for metrics calculation
          const since = new Date(
            Date.now() - 48 * 60 * 60 * 1000
          ).toISOString();
          const to = new Date().toISOString();

          const narrativesResponse = await this.client.getNarratives(
            workspace.id,
            {
              limit: 20,
              since: since,
              to: to,
            }
          );

          // Handle different response formats
          const narratives = Array.isArray(narrativesResponse)
            ? narrativesResponse
            : narrativesResponse?.data && Array.isArray(narrativesResponse.data)
            ? narrativesResponse.data
            : narrativesResponse?.narratives &&
              Array.isArray(narrativesResponse.narratives)
            ? narrativesResponse.narratives
            : [];

          const insights = extractKeyInsights(narratives);
          const velocity = calculateTrendVelocity(narratives);

          // Calculate average risk score from top narratives
          const topNarrs = topNarratives(narratives, 5);
          const avgRiskScore =
            topNarrs.reduce((sum, n) => sum + calculateRiskScore(n), 0) /
            (topNarrs.length || 1);

          return {
            id: workspace.id,
            title: workspace.title,
            workspaceId: workspace.id,
            last48hMentions: insights.totalMentions,
            avgSentiment: this._calculateAvgSentiment(narratives),
            velocity: velocity,
            riskScore: Math.round(avgRiskScore),
            query: workspace.query,
          };
        } catch (error) {
          // Log error but don't spam console for repeated failures
          if (
            !this._recentErrors ||
            !this._recentErrors[workspace.id] ||
            Date.now() - this._recentErrors[workspace.id] > 60000
          ) {
            // Log once per minute
            console.error(
              `❌ PeakMetricsDataService: Failed to get overview for workspace ${workspace.id}: ${error.message}`
            );
            this._recentErrors = this._recentErrors || {};
            this._recentErrors[workspace.id] = Date.now();
          }
          return null;
        }
      });

      const brands = (await Promise.all(brandPromises)).filter(
        (b) => b !== null
      );

      console.log(
        `✅ PeakMetricsDataService: Successfully processed ${brands.length} out of ${workspaces.length} workspaces`
      );

      // Cache the result
      this.cache.set(cacheKey, brands, this.ttlConfig.brandOverview);

      const result = this._createSuccessResponse(brands, false);
      this._cacheResult("brands:overview", cacheKey, result);

      return result;
    } catch (error) {
      console.error(
        "❌ PeakMetricsDataService: Failed to get brands overview:",
        error
      );
      return this._createErrorResponse(
        "Failed to retrieve brands overview",
        error
      );
    }
  }

  /**
   * Get detailed information for a specific brand
   */
  async getBrandById(brandIdOrName) {
    if (!this.isAvailable()) {
      return this._createErrorResponse("PeakMetrics service not available");
    }

    const cacheKey = `brand:detail:${brandIdOrName}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return this._createSuccessResponse(cached, true);
    }

    try {
      // Find workspace by ID or name
      let workspace;
      const workspaces = await this.client.getWorkspaces();

      workspace = workspaces.find(
        (w) =>
          w.id === brandIdOrName ||
          (typeof brandIdOrName === "string" &&
            w.title.toLowerCase() === brandIdOrName.toLowerCase())
      );

      if (!workspace) {
        return this._createErrorResponse(`Brand not found: ${brandIdOrName}`);
      }

      // Get detailed data
      const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const to = new Date().toISOString();

      const [narrativesResponse, mentionsResponse] = await Promise.all([
        this.client.getNarratives(workspace.id, {
          limit: 50,
          since: since,
          to: to,
        }),
        this.client.getMentions(workspace.id, {
          limit: 10,
          since: since,
          to: to,
        }),
      ]);

      // Handle different response formats
      const narratives = Array.isArray(narrativesResponse)
        ? narrativesResponse
        : narrativesResponse?.data && Array.isArray(narrativesResponse.data)
        ? narrativesResponse.data
        : narrativesResponse?.narratives &&
          Array.isArray(narrativesResponse.narratives)
        ? narrativesResponse.narratives
        : [];

      const recentMentions = Array.isArray(mentionsResponse)
        ? mentionsResponse
        : mentionsResponse?.data && Array.isArray(mentionsResponse.data)
        ? mentionsResponse.data
        : mentionsResponse?.mentions && Array.isArray(mentionsResponse.mentions)
        ? mentionsResponse.mentions
        : [];

      const insights = extractKeyInsights(narratives);
      const velocity = calculateTrendVelocity(narratives);
      const topNarrs = topNarratives(narratives, 10);
      const channelDist = getChannelDistribution(narratives);
      const avgRiskScore =
        topNarrs.reduce((sum, n) => sum + calculateRiskScore(n), 0) /
        (topNarrs.length || 1);

      // Provide helpful feedback for low activity (only log once per workspace)
      if (narratives.length === 0 && recentMentions.length > 0) {
        if (
          !this._loggedNoNarratives ||
          !this._loggedNoNarratives[workspace.id]
        ) {
          console.log(
            `ℹ️ PeakMetricsDataService: No narratives found for ${workspace.title} (${recentMentions.length} mentions in last 48h). Narratives require higher mention volume to be generated.`
          );
          this._loggedNoNarratives = this._loggedNoNarratives || {};
          this._loggedNoNarratives[workspace.id] = true;
        }
      } else if (narratives.length > 0) {
        if (!this._loggedNarratives || !this._loggedNarratives[workspace.id]) {
          console.log(
            `✅ PeakMetricsDataService: Found ${narratives.length} narratives for ${workspace.title}`
          );
          this._loggedNarratives = this._loggedNarratives || {};
          this._loggedNarratives[workspace.id] = true;
        }
      }

      const brandDetail = {
        // Overview fields
        id: workspace.id,
        title: workspace.title,
        workspaceId: workspace.id,
        last48hMentions: insights.totalMentions,
        avgSentiment: this._calculateAvgSentiment(narratives),
        velocity: velocity,
        riskScore: Math.round(avgRiskScore),
        query: workspace.query,

        // Detail fields
        topNarratives: topNarrs.map((n) => this._transformNarrative(n)),
        sentimentBreakdown: this._calculateSentimentBreakdown(narratives),
        channelBreakdown: channelDist,
        samples: recentMentions
          .slice(0, 5)
          .map((m) => this._transformMention(m)),
        lastUpdated: new Date().toISOString(),
      };

      // Cache the result
      this.cache.set(cacheKey, brandDetail, this.ttlConfig.brandDetail);

      return this._createSuccessResponse(brandDetail, false);
    } catch (error) {
      console.error(
        "❌ PeakMetricsDataService: Failed to get brand detail:",
        error
      );
      return this._createErrorResponse(
        "Failed to retrieve brand details",
        error
      );
    }
  }

  /**
   * Get narratives for a brand
   */
  async getNarratives(brandIdOrName, options = {}) {
    if (!this.isAvailable()) {
      return this._createErrorResponse("PeakMetrics service not available");
    }

    // Handle workspace name lookup
    let workspaceId = brandIdOrName;
    if (isNaN(brandIdOrName)) {
      const workspaces = await this.client.getWorkspaces();
      const workspace = workspaces.find(
        (w) =>
          typeof brandIdOrName === "string" &&
          w.title.toLowerCase() === brandIdOrName.toLowerCase()
      );
      if (!workspace) {
        return this._createErrorResponse(`Brand not found: ${brandIdOrName}`);
      }
      workspaceId = workspace.id;
    }

    // Ensure required time-window parameters exist BEFORE caching & request
    const defaults = {
      since: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48h ago
      to: new Date().toISOString(),
      limit: 50,
    };
    const finalOptions = { ...defaults, ...options };

    const cacheKey = `narratives:${workspaceId}:${JSON.stringify(
      finalOptions
    )}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return this._createSuccessResponse(cached, true);
    }

    try {
      // parameters already merged into finalOptions above
      const response = await this.client.getNarratives(
        workspaceId,
        finalOptions
      );

      // Handle different response formats
      let narratives = [];
      if (Array.isArray(response)) {
        narratives = response;
      } else if (response && Array.isArray(response.data)) {
        narratives = response.data;
      } else if (
        response &&
        response.narratives &&
        Array.isArray(response.narratives)
      ) {
        narratives = response.narratives;
      } else {
        console.warn(
          "⚠️ PeakMetricsDataService: Unexpected narratives response format:",
          typeof response,
          response
        );
        narratives = [];
      }

      const transformed = narratives.map((n) => this._transformNarrative(n));

      // Provide helpful feedback for empty narratives (only log once per workspace)
      if (transformed.length === 0) {
        if (
          !this._loggedNoNarratives ||
          !this._loggedNoNarratives[workspaceId]
        ) {
          console.log(
            `ℹ️ PeakMetricsDataService: No narratives found for workspace ${workspaceId}. This may be due to low mention volume in the specified time window.`
          );
          this._loggedNoNarratives = this._loggedNoNarratives || {};
          this._loggedNoNarratives[workspaceId] = true;
        }
      }

      // Cache the result
      this.cache.set(cacheKey, transformed, this.ttlConfig.narratives);

      return this._createSuccessResponse(transformed, false);
    } catch (error) {
      console.error(
        "❌ PeakMetricsDataService: Failed to get narratives:",
        error
      );
      return this._createErrorResponse("Failed to retrieve narratives", error);
    }
  }

  /**
   * Get mentions for a brand
   */
  async getMentions(brandIdOrName, options = {}) {
    if (!this.isAvailable()) {
      return this._createErrorResponse("PeakMetrics service not available");
    }

    // Handle workspace name lookup
    let workspaceId = brandIdOrName;
    if (isNaN(brandIdOrName)) {
      const workspaces = await this.client.getWorkspaces();
      const workspace = workspaces.find(
        (w) =>
          typeof brandIdOrName === "string" &&
          w.title.toLowerCase() === brandIdOrName.toLowerCase()
      );
      if (!workspace) {
        return this._createErrorResponse(`Brand not found: ${brandIdOrName}`);
      }
      workspaceId = workspace.id;
    }

    // Ensure required time-window parameters exist BEFORE caching & request
    const mDefaults = {
      since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7d ago
      to: new Date().toISOString(),
      limit: 50,
    };
    const mFinalOptions = { ...mDefaults, ...options };

    const cacheKey = `mentions:${workspaceId}:${JSON.stringify(mFinalOptions)}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return this._createSuccessResponse(cached, true);
    }

    try {
      // parameters already merged into mFinalOptions above
      const response = await this.client.getMentions(
        workspaceId,
        mFinalOptions
      );

      // Handle different response formats
      let mentions = [];
      if (Array.isArray(response)) {
        mentions = response;
      } else if (response && Array.isArray(response.data)) {
        mentions = response.data;
      } else if (
        response &&
        response.mentions &&
        Array.isArray(response.mentions)
      ) {
        mentions = response.mentions;
      } else {
        console.warn(
          "⚠️ PeakMetricsDataService: Unexpected mentions response format:",
          typeof response,
          response
        );
        mentions = [];
      }

      const transformed = mentions.map((m) => this._transformMention(m));

      // Cache the result
      this.cache.set(cacheKey, transformed, this.ttlConfig.mentions);

      return this._createSuccessResponse(transformed, false);
    } catch (error) {
      console.error(
        "❌ PeakMetricsDataService: Failed to get mentions:",
        error
      );
      return this._createErrorResponse("Failed to retrieve mentions", error);
    }
  }

  /**
   * Get trend insights for a brand
   */
  async getTrendInsights(brandIdOrName) {
    if (!this.isAvailable()) {
      return this._createErrorResponse("PeakMetrics service not available");
    }

    // Handle workspace name lookup
    let workspaceId = brandIdOrName;
    if (isNaN(brandIdOrName)) {
      const workspaces = await this.client.getWorkspaces();
      const workspace = workspaces.find(
        (w) =>
          typeof brandIdOrName === "string" &&
          w.title.toLowerCase() === brandIdOrName.toLowerCase()
      );
      if (!workspace) {
        return this._createErrorResponse(`Brand not found: ${brandIdOrName}`);
      }
      workspaceId = workspace.id;
    }

    const cacheKey = `trends:${workspaceId}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return this._createSuccessResponse(cached, true);
    }

    try {
      // Get narratives for different time periods
      const now = new Date();
      const [recentResponse, yesterdayResponse, weekAgoResponse] =
        await Promise.all([
          this.client.getNarratives(workspaceId, {
            since: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
            to: new Date().toISOString(),
            limit: 100,
          }),
          this.client.getNarratives(workspaceId, {
            since: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
            to: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
            limit: 100,
          }),
          this.client.getNarratives(workspaceId, {
            since: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
            limit: 100,
          }),
        ]);

      // Handle different response formats for each period
      const recent = Array.isArray(recentResponse)
        ? recentResponse
        : recentResponse?.data && Array.isArray(recentResponse.data)
        ? recentResponse.data
        : recentResponse?.narratives && Array.isArray(recentResponse.narratives)
        ? recentResponse.narratives
        : [];

      const yesterday = Array.isArray(yesterdayResponse)
        ? yesterdayResponse
        : yesterdayResponse?.data && Array.isArray(yesterdayResponse.data)
        ? yesterdayResponse.data
        : yesterdayResponse?.narratives &&
          Array.isArray(yesterdayResponse.narratives)
        ? yesterdayResponse.narratives
        : [];

      const weekAgo = Array.isArray(weekAgoResponse)
        ? weekAgoResponse
        : weekAgoResponse?.data && Array.isArray(weekAgoResponse.data)
        ? weekAgoResponse.data
        : weekAgoResponse?.narratives &&
          Array.isArray(weekAgoResponse.narratives)
        ? weekAgoResponse.narratives
        : [];

      const recentInsights = extractKeyInsights(recent);
      const yesterdayInsights = extractKeyInsights(yesterday);

      // Calculate growth rate
      const growthRate24h =
        yesterdayInsights.totalMentions > 0
          ? ((recentInsights.totalMentions - yesterdayInsights.totalMentions) /
              yesterdayInsights.totalMentions) *
            100
          : 0;

      // Determine momentum
      let momentum = "steady";
      if (growthRate24h > 50) momentum = "accelerating";
      else if (growthRate24h < -30) momentum = "decelerating";

      const trendInsights = {
        workspaceId: workspaceId,
        firstSeen: weekAgo[0]?.created || new Date().toISOString(),
        growthRate24h: Math.round(growthRate24h),
        halfLifeDays: this._calculateHalfLife(recent, yesterday, weekAgo),
        momentum: momentum,
        topTrends: recentInsights.topTrends,
        totalMentions: recentInsights.totalMentions,
        sentimentOverview: recentInsights.sentimentOverview,
        highRiskTopics: recentInsights.highRiskTopics,
      };

      // Cache the result
      this.cache.set(cacheKey, trendInsights, this.ttlConfig.trendInsights);

      return this._createSuccessResponse(trendInsights, false);
    } catch (error) {
      console.error(
        "❌ PeakMetricsDataService: Failed to get trend insights:",
        error
      );
      return this._createErrorResponse(
        "Failed to retrieve trend insights",
        error
      );
    }
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache() {
    this.cache.clear();
    console.log("🧹 PeakMetricsDataService: Cache cleared");
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  // Private helper methods

  _createSuccessResponse(data, cached = false) {
    return {
      data,
      error: null,
      cached,
      timestamp: Date.now(),
    };
  }

  _createErrorResponse(message, error = null) {
    return {
      data: null,
      error: {
        code: "PEAKMETRICS_ERROR",
        message,
        details: error?.message || null,
        timestamp: new Date().toISOString(),
      },
      cached: false,
      timestamp: Date.now(),
    };
  }

  _transformNarrative(narrative) {
    return {
      id: narrative.id || narrative.title,
      title: narrative.title,
      summary: narrative.summary || "",
      mentionCount: narrative.aggregations?.mentionCount || 0,
      avgSentiment: narrative.aggregations?.avgSentiment || 0,
      relevancy: narrative.aggregations?.relevancyScore || 0,
      riskScore: calculateRiskScore(narrative),
      created: narrative.created,
      aggregations: narrative.aggregations,
    };
  }

  _transformMention(mention) {
    return {
      id: mention.id,
      url: mention.url || "",
      title: mention.title || "",
      excerpt: mention.excerpt || mention.text || "",
      published: mention.published || mention.created,
      source: mention.source || "unknown",
      sentiment: mention.sentiment || 0,
      relevancy: mention.relevancy || 0,
    };
  }

  _calculateAvgSentiment(narratives) {
    if (!narratives.length) return 0;
    const total = narratives.reduce(
      (sum, n) => sum + (n.aggregations?.avgSentiment || 0),
      0
    );
    return Math.round(total / narratives.length);
  }

  _calculateSentimentBreakdown(narratives) {
    const breakdown = { positive: 0, neutral: 0, negative: 0 };

    narratives.forEach((narrative) => {
      const sentiment = narrative.aggregations?.avgSentiment || 0;
      if (sentiment > 10) breakdown.positive++;
      else if (sentiment < -10) breakdown.negative++;
      else breakdown.neutral++;
    });

    const total = narratives.length || 1;
    return {
      positive: Math.round((breakdown.positive / total) * 100),
      neutral: Math.round((breakdown.neutral / total) * 100),
      negative: Math.round((breakdown.negative / total) * 100),
    };
  }

  _calculateHalfLife(recent, yesterday, weekAgo) {
    // Simple half-life calculation based on mention decay
    const recentCount = recent.reduce(
      (sum, n) => sum + (n.aggregations?.mentionCount || 0),
      0
    );
    const weekCount = weekAgo.reduce(
      (sum, n) => sum + (n.aggregations?.mentionCount || 0),
      0
    );

    if (weekCount === 0 || recentCount >= weekCount) {
      return 99; // Growing or stable
    }

    // Rough estimate of days to half the mentions
    const decayRate = (weekCount - recentCount) / weekCount;
    const halfLife = Math.round(3.5 / decayRate); // Assuming linear decay over 7 days

    return Math.min(99, Math.max(1, halfLife));
  }
}

// Singleton instance
let instance = null;

module.exports = {
  getInstance: () => {
    if (!instance) {
      instance = new PeakMetricsDataService();
    }
    return instance;
  },
  PeakMetricsDataService,
};
