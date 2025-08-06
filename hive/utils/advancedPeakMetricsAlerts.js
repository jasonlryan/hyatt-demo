require("dotenv").config();
const { getInstance } = require("../services/PeakMetricsDataService");

class AdvancedPeakMetricsAlerting {
  constructor() {
    this.service = getInstance();
    this.alertHistory = new Map();
    this.alertConfigs = new Map();
    this.isMonitoring = false;
    this.monitoringInterval = null;

    // Advanced alert configurations based on API capabilities
    this.defaultConfigs = {
      // Velocity-based alerts (mentions per day)
      velocity: {
        threshold: 100,
        enabled: true,
        channels: ["slack", "email"],
      },

      // Sentiment-based alerts (using enrichments.sentiment.polarity)
      sentiment: {
        threshold: -20,
        enabled: true,
        channels: ["slack", "email"],
        direction: "negative", // negative, positive, or both
      },

      // Risk-based alerts (derived from velocity + sentiment)
      risk: {
        threshold: 70,
        enabled: true,
        channels: ["slack", "email"],
      },

      // Mention volume alerts (using mentions endpoint)
      mentions: {
        threshold: 50,
        enabled: true,
        channels: ["slack", "email"],
        timeWindow: "48h", // 24h, 48h, 7d
      },

      // Narrative-based alerts (using narratives endpoint)
      narratives: {
        threshold: 5,
        enabled: true,
        channels: ["slack", "email"],
        minRelevancy: 50, // Minimum relevancy score
        minMentionCount: 10, // Minimum mentions per narrative
      },

      // Channel-specific alerts (using channels filter)
      channels: {
        twitter: {
          threshold: 20,
          enabled: false,
          channels: ["slack"],
        },
        news: {
          threshold: 10,
          enabled: false,
          channels: ["email"],
        },
        reddit: {
          threshold: 15,
          enabled: false,
          channels: ["slack"],
        },
      },

      // Domain-specific alerts (using domain field)
      domains: {
        enabled: false,
        watchlist: [], // List of domains to monitor
        threshold: 5,
        channels: ["email"],
      },

      // Author-specific alerts (using author field)
      authors: {
        enabled: false,
        watchlist: [], // List of authors to monitor
        threshold: 3,
        channels: ["slack"],
      },

      // Language-specific alerts (using language field)
      languages: {
        enabled: false,
        watchlist: ["en"], // Language codes to monitor
        threshold: 10,
        channels: ["email"],
      },

      // Media alerts (using media array)
      media: {
        enabled: false,
        types: ["image", "video"], // Media types to monitor
        threshold: 5,
        channels: ["slack"],
      },

      // Filter expression alerts (using filter_expression)
      customFilters: {
        enabled: false,
        expressions: [], // Array of filter expressions
        threshold: 5,
        channels: ["slack", "email"],
      },
    };
  }

  /**
   * Configure advanced alerts for a workspace
   */
  configureAdvancedAlerts(workspaceId, config = {}) {
    const alertConfig = {
      ...this.defaultConfigs,
      ...config,
      workspaceId,
      lastCheck: null,
      cooldown: config.cooldown || 300000, // 5 minutes default
      enabled: config.enabled !== false,
    };

    this.alertConfigs.set(workspaceId, alertConfig);
    console.log(`🔔 Advanced alerting configured for workspace ${workspaceId}`);
    return alertConfig;
  }

  /**
   * Check advanced alerts for a workspace using full API capabilities
   */
  async checkAdvancedWorkspaceAlerts(workspaceId, config) {
    const now = Date.now();

    // Check cooldown
    if (config.lastCheck && now - config.lastCheck < config.cooldown) {
      return;
    }

    config.lastCheck = now;
    const alerts = [];

    try {
      // 1. Check narratives with advanced filtering
      if (config.narratives.enabled) {
        await this.checkNarrativeAlerts(workspaceId, config, alerts);
      }

      // 2. Check mentions with channel filtering
      if (config.mentions.enabled) {
        await this.checkMentionAlerts(workspaceId, config, alerts);
      }

      // 3. Check channel-specific alerts
      if (config.channels) {
        await this.checkChannelAlerts(workspaceId, config, alerts);
      }

      // 4. Check domain-specific alerts
      if (config.domains.enabled) {
        await this.checkDomainAlerts(workspaceId, config, alerts);
      }

      // 5. Check author-specific alerts
      if (config.authors.enabled) {
        await this.checkAuthorAlerts(workspaceId, config, alerts);
      }

      // 6. Check language-specific alerts
      if (config.languages.enabled) {
        await this.checkLanguageAlerts(workspaceId, config, alerts);
      }

      // 7. Check media alerts
      if (config.media.enabled) {
        await this.checkMediaAlerts(workspaceId, config, alerts);
      }

      // 8. Check custom filter alerts
      if (config.customFilters.enabled) {
        await this.checkCustomFilterAlerts(workspaceId, config, alerts);
      }

      // Send alerts if any triggered
      if (alerts.length > 0) {
        await this.sendAdvancedAlerts(alerts, config);
      }
    } catch (error) {
      console.error(
        `❌ Error checking advanced alerts for workspace ${workspaceId}:`,
        error.message
      );
    }
  }

