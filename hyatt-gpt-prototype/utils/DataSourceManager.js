const axios = require("axios");

class DataSourceManager {
  constructor() {
    // Commenting out real API integrations for now
    // this.googleTrendsApiKey = process.env.GOOGLE_TRENDS_API_KEY;
    // this.newsApiKey = process.env.NEWS_API_KEY;
    // this.socialMediaApiKey = process.env.SOCIAL_MEDIA_API_KEY;

    // Force use of enhanced mock data for now
    this.enableRealDataSources = false; // Always use mock data
  }

  async getTrendingTopics(keywords, timeframe = "7d") {
    // Always use enhanced mock data for now
    return this.getEnhancedMockTrendingData(keywords);

    /* COMMENTED OUT - Real API integration
    if (!this.enableRealDataSources || !this.googleTrendsApiKey) {
      return this.getMockTrendingData(keywords);
    }

    try {
      // Google Trends API integration
      const response = await axios.get(
        "https://trends.googleapis.com/trends/api/explore",
        {
          params: {
            hl: "en-US",
            tz: 300,
            req: JSON.stringify({
              comparisonItem: keywords.map((keyword) => ({
                keyword,
                geo: "",
                time: timeframe,
              })),
              category: 0,
              property: "",
            }),
            key: this.googleTrendsApiKey,
          },
          timeout: 10000,
        }
      );

      return this.parseTrendsData(response.data);
    } catch (error) {
      console.warn(
        "🔄 Google Trends API failed, using mock data:",
        error.message
      );
      return this.getMockTrendingData(keywords);
    }
    */
  }

  async getRelevantNews(keywords, category = "business", days = 7) {
    // Always use enhanced mock data for now
    return this.getEnhancedMockNewsData(keywords);

    /* COMMENTED OUT - Real API integration
    if (!this.enableRealDataSources || !this.newsApiKey) {
      return this.getMockNewsData(keywords);
    }

    try {
      // News API integration
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: keywords.join(" OR "),
          from: fromDate.toISOString().split("T")[0],
          sortBy: "relevancy",
          language: "en",
          pageSize: 20,
          apiKey: this.newsApiKey,
        },
        timeout: 10000,
      });

      return this.parseNewsData(response.data.articles);
    } catch (error) {
      console.warn("🔄 News API failed, using mock data:", error.message);
      return this.getMockNewsData(keywords);
    }
    */
  }

  async getSocialMediaSentiment(keywords, platform = "twitter") {
    // Always use enhanced mock data for now
    return this.getEnhancedMockSocialData(keywords);

    /* COMMENTED OUT - Real API integration
    if (!this.enableRealDataSources || !this.socialMediaApiKey) {
      return this.getMockSocialData(keywords);
    }

    try {
      // Social media API integration (example with Twitter API v2)
      const response = await axios.get(
        "https://api.twitter.com/2/tweets/search/recent",
        {
          params: {
            query: keywords.join(" OR "),
            "tweet.fields": "public_metrics,created_at,context_annotations",
            max_results: 100,
          },
          headers: {
            Authorization: `Bearer ${this.socialMediaApiKey}`,
          },
          timeout: 10000,
        }
      );

      return this.parseSocialData(response.data);
    } catch (error) {
      console.warn(
        "🔄 Social Media API failed, using mock data:",
        error.message
      );
      return this.getMockSocialData(keywords);
    }
    */
  }

  // Enhanced mock data methods that are more dynamic and campaign-specific
  getEnhancedMockTrendingData(keywords) {
    console.log("🔄 Using enhanced mock trending data (no external APIs)");

    // Create more realistic, campaign-specific trending data
    const trendData = keywords.map((keyword, index) => {
      const baseInterest = 60 + (keyword.length % 30); // More deterministic
      const seasonalBoost = keyword.toLowerCase().includes("eco")
        ? 15
        : keyword.toLowerCase().includes("luxury")
        ? 10
        : keyword.toLowerCase().includes("business")
        ? 8
        : 0;

      return {
        keyword,
        interest: Math.min(100, baseInterest + seasonalBoost),
        growth: keyword.toLowerCase().includes("sustainable")
          ? 25
          : keyword.toLowerCase().includes("wellness")
          ? 20
          : 10 + index * 3,
        relatedQueries: this.generateRelatedQueries(keyword),
        regions: ["United States", "United Kingdom", "Canada", "Australia"],
        timeframe: "7d",
        source: "enhanced_mock",
      };
    });

    return {
      trends: trendData,
      timestamp: new Date().toISOString(),
      dataQuality: "enhanced_mock",
    };
  }

