module.exports = function (app) {
  const { v4: uuidv4 } = require("uuid");
  const HiveOrchestrator = require("../orchestrations/classes/HiveOrchestrator");
  const HiveWorkflowExecutor = require("../utils/hiveWorkflowExecutor");
  const VisualPromptGeneratorAgent = require("../agents/classes/VisualPromptGeneratorAgent");
  const ModularElementsRecommenderAgent = require("../agents/classes/ModularElementsRecommenderAgent");
  const TrendCulturalAnalyzerAgent = require("../agents/classes/TrendCulturalAnalyzerAgent");
  const BrandQAAgent = require("../agents/classes/BrandQAAgent");
  const BrandLensAgent = require("../agents/classes/BrandLensAgent");

  const activeWorkflows = new Map();

  // GET route for polling workflow status
  app.get("/api/hive-orchestrate/:id", async (req, res) => {
    const { id } = req.params;
    const workflow = activeWorkflows.get(id);

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    res.json(workflow);
  });

  // POST route for starting new workflow
  app.post("/api/hive-orchestrate", async (req, res) => {
    const {
      campaign,
      momentType,
      visualObjective,
      heroVisualDescription,
      promptSnippet,
      modularElements,
      hitlEnabled = false,
    } = req.body;

    if (!campaign) {
      return res
        .status(400)
        .json({ error: "Missing required field: campaign." });
    }

    // Create context object with moment/campaign
    const context = {
      campaign,
      moment: campaign, // For compatibility with new orchestrator
      momentType: momentType || "",
      visualObjective: visualObjective || "",
      heroVisualDescription: heroVisualDescription || "",
      promptSnippet: promptSnippet || "",
      modularElements: modularElements || [],
    };

    // Create workflow object with all 7 phases
    const workflow = {
      id: uuidv4(),
      status: "running",
      currentPhase: "pr_manager",
      hitlEnabled,
      isPaused: false,
      pausedAt: null,
      originalContext: context, // Store original context for resume
      phases: {
        pr_manager: { status: "pending" },
        trending: { status: "pending" },
        strategic: { status: "pending" },
        story: { status: "pending" },
        brand_lens: { status: "pending" },
        visual_prompt_generator: { status: "pending" },
        brand_qa: { status: "pending" },
      },
      deliverables: {},
      conversation: [], // Initialize conversation array for detailed log
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    activeWorkflows.set(workflow.id, workflow);

    // Execute the workflow using the executor
    (async () => {
      const executor = new HiveWorkflowExecutor(workflow, context);
      try {
        await executor.execute();
      } catch (error) {
        console.error("Workflow execution error:", error);
      }
    })();

    res.json({ id: workflow.id });
  });


  // POST route for refining workflow (HITL)
  app.post("/api/hive-orchestrate/:id/refine", async (req, res) => {
    const { id } = req.params;
    const { instructions } = req.body;
    const workflow = activeWorkflows.get(id);

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    if (!instructions) {
      return res.status(400).json({ error: "Missing refinement instructions" });
    }

    try {
      // Add refinement message to conversation
      workflow.conversation.push({
        speaker: "Human",
        message: `Refinement requested: ${instructions}`,
        timestamp: new Date().toISOString(),
      });

      // Update workflow status
      workflow.status = "refining";
      workflow.lastUpdated = new Date().toISOString();

      // Here you would typically re-run the orchestrator with refinements
      // For now, we'll just update the status back to running
      setTimeout(() => {
        workflow.status = "running";
        workflow.conversation.push({
          speaker: "System",
          message: "Applying refinements and continuing workflow...",
          timestamp: new Date().toISOString(),
        });
      }, 1000);

      res.json(workflow);
    } catch (error) {
      console.error("Refine workflow error:", error);
      res.status(500).json({ error: "Failed to refine workflow" });
    }
  });

  // POST route for resuming workflow (HITL)
  app.post("/api/hive-orchestrate/:id/resume", async (req, res) => {
    const { id } = req.params;
    const workflow = activeWorkflows.get(id);

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    if (!workflow.isPaused) {
      return res.status(400).json({ error: "Workflow is not paused" });
    }

    try {
      // Add resume message to conversation
      workflow.conversation.push({
        speaker: "Human",
        message: "Workflow resumed by user",
        timestamp: new Date().toISOString(),
      });

      // Update workflow status
      workflow.isPaused = false;
      workflow.status = "running";
      workflow.lastUpdated = new Date().toISOString();

      // Use the stored original context for resume
      const context = workflow.originalContext || {
        campaign: workflow.deliverables.pr_manager?.content || "",
        moment: workflow.deliverables.pr_manager?.content || "",
        momentType: "",
        visualObjective: "",
        heroVisualDescription: "",
        promptSnippet: "",
        modularElements: [],
      };

      // Resume workflow execution
      (async () => {
        const executor = new HiveWorkflowExecutor(workflow, context);
        try {
          await executor.execute();
        } catch (error) {
          console.error("Workflow resume error:", error);
          // Update workflow status on error
          workflow.status = "error";
          workflow.error = error.message;
          workflow.lastUpdated = new Date().toISOString();
        }
      })();

      res.json({ 
        id: workflow.id,
        status: workflow.status,
        message: `Workflow resumed from ${workflow.pausedAt} phase`
      });
    } catch (error) {
      console.error("Resume workflow error:", error);
      res.status(500).json({ error: "Failed to resume workflow" });
    }
  });

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
      const modulars = await modularAgent.recommendElements(
        context,
        baseResult
      );
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

  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || prompt.trim().length === 0)
        return res.status(400).json({ error: "Prompt is required" });
      const axios = require("axios");
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        { model: "gpt-image-1", prompt, n: 1, size: "1024x1024" },
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

  app.get("/api/hive/workflows/:id", (req, res) => {
    const wf = activeWorkflows.get(req.params.id);
    if (!wf) return res.status(404).json({ error: "Workflow not found" });
    res.json(wf);
  });

  app.get("/api/hive/workflows", (req, res) => {
    res.json(Array.from(activeWorkflows.values()));
  });
};
