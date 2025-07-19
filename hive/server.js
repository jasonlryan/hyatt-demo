require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { createOrchestrator } = require("./orchestrations");
const VisualPromptGeneratorAgent = require("./agents/classes/VisualPromptGeneratorAgent");
const ModularElementsRecommenderAgent = require("./agents/classes/ModularElementsRecommenderAgent");
const TrendCulturalAnalyzerAgent = require("./agents/classes/TrendCulturalAnalyzerAgent");
const BrandQAAgent = require("./agents/classes/BrandQAAgent");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Initialize orchestrator
const orchestrator = createOrchestrator("agent");

// ASYNCHRONOUS IIFE (Immediately Invoked Function Expression) to initialize agents
(async () => {
  try {
    await orchestrator.loadAgents();
    console.log("✅ Orchestrator and agents initialized successfully.");

    // Only start server if not in Vercel environment AND after successful initialization
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`🚀 Hyatt GPT Agent system running on port ${port}`);
        console.log(`📊 Health check: http://localhost:${port}/health`);
        console.log(`🌐 Frontend: http://localhost:${port}`);
        console.log(`📡 API: http://localhost:${port}/api/campaigns`);
      });
    }
  } catch (error) {
    console.error(
      "❌ Server failed to start due to agent initialization error:",
      error
    );
    // Prevent server from starting or Vercel function from becoming healthy if agents fail to init
    // For Vercel, this error should appear in the runtime logs if it occurs during deployment initialization.
    if (process.env.NODE_ENV === "production") {
      // In a Vercel environment, re-throwing will cause the function to fail deployment/startup
      throw error;
    }
    // For local, you might choose to exit or let it run without agents (though it would be broken)
    // process.exit(1); // Optionally exit if local startup fails critically
  }
})();

// Routes

// Manual review status
app.get("/api/manual-review", (req, res) => {
  res.json({ enabled: orchestrator.enableManualReview });
});

app.post("/api/manual-review", (req, res) => {
  const { enabled } = req.body;
  orchestrator.enableManualReview = !!enabled;
  res.json({ enabled: orchestrator.enableManualReview });
});

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

// Cancel and remove a campaign
app.delete("/api/campaigns/:id", (req, res) => {
  const { id } = req.params;
  const cancelled = orchestrator.cancelCampaign(id);
  if (!cancelled) {
    return res.status(404).json({ error: "Campaign not found" });
  }
  res.json({ status: "cancelled", campaignId: id });
});

// Resume a paused campaign
app.post("/api/campaigns/:id/resume", (req, res) => {
  const { id } = req.params;
  const resumed = orchestrator.resumeCampaign(id);
  if (!resumed) {
    return res.status(400).json({ error: "Unable to resume campaign" });
  }
  res.json({ status: "resumed", campaignId: id });
});

// Apply refinement and rerun the current phase
app.post("/api/campaigns/:id/refine", (req, res) => {
  const { id } = req.params;
  const { instructions } = req.body;
  const refined = orchestrator.refineCampaign(id, instructions || "");
  if (!refined) {
    return res.status(400).json({ error: "Unable to refine campaign" });
  }
  res.json({ status: "refining", campaignId: id });
});

// Get agents configuration
app.get("/api/config/agents", (req, res) => {
  try {
    const fs = require("fs");
    const configPath = path.join(__dirname, "agents/agents.config.json");

    if (!fs.existsSync(configPath)) {
      return res
        .status(404)
        .json({ error: "Agents configuration file not found" });
    }

    const configData = fs.readFileSync(configPath, "utf8");
    const agentsConfig = JSON.parse(configData);

    res.json(agentsConfig);
  } catch (error) {
    console.error("Get agents config error:", error);
    res.status(500).json({
      error: "Failed to retrieve agents configuration",
      details: error.message,
    });
  }
});

// Update agents configuration
app.put("/api/config/agents", (req, res) => {
  try {
    const fs = require("fs");
    const configPath = path.join(__dirname, "agents/agents.config.json");
    const updatedConfig = req.body;

    // Add metadata
    updatedConfig.metadata = {
      ...updatedConfig.metadata,
      lastUpdated: new Date().toISOString(),
      updatedBy: "user",
    };

    // Write the updated configuration
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));

    res.json({
      success: true,
      message: "Agents configuration updated successfully",
      config: updatedConfig,
    });
  } catch (error) {
    console.error("Update agents config error:", error);
    res.status(500).json({
      error: "Failed to update agents configuration",
      details: error.message,
    });
  }
});

