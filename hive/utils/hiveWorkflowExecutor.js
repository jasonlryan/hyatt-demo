const HiveOrchestrator = require("../orchestrations/classes/HiveOrchestrator");

class HiveWorkflowExecutor {
  constructor(workflow, context) {
    this.workflow = workflow;
    this.context = context;
    this.orchestrator = new HiveOrchestrator();
  }

  async execute() {
    await this.orchestrator.loadAgents();
    
    // Determine where to start based on workflow state
    const phases = [
      "pr_manager",
      "trending", 
      "strategic",
      "story",
      "brand_lens",
      "visual_prompt_generator",
      "brand_qa"
    ];

    let startIndex = 0;
    if (this.workflow.pausedAt) {
      startIndex = phases.indexOf(this.workflow.pausedAt) + 1;
    }

    // Execute phases starting from the appropriate point
    for (let i = startIndex; i < phases.length; i++) {
      const phase = phases[i];
      
      try {
        switch (phase) {
          case "pr_manager":
            await this.executePRManagerPhase();
            break;
          case "trending":
            await this.executeTrendingPhase();
            break;
          case "strategic":
            await this.executeStrategicPhase();
            break;
          case "story":
            await this.executeStoryPhase();
            break;
          case "brand_lens":
            await this.executeBrandLensPhase();
            break;
          case "visual_prompt_generator":
            await this.executeVisualPhase();
            break;
          case "brand_qa":
            await this.executeBrandQAPhase();
            break;
        }

        // Check for HITL pause after each phase (except the last one)
        if (this.workflow.hitlEnabled && i < phases.length - 1) {
          this.workflow.isPaused = true;
          this.workflow.pausedAt = phase;
          this.workflow.status = "paused";
          this.workflow.lastUpdated = new Date().toISOString();
          
          this.workflow.conversation.push({
            speaker: "System",
            message: `Workflow paused for human review after ${phase.replace(/_/g, ' ')} phase. Please review the deliverable and either refine or resume.`,
            timestamp: new Date().toISOString(),
            hitlPause: true,
          });
          
          // Exit execution to pause
          return;
        }
      } catch (error) {
        console.error(`Error in ${phase} phase:`, error);
        this.workflow.status = "error";
        this.workflow.error = error.message;
        this.workflow.lastUpdated = new Date().toISOString();
        throw error;
      }
    }

    // All phases completed
    this.workflow.status = "completed";
    this.workflow.lastUpdated = new Date().toISOString();
    this.workflow.conversation.push({
      speaker: "System",
      message: "✅ All phases completed successfully! Your campaign strategy is ready.",
      timestamp: new Date().toISOString(),
    });
  }

  async executePRManagerPhase() {
    this.workflow.currentPhase = "pr_manager";
    this.workflow.phases.pr_manager.status = "running";

    this.workflow.conversation.push({
      speaker: "PR Manager",
      message: "I'm the PR Manager and I'll orchestrate this campaign response. Let me establish our strategic framework and coordinate with all agents to deliver a comprehensive campaign strategy.",
      timestamp: new Date().toISOString(),
    });

    this.workflow.conversation.push({
      speaker: "PR Manager",
      message: "_[Establishing overall PR strategy and campaign framework...]_",
      timestamp: new Date().toISOString(),
      isProcessing: true,
    });

    const prIntro = await this.orchestrator.prManager.generateCampaignIntroduction(
      this.context.moment || this.context.campaign,
      this.context
    );

    this.workflow.conversation = this.workflow.conversation.filter(
      (msg) => !msg.isProcessing
    );

    this.workflow.deliverables.pr_manager = {
      id: "pr_manager",
      title: "PR Manager Strategy",
      type: "text",
      status: "ready",
      agent: "PR Manager",
      timestamp: new Date().toISOString(),
      content: prIntro,
    };
    this.workflow.phases.pr_manager.status = "completed";

    this.workflow.conversation.push({
      speaker: "PR Manager",
      message: prIntro,
      deliverable: prIntro,
      agent: "PR Manager",
      timestamp: new Date().toISOString(),
    });

    const handoffMessage = await this.orchestrator.prManager.generateHandoffMessage(
      this.context,
      "trending",
      prIntro
    );

    this.workflow.conversation.push({
      speaker: "PR Manager",
      message: handoffMessage,
      timestamp: new Date().toISOString(),
    });
  }