  getEnhancedMockNewsData(keywords) {
    console.log("🔄 Using enhanced mock news data (no external APIs)");

    const mockArticles = keywords.flatMap((keyword) => [
      {
        title: this.generateNewsTitle(keyword, "trend"),
        description: `Industry analysis shows ${keyword} sector experiencing significant shifts in consumer behavior and market dynamics...`,
        url: `https://example.com/${keyword
          .toLowerCase()
          .replace(/\s+/g, "-")}-trends`,
        publishedAt: new Date(
          Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        source: { name: "Travel Industry Weekly" },
        relevanceScore: 75 + Math.floor(Math.random() * 20),
      },
      {
        title: this.generateNewsTitle(keyword, "innovation"),
        description: `New developments in ${keyword} are reshaping industry standards and customer expectations...`,
        url: `https://example.com/${keyword
          .toLowerCase()
          .replace(/\s+/g, "-")}-innovation`,
        publishedAt: new Date(
          Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        source: { name: "Hospitality Business Today" },
        relevanceScore: 70 + Math.floor(Math.random() * 25),
      },
    ]);

    return {
      articles: mockArticles,
      totalResults: mockArticles.length,
      timestamp: new Date().toISOString(),
      dataQuality: "enhanced_mock",
    };
  }

  getEnhancedMockSocialData(keywords) {
    console.log("🔄 Using enhanced mock social data (no external APIs)");

    // Generate more realistic sentiment based on keywords
    const positiveBoost = keywords.some(
      (k) =>
        k.toLowerCase().includes("luxury") ||
        k.toLowerCase().includes("eco") ||
        k.toLowerCase().includes("wellness")
    )
      ? 15
      : 0;

    return {
      sentiment: {
        positive: Math.min(
          85,
          50 + positiveBoost + Math.floor(Math.random() * 20)
        ),
        neutral: 20 + Math.floor(Math.random() * 15),
        negative: Math.max(
          5,
          30 - positiveBoost - Math.floor(Math.random() * 15)
        ),
      },
      volume: 5000 + Math.floor(Math.random() * 8000),
      engagement: 200 + Math.floor(Math.random() * 400),
      topHashtags: keywords
        .map((k) => `#${k.replace(/\s+/g, "")}`)
        .concat(["#TravelTrends", "#HospitalityNews", "#LuxuryTravel"]),
      influencerMentions: 10 + Math.floor(Math.random() * 40),
      timestamp: new Date().toISOString(),
      dataQuality: "enhanced_mock",
    };
  }

  generateRelatedQueries(keyword) {
    const templates = [
      `${keyword} 2024`,
      `best ${keyword}`,
      `${keyword} trends`,
      `${keyword} industry`,
      `future of ${keyword}`,
    ];

    // Add keyword-specific queries
    if (keyword.toLowerCase().includes("eco")) {
      templates.push(`sustainable ${keyword}`, `green ${keyword}`);
    }
    if (keyword.toLowerCase().includes("luxury")) {
      templates.push(`premium ${keyword}`, `high-end ${keyword}`);
    }

    return templates.slice(0, 5);
  }

  generateNewsTitle(keyword, type) {
    const templates = {
      trend: [
        `${keyword} Market Shows 40% Growth in Consumer Interest`,
        `Industry Report: ${keyword} Sector Leads Innovation`,
        `${keyword} Trends Reshape Customer Expectations`,
      ],
      innovation: [
        `Breaking: New ${keyword} Standards Set Industry Benchmark`,
        `${keyword} Technology Advances Drive Market Changes`,
        `Innovation in ${keyword} Attracts Major Investment`,
      ],
    };

    const typeTemplates = templates[type] || templates.trend;
    return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
  }

  // Mock data methods for fallback
  getMockTrendingData(keywords) {
    return {
      trends: keywords.map((keyword, index) => ({
        keyword,
        interest: Math.floor(Math.random() * 40) + 60, // 60-100
        growth: Math.floor(Math.random() * 30) + 10, // 10-40%
        relatedQueries: [
          `${keyword} 2024`,
          `best ${keyword}`,
          `${keyword} trends`,
        ],
        regions: ["United States", "United Kingdom", "Canada"],
        timeframe: "7d",
        source: "mock",
      })),
      timestamp: new Date().toISOString(),
      dataQuality: "mock",
    };
  }

  getMockNewsData(keywords) {
    const mockArticles = [
      {
        title: `${keywords[0]} Industry Sees Major Shift in Consumer Preferences`,
        description: `Recent studies show changing trends in ${keywords[0]} sector...`,
        url: "https://example.com/article1",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        source: { name: "Industry Weekly" },
        relevanceScore: Math.floor(Math.random() * 30) + 70,
      },
      {
        title: `Breaking: New ${
          keywords[1] || keywords[0]
        } Regulations Announced`,
        description: `Government announces new guidelines affecting ${
          keywords[1] || keywords[0]
        }...`,
        url: "https://example.com/article2",
        publishedAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        source: { name: "Business Times" },
        relevanceScore: Math.floor(Math.random() * 25) + 65,
      },
    ];

    return {
      articles: mockArticles,
      totalResults: mockArticles.length,
      timestamp: new Date().toISOString(),
      dataQuality: "mock",
    };
  }

  getMockSocialData(keywords) {
    return {
      sentiment: {
        positive: Math.floor(Math.random() * 30) + 50, // 50-80%
        neutral: Math.floor(Math.random() * 20) + 15, // 15-35%
        negative: Math.floor(Math.random() * 15) + 5, // 5-20%
      },
      volume: Math.floor(Math.random() * 10000) + 5000,
      engagement: Math.floor(Math.random() * 500) + 200,
      topHashtags: keywords.map((k) => `#${k.replace(/\s+/g, "")}`),
      influencerMentions: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date().toISOString(),
      dataQuality: "mock",
    };
  }

  // Data parsing methods
  parseTrendsData(rawData) {
    // Parse Google Trends response format
    try {
      const data = JSON.parse(rawData.slice(5)); // Remove )]}', prefix
      return {
        trends: data.default.timelineData.map((item) => ({
          keyword: item.keyword,
          interest: item.value[0],
          growth: item.growth || 0,
          relatedQueries: item.relatedQueries || [],
          regions: item.geoMapData || [],
          timeframe: "7d",
          source: "google_trends",
        })),
        timestamp: new Date().toISOString(),
        dataQuality: "real",
      };
    } catch (error) {
      console.warn("Failed to parse Google Trends data:", error);
      return this.getMockTrendingData(["fallback"]);
    }
  }

  parseNewsData(articles) {
    return {
      articles: articles.map((article) => ({
        ...article,
        relevanceScore: this.calculateRelevanceScore(article),
      })),
      totalResults: articles.length,
      timestamp: new Date().toISOString(),
      dataQuality: "real",
    };
  }

  parseSocialData(data) {
    const tweets = data.data || [];
    const sentiment = this.analyzeSentiment(tweets);

    return {
      sentiment,
      volume: tweets.length,
      engagement: tweets.reduce(
        (sum, tweet) => sum + (tweet.public_metrics?.like_count || 0),
        0
      ),
      topHashtags: this.extractHashtags(tweets),
      influencerMentions: tweets.filter(
        (tweet) => tweet.public_metrics?.follower_count > 10000
      ).length,
      timestamp: new Date().toISOString(),
      dataQuality: "real",
    };
  }

  // Utility methods
  calculateRelevanceScore(article) {
    // Simple relevance scoring based on title and description
    let score = 50;
    const text = `${article.title} ${article.description}`.toLowerCase();

    // Boost score for recent articles
    const hoursOld =
      (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
    if (hoursOld < 24) score += 20;
    else if (hoursOld < 72) score += 10;

    // Boost for authoritative sources
    const authoritativeSources = ["reuters", "bloomberg", "wsj", "ft", "bbc"];
    if (
      authoritativeSources.some((source) =>
        article.source.name.toLowerCase().includes(source)
      )
    ) {
      score += 15;
    }

    return Math.min(100, score);
  }

  analyzeSentiment(tweets) {
    // Simple sentiment analysis (in production, use proper NLP service)
    const positiveWords = [
      "great",
      "amazing",
      "love",
      "excellent",
      "fantastic",
      "wonderful",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "hate",
      "awful",
      "horrible",
      "disappointing",
    ];

    let positive = 0,
      negative = 0,
      neutral = 0;

    tweets.forEach((tweet) => {
      const text = tweet.text.toLowerCase();
      const positiveCount = positiveWords.filter((word) =>
        text.includes(word)
      ).length;
      const negativeCount = negativeWords.filter((word) =>
        text.includes(word)
      ).length;

      if (positiveCount > negativeCount) positive++;
      else if (negativeCount > positiveCount) negative++;
      else neutral++;
    });

    const total = tweets.length || 1;
    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
    };
  }

  extractHashtags(tweets) {
    const hashtags = new Map();
    tweets.forEach((tweet) => {
      const matches = tweet.text.match(/#\w+/g) || [];
      matches.forEach((tag) => {
        hashtags.set(tag, (hashtags.get(tag) || 0) + 1);
      });
    });

    return Array.from(hashtags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  // Data quality validation
  validateDataQuality(data, type) {
    const qualityChecks = {
      trends: (d) =>
        d.trends &&
        d.trends.length > 0 &&
        d.trends.every((t) => t.interest >= 0),
      news: (d) =>
        d.articles &&
        d.articles.length > 0 &&
        d.articles.every((a) => a.title && a.publishedAt),
      social: (d) =>
        d.sentiment &&
        d.volume >= 0 &&
        Object.values(d.sentiment).every((v) => v >= 0),
    };

    const isValid = qualityChecks[type] ? qualityChecks[type](data) : true;

    return {
      isValid,
      quality: data.dataQuality || "unknown",
      timestamp: data.timestamp || new Date().toISOString(),
      confidence: isValid ? (data.dataQuality === "real" ? 95 : 75) : 30,
    };
  }
}

module.exports = DataSourceManager;
