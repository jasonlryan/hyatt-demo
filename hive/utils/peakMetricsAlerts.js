require("dotenv").config();
const { getInstance } = require("../services/PeakMetricsDataService");

class PeakMetricsAlerting {
  constructor() {
    this.service = getInstance();
    this.alertHistory = new Map();
    this.alertConfigs = new Map();
    this.isMonitoring = false;
    this.monitoringInterval = null;

    // Default alert configurations
    this.defaultConfigs = {
      velocity: {
        threshold: 100,
        enabled: true,
        channels: ["slack", "email"],
      },
      sentiment: {
        threshold: -20, // Negative sentiment threshold
        enabled: true,
        channels: ["slack", "email"],
      },
      risk: {
        threshold: 70,
        enabled: true,
        channels: ["slack", "email"],
      },
      mentions: {
        threshold: 50,
        enabled: true,
        channels: ["slack", "email"],
      },
      narratives: {
        threshold: 5,
        enabled: true,
        channels: ["slack", "email"],
      },
    };
  }

  /**
   * Configure alerts for a specific brand/workspace
   */
  configureAlerts(workspaceId, config = {}) {
    const alertConfig = {
      ...this.defaultConfigs,
      ...config,
      workspaceId,
      lastCheck: null,
      cooldown: config.cooldown || 300000, // 5 minutes default cooldown
      enabled: config.enabled !== false,
    };

    this.alertConfigs.set(workspaceId, alertConfig);
    console.log(`🔔 Alerting configured for workspace ${workspaceId}`);
    return alertConfig;
  }

  /**
   * Start monitoring all configured workspaces
   */
  startMonitoring(intervalMs = 300000) {
    // 5 minutes default
    if (this.isMonitoring) {
      console.log("⚠️ Monitoring already active");
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.checkAllAlerts();
    }, intervalMs);