// Get GPT prompt files
app.get("/api/prompts/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const fs = require("fs");

    // Security check - only allow specific prompt files
    const allowedFiles = [
      "research_audience_gpt.md",
      "trending_news_gpt.md",
      "story_angles_headlines_gpt.md",
      "strategic_insight_gpt.md",
      "pr_manager_gpt.md",
      // New visual prompt agents
      "visual_prompt_generator.md",
      "modular_elements_recommender.md",
      "trend_cultural_analyzer.md",
      "brand_qa.md",
    ];

    if (!allowedFiles.includes(filename)) {
      return res.status(404).json({ error: "Prompt file not found" });
    }

    const promptPath = path.join(__dirname, "agents/prompts", filename);

    if (!fs.existsSync(promptPath)) {
      return res.status(404).json({ error: "Prompt file not found" });
    }

    const promptContent = fs.readFileSync(promptPath, "utf8");
    res.set("Content-Type", "text/plain");
    res.send(promptContent);
  } catch (error) {
    console.error("Get prompt file error:", error);
    res.status(500).json({
      error: "Failed to retrieve prompt file",
      details: error.message,
    });
  }
});

// Hive visual orchestration endpoint (must be declared BEFORE the 404 handler)
app.post("/api/hive-orchestrate", async (req, res) => {
  const {
    campaign,
    momentType,
    visualObjective,
    heroVisualDescription,
    promptSnippet,
    modularElements,
  } = req.body;
  if (!campaign || !visualObjective || !heroVisualDescription) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const context = {
      campaign,
      momentType,
      visualObjective,
      heroVisualDescription,
      promptSnippet,
      modularElements,
    };

    const visualAgent = new VisualPromptGeneratorAgent();
    const modularAgent = new ModularElementsRecommenderAgent();
    const trendAgent = new TrendCulturalAnalyzerAgent();
    const qaAgent = new BrandQAAgent();

    const baseResult = await visualAgent.generatePrompt(context);
    const modulars = await modularAgent.recommendElements(context, baseResult);
    const trendInsights = await trendAgent.analyzeTrends(context);
    const qaResult = await qaAgent.reviewPrompt(
      baseResult,
      modulars,
      trendInsights
    );
    res.json({
      promptText: baseResult.promptText,
      imageUrl: baseResult.imageUrl,
      modulars,
      trendInsights,
      qaResult,
    });
  } catch (err) {
    console.error("Hive orchestrate error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------- Hive Visual Stream (SSE) --------
app.get("/api/hive-orchestrate-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event, payload) => {
    res.write(`event:${event}\ndata:${JSON.stringify(payload)}\n\n`);
  };

  const context = {
    campaign: req.query.campaign || "Capri Sun Pouch Pallet",
    momentType:
      req.query.momentType || "Brand Rumor Response / Nostalgia Reassurance",
    visualObjective:
      req.query.visualObjective ||
      "Reinforce pouch nostalgia while introducing new bottle",
    heroVisualDescription:
      req.query.heroVisualDescription ||
      "Classic Capri Sun pouch in foreground, bottle behind, pop-art style on blue background",
    promptSnippet: req.query.promptSnippet || "",
    modularElements: [],
  };

  try {
    const visualAgent = new VisualPromptGeneratorAgent();
    send("status", { stage: "loading_prompts" });
    const baseResult = await visualAgent.generatePrompt(context);
    send("progress", { stage: "base_prompt", baseResult });

    const modularAgent = new ModularElementsRecommenderAgent();
    const modulars = await modularAgent.recommendElements(context, baseResult);
    send("progress", { stage: "modular_elements", modulars });

    const trendAgent = new TrendCulturalAnalyzerAgent();
    const trendInsights = await trendAgent.analyzeTrends(context);
    send("progress", { stage: "trend_insights", trendInsights });

    const qaAgent = new BrandQAAgent();
    const qaResult = await qaAgent.reviewPrompt(
      baseResult,
      modulars,
      trendInsights
    );
    send("progress", { stage: "brand_qa", qaResult });

    send("complete", {
      promptText: baseResult.promptText,
      imageUrl: baseResult.imageUrl,
      modulars,
      trendInsights,
      qaResult,
    });
    res.end();
  } catch (err) {
    send("error", { message: err.message });
    res.end();
  }
});
// -------- End SSE Route --------

// -------- Simple Image Generation Endpoint --------
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const axios = require("axios");
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const b64 = response.data.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${b64}`;
    res.json({ imageUrl });
  } catch (err) {
    console.error("Image generation error:", err);
    res.status(500).json({ error: err.message });
  }
});
// -------- End Image Generation Endpoint --------

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

// Make sure module.exports = app; is at the very end, outside the IIFE.
module.exports = app;
