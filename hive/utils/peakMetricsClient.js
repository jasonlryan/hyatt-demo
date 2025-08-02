const axios = require("axios");

class PeakMetricsClient {
  constructor() {
    this.baseURL = "https://api.peakmetrics.com";
    this.token = null;
    this.tokenExpiry = null;

    // Load credentials from environment
    this.username = process.env.PEAKMETRICS_UN;
    this.password = process.env.PEAKMETRICS_PW;
    this.clientId = process.env.PEAKMETRICS_CLIENT_ID || "hive-integration";

    if (!this.username || !this.password) {
      throw new Error(
        "PeakMetrics credentials not found in environment variables"
      );
    }
  }

  async getToken() {
    // Check if we have a valid cached token
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post(`${this.baseURL}/access/token`, {
        username: this.username,
        password: this.password,
        client_id: this.clientId,
      });

      this.token = response.data.Token;
      // Set expiry to 90% of the reported expiry time to be safe
      this.tokenExpiry = Date.now() + response.data.ExpiresIn * 1000 * 0.9;

      console.log("✅ PeakMetrics: JWT token obtained and cached");
      return this.token;
    } catch (error) {
      console.error(
        "❌ PeakMetrics: Failed to get token:",
        error.response?.data || error.message
      );
      throw new Error(`PeakMetrics authentication failed: ${error.message}`);
    }
  }

  async get(path, params = {}) {
    try {
      const token = await this.getToken();

      const response = await axios.get(`${this.baseURL}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: params,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired, clear cache and retry once
        this.token = null;
        this.tokenExpiry = null;
        console.log("🔄 PeakMetrics: Token expired, retrying...");
        return this.get(path, params);
      }

      console.error(
        `❌ PeakMetrics API error (${path}):`,
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Convenience methods for common operations
  async getWorkspaces() {
    return this.get("/workspaces");
  }

  async getNarratives(workspaceId, options = {}) {
    const defaults = {
      limit: 50,
      sort: "relevancy",
      since: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
      to: new Date().toISOString(),
    };

    const params = { ...defaults, ...options };
    return this.get(`/workspaces/${workspaceId}/narratives`, params);
  }

  async getMentions(workspaceId, options = {}) {
    const defaults = {
      limit: 50,
      sort: "published",
      order: "desc",
      since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      to: new Date().toISOString(),
    };

    const params = { ...defaults, ...options };
    return this.get(`/workspaces/${workspaceId}/mentions`, params);
  }

  // Helper to find workspace by title/query
  async findWorkspaceByQuery(query) {
    const workspaces = await this.getWorkspaces();
    return workspaces.find(
      (w) =>
        w.title.toLowerCase().includes(query.toLowerCase()) ||
        w.query.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = PeakMetricsClient;