    console.log(
      `🔔 PeakMetrics alerting started (checking every ${intervalMs / 1000}s)`
    );
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log("🔔 PeakMetrics alerting stopped");
  }

  /**
   * Check alerts for all configured workspaces
   */
  async checkAllAlerts() {
    if (!this.service.isAvailable()) {
      console.log("❌ PeakMetrics service not available for alerting");
      return;
    }

    console.log("🔍 Checking PeakMetrics alerts...");

    for (const [workspaceId, config] of this.alertConfigs) {
      if (!config.enabled) continue;

      try {
        await this.checkWorkspaceAlerts(workspaceId, config);
      } catch (error) {
        console.error(
          `❌ Error checking alerts for workspace ${workspaceId}:`,
          error.message
        );
      }
    }
  }

  /**
   * Check alerts for a specific workspace
   */
  async checkWorkspaceAlerts(workspaceId, config) {
    const now = Date.now();

    // Check cooldown
    if (config.lastCheck && now - config.lastCheck < config.cooldown) {
      return;
    }

    config.lastCheck = now;

    // Get brand overview
    const brandsResult = await this.service.getAllBrandsOverview();
    const brand = brandsResult.data.find((b) => b.id === workspaceId);

    if (!brand) {
      console.log(`⚠️ Brand not found for workspace ${workspaceId}`);
      return;
    }

    const alerts = [];

    // Check velocity alerts
    if (config.velocity.enabled && brand.velocity > config.velocity.threshold) {
      alerts.push({
        type: "velocity",
        severity: "high",
        message: `🚀 High velocity detected: ${brand.velocity} mentions/day (threshold: ${config.velocity.threshold})`,
        value: brand.velocity,
        threshold: config.velocity.threshold,
        brand: brand.title,
      });
    }

    // Check sentiment alerts
    if (
      config.sentiment.enabled &&
      brand.avgSentiment < config.sentiment.threshold
    ) {
      alerts.push({
        type: "sentiment",
        severity: "high",
        message: `😟 Negative sentiment detected: ${brand.avgSentiment} (threshold: ${config.sentiment.threshold})`,
        value: brand.avgSentiment,
        threshold: config.sentiment.threshold,
        brand: brand.title,
      });
    }

    // Check risk alerts
    if (config.risk.enabled && brand.riskScore > config.risk.threshold) {
      alerts.push({
        type: "risk",
        severity: "critical",
        message: `⚠️ High risk detected: ${brand.riskScore} (threshold: ${config.risk.threshold})`,
        value: brand.riskScore,
        threshold: config.risk.threshold,
        brand: brand.title,
      });
    }

    // Check mention volume alerts
    if (
      config.mentions.enabled &&
      brand.last48hMentions > config.mentions.threshold
    ) {
      alerts.push({
        type: "mentions",
        severity: "medium",
        message: `📊 High mention volume: ${brand.last48hMentions} mentions in 48h (threshold: ${config.mentions.threshold})`,
        value: brand.last48hMentions,
        threshold: config.mentions.threshold,
        brand: brand.title,
      });
    }

    // Check narrative alerts
    if (config.narratives.enabled) {
      const narrativesResult = await this.service.getNarratives(workspaceId, {
        limit: 10,
      });
      const narratives = narrativesResult.data || [];

      if (narratives.length > config.narratives.threshold) {
        alerts.push({
          type: "narratives",
          severity: "medium",
          message: `📰 High narrative count: ${narratives.length} narratives (threshold: ${config.narratives.threshold})`,
          value: narratives.length,
          threshold: config.narratives.threshold,
          brand: brand.title,
        });
      }
    }

    // Send alerts if any triggered
    if (alerts.length > 0) {
      await this.sendAlerts(alerts, config);
    }
  }

  /**
   * Send alerts through configured channels
   */
  async sendAlerts(alerts, config) {
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
      for (const channel of config[alert.type]?.channels || ["console"]) {
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
    // Implementation would depend on your Slack integration
    console.log(`📱 Slack alert: ${alertData.message}`);

    // Example implementation:
    // const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    // if (slackWebhook) {
    //   await axios.post(slackWebhook, {
    //     text: alertData.message,
    //     attachments: [{
    //       color: alertData.severity === 'critical' ? 'danger' : 'warning',
    //       fields: [
    //         { title: 'Brand', value: alertData.brand, short: true },
    //         { title: 'Value', value: alertData.value.toString(), short: true },
    //         { title: 'Threshold', value: alertData.threshold.toString(), short: true }
    //       ]
    //     }]
    //   });
    // }
  }

  /**
   * Send alert via email
   */
  async sendEmailAlert(alertData) {
    // Implementation would depend on your email service
    console.log(`📧 Email alert: ${alertData.message}`);

    // Example implementation:
    // const emailService = require('./emailService');
    // await emailService.sendAlert({
    //   to: process.env.ALERT_EMAIL,
    //   subject: `PeakMetrics Alert: ${alertData.type.toUpperCase()}`,
    //   body: alertData.message
    // });
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
   * Clear alert history
   */
  clearAlertHistory() {
    this.alertHistory.clear();
    console.log("🧹 Alert history cleared");
  }

  /**
   * Get current alert configurations
   */
  getAlertConfigs() {
    return Object.fromEntries(this.alertConfigs);
  }

  /**
   * Manual alert check for a specific workspace
   */
  async checkWorkspaceManually(workspaceId) {
    const config = this.alertConfigs.get(workspaceId);
    if (!config) {
      console.log(
        `⚠️ No alert configuration found for workspace ${workspaceId}`
      );
      return;
    }

    await this.checkWorkspaceAlerts(workspaceId, config);
  }
}

// Export singleton instance
let alertingInstance = null;

function getAlertingInstance() {
  if (!alertingInstance) {
    alertingInstance = new PeakMetricsAlerting();
  }
  return alertingInstance;
}

module.exports = {
  PeakMetricsAlerting,
  getAlertingInstance,
};
