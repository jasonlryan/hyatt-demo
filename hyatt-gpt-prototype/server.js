require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const AgentOrchestrator = require("./AgentOrchestrator");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Initialize orchestrator
const orchestrator = new AgentOrchestrator();

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Hyatt GPT Agents System",
  });
});

// Create a new campaign
app.post("/api/campaigns", async (req, res) => {
  try {
    const { campaignBrief } = req.body;

    if (!campaignBrief || campaignBrief.trim().length === 0) {
      return res.status(400).json({
        error: "Campaign brief is required",
      });
    }

    console.log(
      "Creating new campaign with brief:",
      campaignBrief.substring(0, 100) + "..."
    );

    const campaign = await orchestrator.startCampaign(campaignBrief);

    res.status(201).json(campaign);
  } catch (error) {
    console.error("Campaign creation error:", error);
    res.status(500).json({
      error: "Failed to create campaign",
      details: error.message,
    });
  }
});

// Get campaign status and results
app.get("/api/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = orchestrator.getCampaign(id);

    if (!campaign) {
      return res.status(404).json({
        error: "Campaign not found",
      });
    }

    res.json(campaign);
  } catch (error) {
    console.error("Get campaign error:", error);
    res.status(500).json({
      error: "Failed to retrieve campaign",
      details: error.message,
    });
  }
});

// Get research phase results
app.get("/api/campaigns/:id/research", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = orchestrator.getCampaign(id);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (!campaign.phases.research) {
      return res.status(202).json({
        message: "Research phase not yet completed",
        status: campaign.status,
      });
    }

    res.json(campaign.phases.research);
  } catch (error) {
    console.error("Get research error:", error);
    res.status(500).json({
      error: "Failed to retrieve research results",
      details: error.message,
    });
  }
});

// Get trending phase results
app.get("/api/campaigns/:id/trending", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = orchestrator.getCampaign(id);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (!campaign.phases.trending) {
      return res.status(202).json({
        message: "Trending phase not yet completed",
        status: campaign.status,
      });
    }

    res.json(campaign.phases.trending);
  } catch (error) {
    console.error("Get trending error:", error);
    res.status(500).json({
      error: "Failed to retrieve trending results",
      details: error.message,
    });
  }
});

// Get story angles phase results
app.get("/api/campaigns/:id/story", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = orchestrator.getCampaign(id);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (!campaign.phases.story) {
      return res.status(202).json({
        message: "Story phase not yet completed",
        status: campaign.status,
      });
    }

    res.json(campaign.phases.story);
  } catch (error) {
    console.error("Get story error:", error);
    res.status(500).json({
      error: "Failed to retrieve story results",
      details: error.message,
    });
  }
});

// Get final campaign plan
app.get("/api/campaigns/:id/final", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = orchestrator.getCampaign(id);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (campaign.status !== "completed") {
      return res.status(202).json({
        message: "Campaign not yet completed",
        status: campaign.status,
      });
    }

    res.json({
      campaignId: campaign.id,
      status: campaign.status,
      campaignPlan: campaign.phases.collaborative.finalStrategy,
    });
  } catch (error) {
    console.error("Get final campaign error:", error);
    res.status(500).json({
      error: "Failed to retrieve final campaign",
      details: error.message,
    });
  }
});

// List all campaigns
app.get("/api/campaigns", async (req, res) => {
  try {
    const campaigns = orchestrator.getAllCampaigns();
    res.json(campaigns);
  } catch (error) {
    console.error("List campaigns error:", error);
    res.status(500).json({
      error: "Failed to list campaigns",
      details: error.message,
    });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Hyatt GPT Agent system running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🌐 Frontend: http://localhost:${port}`);
  console.log(`📡 API: http://localhost:${port}/api/campaigns`);
});

module.exports = app;