  async executeTrendingPhase() {
    this.workflow.currentPhase = "trending";
    this.workflow.phases.trending.status = "running";

    // Create a safe context for trending analysis
    const safeContext = {
      ...this.context,
      targetMarket: this.context.targetMarket || "general audience",
      industry: this.context.industry || "general",
    };

    const trendingIntroMessage = await this.orchestrator.trendingAgent.generateConversationResponse(
      safeContext,
      "introduction",
      { phase: "trending", campaignType: "moment_response" }
    );

    this.workflow.conversation.push({
      speaker: "Trending News GPT",
      message: trendingIntroMessage,
      timestamp: new Date().toISOString(),
    });

    this.workflow.conversation.push({
      speaker: "Trending News GPT",
      message: "_[Scanning cultural moments and trend data...]_",
      timestamp: new Date().toISOString(),
      isProcessing: true,
    });

    const trendInsights = await this.orchestrator.trendingAgent.analyzeTrends(
      this.context.moment || this.context.campaign,
      safeContext
    );

    this.workflow.conversation = this.workflow.conversation.filter(
      (msg) => !msg.isProcessing
    );

    this.workflow.deliverables.trending = {
      id: "trending",
      title: "Moment Analysis",
      type: "text",
      status: "ready",
      agent: "Trending News",
      timestamp: new Date().toISOString(),
      content: trendInsights.trends?.trendsAnalysis ||
        (typeof trendInsights === "string"
          ? trendInsights
          : JSON.stringify(trendInsights, null, 2)),
    };
    this.workflow.phases.trending.status = "completed";

    const trendingDeliveryMessage = await this.orchestrator.trendingAgent.generateConversationResponse(
      this.context,
      "delivery",
      trendInsights
    );

    this.workflow.conversation.push({
      speaker: "Trending News GPT",
      message: trendingDeliveryMessage,
      deliverable: trendInsights,
      agent: "Trending News GPT",
      timestamp: new Date().toISOString(),
    });

    // Store trend insights for next phases
    this.trendInsights = trendInsights;
  }

  async executeStrategicPhase() {
    this.workflow.currentPhase = "strategic";
    this.workflow.phases.strategic.status = "running";

    this.workflow.conversation.push({
      speaker: "Strategic Insight GPT",
      message: "_[Analyzing trends to discover deeper human truths...]_",
      timestamp: new Date().toISOString(),
      isProcessing: true,
    });

    // Create a safe context for strategic analysis
    const safeContext = {
      ...this.context,
      targetMarket: this.context.targetMarket || "general audience",
      industry: this.context.industry || "general",
    };

    const strategicInsights = await this.orchestrator.strategicAgent.discoverHumanTruth(
      this.trendInsights || {},
      safeContext
    );

    this.workflow.conversation = this.workflow.conversation.filter(
      (msg) => !msg.isProcessing
    );

    this.workflow.deliverables.strategic = {
      id: "strategic",
      title: "Strategic Insights",
      type: "text",
      status: "ready",
      agent: "Strategic Insight",
      timestamp: new Date().toISOString(),
      content: strategicInsights.humanTruthAnalysis || strategicInsights,
    };
    this.workflow.phases.strategic.status = "completed";

    this.workflow.conversation.push({
      speaker: "Strategic Insight GPT",
      message: strategicInsights.humanTruthAnalysis || JSON.stringify(strategicInsights, null, 2),
      deliverable: strategicInsights,
      agent: "Strategic Insight GPT",
      timestamp: new Date().toISOString(),
    });

    this.strategicInsights = strategicInsights;
  }

