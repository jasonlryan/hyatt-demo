const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const ResearchAudienceAgent = require("./agents/ResearchAudienceAgent");
const TrendingNewsAgent = require("./agents/TrendingNewsAgent");
const StoryAnglesAgent = require("./agents/StoryAnglesAgent");
const PRManagerAgent = require("./agents/PRManagerAgent");

class AgentOrchestrator {
  constructor() {
    this.researchAgent = new ResearchAudienceAgent();
    this.trendingAgent = new TrendingNewsAgent();
    this.storyAgent = new StoryAnglesAgent();
    this.prManagerAgent = new PRManagerAgent();
    this.campaigns = new Map();
  }

  async startCampaign(campaignBrief) {
    const campaignId = this.generateCampaignId();
    console.log(
      `Creating new campaign with brief: ${campaignBrief.substring(0, 100)}...`
    );

    const campaign = {
      id: campaignId,
      brief: campaignBrief,
      status: "research", // Start with research phase
      phases: {},
      conversation: [], // Track the conversational flow
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.campaigns.set(campaignId, campaign);

    // Analyze the brief to determine campaign type and approach
    const campaignContext = this.analyzeCampaignBrief(campaignBrief);

    // Add dynamic PR Manager message using the agent's system prompt
    const prManagerIntro =
      await this.prManagerAgent.generateCampaignIntroduction(
        campaignBrief,
        campaignContext
      );
    campaign.conversation.push({
      speaker: "PR Manager",
      message: prManagerIntro,
      timestamp: new Date().toISOString(),
    });

    // Start the first phase asynchronously
    setTimeout(() => this.runResearchPhase(campaignId, campaignContext), 1000);

    return campaign;
  }

  analyzeCampaignBrief(brief) {
    const lowerBrief = brief.toLowerCase();

    // Determine campaign type
    let campaignType = "general";
    let focusAreas = [];
    let urgency = "standard";
    let targetMarket = "general";

    // Campaign type detection
    if (
      lowerBrief.includes("eco") ||
      lowerBrief.includes("sustainable") ||
      lowerBrief.includes("regenerative")
    ) {
      campaignType = "sustainability";
      focusAreas.push("environmental impact", "conscious travelers");
    }
    if (lowerBrief.includes("luxury") || lowerBrief.includes("premium")) {
      campaignType =
        campaignType === "sustainability" ? "luxury-sustainability" : "luxury";
      focusAreas.push("high-end experiences", "affluent travelers");
    }
    if (lowerBrief.includes("business") || lowerBrief.includes("corporate")) {
      campaignType = "business";
      focusAreas.push("corporate travel", "executive experiences");
    }
    if (lowerBrief.includes("family") || lowerBrief.includes("kids")) {
      campaignType = "family";
      focusAreas.push("family experiences", "multi-generational travel");
    }
    if (lowerBrief.includes("wellness") || lowerBrief.includes("spa")) {
      campaignType = "wellness";
      focusAreas.push("health and wellness", "transformative experiences");
    }

    // Urgency detection
    if (
      lowerBrief.includes("urgent") ||
      lowerBrief.includes("asap") ||
      lowerBrief.includes("immediately")
    ) {
      urgency = "urgent";
    }
    if (lowerBrief.includes("next quarter") || lowerBrief.includes("soon")) {
      urgency = "upcoming";
    }

    // Target market detection
    if (lowerBrief.includes("millennial") || lowerBrief.includes("gen z")) {
      targetMarket = "younger";
    }
    if (lowerBrief.includes("executive") || lowerBrief.includes("c-suite")) {
      targetMarket = "executive";
    }
    if (lowerBrief.includes("international") || lowerBrief.includes("global")) {
      targetMarket = "international";
    }

    return {
      campaignType,
      focusAreas,
      urgency,
      targetMarket,
      originalBrief: brief,
    };
  }

  async runResearchPhase(campaignId, campaignContext) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    try {
      console.log(`[${campaignId}] Starting research phase...`);
      campaign.status = "research";
      campaign.lastUpdated = new Date().toISOString();

      // Generate dynamic introduction using the agent's system prompt
      const introMessage = await this.generateAgentIntroMessage(
        this.researchAgent,
        campaignContext,
        "research"
      );

      campaign.conversation.push({
        speaker: "Research & Audience GPT",
        message: introMessage,
        timestamp: new Date().toISOString(),
      });

      // Add processing indicator
      campaign.conversation.push({
        speaker: "Research & Audience GPT",
        message: "_[Processing audience data and industry reports...]_",
        timestamp: new Date().toISOString(),
        isProcessing: true,
      });

      const researchResult = await this.researchAgent.analyzeAudience(
        campaign.brief
      );

      // Remove processing indicator and add results
      campaign.conversation = campaign.conversation.filter(
        (msg) => !msg.isProcessing
      );

      campaign.phases.research = researchResult;

      // Generate dynamic delivery message using the agent's system prompt
      const deliveryMessage = await this.generateAgentDeliveryMessage(
        this.researchAgent,
        campaignContext,
        "research",
        researchResult.insights
      );

      campaign.conversation.push({
        speaker: "Research & Audience GPT",
        message: deliveryMessage,
        deliverable: "Target Audience Analysis",
        data: researchResult.insights,
        timestamp: new Date().toISOString(),
      });

      campaign.lastUpdated = new Date().toISOString();
      console.log(`[${campaignId}] Research phase completed`);

      // Generate dynamic PR Manager handoff
      setTimeout(async () => {
        try {
          const handoffMessage = await this.generatePRManagerHandoffMessage(
            campaignContext,
            "trending",
            researchResult.insights
          );

          campaign.conversation.push({
            speaker: "PR Manager",
            message: handoffMessage,
            timestamp: new Date().toISOString(),
          });

          console.log(`[${campaignId}] Starting trending phase handoff...`);
          this.runTrendingPhase(campaignId, campaignContext);
        } catch (error) {
          console.error(`[${campaignId}] Handoff to trending failed:`, error);
          // Still proceed to trending phase even if handoff message fails
          campaign.conversation.push({
            speaker: "PR Manager",
            message:
              "Now let's analyze current trends that align with these audience insights.",
            timestamp: new Date().toISOString(),
          });
          this.runTrendingPhase(campaignId, campaignContext);
        }
      }, 2000);
    } catch (error) {
      console.error(`[${campaignId}] Research phase failed:`, error);
      campaign.status = "failed";
      campaign.error = error.message;
      campaign.lastUpdated = new Date().toISOString();
    }
  }

