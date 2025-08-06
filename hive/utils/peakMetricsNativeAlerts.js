const axios = require("axios");
require("dotenv").config();

/**
 * PeakMetrics Native Alerting Client
 * Uses the flux.peakm.com API for native alerting capabilities
 */
class PeakMetricsNativeAlerting {
  constructor() {
    this.baseURL = "https://flux.peakm.com";
    this.authToken = null;
    this.isAuthenticated = false;
  }

  /**
   * Authenticate with PeakMetrics
   */
  async authenticate() {
    try {
      const response = await axios.post(
        "https://api.peakmetrics.com/access/token",
        {
          username: process.env.PEAKMETRICS_UN,
          password: process.env.PEAKMETRICS_PW,
          client_id: process.env.PEAKMETRICS_CLIENT_ID,
        }
      );

      this.authToken = response.data.Token;
      this.isAuthenticated = true;
      console.log("✅ Authenticated with PeakMetrics");
      return true;
    } catch (error) {
      console.error("❌ Authentication failed:", error.message);
      return false;
    }
  }

  /**
   * Create a new alert
   */
  async createAlert(alertConfig) {
    if (!this.isAuthenticated) {
      const authSuccess = await this.authenticate();
      if (!authSuccess) {
        throw new Error("Authentication required");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/alerts/alert`,
        alertConfig,
        {
          headers: {
            Authorization: this.authToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Alert created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Failed to create alert:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Create a velocity spike alert
   */
  async createVelocityAlert(workspaceId, threshold = 50, frequency = 60) {
    const alertConfig = {
      title: `Velocity Spike Alert - Workspace ${workspaceId}`,
      whenThis: {
        value: null,
        text: `velocity > ${threshold}`,
        parts: {
          always: [`workspace:${workspaceId}`],
          sometimes: [],
          never: [],
        },
      },
      happens: {
        text: "News, Twitter, Reddit",
        value: {
          tags: [
            { tag: "news", id: 1, friendly: "News" },
            { tag: "twitter", id: 2, friendly: "Twitter V2" },
            { tag: "reddit", id: 3, friendly: "Reddit" },
          ],
          sources: [],
        },
      },
      that: [
        {
          text: "send me an email",
          value: 2,
        },
      ],
      frequency: {
        value: frequency,
        text: `every ${frequency} minutes`,
      },
      tags: [],
      search: "workspaces",
    };

    return this.createAlert(alertConfig);
  }

  /**
   * Create a sentiment alert
   */
  async createSentimentAlert(
    workspaceId,
    sentiment = "negative",
    frequency = 60
  ) {
    const alertConfig = {
      title: `Sentiment Alert - Workspace ${workspaceId}`,
      whenThis: {
        value: null,
        text: `sentiment ${sentiment}`,
        parts: {
          always: [`workspace:${workspaceId}`],
          sometimes: [],
          never: [],
        },
      },
      happens: {
        text: "All Sources",
        value: {
          tags: [
            { tag: "news", id: 1, friendly: "News" },
            { tag: "twitter", id: 2, friendly: "Twitter V2" },
            { tag: "reddit", id: 3, friendly: "Reddit" },
            { tag: "instagram", id: 4, friendly: "Instagram" },
          ],
          sources: [],
        },
      },
      that: [
        {
          text: "send me a Slack",
          value: 3,
        },
      ],
      frequency: {
        value: frequency,
        text: `every ${frequency} minutes`,
      },
      tags: [],
      search: "workspaces",
    };

    return this.createAlert(alertConfig);
  }

  /**
   * Create a mention volume alert
   */
  async createMentionVolumeAlert(
    workspaceId,
    minMentions = 10,
    frequency = 60
  ) {
    const alertConfig = {
      title: `Mention Volume Alert - Workspace ${workspaceId}`,
      whenThis: {
        value: null,
        text: `mentions >= ${minMentions}`,
        parts: {
          always: [`workspace:${workspaceId}`],
          sometimes: [],
          never: [],
        },
      },
      happens: {
        text: "All Sources",
        value: {
          tags: [
            { tag: "news", id: 1, friendly: "News" },
            { tag: "twitter", id: 2, friendly: "Twitter V2" },
            { tag: "reddit", id: 3, friendly: "Reddit" },
            { tag: "instagram", id: 4, friendly: "Instagram" },
          ],
          sources: [],
        },
      },
      that: [
        {
          text: "just track",
          value: 5,
        },
      ],
      frequency: {
        value: frequency,
        text: `every ${frequency} minutes`,
      },
      tags: [],
      search: "workspaces",
    };

    return this.createAlert(alertConfig);
  }

  /**
   * Create a custom keyword alert
   */
  async createKeywordAlert(workspaceId, keywords = [], frequency = 60) {
    const alertConfig = {
      title: `Keyword Alert - Workspace ${workspaceId}`,
      whenThis: {
        value: null,
        text: keywords.join(" OR "),
        parts: {
          always: [`workspace:${workspaceId}`],
          sometimes: keywords,
          never: [],
        },
      },
      happens: {
        text: "All Sources",
        value: {
          tags: [
            { tag: "news", id: 1, friendly: "News" },
            { tag: "twitter", id: 2, friendly: "Twitter V2" },
            { tag: "reddit", id: 3, friendly: "Reddit" },
          ],
          sources: [],
        },
      },
      that: [
        {
          text: "send me an email",
          value: 2,
        },
        {
          text: "send me a Slack",
          value: 3,
        },
      ],
      frequency: {
        value: frequency,
        text: `every ${frequency} minutes`,
      },
      tags: [],
      search: "workspaces",
    };

    return this.createAlert(alertConfig);
  }

  /**
   * List all alerts (if endpoint exists)
   */
  async listAlerts() {
    if (!this.isAuthenticated) {
      const authSuccess = await this.authenticate();
      if (!authSuccess) {
        throw new Error("Authentication required");
      }
    }

    try {
      const response = await axios.get(`${this.baseURL}/alerts`, {
        headers: {
          Authorization: this.authToken,
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "❌ Failed to list alerts:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Delete an alert (if endpoint exists)
   */
  async deleteAlert(alertId) {
    if (!this.isAuthenticated) {
      const authSuccess = await this.authenticate();
      if (!authSuccess) {
        throw new Error("Authentication required");
      }
    }

    try {
      const response = await axios.delete(`${this.baseURL}/alerts/${alertId}`, {
        headers: {
          Authorization: this.authToken,
        },
      });

      console.log("✅ Alert deleted successfully");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Failed to delete alert:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

// Export singleton instance
let nativeAlertingInstance = null;

function getNativeAlertingInstance() {
  if (!nativeAlertingInstance) {
    nativeAlertingInstance = new PeakMetricsNativeAlerting();
  }
  return nativeAlertingInstance;
}

module.exports = { PeakMetricsNativeAlerting, getNativeAlertingInstance };