  /**
   * Check narrative-based alerts using narratives endpoint
   */
  async checkNarrativeAlerts(workspaceId, config, alerts) {
    const narrativesResult = await this.service.getNarratives(workspaceId, {
      limit: 50,
      sort: "mentionCount",
      since: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
    });

    const narratives = narrativesResult.data || [];

    // Check total narrative count
    if (narratives.length > config.narratives.threshold) {
      alerts.push({
        type: "narratives",
        severity: "medium",
        message: `📰 High narrative count: ${narratives.length} narratives (threshold: ${config.narratives.threshold})`,
        value: narratives.length,
        threshold: config.narratives.threshold,
        workspaceId,
      });
    }

    // Check high-relevancy narratives
    const highRelevancyNarratives = narratives.filter(
      (n) => n.aggregations?.relevancyScore > config.narratives.minRelevancy
    );

    if (highRelevancyNarratives.length > 0) {
      alerts.push({
        type: "narratives_relevancy",
        severity: "high",
        message: `🎯 High-relevancy narratives detected: ${highRelevancyNarratives.length} narratives with relevancy > ${config.narratives.minRelevancy}`,
        value: highRelevancyNarratives.length,
        threshold: config.narratives.minRelevancy,
        workspaceId,
        details: highRelevancyNarratives.slice(0, 3).map((n) => ({
          title: n.title,
          relevancy: n.aggregations.relevancyScore,
          mentions: n.aggregations.mentionCount,
        })),
      });
    }

    // Check high-volume narratives
    const highVolumeNarratives = narratives.filter(
      (n) => n.aggregations?.mentionCount > config.narratives.minMentionCount
    );

    if (highVolumeNarratives.length > 0) {
      alerts.push({
        type: "narratives_volume",
        severity: "high",
        message: `📊 High-volume narratives detected: ${highVolumeNarratives.length} narratives with > ${config.narratives.minMentionCount} mentions`,
        value: highVolumeNarratives.length,
        threshold: config.narratives.minMentionCount,
        workspaceId,
        details: highVolumeNarratives.slice(0, 3).map((n) => ({
          title: n.title,
          mentions: n.aggregations.mentionCount,
          sentiment: n.aggregations.avgSentiment,
        })),
      });
    }
  }

  /**
   * Check mention-based alerts using mentions endpoint
   */
  async checkMentionAlerts(workspaceId, config, alerts) {
    const mentionsResult = await this.service.getMentions(workspaceId, {
      limit: 100,
      sort: "published",
      order: "desc",
      since: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
    });

    const mentions = mentionsResult.data || [];

    // Check total mention volume
    if (mentions.length > config.mentions.threshold) {
      alerts.push({
        type: "mentions_volume",
        severity: "medium",
        message: `📊 High mention volume: ${mentions.length} mentions in 48h (threshold: ${config.mentions.threshold})`,
        value: mentions.length,
        threshold: config.mentions.threshold,
        workspaceId,
      });
    }

    // Check sentiment distribution
    const negativeMentions = mentions.filter(
      (m) => m.enrichments?.sentiment?.polarity < config.sentiment.threshold
    );

    if (negativeMentions.length > 0) {
      alerts.push({
        type: "mentions_sentiment",
        severity: "high",
        message: `😟 Negative mentions detected: ${negativeMentions.length} mentions with sentiment < ${config.sentiment.threshold}`,
        value: negativeMentions.length,
        threshold: config.sentiment.threshold,
        workspaceId,
        details: negativeMentions.slice(0, 3).map((m) => ({
          title: m.title,
          sentiment: m.enrichments?.sentiment?.polarity,
          domain: m.domain,
          author: m.author,
        })),
      });
    }

    // Check for mentions with media
    const mentionsWithMedia = mentions.filter(
      (m) => m.media && m.media.length > 0
    );

    if (mentionsWithMedia.length > 0) {
      alerts.push({
        type: "mentions_media",
        severity: "medium",
        message: `📸 Mentions with media detected: ${mentionsWithMedia.length} mentions contain media`,
        value: mentionsWithMedia.length,
        workspaceId,
        details: mentionsWithMedia.slice(0, 3).map((m) => ({
          title: m.title,
          mediaCount: m.media.length,
          mediaTypes: m.media.map((media) => media.type),
        })),
      });
    }
  }

