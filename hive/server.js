require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
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
const frontendDist = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}
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
        console.log(`🚀 Hive Agent system running on port ${port}`);
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
    service: "Hive Agents System",
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

// Get orchestrations list
app.get("/api/orchestrations", (req, res) => {
  try {
    // Load generated orchestrations
    const fs = require("fs");
    const path = require("path");

    let generatedOrchestrations = [];
    const generatedOrchestrationsPath = path.join(
      process.cwd(),
      "data",
      "generated-orchestrations.json"
    );

    if (fs.existsSync(generatedOrchestrationsPath)) {
      const generatedData = JSON.parse(
        fs.readFileSync(generatedOrchestrationsPath, "utf8")
      );
      generatedOrchestrations = Object.values(
        generatedData.orchestrations || {}
      );
    }

    // Base orchestrations
    const baseOrchestrations = {
      hyatt: {
        id: "hyatt",
        name: "Hyatt Orchestrator",
        description:
          "Specialized orchestration for Hyatt PR campaigns with sequential workflow execution. Perfect for hotel and hospitality marketing campaigns.",
        enabled: true,
        config: {
          maxConcurrentWorkflows: 5,
          timeout: 300000,
          retryAttempts: 3,
          enableLogging: true,
        },
        workflows: [
          "pr_campaign_workflow",
          "content_creation_workflow",
          "research_workflow",
        ],
        agents: ["pr-manager", "research", "strategic", "trending", "story"],
      },
      template: {
        id: "template",
        name: "Template Orchestrator",
        description: "Example orchestration built from the Hyatt template.",
        enabled: true,
        config: {
          maxConcurrentWorkflows: 5,
          timeout: 300000,
          retryAttempts: 3,
          enableLogging: true,
        },
        workflows: ["pr_campaign_workflow"],
        agents: ["pr-manager", "research", "strategic", "trending"],
      },
      builder: {
        id: "builder",
        name: "Orchestration Builder",
        description:
          "AI-powered orchestration generator. Describe what you want, and it creates a custom orchestration for you.",
        enabled: true,
        config: {
          maxConcurrentWorkflows: 3,
          timeout: 300000,
          retryAttempts: 2,
          enableLogging: true,
        },
        workflows: ["orchestration_generation_workflow"],
        agents: [
          "orchestration_analyzer",
          "agent_generator",
          "workflow_designer",
        ],
      },
      hive: {
        id: "hive",
        name: "Hive Orchestrator",
        description:
          "Reactive framework orchestration with parallel agent collaboration. Perfect for complex PR campaigns with multiple stakeholders.",
        enabled: true,
        config: {
          maxConcurrentWorkflows: 10,
          timeout: 600000,
          retryAttempts: 2,
          enableLogging: true,
          reactiveFramework: true,
          parallelExecution: true,
        },
        workflows: [
          "hive_pr_campaign",
          "hive_content_creation",
          "hive_research_collaboration",
        ],
        agents: [
          "pr-manager",
          "research",
          "strategic",
          "trending",
          "story",
          "visual_prompt_generator",
          "brand_qa",
          "modular_elements_recommender",
          "trend_cultural_analyzer",
          "brand_lens",
        ],
      },
    };

    // Combine base and generated orchestrations
    const allOrchestrations = {
      ...baseOrchestrations,
      ...generatedOrchestrations.reduce((acc, orchestration) => {
        acc[orchestration.id] = orchestration;
        return acc;
      }, {}),
    };

    res.status(200).json({
      orchestrators: allOrchestrations,
    });
  } catch (error) {
    console.error("Error loading orchestrations:", error);
    res.status(500).json({
      message: "Failed to load orchestrations",
      error: error.message,
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

// Orchestration documentation endpoint
app.get("/api/orchestration-documentation", (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id)
      return res.status(400).json({ message: "Missing orchestration id" });

    const fs = require("fs");
    const path = require("path");

    // Documentation path mapping
    const documentationPaths = {
      hyatt: "docs/orchestrations/HyattOrchestrator.md",
      builder: "docs/orchestrations/OrchestrationBuilder.md",
      template: "docs/orchestrations/TemplateOrchestrator.md",
      hive: "docs/orchestrations/HiveOrchestrator.md",
    };

    const docPath = path.join(
      __dirname,
      "..",
      documentationPaths[id] || `docs/orchestrations/${id}.md`
    );

    if (!fs.existsSync(docPath)) {
      return res.status(404).json({ message: "Documentation not found" });
    }

    const markdown = fs.readFileSync(docPath, "utf8");
    res.status(200).json({
      markdown,
      metadata: {
        orchestrationId: id,
        lastModified: fs.statSync(docPath).mtime.toISOString(),
      },
    });
  } catch (error) {
    console.error("Documentation loading failed:", error);
    res.status(500).json({ message: "Failed to load documentation" });
  }
});

// Generate orchestration
app.post("/api/generate-orchestration", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    const { OpenAI } = require("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const systemPrompt = `You are an AI orchestration architect. Based on a description, generate a complete orchestration specification including agents, workflows, configuration, and comprehensive documentation.`;
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Create an orchestration for: ${description}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });
    const generated = JSON.parse(completion.choices[0].message.content);
    if (!generated.name || !generated.agents || !generated.workflows) {
      throw new Error("Invalid orchestration structure generated");
    }
    generated.metadata = {
      generatedAt: new Date().toISOString(),
      sourceDescription: description,
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
    };
    res.status(200).json(generated);
  } catch (error) {
    console.error("Error generating orchestration:", error);
    res.status(500).json({
      error: "Failed to generate orchestration",
      details: error.message,
    });
  }
});