  async generateAgentIntroMessage(agent, campaignContext, phase) {
    // Call the agent's own method to generate the intro using their system prompt
    try {
      console.log(`🔄 Generating intro message for ${agent.name}...`);
      const message = await agent.generateConversationResponse(
        campaignContext,
        "intro"
      );
      console.log(
        `✅ Generated intro message for ${agent.name}: ${message.substring(
          0,
          100
        )}...`
      );
      return message;
    } catch (error) {
      console.error(
        `❌ Failed to generate intro message for ${agent.name}:`,
        error
      );
      return `I'm ${agent.name} and I'll help analyze this ${campaignContext.campaignType} campaign.`;
    }
  }

  async generateAgentDeliveryMessage(agent, campaignContext, phase, data) {
    // Call the agent's own method to generate the delivery using their system prompt
    try {
      console.log(`🔄 Generating delivery message for ${agent.name}...`);
      const message = await agent.generateConversationResponse(
        campaignContext,
        "delivery",
        data
      );
      console.log(
        `✅ Generated delivery message for ${agent.name}: ${message.substring(
          0,
          100
        )}...`
      );
      return message;
    } catch (error) {
      console.error(
        `❌ Failed to generate delivery message for ${agent.name}:`,
        error
      );
      return `I've completed my analysis for this ${campaignContext.campaignType} campaign. The results are available in the deliverable section.`;
    }
  }

  async generatePRManagerHandoffMessage(
    campaignContext,
    nextPhase,
    previousData
  ) {
    // Use the PR Manager agent to generate dynamic handoff messages
    return await this.prManagerAgent.generateHandoffMessage(
      campaignContext,
      nextPhase,
      previousData
    );
  }

