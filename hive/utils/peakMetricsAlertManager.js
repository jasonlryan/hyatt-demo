const { getNativeAlertingInstance } = require("./peakMetricsNativeAlerts");
const {
  PeakMetricsDataService,
} = require("../services/PeakMetricsDataService");

/**
 * PeakMetrics Alert Manager
 * Automatically configures and manages native PeakMetrics alerts for all workspaces
 */
class PeakMetricsAlertManager {
  constructor() {
    this.nativeAlerting = getNativeAlertingInstance();
    this.dataService = new PeakMetricsDataService();
    this.alertConfigs = new Map();
  }

  /**
   * Initialize alert manager
   */
  async initialize() {
    console.log("🚀 Initializing PeakMetrics Alert Manager...");

    // Authenticate with both services
    const authSuccess = await this.nativeAlerting.authenticate();
    if (!authSuccess) {
      throw new Error("Failed to authenticate with PeakMetrics");
    }

    console.log("✅ Alert Manager initialized successfully");
  }

  /**
   * Get all workspaces and configure alerts for each
   */
  async configureAlertsForAllWorkspaces() {
    console.log("📋 Configuring alerts for all workspaces...");

    try {
      // Get all brands/workspaces
      const brandsResult = await this.dataService.getAllBrandsOverview();
      if (!brandsResult.success || !brandsResult.data) {
        throw new Error("Failed to fetch workspaces");
      }

      const workspaces = brandsResult.data;
      console.log(`📊 Found ${workspaces.length} workspaces`);

      // Configure alerts for each workspace
      for (const workspace of workspaces) {
        await this.configureWorkspaceAlerts(workspace);
      }

      console.log("✅ Alert configuration completed for all workspaces");
    } catch (error) {
      console.error("❌ Failed to configure alerts:", error.message);
      throw error;
    }
  }

  /**
   * Configure comprehensive alerts for a specific workspace
   */
  async configureWorkspaceAlerts(workspace) {
    const workspaceId = workspace.id;
    const workspaceTitle = workspace.title;

    console.log(
      `\n🔧 Configuring alerts for workspace: ${workspaceTitle} (ID: ${workspaceId})`
    );

    try {
      // Store alert configurations
      this.alertConfigs.set(workspaceId, {
        workspace: workspace,
        alerts: [],
      });

      // 1. Velocity Spike Alert (high priority)
      console.log("  📈 Creating velocity spike alert...");
      try {
        const velocityAlert = await this.nativeAlerting.createVelocityAlert(
          workspaceId,
          50, // threshold
          60 // every hour
        );
        this.alertConfigs.get(workspaceId).alerts.push({
          type: "velocity",
          alert: velocityAlert,
        });
        console.log("    ✅ Velocity alert created");
      } catch (error) {
        console.log(`    ❌ Velocity alert failed: ${error.message}`);
      }

      // 2. Negative Sentiment Alert (crisis detection)
      console.log("  😡 Creating negative sentiment alert...");
      try {
        const sentimentAlert = await this.nativeAlerting.createSentimentAlert(
          workspaceId,
          "negative",
          120 // every 2 hours
        );
        this.alertConfigs.get(workspaceId).alerts.push({
          type: "sentiment",
          alert: sentimentAlert,
        });
        console.log("    ✅ Sentiment alert created");
      } catch (error) {
        console.log(`    ❌ Sentiment alert failed: ${error.message}`);
      }

      // 3. Mention Volume Alert (viral detection)
      console.log("  📊 Creating mention volume alert...");
      try {
        const volumeAlert = await this.nativeAlerting.createMentionVolumeAlert(
          workspaceId,
          20, // minimum mentions
          180 // every 3 hours
        );
        this.alertConfigs.get(workspaceId).alerts.push({
          type: "volume",
          alert: volumeAlert,
        });
        console.log("    ✅ Volume alert created");
      } catch (error) {
        console.log(`    ❌ Volume alert failed: ${error.message}`);
      }

      // 4. Crisis Keywords Alert (immediate)
      console.log("  🚨 Creating crisis keywords alert...");
      try {
        const crisisKeywords = [
          "crisis",
          "scandal",
          "recall",
          "lawsuit",
          "investigation",
          "breach",
          "hack",
          "leak",
          "controversy",
          "outrage",
          "boycott",
          "protest",
          "resignation",
          "fired",
          "suspended",
        ];

        const keywordAlert = await this.nativeAlerting.createKeywordAlert(
          workspaceId,
          crisisKeywords,
          30 // every 30 minutes (high priority)
        );
        this.alertConfigs.get(workspaceId).alerts.push({
          type: "crisis_keywords",
          alert: keywordAlert,
        });
        console.log("    ✅ Crisis keywords alert created");
      } catch (error) {
        console.log(`    ❌ Crisis keywords alert failed: ${error.message}`);
      }

      // 5. Positive PR Keywords Alert (opportunity detection)
      console.log("  🌟 Creating positive PR keywords alert...");
      try {
        const positiveKeywords = [
          "award",
          "recognition",
          "innovation",
          "success",
          "growth",
          "partnership",
          "launch",
          "milestone",
          "achievement",
          "breakthrough",
          "charity",
          "donation",
          "sustainability",
          "green",
          "eco-friendly",
        ];

        const positiveAlert = await this.nativeAlerting.createKeywordAlert(
          workspaceId,
          positiveKeywords,
          120 // every 2 hours
        );
        this.alertConfigs.get(workspaceId).alerts.push({
          type: "positive_keywords",
          alert: positiveAlert,
        });
        console.log("    ✅ Positive PR keywords alert created");
      } catch (error) {
        console.log(
          `    ❌ Positive PR keywords alert failed: ${error.message}`
        );
      }

      console.log(`  ✅ Completed alert configuration for ${workspaceTitle}`);
    } catch (error) {
      console.error(
        `  ❌ Failed to configure alerts for workspace ${workspaceId}:`,
        error.message
      );
    }
  }