// Generate diagram for an orchestration
app.post("/api/generate-diagram", (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Missing id" });
    const orchestrations = {
      hyatt: {
        agents: [
          "pr_manager",
          "research_audience",
          "strategic_insight",
          "trending_news",
          "story_angles",
        ],
      },
      hive: {
        agents: [
          "trend_cultural_analyzer",
          "brand_lens",
          "visual_prompt_generator",
          "modular_elements_recommender",
          "brand_qa",
        ],
      },
      template: {
        agents: [
          "pr_manager",
          "research_audience",
          "strategic_insight",
          "trending_news",
        ],
      },
    };

    const agentColors = {
      research: "#2563eb",
      strategy: "#ec4899",
      trending: "#22c55e",
      story: "#7c3aed",
      "pr-manager": "#64748b",
      visual_prompt_generator: "#f59e0b",
      modular_elements_recommender: "#06b6d4",
      trend_cultural_analyzer: "#8b5cf6",
      brand_qa: "#ef4444",
      brand_lens: "#10b981",
    };

    const calculateNodePosition = (index, total) => {
      const centerX = 600;
      const centerY = 300;
      const radius = 200;
      if (total === 1) return { x: centerX, y: centerY };
      const angle = (index / total) * Math.PI * 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    };

    const generateNodes = (agents) =>
      agents.map((agent, index) => ({
        id: agent,
        label: agent,
        position: calculateNodePosition(index, agents.length),
        connectors: [
          { id: `${agent}-T`, position: "T" },
          { id: `${agent}-B`, position: "B" },
          { id: `${agent}-L`, position: "L" },
          { id: `${agent}-R`, position: "R" },
        ],
        style: { border: `2px solid ${agentColors[agent] || "#64748b"}` },
      }));

    const generateSequentialConnections = (agents) => {
      const connections = [];
      for (let i = 0; i < agents.length - 1; i++) {
        connections.push(`${agents[i]}:R -> ${agents[i + 1]}:L`);
      }
      return connections;
    };

    const parseConnection = (conn) => {
      const [nodeId, connector] = conn.split(":");
      return { nodeId, connector };
    };

    const createEdgeFromString = (str) => {
      const [from, to] = str.split("->").map((s) => s.trim());
      const fromConn = parseConnection(from);
      const toConn = parseConnection(to);
      return {
        id: `${from}-${to}`,
        from: fromConn,
        to: toConn,
        style: {
          color: "#2563eb",
          dashed: true,
          animated: true,
          strokeWidth: 2,
        },
        type: "default",
      };
    };

    const generateDiagramFromOrchestration = (orch) => {
      if (!orch || !Array.isArray(orch.agents) || orch.agents.length === 0) {
        return {
          nodes: [
            {
              id: "empty",
              label: "No Agents",
              position: { x: 600, y: 300 },
              connectors: [],
            },
          ],
          edges: [],
        };
      }
      const nodes = generateNodes(orch.agents);
      const edges = generateSequentialConnections(orch.agents).map(
        createEdgeFromString
      );
      return { nodes, edges };
    };

    const orchestration = orchestrations[id];
    if (!orchestration) return res.status(404).json({ message: "Not found" });
    const diagram = generateDiagramFromOrchestration(orchestration);
    res.status(200).json({ diagram });
  } catch (err) {
    console.error("Diagram generation failed:", err);
    res.status(500).json({ message: "Failed to generate diagram" });
  }
});