  async executeStoryPhase() {
    this.workflow.currentPhase = "story";
    this.workflow.phases.story.status = "running";

    // Create a safe context for story analysis
    const safeContext = {
      ...this.context,
      targetMarket: this.context.targetMarket || "general audience",
      industry: this.context.industry || "general",
    };

    const storyIntroMessage = await this.orchestrator.storyAgent.generateConversationResponse(
      safeContext,
      "introduction",
      { phase: "story", campaignType: "moment_response" }
    );

    this.workflow.conversation.push({
      speaker: "Story Angles & Headlines GPT",
      message: storyIntroMessage,
      timestamp: new Date().toISOString(),
    });

    this.workflow.conversation.push({
      speaker: "Story Angles & Headlines GPT",
      message: "_[Crafting compelling narrative angles and headlines...]_",
      timestamp: new Date().toISOString(),
      isProcessing: true,
    });

    const storyAngles = await this.orchestrator.storyAgent.generateStoryAngles(
      this.strategicInsights || {},
      safeContext
    );

    this.workflow.conversation = this.workflow.conversation.filter(
      (msg) => !msg.isProcessing
    );

    this.workflow.deliverables.story = {
      id: "story",
      title: "Story Angles & Headlines",
      type: "text",
      status: "ready",
      agent: "Story Angles",
      timestamp: new Date().toISOString(),
      content: storyAngles.angles || JSON.stringify(storyAngles, null, 2),
    };
    this.workflow.phases.story.status = "completed";

    const storyDeliveryMessage = await this.orchestrator.storyAgent.generateConversationResponse(
      safeContext,
      "delivery",
      storyAngles
    );

    this.workflow.conversation.push({
      speaker: "Story Angles & Headlines GPT",
      message: storyDeliveryMessage,
      deliverable: storyAngles,
      agent: "Story Angles & Headlines GPT",
      timestamp: new Date().toISOString(),
    });

    this.storyAngles = storyAngles;
  }

  async executeBrandLensPhase() {
    this.workflow.currentPhase = "brand_lens";
    this.workflow.phases.brand_lens.status = "running";

    this.workflow.conversation.push({
      speaker: "Brand Lens Agent",
      message: "_[Applying brand perspective to campaign strategy...]_",
      timestamp: new Date().toISOString(),
      isProcessing: true,
    });

    // Create a safe context for brand analysis
    const safeContext = {
      ...this.context,
      targetMarket: this.context.targetMarket || "general audience",
      industry: this.context.industry || "general",
    };

    const brandLens = await this.orchestrator.brandLensAgent.analyzeBrandPerspective(
      JSON.stringify(this.trendInsights || {}),
      safeContext
    );

    this.workflow.conversation = this.workflow.conversation.filter(
      (msg) => !msg.isProcessing
    );

    this.workflow.deliverables.brand_lens = {
      id: "brand_lens",
      title: "Brand Lens Analysis",
      type: "text",
      status: "ready",
      agent: "Brand Lens",
      timestamp: new Date().toISOString(),
      content: brandLens.brandPositioning || JSON.stringify(brandLens, null, 2),
    };
    this.workflow.phases.brand_lens.status = "completed";

    this.workflow.conversation.push({
      speaker: "Brand Lens Agent",
      message: `Brand positioning established: ${brandLens.brandPositioning}. Key principles: ${brandLens.keyPrinciples?.join(", ")}.`,
      deliverable: brandLens,
      agent: "Brand Lens Agent",
      timestamp: new Date().toISOString(),
    });

    this.brandLens = brandLens;
  }