  /**
   * Check channel-specific alerts
   */
  async checkChannelAlerts(workspaceId, config, alerts) {
    for (const [channel, channelConfig] of Object.entries(config.channels)) {
      if (!channelConfig.enabled) continue;

      const mentionsResult = await this.service.getMentions(workspaceId, {
        limit: 50,
        sort: "published",
        order: "desc",
        since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString(),
        channels: [channel],
      });

      const channelMentions = mentionsResult.data || [];

      if (channelMentions.length > channelConfig.threshold) {
        alerts.push({
          type: `channel_${channel}`,
          severity: "medium",
          message: `📱 High ${channel} activity: ${channelMentions.length} mentions (threshold: ${channelConfig.threshold})`,
          value: channelMentions.length,
          threshold: channelConfig.threshold,
          workspaceId,
          channel,
        });
      }
    }
  }

  /**
   * Check domain-specific alerts
   */
  async checkDomainAlerts(workspaceId, config, alerts) {
    if (!config.domains.watchlist.length) return;

    const mentionsResult = await this.service.getMentions(workspaceId, {
      limit: 100,
      sort: "published",
      order: "desc",
      since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
    });

    const mentions = mentionsResult.data || [];
    const domainMentions = mentions.filter((m) =>
      config.domains.watchlist.some((domain) => m.domain.includes(domain))
    );

    if (domainMentions.length > config.domains.threshold) {
      alerts.push({
        type: "domains",
        severity: "medium",
        message: `🌐 High activity from watched domains: ${domainMentions.length} mentions (threshold: ${config.domains.threshold})`,
        value: domainMentions.length,
        threshold: config.domains.threshold,
        workspaceId,
        domains: config.domains.watchlist,
      });
    }
  }

  /**
   * Check author-specific alerts
   */
  async checkAuthorAlerts(workspaceId, config, alerts) {
    if (!config.authors.watchlist.length) return;

    const mentionsResult = await this.service.getMentions(workspaceId, {
      limit: 100,
      sort: "published",
      order: "desc",
      since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
    });

    const mentions = mentionsResult.data || [];
    const authorMentions = mentions.filter((m) =>
      config.authors.watchlist.some((author) =>
        m.author?.toLowerCase().includes(author.toLowerCase())
      )
    );

    if (authorMentions.length > config.authors.threshold) {
      alerts.push({
        type: "authors",
        severity: "medium",
        message: `👤 High activity from watched authors: ${authorMentions.length} mentions (threshold: ${config.authors.threshold})`,
        value: authorMentions.length,
        threshold: config.authors.threshold,
        workspaceId,
        authors: config.authors.watchlist,
      });
    }
  }

  /**
   * Check language-specific alerts
   */
  async checkLanguageAlerts(workspaceId, config, alerts) {
    if (!config.languages.watchlist.length) return;

    const mentionsResult = await this.service.getMentions(workspaceId, {
      limit: 100,
      sort: "published",
      order: "desc",
      since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
    });

    const mentions = mentionsResult.data || [];
    const languageMentions = mentions.filter((m) =>
      config.languages.watchlist.includes(m.language)
    );

    if (languageMentions.length > config.languages.threshold) {
      alerts.push({
        type: "languages",
        severity: "medium",
        message: `🌍 High activity in watched languages: ${languageMentions.length} mentions (threshold: ${config.languages.threshold})`,
        value: languageMentions.length,
        threshold: config.languages.threshold,
        workspaceId,
        languages: config.languages.watchlist,
      });
    }
  }

  /**
   * Check media alerts
   */
  async checkMediaAlerts(workspaceId, config, alerts) {
    const mentionsResult = await this.service.getMentions(workspaceId, {
      limit: 100,
      sort: "published",
      order: "desc",
      since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
    });

    const mentions = mentionsResult.data || [];
    const mediaMentions = mentions.filter((m) =>
      m.media?.some((media) => config.media.types.includes(media.type))
    );

    if (mediaMentions.length > config.media.threshold) {
      alerts.push({
        type: "media",
        severity: "medium",
        message: `📸 High media activity: ${
          mediaMentions.length
        } mentions with ${config.media.types.join("/")} (threshold: ${
          config.media.threshold
        })`,
        value: mediaMentions.length,
        threshold: config.media.threshold,
        workspaceId,
        mediaTypes: config.media.types,
      });
    }
  }

  /**
   * Check custom filter alerts using filter_expression
   */
  async checkCustomFilterAlerts(workspaceId, config, alerts) {
    for (const expression of config.customFilters.expressions) {
      const mentionsResult = await this.service.getMentions(workspaceId, {
        limit: 50,
        sort: "published",
        order: "desc",
        since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString(),
        filter_expression: expression,
      });

      const filteredMentions = mentionsResult.data || [];

      if (filteredMentions.length > config.customFilters.threshold) {
        alerts.push({
          type: "custom_filter",
          severity: "medium",
          message: `🔍 Custom filter triggered: ${filteredMentions.length} mentions match "${expression}" (threshold: ${config.customFilters.threshold})`,
          value: filteredMentions.length,
          threshold: config.customFilters.threshold,
          workspaceId,
          filter: expression,
        });
      }
    }
  }