// Page generation endpoint
app.post("/api/generate-page", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pageType, requirements, features } = req.body;

    const { OpenAI } = require("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are a React page generator for the Hive application.

CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing pages
- Ensure accessibility and brand consistency

DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary

PAGE PATTERNS:
- Page container: bg-secondary min-h-screen
- Main content: max-w-7xl mx-auto px-4 py-8
- Page header: text-2xl font-bold text-text-primary mb-6
- Content cards: bg-white rounded-lg shadow-md p-6 border border-border
- Action buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium

Generate a complete React page that:
1. Uses ONLY design tokens for styling
2. Follows established page patterns from the Hive application
3. Includes proper TypeScript interfaces
4. Has proper accessibility features
5. Is responsive and well-structured
6. Integrates with existing shared components when appropriate

Return the page as a complete, ready-to-use React TypeScript file.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate a ${pageType} page with features: ${features}. Requirements: ${requirements}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const generatedPage = completion.choices[0].message.content;

    res.status(200).json({
      page: generatedPage,
      metadata: {
        generatedAt: new Date().toISOString(),
        pageType,
        requirements,
        features,
      },
    });
  } catch (error) {
    console.error("Error generating page:", error);
    res.status(500).json({
      error: "Failed to generate page",
      details: error.message,
    });
  }
});

// Component generation endpoint
app.post("/api/generate-component", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { componentType, requirements, orchestrationContext } = req.body;

    const { OpenAI } = require("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are a React component generator for the Hive application.

CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing components
- Ensure accessibility and brand consistency

DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary

COMPONENT PATTERNS:
- Buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors
- Cards: bg-white rounded-lg shadow-md p-6 border border-border
- Forms: w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition
- Status indicators: inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success

Generate a complete React component that:
1. Uses ONLY design tokens for styling
2. Follows established patterns from the Hive application
3. Includes proper TypeScript interfaces
4. Has proper accessibility features
5. Includes hover and focus states
6. Is responsive and well-structured

Return the component as a complete, ready-to-use React TypeScript file.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate a ${componentType} component for: ${requirements}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const generatedComponent = completion.choices[0].message.content;

    res.status(200).json({
      component: generatedComponent,
      metadata: {
        generatedAt: new Date().toISOString(),
        componentType,
        requirements,
        orchestrationContext,
      },
    });
  } catch (error) {
    console.error("Error generating component:", error);
    res.status(500).json({
      error: "Failed to generate component",
      details: error.message,
    });
  }
});