  async executeVisualPhase() {
    this.workflow.currentPhase = "visual_prompt_generator";
    this.workflow.phases.visual_prompt_generator.status = "running";

    this.workflow.conversation.push({
      speaker: "Visual Prompt Generator",
      message: "_[Creating compelling visual concept and generating image...]_",
      timestamp: new Date().toISOString(),
      isProcessing: true,
    });

    const visual = await this.orchestrator.visualAgent.generatePrompt({
      campaign: this.context.moment || this.context.campaign,
      momentType: this.context.momentType,
      visualObjective: this.brandLens?.brandPositioning || "compelling visual narrative",
      heroVisualDescription: this.brandLens?.brandVoice || "authentic brand expression",
    });

    this.workflow.conversation = this.workflow.conversation.filter(
      (msg) => !msg.isProcessing
    );

    this.workflow.deliverables.visual_prompt_generator = {
      id: "visual_prompt_generator",
      title: "Visual Concept",
      type: visual.imageUrl ? "image" : "text",
      status: visual.imageUrl ? "ready" : "waiting",
      agent: "Visual Generator",
      timestamp: new Date().toISOString(),
      content: visual.imageUrl ? visual : visual.promptText || visual,
    };
    this.workflow.phases.visual_prompt_generator.status = visual.imageUrl
      ? "completed"
      : "waiting";

    const visualMessage = visual.imageUrl
      ? `Visual concept created successfully! Generated compelling image based on the campaign strategy.`
      : `Visual prompt created: ${visual.promptText || visual}`;

    this.workflow.conversation.push({
      speaker: "Visual Prompt Generator",
      message: visualMessage,
      deliverable: visual,
      agent: "Visual Prompt Generator",
      timestamp: new Date().toISOString(),
    });

    if (!visual.imageUrl) {
      this.workflow.currentPhase = "waiting_for_image";
      this.workflow.status = "waiting_for_image";
      this.workflow.conversation.push({
        speaker: "System",
        message: "Waiting for image to be generated before proceeding to Brand QA...",
        timestamp: new Date().toISOString(),
      });
      this.workflow.lastUpdated = new Date().toISOString();
      throw new Error("Image generation pending");
    }

    this.visual = visual;
  }

  async executeBrandQAPhase() {
    this.workflow.currentPhase = "brand_qa";
    this.workflow.phases.brand_qa.status = "running";

    this.workflow.conversation.push({
      speaker: "Brand QA Agent",
      message: "_[Conducting comprehensive quality assessment...]_",
      timestamp: new Date().toISOString(),
      isProcessing: true,
    });

    const qaResult = await this.orchestrator.qaAgent.reviewPrompt(
      this.visual || {},
      null,
      this.trendInsights || {},
      this.brandLens || {}
    );

    this.workflow.conversation = this.workflow.conversation.filter(
      (msg) => !msg.isProcessing
    );

    const qaScore = qaResult.qualityScore || 85;
    console.log(`🔍 Brand QA Review: ${qaScore}% quality score`);
    if (qaResult.approved) {
      console.log(`✅ Campaign approved by Brand QA`);
    } else {
      console.log(`⚠️ Brand QA suggestions: ${qaResult.suggestions?.join(", ") || "Review feedback provided"}`);
    }

    this.workflow.deliverables.brand_qa = {
      id: "brand_qa",
      title: "Brand QA Review",
      type: "text",
      status: "ready",
      agent: "Brand QA",
      timestamp: new Date().toISOString(),
      content: qaResult.feedback || JSON.stringify(qaResult, null, 2),
    };
    this.workflow.phases.brand_qa.status = "completed";

    const qaMessage = qaResult.approved
      ? `✅ Campaign approved! Quality score: ${qaScore}%. ${qaResult.feedback}`
      : `⚠️ Campaign needs refinement. Quality score: ${qaScore}%. Suggestions: ${qaResult.suggestions?.join("; ") || qaResult.feedback}`;

    this.workflow.conversation.push({
      speaker: "Brand QA Agent",
      message: qaMessage,
      deliverable: qaResult,
      agent: "Brand QA Agent",
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = HiveWorkflowExecutor;