  /**
   * Send advanced alerts
   */
  async sendAdvancedAlerts(alerts, config) {
    for (const alert of alerts) {
      const alertKey = `${config.workspaceId}-${alert.type}-${alert.value}`;

      // Check if we've already sent this alert recently
      if (this.alertHistory.has(alertKey)) {
        const lastSent = this.alertHistory.get(alertKey);
        if (Date.now() - lastSent < 3600000) {
          // 1 hour cooldown
          continue;
        }
      }

      // Store alert in history
      this.alertHistory.set(alertKey, Date.now());

      // Send through configured channels
      const channels = config[alert.type]?.channels ||
        config[alert.type.split("_")[0]]?.channels || ["console"];
      for (const channel of channels) {
        await this.sendAlertToChannel(alert, channel, config);
      }
    }
  }

  /**
   * Send alert to specific channel
   */
  async sendAlertToChannel(alert, channel, config) {
    const timestamp = new Date().toISOString();
    const alertData = {
      ...alert,
      timestamp,
      workspaceId: config.workspaceId,
      config: config,
    };

    switch (channel) {
      case "console":
        console.log(
          `🔔 ${alert.severity.toUpperCase()} ALERT: ${alert.message}`
        );
        if (alert.details) {
          console.log("   Details:", JSON.stringify(alert.details, null, 2));
        }
        break;

      case "slack":
        await this.sendSlackAlert(alertData);
        break;

      case "email":
        await this.sendEmailAlert(alertData);
        break;

      case "webhook":
        await this.sendWebhookAlert(alertData, config.webhookUrl);
        break;

      default:
        console.log(`⚠️ Unknown alert channel: ${channel}`);
    }
  }

  /**
   * Send alert to Slack
   */
  async sendSlackAlert(alertData) {
    console.log(`📱 Slack alert: ${alertData.message}`);
    // Implementation would depend on your Slack integration
  }

  /**
   * Send alert via email
   */
  async sendEmailAlert(alertData) {
    console.log(`📧 Email alert: ${alertData.message}`);
    // Implementation would depend on your email service
  }

  /**
   * Send alert via webhook
   */
  async sendWebhookAlert(alertData, webhookUrl) {
    if (!webhookUrl) {
      console.log("⚠️ No webhook URL configured");
      return;
    }

    try {
      const axios = require("axios");
      await axios.post(webhookUrl, alertData, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      });
      console.log(`🌐 Webhook alert sent: ${alertData.message}`);
    } catch (error) {
      console.error("❌ Failed to send webhook alert:", error.message);
    }
  }

  /**
   * Start advanced monitoring
   */
  startAdvancedMonitoring(intervalMs = 300000) {
    if (this.isMonitoring) {
      console.log("⚠️ Advanced monitoring already active");
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.checkAllAdvancedAlerts();
    }, intervalMs);

    console.log(
      `🔔 Advanced PeakMetrics alerting started (checking every ${
        intervalMs / 1000
      }s)`
    );
  }

  /**
   * Check all advanced alerts
   */
  async checkAllAdvancedAlerts() {
    if (!this.service.isAvailable()) {
      console.log("❌ PeakMetrics service not available for advanced alerting");
      return;
    }

    console.log("🔍 Checking advanced PeakMetrics alerts...");

    for (const [workspaceId, config] of this.alertConfigs) {
      if (!config.enabled) continue;

      try {
        await this.checkAdvancedWorkspaceAlerts(workspaceId, config);
      } catch (error) {
        console.error(
          `❌ Error checking advanced alerts for workspace ${workspaceId}:`,
          error.message
        );
      }
    }
  }

  /**
   * Stop advanced monitoring
   */
  stopAdvancedMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log("🔔 Advanced PeakMetrics alerting stopped");
  }

  /**
   * Get alert history
   */
  getAlertHistory() {
    return Array.from(this.alertHistory.entries()).map(([key, timestamp]) => ({
      key,
      timestamp,
      date: new Date(timestamp).toISOString(),
    }));
  }

  /**
   * Get current alert configurations
   */
  getAlertConfigs() {
    return Object.fromEntries(this.alertConfigs);
  }
}

// Export singleton instance
let advancedAlertingInstance = null;

function getAdvancedAlertingInstance() {
  if (!advancedAlertingInstance) {
    advancedAlertingInstance = new AdvancedPeakMetricsAlerting();
  }
  return advancedAlertingInstance;
}

module.exports = {
  AdvancedPeakMetricsAlerting,
  getAdvancedAlertingInstance,
};