// Save updated global CSS
app.post("/api/save-css", (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { css } = req.body;
    if (!css) {
      return res.status(400).json({ message: "CSS content is required" });
    }
    const cssPath = path.join(process.cwd(), "frontend", "src", "index.css");
    fs.writeFileSync(cssPath, css, "utf8");
    res.status(200).json({ message: "CSS saved successfully" });
  } catch (error) {
    console.error("Error saving CSS:", error);
    res.status(500).json({ message: "Failed to save CSS" });
  }
});

// Save a generated orchestration and docs
app.post("/api/save-orchestration", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const orchestration = req.body;
    if (
      !orchestration.name ||
      !orchestration.agents ||
      !orchestration.workflows
    ) {
      return res.status(400).json({ error: "Invalid orchestration data" });
    }
    const id = orchestration.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const timestamp = Date.now();
    const uniqueId = `${id}-${timestamp}`;
    const newOrchestration = {
      id: uniqueId,
      name: orchestration.name,
      description: orchestration.description,
      enabled: true,
      config: {
        maxConcurrentWorkflows:
          orchestration.config.maxConcurrentWorkflows || 5,
        timeout: orchestration.config.timeout || 300000,
        retryAttempts: orchestration.config.retryAttempts || 3,
        enableLogging: orchestration.config.enableLogging !== false,
        reactiveFramework: orchestration.config.reactiveFramework || false,
        parallelExecution: orchestration.config.parallelExecution || false,
      },
      workflows: orchestration.workflows,
      agents: orchestration.agents,
      documentation: orchestration.documentation || {},
      metadata: {
        ...orchestration.metadata,
        createdBy: "orchestration-builder",
        createdAt: new Date().toISOString(),
      },
    };

    if (orchestration.generatedPage) {
      const { FileGenerator } = require("../utils/fileGenerator");
      const fileGenerator = new FileGenerator();
      await fileGenerator.generateOrchestrationPage(
        uniqueId,
        orchestration.name,
        orchestration.generatedPage
      );
      newOrchestration.metadata.generatedPagePath = `frontend/src/components/orchestrations/generated/${uniqueId}.tsx`;
      newOrchestration.metadata.generatedPageId = uniqueId;
    }

    const orchestrationsDir = path.join(
      process.cwd(),
      "data",
      "orchestrations"
    );
    if (!fs.existsSync(orchestrationsDir)) {
      fs.mkdirSync(orchestrationsDir, { recursive: true });
    }
    const filePath = path.join(orchestrationsDir, `${uniqueId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(newOrchestration, null, 2));

    const masterListPath = path.join(
      orchestrationsDir,
      "generated-orchestrations.json"
    );
    let masterList = [];
    if (fs.existsSync(masterListPath)) {
      masterList = JSON.parse(fs.readFileSync(masterListPath, "utf8"));
    }
    masterList.push(newOrchestration);
    fs.writeFileSync(masterListPath, JSON.stringify(masterList, null, 2));

    if (orchestration.documentation) {
      const docsDir = path.join(
        process.cwd(),
        "hive",
        "orchestrations",
        "docs"
      );
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }
      const generateDocumentationMarkdown = (o) => {
        const { name, description, agents, workflows, config, documentation } =
          o;
        return `# ${name}\n\n## Overview\n\n${
          documentation.overview || description
        }`;
      };
      const docContent = generateDocumentationMarkdown(orchestration);
      const docFilePath = path.join(docsDir, `${uniqueId}.md`);
      fs.writeFileSync(docFilePath, docContent);
    }

    res.status(200).json({
      success: true,
      orchestration: newOrchestration,
      message: "Orchestration and documentation saved successfully",
    });
  } catch (error) {
    console.error("Error saving orchestration:", error);
    res.status(500).json({
      error: "Failed to save orchestration",
      details: error.message,
    });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  const distIndex = path.join(
    __dirname,
    "..",
    "frontend",
    "dist",
    "index.html"
  );
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
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