  async runTrendingPhase(campaignId, campaignContext) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || !campaign.phases.research) return;

    try {
      console.log(`[${campaignId}] Starting trending phase...`);
      campaign.status = "trending";
      campaign.lastUpdated = new Date().toISOString();

      // Generate dynamic introduction using the agent's system prompt
      const introMessage = await this.generateAgentIntroMessage(
        this.trendingAgent,
        campaignContext,
        "trending"
      );

      campaign.conversation.push({
        speaker: "Trending News GPT",
        message: introMessage,
        timestamp: new Date().toISOString(),
      });

      // Add processing indicator
      campaign.conversation.push({
        speaker: "Trending News GPT",
        message: "_[Scanning latest travel industry news...]_",
        timestamp: new Date().toISOString(),
        isProcessing: true,
      });

      const trendingResult = await this.trendingAgent.analyzeTrends(
        campaign.brief,
        campaign.phases.research.insights
      );

      // Remove processing indicator and add results
      campaign.conversation = campaign.conversation.filter(
        (msg) => !msg.isProcessing
      );

      campaign.phases.trending = trendingResult;

      // Generate dynamic delivery message using the agent's system prompt
      const deliveryMessage = await this.generateAgentDeliveryMessage(
        this.trendingAgent,
        campaignContext,
        "trending",
        trendingResult.trends
      );

      campaign.conversation.push({
        speaker: "Trending News GPT",
        message: deliveryMessage,
        deliverable: "Current Trend Analysis",
        data: trendingResult.trends,
        timestamp: new Date().toISOString(),
      });

      campaign.lastUpdated = new Date().toISOString();
      console.log(`[${campaignId}] Trending phase completed`);

      // Generate dynamic PR Manager handoff
      setTimeout(async () => {
        try {
          const handoffMessage = await this.generatePRManagerHandoffMessage(
            campaignContext,
            "story",
            trendingResult.trends
          );

          campaign.conversation.push({
            speaker: "PR Manager",
            message: handoffMessage,
            timestamp: new Date().toISOString(),
          });

          console.log(`[${campaignId}] Starting story phase handoff...`);
          this.runStoryPhase(campaignId, campaignContext);
        } catch (error) {
          console.error(`[${campaignId}] Handoff to story failed:`, error);
          // Still proceed to story phase even if handoff message fails
          campaign.conversation.push({
            speaker: "PR Manager",
            message:
              "Now let's develop compelling story angles and headlines that bridge these insights.",
            timestamp: new Date().toISOString(),
          });
          this.runStoryPhase(campaignId, campaignContext);
        }
      }, 2000);
    } catch (error) {
      console.error(`[${campaignId}] Trending phase failed:`, error);
      campaign.status = "failed";
      campaign.error = error.message;
      campaign.lastUpdated = new Date().toISOString();
    }
  }

  async runStoryPhase(campaignId, campaignContext) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || !campaign.phases.research || !campaign.phases.trending)
      return;

    try {
      console.log(`[${campaignId}] Starting story phase...`);
      campaign.status = "story";
      campaign.lastUpdated = new Date().toISOString();

      // Generate dynamic introduction using the agent's system prompt
      const introMessage = await this.generateAgentIntroMessage(
        this.storyAgent,
        campaignContext,
        "story"
      );

      campaign.conversation.push({
        speaker: "Story Angles & Headlines GPT",
        message: introMessage,
        timestamp: new Date().toISOString(),
      });

      // Add processing indicator
      campaign.conversation.push({
        speaker: "Story Angles & Headlines GPT",
        message: "_[Analyzing media opportunities and developing angles...]_",
        timestamp: new Date().toISOString(),
        isProcessing: true,
      });

      const storyResult = await this.storyAgent.generateStoryAngles(
        campaign.brief,
        campaign.phases.research.insights,
        campaign.phases.trending.trends
      );

      // Remove processing indicator and add results
      campaign.conversation = campaign.conversation.filter(
        (msg) => !msg.isProcessing
      );

      campaign.phases.story = storyResult;

      // Generate dynamic delivery message using the agent's system prompt
      const deliveryMessage = await this.generateAgentDeliveryMessage(
        this.storyAgent,
        campaignContext,
        "story",
        storyResult.storyAngles
      );

      campaign.conversation.push({
        speaker: "Story Angles & Headlines GPT",
        message: deliveryMessage,
        deliverable: "Media Angles & Headlines Strategy",
        data: storyResult.storyAngles,
        timestamp: new Date().toISOString(),
      });

      campaign.lastUpdated = new Date().toISOString();
      console.log(`[${campaignId}] Story phase completed`);

      // Generate dynamic PR Manager handoff
      setTimeout(async () => {
        try {
          const handoffMessage = await this.generatePRManagerHandoffMessage(
            campaignContext,
            "collaborative",
            storyResult.storyAngles
          );

          campaign.conversation.push({
            speaker: "PR Manager",
            message: handoffMessage,
            timestamp: new Date().toISOString(),
          });

          console.log(
            `[${campaignId}] Starting collaborative phase handoff...`
          );
          this.runCollaborativePhase(campaignId, campaignContext);
        } catch (error) {
          console.error(
            `[${campaignId}] Handoff to collaborative failed:`,
            error
          );
          // Still proceed to collaborative phase even if handoff message fails
          campaign.conversation.push({
            speaker: "PR Manager",
            message:
              "Now let's bring this together into a cohesive, integrated campaign plan.",
            timestamp: new Date().toISOString(),
          });
          this.runCollaborativePhase(campaignId, campaignContext);
        }
      }, 2000);
    } catch (error) {
      console.error(`[${campaignId}] Story phase failed:`, error);
      campaign.status = "failed";
      campaign.error = error.message;
      campaign.lastUpdated = new Date().toISOString();
    }
  }

  async runCollaborativePhase(campaignId, campaignContext) {
    const campaign = this.campaigns.get(campaignId);
    if (
      !campaign ||
      !campaign.phases.research ||
      !campaign.phases.trending ||
      !campaign.phases.story
    )
      return;

    try {
      console.log(`[${campaignId}] Starting collaborative phase...`);
      campaign.status = "collaborative";
      campaign.lastUpdated = new Date().toISOString();

      // Add dynamic collaborative discussion
      const collaborativeMessages = await this.generateCollaborativeDiscussion(
        campaignContext,
        campaign.phases
      );

      for (let i = 0; i < collaborativeMessages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        campaign.conversation.push({
          ...collaborativeMessages[i],
          timestamp: new Date().toISOString(),
        });
      }

      const collaborativeResults = await Promise.all([
        this.researchAgent.collaborativeInput(campaign.phases),
        this.trendingAgent.collaborativeInput(campaign.phases),
        this.storyAgent.collaborativeInput(campaign.phases),
      ]);

      campaign.phases.collaborative = {
        agent: "All Agents",
        timestamp: new Date().toISOString(),
        phase: "collaborative",
        contributions: collaborativeResults,
        finalStrategy: this.synthesizeFinalStrategy(
          campaign.phases,
          collaborativeResults
        ),
      };

      // Add final deliverable
      campaign.conversation.push({
        speaker: "All Agents",
        message: await this.generateFinalDeliveryMessage(
          campaignContext,
          campaign.phases
        ),
        deliverable: "Integrated Campaign Plan",
        data: campaign.phases.collaborative.finalStrategy,
        timestamp: new Date().toISOString(),
      });

      campaign.conversation.push({
        speaker: "PR Manager",
        message: await this.generatePRManagerConclusion(
          campaignContext,
          campaign.phases.collaborative.finalStrategy
        ),
        timestamp: new Date().toISOString(),
      });

      campaign.status = "completed";
      campaign.lastUpdated = new Date().toISOString();
      console.log(
        `[${campaignId}] Collaborative phase completed - Campaign finished!`
      );

      // Save campaign to file
      this.saveCampaignToFile(campaign);
    } catch (error) {
      console.error(`[${campaignId}] Collaborative phase failed:`, error);
      campaign.status = "failed";
      campaign.error = error.message;
      campaign.lastUpdated = new Date().toISOString();
    }
  }

  async generateCollaborativeDiscussion(context, phases) {
    const { campaignType } = context;
    const primaryAngle = phases.story.storyAngles.primaryAngle.angle;
    const topTrend = phases.trending.trends.relevantTrends[0].trend;
    const topDriver = Object.entries(phases.research.insights.keyDrivers)[0];

    // Generate dynamic collaborative messages using agent context
    const researchMessage = await this.generateCollaborativeMessage(
      this.researchAgent,
      context,
      phases,
      "research"
    );

    const trendingMessage = await this.generateCollaborativeMessage(
      this.trendingAgent,
      context,
      phases,
      "trending"
    );

    const storyMessage = await this.generateCollaborativeMessage(
      this.storyAgent,
      context,
      phases,
      "story"
    );

    return [
      {
        speaker: "Research & Audience GPT",
        message: researchMessage,
      },
      {
        speaker: "Trending News GPT",
        message: trendingMessage,
      },
      {
        speaker: "Story Angles & Headlines GPT",
        message: storyMessage,
      },
    ];
  }

  async generateCollaborativeMessage(
    agent,
    campaignContext,
    phases,
    agentPhase
  ) {
    // Use the agent's own collaborative input method to generate the message
    const collaborativeInput = await agent.collaborativeInput(phases);
    return collaborativeInput.contribution;
  }

  async generateFinalDeliveryMessage(context, allPhaseData) {
    // Use the PR Manager agent to generate dynamic final delivery messages
    return await this.prManagerAgent.generateFinalDelivery(
      context,
      allPhaseData
    );
  }

  async generatePRManagerConclusion(context, finalStrategy) {
    // Use the PR Manager agent to generate dynamic conclusion messages
    return await this.prManagerAgent.generateCampaignConclusion(
      context,
      finalStrategy
    );
  }

  synthesizeFinalStrategy(phases, collaborativeResults) {
    const research = phases.research?.insights;
    const trends = phases.trending?.trends;
    const story = phases.story?.storyAngles;

    if (!research || !trends || !story) {
      return {
        summary: "Unable to synthesize strategy due to incomplete phase data",
        recommendations: [],
      };
    }

    const topDriver = Object.entries(research.keyDrivers)[0];
    const topTrend = trends.relevantTrends[0];
    const primaryAngle = story.primaryAngle;

    // Format target audience properly - extract segment names from objects
    const targetAudienceNames = research.targetDemographics
      .map((demo) => demo.segment || demo.name || demo)
      .join(", ");

    // Calculate strategic alignment properly - extract numeric values from relevance percentages
    let strategicAlignment = "N/A";
    try {
      const relevanceMatch = topTrend.relevance.match(/(\d+)/);
      const relevanceNum = relevanceMatch ? parseInt(relevanceMatch[1]) : 75;
      strategicAlignment = `${relevanceNum}%`;
    } catch (error) {
      strategicAlignment = "75%"; // Default fallback
    }

    return {
      campaignTheme: primaryAngle.angle,
      primaryHeadline: story.headlines[0],
      targetAudience: targetAudienceNames,
      keyMessage: primaryAngle.emotionalHook,
      strategicAlignment: strategicAlignment,
      launchTiming: trends.timingRecommendation,
      mediaStrategy: trends.mediaOpportunities.slice(0, 3),
      successMetrics: [
        `${topDriver[0]} engagement rate`,
        `${topTrend.trend} mention share`,
        "Campaign reach and impressions",
        "Audience sentiment analysis",
      ],
      collaborativeInsights: collaborativeResults.map((result) => ({
        agent: result.agent,
        keyInsight: result.contribution,
      })),
    };
  }

  generateCampaignId() {
    return uuidv4();
  }

  getCampaign(campaignId) {
    return this.campaigns.get(campaignId);
  }

  getAllCampaigns() {
    return Array.from(this.campaigns.values());
  }

  saveCampaignToFile(campaign) {
    try {
      const campaignsDir = path.join(__dirname, "campaigns");
      if (!fs.existsSync(campaignsDir)) {
        fs.mkdirSync(campaignsDir, { recursive: true });
      }

      const filename = `campaign_${campaign.id}.json`;
      const filepath = path.join(campaignsDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(campaign, null, 2));
      console.log(`💾 Campaign saved to ${filepath}`);
    } catch (error) {
      console.error("Failed to save campaign to file:", error);
    }
  }
}

module.exports = AgentOrchestrator;
