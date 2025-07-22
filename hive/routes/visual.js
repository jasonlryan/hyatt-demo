module.exports = function (app) {
  const { v4: uuidv4 } = require("uuid");
  const VisualPromptGeneratorAgent = require("../agents/classes/VisualPromptGeneratorAgent");
  const ModularElementsRecommenderAgent = require("../agents/classes/ModularElementsRecommenderAgent");
  const TrendCulturalAnalyzerAgent = require("../agents/classes/TrendCulturalAnalyzerAgent");
  const BrandQAAgent = require("../agents/classes/BrandQAAgent");
  const BrandLensAgent = require("../agents/classes/BrandLensAgent");

  const activeWorkflows = new Map();

  app.post("/api/hive-orchestrate", async (req, res) => {
    const {
      campaign,
      momentType,
      visualObjective,
      heroVisualDescription,
      promptSnippet,
      modularElements,
    } = req.body;
    if (!campaign) {
      return res
        .status(400)
        .json({ error: "Missing required field: campaign." });
    }
    // Provide defaults for optional fields for backward compatibility
    const context = {
      campaign,
      momentType: momentType || "",
      visualObjective: visualObjective || "",
      heroVisualDescription: heroVisualDescription || "",
      promptSnippet: promptSnippet || "",
      modularElements: modularElements || [],
    };

    const workflow = {
      id: uuidv4(),
      status: "running",
      currentPhase: "trend_analysis",
      phases: {
        trend_analysis: { status: "pending" },
        brand_lens: { status: "pending" },
        visual_prompt: { status: "pending" },
        modular_elements: { status: "pending" },
        qa_review: { status: "pending" },
      },
      deliverables: {},
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    activeWorkflows.set(workflow.id, workflow);

    const trendAgent = new TrendCulturalAnalyzerAgent();
    const brandLensAgent = new BrandLensAgent();
    const visualAgent = new VisualPromptGeneratorAgent();
    const modularAgent = new ModularElementsRecommenderAgent();
    const qaAgent = new BrandQAAgent();

    (async () => {
      try {
        workflow.phases.trend_analysis.status = "running";
        const trendInsights = await trendAgent.analyzeTrends(context);
        workflow.phases.trend_analysis.status = "completed";
        workflow.deliverables.trend_analysis = {
          id: "trend_analysis",
          title: "Trend Insights",
          type: "text",
          status: "ready",
          agent: "Trend Cultural Analyzer",
          timestamp: new Date().toISOString(),
          content: trendInsights,
        };

        workflow.currentPhase = "brand_lens";
        workflow.phases.brand_lens.status = "running";
        const brandLens = await brandLensAgent.analyzeBrandPerspective(
          trendInsights,
          context
        );
        workflow.phases.brand_lens.status = "completed";
        workflow.deliverables.brand_lens = {
          id: "brand_lens",
          title: "Brand Lens",
          type: "text",
          status: "ready",
          agent: "Brand Lens",
          timestamp: new Date().toISOString(),
          content: brandLens,
        };

        workflow.currentPhase = "visual_prompt";
        workflow.phases.visual_prompt.status = "running";
        const baseResult = await visualAgent.generatePrompt(context);
        workflow.phases.visual_prompt.status = "completed";
        workflow.deliverables.visual_prompt = {
          id: "visual_prompt",
          title: "Visual Prompt",
          type: "image",
          status: "ready",
          agent: "Visual Prompt Generator",
          timestamp: new Date().toISOString(),
          content: {
            promptText: baseResult.promptText,
            imageUrl: baseResult.imageUrl,
          },
        };

        workflow.currentPhase = "modular_elements";
        workflow.phases.modular_elements.status = "running";
        const modulars = await modularAgent.recommendElements(
          context,
          baseResult,
          trendInsights,
          brandLens
        );
        workflow.phases.modular_elements.status = "completed";
        workflow.deliverables.modular_elements = {
          id: "modular_elements",
          title: "Modular Elements",
          type: "text",
          status: "ready",
          agent: "Modular Elements Recommender",
          timestamp: new Date().toISOString(),
          content: { elements: modulars },
        };

        workflow.currentPhase = "qa_review";
        workflow.phases.qa_review.status = "running";
        const qaResult = await qaAgent.reviewPrompt(
          baseResult,
          modulars,
          trendInsights,
          brandLens
        );
        workflow.phases.qa_review.status = "completed";
        workflow.deliverables.qa_review = {
          id: "qa_review",
          title: "QA Review",
          type: "text",
          status: "ready",
          agent: "Brand QA",
          timestamp: new Date().toISOString(),
          content: qaResult,
        };

        workflow.status = "completed";
        workflow.currentPhase = "completed";
        workflow.lastUpdated = new Date().toISOString();
      } catch (err) {
        workflow.status = "failed";
        workflow.error = err.message;
        workflow.lastUpdated = new Date().toISOString();
      }
    })();

    res.json({ id: workflow.id });
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
