const axios = require("axios");
require("dotenv").config();

/**
 * PeakMetrics Workspace Alert Setup
 * Demonstrates how to set up native alerts for a specific workspace
 */
class WorkspaceAlertSetup {
  constructor() {
    this.baseURL = "https://api.peakmetrics.com";
    this.alertingURL = "https://flux.peakm.com";
    this.token = null;
  }

  /**
   * Authenticate with PeakMetrics
   */
  async authenticate() {
    try {
      console.log("🔐 Authenticating with PeakMetrics...");

      const response = await axios.post(`${this.baseURL}/access/token`, {
        username: process.env.PEAKMETRICS_UN,
        password: process.env.PEAKMETRICS_PW,
        client_id: process.env.PEAKMETRICS_CLIENT_ID,
      });

      this.token = response.data.Token;
      console.log("✅ Authentication successful!");

      return this.token;
    } catch (error) {
      console.error("❌ Authentication failed:", error.message);
      throw error;
    }
  }

  /**
   * List all available workspaces
   */
  async listWorkspaces() {
    try {
      console.log("📋 Listing available workspaces...");

      const response = await axios.get(`${this.baseURL}/workspaces`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      console.log("✅ Workspaces found:");
      response.data.forEach((workspace) => {
        console.log(
          `   📁 ID: ${workspace.id} | Title: ${workspace.title} | Query: ${workspace.query}`
        );
      });

      return response.data;
    } catch (error) {
      console.error("❌ Failed to list workspaces:", error.message);
      throw error;
    }
  }

  /**
   * Create a velocity alert for a workspace
   */
  async createVelocityAlert(workspaceId, workspaceTitle, threshold = 50) {
    try {
      console.log(
        `🚨 Creating velocity alert for workspace: ${workspaceTitle} (ID: ${workspaceId})`
      );

      const alertConfig = {
        title: `${workspaceTitle} - Velocity Spike Alert`,
        whenThis: {
          value: null,
          text: `velocity > ${threshold}`,
          parts: {
            always: [`workspace:${workspaceId}`],
            sometimes: [],
            never: [],
          },
          case_sensitive: false,
          advanced_search: false,
        },
        happens: {
          text: "appears in News, Twitter, Reddit",
          value: {
            tags: [
              { tag: "news", id: 1, meta: null, friendly: "News" },
              { tag: "twitter", id: 2, meta: null, friendly: "Twitter V2" },
              { tag: "reddit", id: 3, meta: null, friendly: "Reddit" },
            ],
            sources: [],
          },
          search: "workspaces",
        },
        that: [
          {
            text: "send me an email",
            value: 2,
          },
        ],
        frequency: {
          value: 60,
          text: "every 60 minutes",
        },
        tags: [],
      };

      const response = await axios.post(
        `${this.alertingURL}/alerts/alert`,
        alertConfig,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📤 Request Body Sent:");
      console.log(JSON.stringify(alertConfig, null, 2));
      console.log("✅ Velocity alert created successfully!");
      console.log(`   Alert ID: ${response.data.id || "N/A"}`);
      console.log("📄 Full API Response:");
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error("❌ Failed to create velocity alert:", error.message);
      throw error;
    }
  }

  /**
   * Create a sentiment alert for a workspace
   */
  async createSentimentAlert(
    workspaceId,
    workspaceTitle,
    sentiment = "negative"
  ) {
    try {
      console.log(
        `😡 Creating ${sentiment} sentiment alert for workspace: ${workspaceTitle} (ID: ${workspaceId})`
      );

      const alertConfig = {
        title: `${workspaceTitle} - ${
          sentiment.charAt(0).toUpperCase() + sentiment.slice(1)
        } Sentiment Alert`,
        whenThis: {
          value: null,
          text: `sentiment ${sentiment}`,
          parts: {
            always: [`workspace:${workspaceId}`],
            sometimes: [],
            never: [],
          },
          case_sensitive: false,
          advanced_search: false,
        },
        happens: {
          text: "appears in News, Twitter, Reddit",
          value: {
            tags: [
              { tag: "news", id: 1, meta: null, friendly: "News" },
              { tag: "twitter", id: 2, meta: null, friendly: "Twitter V2" },
              { tag: "reddit", id: 3, meta: null, friendly: "Reddit" },
            ],
            sources: [],
          },
          search: "workspaces",
        },
        that: [
          {
            text: "send me an email",
            value: 2,
          },
        ],
        frequency: {
          value: 30,
          text: "every 30 minutes",
        },
        tags: [],
      };

      const response = await axios.post(
        `${this.alertingURL}/alerts/alert`,
        alertConfig,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📤 Request Body Sent:");
      console.log(JSON.stringify(alertConfig, null, 2));
      console.log("✅ Sentiment alert created successfully!");
      console.log(`   Alert ID: ${response.data.id || "N/A"}`);
      console.log("📄 Full API Response:");
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error("❌ Failed to create sentiment alert:", error.message);
      throw error;
    }
  }

  /**
   * Create a mention volume alert for a workspace
   */
  async createMentionVolumeAlert(
    workspaceId,
    workspaceTitle,
    minMentions = 10
  ) {
    try {
      console.log(
        `📊 Creating mention volume alert for workspace: ${workspaceTitle} (ID: ${workspaceId})`
      );

      const alertConfig = {
        title: `${workspaceTitle} - High Mention Volume Alert`,
        whenThis: {
          value: null,
          text: `mentions >= ${minMentions}`,
          parts: {
            always: [`workspace:${workspaceId}`],
            sometimes: [],
            never: [],
          },
          case_sensitive: false,
          advanced_search: false,
        },
        happens: {
          text: "appears in News, Twitter, Reddit",
          value: {
            tags: [
              { tag: "news", id: 1, meta: null, friendly: "News" },
              { tag: "twitter", id: 2, meta: null, friendly: "Twitter V2" },
              { tag: "reddit", id: 3, meta: null, friendly: "Reddit" },
            ],
            sources: [],
          },
          search: "workspaces",
        },
        that: [
          {
            text: "send me an email",
            value: 2,
          },
        ],
        frequency: {
          value: 120,
          text: "every 2 hours",
        },
        tags: [],
      };

      const response = await axios.post(
        `${this.alertingURL}/alerts/alert`,
        alertConfig,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📤 Request Body Sent:");
      console.log(JSON.stringify(alertConfig, null, 2));
      console.log("✅ Mention volume alert created successfully!");
      console.log(`   Alert ID: ${response.data.id || "N/A"}`);
      console.log("📄 Full API Response:");
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error("❌ Failed to create mention volume alert:", error.message);
      throw error;
    }
  }

  /**
   * Create a keyword alert for a workspace
   */
  async createKeywordAlert(
    workspaceId,
    workspaceTitle,
    keywords = ["crisis", "scandal", "recall"]
  ) {
    try {
      console.log(
        `🔍 Creating keyword alert for workspace: ${workspaceTitle} (ID: ${workspaceId})`
      );

      const alertConfig = {
        title: `${workspaceTitle} - Crisis Keywords Alert`,
        whenThis: {
          value: null,
          text: keywords.join(" OR "),
          parts: {
            always: [`workspace:${workspaceId}`],
            sometimes: keywords,
            never: [],
          },
          case_sensitive: false,
          advanced_search: false,
        },
        happens: {
          text: "appears in News, Twitter, Reddit",
          value: {
            tags: [
              { tag: "news", id: 1, meta: null, friendly: "News" },
              { tag: "twitter", id: 2, meta: null, friendly: "Twitter V2" },
              { tag: "reddit", id: 3, meta: null, friendly: "Reddit" },
            ],
            sources: [],
          },
          search: "workspaces",
        },
        that: [
          {
            text: "send me an email",
            value: 2,
          },
        ],
        frequency: {
          value: 30,
          text: "every 30 minutes",
        },
        tags: [],
      };

      const response = await axios.post(
        `${this.alertingURL}/alerts/alert`,
        alertConfig,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📤 Request Body Sent:");
      console.log(JSON.stringify(alertConfig, null, 2));
      console.log("✅ Keyword alert created successfully!");
      console.log(`   Alert ID: ${response.data.id || "N/A"}`);
      console.log("📄 Full API Response:");
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error("❌ Failed to create keyword alert:", error.message);
      throw error;
    }
  }

  /**
   * Create a positive PR alert for a workspace
   */
  async createPositivePRAlert(workspaceId, workspaceTitle) {
    try {
      console.log(
        `🌟 Creating positive PR alert for workspace: ${workspaceTitle} (ID: ${workspaceId})`
      );

      const positiveKeywords = [
        "award",
        "recognition",
        "innovation",
        "success",
        "achievement",
        "milestone",
      ];

      const alertConfig = {
        title: `${workspaceTitle} - Positive PR Opportunities`,
        whenThis: {
          value: null,
          text: positiveKeywords.join(" OR "),
          parts: {
            always: [`workspace:${workspaceId}`],
            sometimes: positiveKeywords,
            never: [],
          },
          case_sensitive: false,
          advanced_search: false,
        },
        happens: {
          text: "appears in News, Twitter, Reddit",
          value: {
            tags: [
              { tag: "news", id: 1, meta: null, friendly: "News" },
              { tag: "twitter", id: 2, meta: null, friendly: "Twitter V2" },
              { tag: "reddit", id: 3, meta: null, friendly: "Reddit" },
            ],
            sources: [],
          },
          search: "workspaces",
        },
        that: [
          {
            text: "send me an email",
            value: 2,
          },
        ],
        frequency: {
          value: 120,
          text: "every 2 hours",
        },
        tags: [],
      };

      const response = await axios.post(
        `${this.alertingURL}/alerts/alert`,
        alertConfig,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📤 Request Body Sent:");
      console.log(JSON.stringify(alertConfig, null, 2));
      console.log("✅ Positive PR alert created successfully!");
      console.log(`   Alert ID: ${response.data.id || "N/A"}`);
      console.log("📄 Full API Response:");
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error("❌ Failed to create positive PR alert:", error.message);
      throw error;
    }
  }

  /**
   * Set up comprehensive alerts for a workspace
   */
  async setupComprehensiveAlerts(workspaceId, workspaceTitle) {
    try {
      console.log(
        `🎯 Setting up comprehensive alerts for: ${workspaceTitle} (ID: ${workspaceId})`
      );

      const alerts = [];

      // 1. Velocity alert
      const velocityAlert = await this.createVelocityAlert(
        workspaceId,
        workspaceTitle,
        50
      );
      alerts.push({ type: "velocity", alert: velocityAlert });

      // 2. Negative sentiment alert
      const sentimentAlert = await this.createSentimentAlert(
        workspaceId,
        workspaceTitle,
        "negative"
      );
      alerts.push({ type: "sentiment", alert: sentimentAlert });

      // 3. Mention volume alert
      const volumeAlert = await this.createMentionVolumeAlert(
        workspaceId,
        workspaceTitle,
        10
      );
      alerts.push({ type: "volume", alert: volumeAlert });

      // 4. Crisis keywords alert
      const keywordAlert = await this.createKeywordAlert(
        workspaceId,
        workspaceTitle
      );
      alerts.push({ type: "keywords", alert: keywordAlert });

      // 5. Positive PR alert
      const positiveAlert = await this.createPositivePRAlert(
        workspaceId,
        workspaceTitle
      );
      alerts.push({ type: "positive", alert: positiveAlert });

      console.log("\n🎉 Comprehensive alert setup completed!");
      console.log(`📊 Total alerts created: ${alerts.length}`);

      return alerts;
    } catch (error) {
      console.error("❌ Failed to setup comprehensive alerts:", error.message);
      throw error;
    }
  }

  /**
   * List existing alerts
   */
  async listAlerts(username) {
    try {
      console.log(`📋 Listing alerts for user: ${username}`);

      const response = await axios.get(
        `${this.alertingURL}/alerts/alert/${username}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );

      console.log("✅ Alerts found:");
      console.log("📄 Full List Alerts Response:");
      console.log(JSON.stringify(response.data, null, 2));

      if (response.data && response.data.length > 0) {
        response.data.forEach((alert) => {
          console.log(
            `   🚨 ID: ${alert.id} | Title: ${alert.title} | Frequency: ${
              alert.frequency?.text || "N/A"
            }`
          );
        });
      } else {
        console.log("   No alerts found");
      }

      return response.data;
    } catch (error) {
      console.error("❌ Failed to list alerts:", error.message);
      throw error;
    }
  }
}

// Export the class
module.exports = { WorkspaceAlertSetup };

// Example usage
async function exampleUsage() {
  const alertSetup = new WorkspaceAlertSetup();

  try {
    // 1. Authenticate
    await alertSetup.authenticate();

    // 2. List workspaces
    const workspaces = await alertSetup.listWorkspaces();

    // 3. Find a suitable workspace (example: first one)
    if (workspaces.length > 0) {
      const workspace = workspaces[0];
      console.log(`\n🎯 Setting up alerts for workspace: ${workspace.title}`);

      // 4. Setup comprehensive alerts
      await alertSetup.setupComprehensiveAlerts(workspace.id, workspace.title);

      // 5. List all alerts
      await alertSetup.listAlerts(process.env.PEAKMETRICS_UN);
    } else {
      console.log("❌ No workspaces found");
    }
  } catch (error) {
    console.error("💥 Example failed:", error.message);
  }
}

// Run example if called directly
if (require.main === module) {
  exampleUsage()
    .then(() => {
      console.log("\n✅ Workspace alert setup example completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Workspace alert setup example failed:", error);
      process.exit(1);
    });
}