  /**
   * Get alert configuration for a specific workspace
   */
  getWorkspaceAlertConfig(workspaceId) {
    return this.alertConfigs.get(workspaceId);
  }

  /**
   * Get all alert configurations
   */
  getAllAlertConfigs() {
    return this.alertConfigs;
  }

  /**
   * Generate alert configuration report
   */
  generateAlertReport() {
    console.log("\n📊 PeakMetrics Alert Configuration Report");
    console.log("==========================================");

    const configs = this.getAllAlertConfigs();
    let totalAlerts = 0;

    for (const [workspaceId, config] of configs) {
      const workspace = config.workspace;
      const alerts = config.alerts;

      console.log(`\n🏢 Workspace: ${workspace.title} (ID: ${workspaceId})`);
      console.log(`   📈 Velocity: ${workspace.velocity || "N/A"}`);
      console.log(`   😊 Sentiment: ${workspace.avgSentiment || "N/A"}`);
      console.log(`   📊 Mentions: ${workspace.mentionCount || "N/A"}`);
      console.log(`   🚨 Alerts configured: ${alerts.length}`);

      for (const alert of alerts) {
        console.log(`     • ${alert.type}: ${alert.alert.alertId}`);
      }

      totalAlerts += alerts.length;
    }

    console.log(`\n📈 Summary:`);
    console.log(`   • Total workspaces: ${configs.size}`);
    console.log(`   • Total alerts: ${totalAlerts}`);
    console.log(
      `   • Average alerts per workspace: ${(
        totalAlerts / configs.size
      ).toFixed(1)}`
    );

    return {
      workspaces: configs.size,
      totalAlerts: totalAlerts,
      averageAlertsPerWorkspace: totalAlerts / configs.size,
    };
  }

  /**
   * Create custom alert for specific use case
   */
  async createCustomAlert(workspaceId, alertType, config) {
    console.log(
      `🔧 Creating custom ${alertType} alert for workspace ${workspaceId}...`
    );

    try {
      let alert;

      switch (alertType) {
        case "velocity":
          alert = await this.nativeAlerting.createVelocityAlert(
            workspaceId,
            config.threshold || 50,
            config.frequency || 60
          );
          break;

        case "sentiment":
          alert = await this.nativeAlerting.createSentimentAlert(
            workspaceId,
            config.sentiment || "negative",
            config.frequency || 60
          );
          break;

        case "volume":
          alert = await this.nativeAlerting.createMentionVolumeAlert(
            workspaceId,
            config.minMentions || 10,
            config.frequency || 60
          );
          break;

        case "keywords":
          alert = await this.nativeAlerting.createKeywordAlert(
            workspaceId,
            config.keywords || [],
            config.frequency || 60
          );
          break;

        default:
          throw new Error(`Unknown alert type: ${alertType}`);
      }

      // Store the alert configuration
      if (!this.alertConfigs.has(workspaceId)) {
        this.alertConfigs.set(workspaceId, { workspace: null, alerts: [] });
      }

      this.alertConfigs.get(workspaceId).alerts.push({
        type: alertType,
        alert: alert,
        custom: true,
      });

      console.log(`✅ Custom ${alertType} alert created: ${alert.alertId}`);
      return alert;
    } catch (error) {
      console.error(
        `❌ Failed to create custom ${alertType} alert:`,
        error.message
      );
      throw error;
    }
  }
}

// Export singleton instance
let alertManagerInstance = null;

function getAlertManagerInstance() {
  if (!alertManagerInstance) {
    alertManagerInstance = new PeakMetricsAlertManager();
  }
  return alertManagerInstance;
}

module.exports = { PeakMetricsAlertManager, getAlertManagerInstance };
