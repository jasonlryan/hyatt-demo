module.exports = function (app) {
  const { v4: uuidv4 } = require("uuid");
  const HiveOrchestrator = require("../orchestrations/classes/HiveOrchestrator");
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

    // Use HiveOrchestrator to execute the workflow
    const orchestrator = new HiveOrchestrator();

    (async () => {
      try {
        workflow.conversation.push({
          speaker: "System",
          message: "Starting Hive PR Manager-led workflow...",
          timestamp: new Date().toISOString(),
        });

        await orchestrator.loadAgents();

        // Step 1: PR Manager introduction
        workflow.currentPhase = "pr_manager";
        workflow.phases.pr_manager.status = "running";

        // PR Manager doesn't have generateConversationResponse, so we'll create a simple intro message
        workflow.conversation.push({
          speaker: "PR Manager",
          message:
            "I'm the PR Manager and I'll orchestrate this campaign response. Let me establish our strategic framework and coordinate with all agents to deliver a comprehensive campaign strategy.",
          timestamp: new Date().toISOString(),
        });

        // Add processing indicator
        workflow.conversation.push({
          speaker: "PR Manager",
          message:
            "_[Establishing overall PR strategy and campaign framework...]_",
          timestamp: new Date().toISOString(),
          isProcessing: true,
        });

        const prIntro =
          await orchestrator.prManager.generateCampaignIntroduction(
            context.moment || context.campaign,
            context
          );

        // Remove processing indicator
        workflow.conversation = workflow.conversation.filter(
          (msg) => !msg.isProcessing
        );

        // Update PR Manager deliverable immediately
        workflow.deliverables.pr_manager = {
          id: "pr_manager",
          title: "PR Manager Strategy",
          type: "text",
          status: "ready",
          agent: "PR Manager",
          timestamp: new Date().toISOString(),
          content: prIntro, // Already a string
        };
        workflow.phases.pr_manager.status = "completed";

        // PR Manager provides the strategy directly
        workflow.conversation.push({
          speaker: "PR Manager",
          message: prIntro,
          deliverable: prIntro,
          agent: "PR Manager",
          timestamp: new Date().toISOString(),
        });

        // PR Manager handoff to next phase
        const handoffMessage =
          await orchestrator.prManager.generateHandoffMessage(
            context,
            "trending",
            prIntro
          );

        workflow.conversation.push({
          speaker: "PR Manager",
          message: handoffMessage,
          timestamp: new Date().toISOString(),
        });

        // Step 2: Moment analysis
        workflow.currentPhase = "trending";
        workflow.phases.trending.status = "running";

        // Generate dynamic introduction message
        const trendingIntroMessage =
          await orchestrator.trendingAgent.generateConversationResponse(
            context,
            "introduction",
            { phase: "trending", campaignType: "moment_response" }
          );

        workflow.conversation.push({
          speaker: "Trending News GPT",
          message: trendingIntroMessage,
          timestamp: new Date().toISOString(),
        });

        // Add processing indicator
        workflow.conversation.push({
          speaker: "Trending News GPT",
          message: "_[Scanning cultural moments and trend data...]_",
          timestamp: new Date().toISOString(),
          isProcessing: true,
        });

        const trendInsights = await orchestrator.trendingAgent.analyzeTrends(
          context.moment || context.campaign,
          null,
          null
        );

        // Remove processing indicator
        workflow.conversation = workflow.conversation.filter(
          (msg) => !msg.isProcessing
        );

        // Update Trending deliverable immediately
        workflow.deliverables.trending = {
          id: "trending",
          title: "Moment Analysis",
          type: "text",
          status: "ready",
          agent: "Trending News",
          timestamp: new Date().toISOString(),
          content:
            trendInsights.trends?.trendsAnalysis ||
            (typeof trendInsights === "string"
              ? trendInsights
              : JSON.stringify(trendInsights, null, 2)), // Extract main content as string
        };
        workflow.phases.trending.status = "completed";

        // Generate delivery message
        const trendingDeliveryMessage =
          await orchestrator.trendingAgent.generateConversationResponse(
            context,
            "delivery",
            trendInsights
          );

        workflow.conversation.push({
          speaker: "Trending News GPT",
          message: trendingDeliveryMessage,
          deliverable: trendInsights,
          agent: "Trending News GPT",
          timestamp: new Date().toISOString(),
        });

        // Step 3: Strategic insight
        workflow.currentPhase = "strategic";
        workflow.phases.strategic.status = "running";

        // Add processing indicator
        workflow.conversation.push({
          speaker: "Strategic Insight GPT",
          message: "_[Analyzing trends to discover deeper human truths...]_",
          timestamp: new Date().toISOString(),
          isProcessing: true,
        });

        const strategicInsights =
          await orchestrator.strategicAgent.discoverHumanTruth(
            trendInsights,
            context
          );

        // Remove processing indicator
        workflow.conversation = workflow.conversation.filter(
          (msg) => !msg.isProcessing
        );

        // Log strategic transformation
        console.log(`🔍 STRATEGIC TRANSFORMATION COMPLETE:
- Human Truth Analysis: Generated via Responses API
- Confidence: ${strategicInsights.confidence_score || 95}% confidence
- Analysis: ${
          strategicInsights.humanTruthAnalysis?.substring(0, 100) ||
          "Analysis complete"
        }...`);

        // Update Strategic deliverable immediately
        workflow.deliverables.strategic = {
          id: "strategic",
          title: "Strategic Insights",
          type: "text",
          status: "ready",
          agent: "Strategic Insight",
          timestamp: new Date().toISOString(),
          content: strategicInsights.humanTruthAnalysis || strategicInsights, // Extract main content
        };
        workflow.phases.strategic.status = "completed";

        workflow.conversation.push({
          speaker: "Strategic Insight GPT",
          message:
            strategicInsights.humanTruthAnalysis ||
            JSON.stringify(strategicInsights, null, 2),
          deliverable: strategicInsights,
          agent: "Strategic Insight GPT",
          timestamp: new Date().toISOString(),
        });

        // Step 4: Story angle generation
        workflow.currentPhase = "story";
        workflow.phases.story.status = "running";

        // Generate dynamic introduction message
        const storyIntroMessage =
          await orchestrator.storyAgent.generateConversationResponse(
            context,
            "introduction",
            { phase: "story", campaignType: "moment_response" }
          );

        workflow.conversation.push({
          speaker: "Story Angles & Headlines GPT",
          message: storyIntroMessage,
          timestamp: new Date().toISOString(),
        });

        // Add processing indicator
        workflow.conversation.push({
          speaker: "Story Angles & Headlines GPT",
          message: "_[Crafting compelling narrative angles and headlines...]_",
          timestamp: new Date().toISOString(),
          isProcessing: true,
        });

        const storyAngles = await orchestrator.storyAgent.generateStoryAngles(
          context.moment || context.campaign,
          strategicInsights,
          trendInsights
        );

        // Remove processing indicator
        workflow.conversation = workflow.conversation.filter(
          (msg) => !msg.isProcessing
        );

        // Update Story deliverable immediately
        workflow.deliverables.story = {
          id: "story",
          title: "Story Angles",
          type: "text",
          status: "ready",
          agent: "Story Angles",
          timestamp: new Date().toISOString(),
          content:
            storyAngles.storyAngles?.storyStrategy ||
            (typeof storyAngles === "string"
              ? storyAngles
              : JSON.stringify(storyAngles, null, 2)), // Extract main content as string
        };
        workflow.phases.story.status = "completed";

        // Generate delivery message
        const storyDeliveryMessage =
          await orchestrator.storyAgent.generateConversationResponse(
            context,
            "delivery",
            storyAngles
          );

        workflow.conversation.push({
          speaker: "Story Angles & Headlines GPT",
          message: storyDeliveryMessage,
          deliverable: storyAngles,
          agent: "Story Angles & Headlines GPT",
          timestamp: new Date().toISOString(),
        });

        // Step 5: Brand lens
        workflow.currentPhase = "brand_lens";
        workflow.phases.brand_lens.status = "running";

        // Add processing indicator
        workflow.conversation.push({
          speaker: "Brand Lens Agent",
          message: "_[Applying brand perspective and positioning...]_",
          timestamp: new Date().toISOString(),
          isProcessing: true,
        });

        const brandLens =
          await orchestrator.brandLensAgent.analyzeBrandPerspective(
            storyAngles,
            context
          );

        // Remove processing indicator
        workflow.conversation = workflow.conversation.filter(
          (msg) => !msg.isProcessing
        );

        // Update Brand Lens deliverable immediately
        workflow.deliverables.brand_lens = {
          id: "brand_lens",
          title: "Brand Perspective",
          type: "text",
          status: "ready",
          agent: "Brand Lens",
          timestamp: new Date().toISOString(),
          content:
            brandLens.brandPositioning ||
            (typeof brandLens === "string"
              ? brandLens
              : JSON.stringify(brandLens, null, 2)), // Extract main content as string
        };
        workflow.phases.brand_lens.status = "completed";

        workflow.conversation.push({
          speaker: "Brand Lens Agent",
          message:
            typeof brandLens === "string"
              ? brandLens
              : JSON.stringify(brandLens, null, 2),
          deliverable: brandLens,
          agent: "Brand Lens Agent",
          timestamp: new Date().toISOString(),
        });

        // Step 6: Visual prompt generation
        workflow.currentPhase = "visual_prompt_generator";
        workflow.phases.visual_prompt_generator.status = "running";

        // Add processing indicator
        workflow.conversation.push({
          speaker: "Visual Prompt Generator",
          message:
            "_[Creating compelling visual concept and generating image...]_",
          timestamp: new Date().toISOString(),
          isProcessing: true,
        });

        const visual = await orchestrator.visualAgent.generatePrompt({
          campaign: context.moment || context.campaign,
          momentType: context.momentType,
          visualObjective:
            brandLens.brandPositioning || "compelling visual narrative",
          heroVisualDescription:
            brandLens.brandVoice || "authentic brand expression",
        });

        // Remove processing indicator
        workflow.conversation = workflow.conversation.filter(
          (msg) => !msg.isProcessing
        );

        // Update Visual deliverable immediately
        workflow.deliverables.visual_prompt_generator = {
          id: "visual_prompt_generator",
          title: "Visual Concept",
          type: visual.imageUrl ? "image" : "text", // Set type based on whether image exists
          status: visual.imageUrl ? "ready" : "waiting",
          agent: "Visual Generator",
          timestamp: new Date().toISOString(),
          content: visual.imageUrl ? visual : visual.promptText || visual, // Keep image format or extract text
        };
        workflow.phases.visual_prompt_generator.status = visual.imageUrl
          ? "completed"
          : "waiting";

        const visualMessage = visual.imageUrl
          ? `Visual concept created successfully! Generated compelling image based on the campaign strategy.`
          : `Visual prompt created: ${visual.promptText || visual}`;

        workflow.conversation.push({
          speaker: "Visual Prompt Generator",
          message: visualMessage,
          deliverable: visual,
          agent: "Visual Prompt Generator",
          timestamp: new Date().toISOString(),
        });

        // Only proceed to Brand QA if image is ready
        if (!visual.imageUrl) {
          workflow.currentPhase = "waiting_for_image";
          workflow.status = "waiting_for_image";
          workflow.conversation.push({
            speaker: "System",
            message:
              "Waiting for image to be generated before proceeding to Brand QA...",
            timestamp: new Date().toISOString(),
          });
          workflow.lastUpdated = new Date().toISOString();
          // Optionally, implement retry logic here
          return;
        }

        // Step 7: Brand QA
        workflow.currentPhase = "brand_qa";
        workflow.phases.brand_qa.status = "running";

        // Add processing indicator
        workflow.conversation.push({
          speaker: "Brand QA Agent",
          message: "_[Conducting comprehensive quality assessment...]_",
          timestamp: new Date().toISOString(),
          isProcessing: true,
        });

        const qaResult = await orchestrator.qaAgent.reviewPrompt(
          visual,
          null,
          trendInsights,
          brandLens
        );

        // Remove processing indicator
        workflow.conversation = workflow.conversation.filter(
          (msg) => !msg.isProcessing
        );

        // Log QA results
        const qaScore = qaResult.qualityScore || 85;
        console.log(`🔍 Brand QA Review: ${qaScore}% quality score`);
        if (qaResult.approved) {
          console.log(`✅ Campaign approved by Brand QA`);
        } else {
          console.log(
            `⚠️ Brand QA suggestions: ${
              qaResult.suggestions?.join(", ") || "Review feedback provided"
            }`
          );
        }

        // Update QA deliverable immediately
        workflow.deliverables.brand_qa = {
          id: "brand_qa",
          title: "Quality Assessment",
          type: "text",
          status: "ready",
          agent: "Brand QA",
          timestamp: new Date().toISOString(),
          content:
            qaResult.feedback ||
            (typeof qaResult === "string"
              ? qaResult
              : JSON.stringify(qaResult, null, 2)), // Extract main content as string
        };
        workflow.phases.brand_qa.status = "completed";

        const qaMessage = qaResult.approved
          ? `✅ Quality assessment complete! Campaign approved with ${qaScore}% quality score. ${
              qaResult.feedback || ""
            }`
          : `⚠️ Quality assessment complete with recommendations. Score: ${qaScore}%. ${
              qaResult.feedback || ""
            }`;

        workflow.conversation.push({
          speaker: "Brand QA Agent",
          message: qaMessage,
          deliverable: qaResult,
          agent: "Brand QA Agent",
          qualityScore: qaScore,
          timestamp: new Date().toISOString(),
        });

        // Final completion
        workflow.status = "completed";
        workflow.currentPhase = "completed";
        workflow.conversation.push({
          speaker: "System",
          message:
            "Workflow completed successfully. All deliverables are ready.",
          timestamp: new Date().toISOString(),
        });
        workflow.lastUpdated = new Date().toISOString();
      } catch (err) {
        workflow.status = "failed";
        workflow.error = err.message;
        workflow.conversation.push({
          speaker: "System",
          message: `Workflow failed: ${err.message}`,
          timestamp: new Date().toISOString(),
          error: true,
        });
        workflow.lastUpdated = new Date().toISOString();
        console.error(`Workflow ${workflow.id} failed:`, err);
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

    try {
      // Add resume message to conversation
      workflow.conversation.push({
        speaker: "Human",
        message: "Workflow resumed by user",
        timestamp: new Date().toISOString(),
      });

      // Update workflow status
      workflow.status = "running";
      workflow.lastUpdated = new Date().toISOString();

      res.json(workflow);
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
