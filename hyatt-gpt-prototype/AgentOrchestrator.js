const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const ResearchAudienceAgent = require("./agents/ResearchAudienceAgent");
const TrendingNewsAgent = require("./agents/TrendingNewsAgent");
const StoryAnglesAgent = require("./agents/StoryAnglesAgent");
const PRManagerAgent = require("./agents/PRManagerAgent");
const StrategicInsightAgent = require("./agents/StrategicInsightAgent");

// Import new dynamic components
const DataSourceManager = require("./utils/DataSourceManager");
const QualityController = require("./utils/QualityController");

class AgentOrchestrator {
  constructor() {
    this.campaigns = new Map();
    this.researchAgent = new ResearchAudienceAgent();
    this.trendingAgent = new TrendingNewsAgent();
    this.storyAgent = new StoryAnglesAgent();
    this.prManagerAgent = new PRManagerAgent();
    this.strategicInsightAgent = new StrategicInsightAgent();

    // Initialize dynamic components
    this.dataSourceManager = new DataSourceManager();
    this.qualityController = new QualityController();

    // Dynamic flow configuration
    this.enableDynamicFlow = process.env.ENABLE_DYNAMIC_FLOW === "true";
    this.enableQualityControl = process.env.ENABLE_QUALITY_CONTROL === "true";
    this.enableAgentInteraction =
      process.env.ENABLE_AGENT_INTERACTION === "true";
  }

  async startCampaign(campaignBrief) {
    const campaignId = this.generateCampaignId();
    const campaignContext = this.analyzeCampaignBrief(campaignBrief);
    campaignContext.originalBrief = campaignBrief; // Include original brief for agents

    const campaign = {
      id: campaignId,
      brief: campaignBrief,
      context: campaignContext,
      status: "initializing",
      conversation: [],
      phases: {},
      qualityMetrics: {},
      dataSourcesUsed: [],
      flowDecisions: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.campaigns.set(campaignId, campaign);

    try {
      // Generate dynamic campaign introduction
      const introMessage =
        await this.prManagerAgent.generateCampaignIntroduction(
          campaignBrief,
          campaignContext
        );

      campaign.conversation.push({
        speaker: "PR Manager",
        message: introMessage,
        timestamp: new Date().toISOString(),
      });

      campaign.status = "active";
      campaign.lastUpdated = new Date().toISOString();

      // Start the research phase with dynamic flow control
      setTimeout(() => {
        this.runResearchPhase(campaignId, campaignContext);
      }, 1000);

      return { campaignId, status: "started" };
    } catch (error) {
      console.error("Failed to start campaign:", error);
      campaign.status = "failed";
      campaign.error = error.message;
      return { campaignId, status: "failed", error: error.message };
    }
  }

  analyzeCampaignBrief(brief) {
    // Enhanced campaign analysis with keyword extraction
    const keywords = this.extractCampaignKeywords(brief);
    const campaignType = this.determineCampaignType(brief);
    const urgency = this.assessUrgency(brief);
    const complexity = this.assessComplexity(brief);

    return {
      originalBrief: brief,
      campaignType,
      urgency,
      complexity,
      keywords,
      targetIndustry: this.identifyIndustry(brief),
      estimatedDuration: this.estimateDuration(complexity, urgency),
      riskLevel: this.assessRiskLevel(brief),
      dataRequirements: this.identifyDataRequirements(brief),
      targetMarket: this.extractTargetMarket(brief),
      focusAreas: this.extractFocusAreas(brief),
    };
  }

  // Enhanced campaign analysis methods
  extractCampaignKeywords(brief) {
    const text = brief.toLowerCase();
    const keywords = [];

    // Industry keywords
    const industryTerms = [
      "hospitality",
      "hotel",
      "resort",
      "travel",
      "tourism",
      "luxury",
      "eco",
      "wellness",
    ];
    industryTerms.forEach((term) => {
      if (text.includes(term)) keywords.push(term);
    });

    // Audience keywords
    const audienceTerms = [
      "millennial",
      "gen z",
      "young",
      "professional",
      "family",
      "business",
    ];
    audienceTerms.forEach((term) => {
      if (text.includes(term)) keywords.push(term);
    });

    // Campaign type keywords
    const campaignTerms = [
      "launch",
      "awareness",
      "promotion",
      "event",
      "announcement",
    ];
    campaignTerms.forEach((term) => {
      if (text.includes(term)) keywords.push(term);
    });

    return [...new Set(keywords)];
  }

  determineCampaignType(brief) {
    const text = brief.toLowerCase();
    if (text.includes("launch")) return "product_launch";
    if (text.includes("event")) return "event_promotion";
    if (text.includes("awareness")) return "brand_awareness";
    if (text.includes("crisis")) return "crisis_management";
    return "general_campaign";
  }

  assessUrgency(brief) {
    const text = brief.toLowerCase();
    if (
      text.includes("urgent") ||
      text.includes("asap") ||
      text.includes("immediate")
    )
      return "high";
    if (text.includes("soon") || text.includes("quick")) return "medium";
    return "low";
  }

  assessComplexity(brief) {
    const wordCount = brief.split(" ").length;
    const hasMultipleObjectives =
      (brief.match(/and|also|additionally/gi) || []).length > 2;
    const hasSpecificRequirements =
      brief.includes("must") || brief.includes("require");

    if (wordCount > 200 || hasMultipleObjectives || hasSpecificRequirements)
      return "high";
    if (wordCount > 100) return "medium";
    return "low";
  }

  identifyIndustry(brief) {
    const text = brief.toLowerCase();
    if (
      text.includes("hotel") ||
      text.includes("resort") ||
      text.includes("hospitality")
    )
      return "hospitality";
    if (text.includes("tech") || text.includes("software")) return "technology";
    if (text.includes("health") || text.includes("medical"))
      return "healthcare";
    return "general";
  }

  estimateDuration(complexity, urgency) {
    const complexityMultiplier = { low: 1, medium: 1.5, high: 2 };
    const urgencyMultiplier = { high: 0.5, medium: 1, low: 1.5 };

    const baseDuration = 7; // days
    return Math.round(
      baseDuration *
        complexityMultiplier[complexity] *
        urgencyMultiplier[urgency]
    );
  }

  assessRiskLevel(brief) {
    const text = brief.toLowerCase();
    const riskKeywords = [
      "crisis",
      "urgent",
      "sensitive",
      "controversial",
      "legal",
    ];
    const riskCount = riskKeywords.filter((keyword) =>
      text.includes(keyword)
    ).length;

    if (riskCount >= 2) return "high";
    if (riskCount === 1) return "medium";
    return "low";
  }

  identifyDataRequirements(brief) {
    const requirements = [];
    const text = brief.toLowerCase();

    if (text.includes("trend") || text.includes("popular"))
      requirements.push("trending_data");
    if (text.includes("audience") || text.includes("demographic"))
      requirements.push("audience_data");
    if (text.includes("competitor") || text.includes("market"))
      requirements.push("competitive_data");
    if (text.includes("social") || text.includes("sentiment"))
      requirements.push("social_data");

    return requirements;
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
        message: "_[Analyzing target audience and market dynamics...]_",
        timestamp: new Date().toISOString(),
        isProcessing: true,
      });

      // Get real data if enabled
      let externalData = null;
      if (this.dataSourceManager.enableRealDataSources) {
        try {
          externalData = await this.gatherResearchData(campaignContext);
          campaign.dataSourcesUsed.push("audience_research", "market_data");
        } catch (error) {
          console.warn(
            "External research data failed, proceeding with AI analysis:",
            error.message
          );
        }
      }

      const researchResult = await this.researchAgent.analyzeAudience(
        campaignContext.originalBrief || campaign.brief,
        externalData
      );

      // Remove processing indicator and add results
      campaign.conversation = campaign.conversation.filter(
        (msg) => !msg.isProcessing
      );

      // Quality control validation
      let qualityValidation = { isValid: true, confidence: 85 };
      if (this.enableQualityControl) {
        qualityValidation = this.qualityController.validateResearchData(
          researchResult.insights
        );
        campaign.qualityMetrics.research = qualityValidation;

        console.log(
          `🔍 Research Quality: ${qualityValidation.confidence}% confidence`
        );
        if (qualityValidation.issues.length > 0) {
          console.log(
            `⚠️ Research Issues: ${qualityValidation.issues.join(", ")}`
          );
        }
      }

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
        deliverable: researchResult.insights,
        agent: "Research & Audience GPT",
        qualityScore: qualityValidation.confidence,
        timestamp: new Date().toISOString(),
      });

      campaign.lastUpdated = new Date().toISOString();
      console.log(`[${campaignId}] Research phase completed`);

      // Dynamic flow control
      if (this.enableDynamicFlow && this.enableQualityControl) {
        const flowDecision = this.qualityController.determineNextPhase(
          "research",
          qualityValidation
        );
        campaign.flowDecisions.push({
          phase: "research",
          decision: flowDecision,
          timestamp: new Date().toISOString(),
        });

        if (flowDecision.nextPhase === "research_retry") {
          console.log(`🔄 Research quality insufficient, retrying...`);
          // Could implement retry logic here
        }
      }

      // Generate dynamic PR Manager handoff
      setTimeout(async () => {
        try {
          const handoffMessage = await this.generatePRManagerHandoffMessage(
            campaignContext,
            "strategic_insight",
            researchResult.insights
          );

          campaign.conversation.push({
            speaker: "PR Manager",
            message: handoffMessage,
            timestamp: new Date().toISOString(),
          });

          console.log(
            `[${campaignId}] Starting strategic insight phase handoff...`
          );
          console.log(
            `🔄 TRANSFORMATION PHASE: Converting functional insights to emotional truths...`
          );
          this.runStrategicInsightPhase(campaignId, campaignContext);
        } catch (error) {
          console.error(
            `[${campaignId}] Handoff to strategic insight failed:`,
            error
          );
          // Still proceed to strategic insight phase even if handoff message fails
          campaign.conversation.push({
            speaker: "PR Manager",
            message:
              "Now we need to transform these functional insights into deeper human truths. Strategic Insight Agent, please dig beneath the surface to find the emotional core that will drive authentic connection.",
            timestamp: new Date().toISOString(),
          });
          this.runStrategicInsightPhase(campaignId, campaignContext);
        }
      }, 2000);
    } catch (error) {
      console.error(`[${campaignId}] Research phase failed:`, error);
      campaign.status = "failed";
      campaign.error = error.message;
      campaign.lastUpdated = new Date().toISOString();
    }
  }

  async gatherResearchData(campaignContext) {
    const keywords = campaignContext.keywords || ["hospitality", "travel"];

    try {
      const [socialData, newsData] = await Promise.all([
        this.dataSourceManager.getSocialMediaSentiment(keywords),
        this.dataSourceManager.getRelevantNews(keywords, "business", 7),
      ]);

      return {
        socialSentiment: socialData,
        recentNews: newsData,
        dataQuality:
          socialData.dataQuality === "real" && newsData.dataQuality === "real"
            ? "real"
            : "mixed",
      };
    } catch (error) {
      console.warn("Failed to gather external research data:", error);
      return null;
    }
  }

  async generateAgentIntroMessage(agent, campaignContext, phase) {
    try {
      console.log(`🔄 Generating intro message for ${agent.name}...`);
      const message = await agent.generateConversationResponse(
        campaignContext,
        "introduction",
        { phase, campaignType: campaignContext.campaignType }
      );

      // Safe substring with null check
      const messagePreview =
        message && typeof message === "string"
          ? message.substring(0, 100)
          : "Generated introduction message";

      console.log(
        `✅ Generated intro message for ${agent.name}: ${messagePreview}...`
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

      // Safe substring with null check
      const messagePreview =
        message && typeof message === "string"
          ? message.substring(0, 100)
          : "Generated delivery message";

      console.log(
        `✅ Generated delivery message for ${agent.name}: ${messagePreview}...`
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

  async runStrategicInsightPhase(campaignId, campaignContext) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || !campaign.phases.research) return;

    try {
      console.log(`[${campaignId}] Starting strategic insight phase...`);
      campaign.status = "strategic_insight";
      campaign.lastUpdated = new Date().toISOString();

      // Add processing indicator
      campaign.conversation.push({
        speaker: "Strategic Insight & Human Truth GPT",
        message:
          "_[Analyzing research data to discover deeper human truths...]_",
        timestamp: new Date().toISOString(),
        isProcessing: true,
      });

      console.log(
        `🔄 TRANSFORMATION PHASE: Converting functional insights to emotional truths...`
      );
      const strategicInsightResult =
        await this.strategicInsightAgent.discoverHumanTruth(
          campaign.phases.research.insights,
          campaignContext
        );

      // Remove processing indicator
      campaign.conversation = campaign.conversation.filter(
        (msg) => !msg.isProcessing
      );

      // Log the transformation for visibility - use the actual response structure
      console.log(`
🔍 STRATEGIC TRANSFORMATION COMPLETE:
- Human Truth Analysis: Generated via Responses API
- Confidence: ${strategicInsightResult.confidence_score}% confidence
- Analysis: ${strategicInsightResult.humanTruthAnalysis?.substring(0, 100)}...
`);

      // Store results
      campaign.phases.strategic_insight = {
        insights: strategicInsightResult,
        timestamp: new Date().toISOString(),
        quality: {
          isValid: true,
          confidence: strategicInsightResult.confidence_score || 85,
        },
      };

      // Add the actual analysis to conversation
      campaign.conversation.push({
        speaker: "Strategic Insight & Human Truth GPT",
        message: strategicInsightResult.humanTruthAnalysis,
        timestamp: new Date().toISOString(),
      });

      // Generate dynamic PR Manager handoff
      setTimeout(async () => {
        try {
          const handoffMessage = await this.generatePRManagerHandoffMessage(
            campaignContext,
            "trending",
            strategicInsightResult
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
        }
      }, 2000);
    } catch (error) {
      console.error(
        `[${campaignId}] Strategic insight phase failed:`,
        error.message
      );
      campaign.status = "error";
      campaign.lastError = error.message;
    }
  }

  async gatherStrategicInsightData(campaignContext) {
    const keywords = campaignContext.keywords || ["hospitality", "travel"];

    try {
      const [insightsData, newsData] = await Promise.all([
        this.dataSourceManager.getStrategicInsights(keywords),
        this.dataSourceManager.getRelevantNews(keywords, "business", 3),
      ]);

      return {
        insights: insightsData,
        recentNews: newsData,
        dataQuality:
          insightsData.dataQuality === "real" && newsData.dataQuality === "real"
            ? "real"
            : "mixed",
      };
    } catch (error) {
      console.warn("Failed to gather external strategic insight data:", error);
      return null;
    }
  }

  async runTrendingPhase(campaignId, campaignContext) {
    const campaign = this.campaigns.get(campaignId);
    if (
      !campaign ||
      !campaign.phases.research ||
      !campaign.phases.strategic_insight
    )
      return;

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

      // Get real trending data if enabled
      let externalData = null;
      if (this.dataSourceManager.enableRealDataSources) {
        try {
          externalData = await this.gatherTrendingData(campaignContext);
          campaign.dataSourcesUsed.push("google_trends", "news_api");
        } catch (error) {
          console.warn(
            "External trending data failed, proceeding with AI analysis:",
            error.message
          );
        }
      }

      const trendingResult = await this.trendingAgent.analyzeTrends(
        campaignContext.originalBrief || campaign.brief,
        campaign.phases.research.insights,
        campaign.phases.strategic_insight.insights,
        externalData
      );

      // Remove processing indicator and add results
      campaign.conversation = campaign.conversation.filter(
        (msg) => !msg.isProcessing
      );

      // Quality control validation
      let qualityValidation = {
        isValid: true,
        confidence: 80,
        shouldSkipTrends: false,
      };
      if (this.enableQualityControl) {
        qualityValidation = this.qualityController.validateTrendingData(
          trendingResult.trends
        );
        campaign.qualityMetrics.trending = qualityValidation;

        console.log(
          `📈 Trending Quality: ${qualityValidation.confidence}% confidence`
        );
        if (qualityValidation.shouldSkipTrends) {
          console.log(
            `⚠️ Weak trends detected, considering alternative strategy`
          );
        }
      }

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
        deliverable: trendingResult.trends,
        agent: "Trending News GPT",
        qualityScore: qualityValidation.confidence,
        timestamp: new Date().toISOString(),
      });

      campaign.lastUpdated = new Date().toISOString();
      console.log(`[${campaignId}] Trending phase completed`);

      // Dynamic flow control
      if (this.enableDynamicFlow && this.enableQualityControl) {
        const flowDecision = this.qualityController.determineNextPhase(
          "trending",
          qualityValidation
        );
        campaign.flowDecisions.push({
          phase: "trending",
          decision: flowDecision,
          timestamp: new Date().toISOString(),
        });

        if (flowDecision.alternativeFlow) {
          console.log(`🔄 Using alternative strategy due to weak trends`);
          campaignContext.useAlternativeStrategy = true;
        }
      }

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
              "Now let's develop compelling story angles and headlines for our campaign.",
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

  async gatherTrendingData(campaignContext) {
    const keywords = campaignContext.keywords || ["hospitality", "travel"];

    try {
      const [trendsData, newsData] = await Promise.all([
        this.dataSourceManager.getTrendingTopics(keywords),
        this.dataSourceManager.getRelevantNews(keywords, "business", 3),
      ]);

      return {
        googleTrends: trendsData,
        recentNews: newsData,
        dataQuality:
          trendsData.dataQuality === "real" && newsData.dataQuality === "real"
            ? "real"
            : "mixed",
      };
    } catch (error) {
      console.warn("Failed to gather external trending data:", error);
      return null;
    }
  }

  async runStoryPhase(campaignId, campaignContext) {
    const campaign = this.campaigns.get(campaignId);
    if (
      !campaign ||
      !campaign.phases.research ||
      !campaign.phases.strategic_insight ||
      !campaign.phases.trending
    )
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
        message: "_[Crafting compelling story angles...]_",
        timestamp: new Date().toISOString(),
        isProcessing: true,
      });

      const storyResult = await this.storyAgent.generateStoryAngles(
        campaignContext.originalBrief || campaign.brief,
        campaign.phases.research.insights,
        campaign.phases.trending?.trends
      );

      // Remove processing indicator and add results
      campaign.conversation = campaign.conversation.filter(
        (msg) => !msg.isProcessing
      );

      // Quality control validation
      let qualityValidation = { isValid: true, confidence: 75 };
      if (this.enableQualityControl) {
        qualityValidation = this.qualityController.validateStoryData(
          storyResult.storyAngles
        );
        campaign.qualityMetrics.story = qualityValidation;

        console.log(
          `✍️ Story Quality: ${qualityValidation.confidence}% confidence`
        );
      }

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
        deliverable: storyResult.storyAngles,
        agent: "Story Angles & Headlines GPT",
        qualityScore: qualityValidation.confidence,
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
              "Now let's bring all our insights together for the final campaign strategy.",
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
      !campaign.phases.strategic_insight ||
      !campaign.phases.story
    )
      return;

    try {
      console.log(`[${campaignId}] Starting collaborative phase...`);
      campaign.status = "collaborative";
      campaign.lastUpdated = new Date().toISOString();

      // Enhanced collaborative discussion with real agent interaction
      const collaborativePrompts = {
        research:
          "Based on the strategic insight, trending analysis, and story angles, how would you refine your audience insights?",
        strategic_insight:
          "Given the research findings, trending data, and story direction, which insights should we prioritize?",
        trending:
          "Considering the research insights, strategic truths, and story angles, which trends should we emphasize?",
        story:
          "Considering the audience research, strategic insights, and trending data, how can we strengthen our story angles?",
      };

      let results = [];

      if (this.enableAgentInteraction) {
        results = await this.generateEnhancedCollaborativeDiscussion(
          campaignContext,
          campaign.phases
        );
      } else {
        results = await this.generateCollaborativeDiscussion(
          campaignContext,
          campaign.phases
        );
      }

      // Add collaborative messages to conversation
      results.forEach((result) => {
        campaign.conversation.push({
          speaker: result.speaker,
          message: result.message,
          timestamp: new Date().toISOString(),
        });
      });

      // Quality control - validate data synthesis
      let synthesisValidation = { isCoherent: true, alignmentScore: 85 };
      if (this.enableQualityControl && this.qualityController) {
        try {
          synthesisValidation = this.qualityController.validateDataSynthesis(
            campaign.phases.research.insights,
            campaign.phases.strategic_insight.insights,
            campaign.phases.trending?.trends,
            campaign.phases.story.storyAngles
          );

          console.log(
            `🔗 Data Synthesis: ${synthesisValidation.alignmentScore}% alignment`
          );
          if (!synthesisValidation.isCoherent) {
            console.log(
              `⚠️ Synthesis Issues: ${synthesisValidation.gaps.join(", ")}`
            );
          }
        } catch (error) {
          console.log(`⚠️ Quality control validation failed, using defaults`);
        }
      }

      campaign.phases.collaborative = {
        phase: "collaborative",
        contributions: results,
        synthesisQuality: synthesisValidation,
        finalStrategy: await this.synthesizeFinalStrategy(
          campaign.phases,
          results
        ),
      };

      // Add final deliverable
      campaign.conversation.push({
        speaker: "All Agents",
        message: await this.generateFinalDeliveryMessage(
          campaignContext,
          campaign.phases
        ),
        deliverable: campaign.phases.collaborative.finalStrategy,
        agent: "All Agents",
        synthesisScore: synthesisValidation.alignmentScore,
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

      // Generate final quality report
      if (this.enableQualityControl) {
        const qualityReport = this.qualityController.generateQualityReport(
          campaign.qualityMetrics
        );
        campaign.qualityReport = qualityReport;

        console.log(
          `📊 Campaign Quality Report: ${qualityReport.overallQuality} (${qualityReport.confidence}% confidence)`
        );
      }

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

  async generateEnhancedCollaborativeDiscussion(context, phases) {
    // Enhanced collaborative discussion with real agent interaction
    const collaborativePrompts = {
      research:
        "Based on the strategic insight, trending analysis, and story angles, how would you refine your audience insights?",
      strategic_insight:
        "Given the research findings, trending data, and story direction, which insights should we prioritize?",
      trending:
        "Considering the research insights, strategic truths, and story angles, which trends should we emphasize?",
      story:
        "Considering the audience research, strategic insights, and trending data, how can we strengthen our story angles?",
    };

    const results = [];

    try {
      // Let each agent respond to the others' findings
      for (const [agentType, prompt] of Object.entries(collaborativePrompts)) {
        const agent = this.getAgentByType(agentType);
        const otherPhasesData = this.getOtherPhasesData(phases, agentType);

        const response = await agent.generateConversationResponse(
          context,
          "collaborative_refinement",
          { prompt, otherPhasesData, allPhases: phases }
        );

        results.push({
          agent: agentType,
          speaker: agent.name,
          message: response,
          type: "refinement",
        });
      }
    } catch (error) {
      console.warn(
        "Enhanced collaboration failed, using standard approach:",
        error
      );
      return await this.generateCollaborativeDiscussion(context, phases);
    }

    return results;
  }

  getAgentByType(type) {
    switch (type) {
      case "research":
        return this.researchAgent;
      case "strategic_insight":
        return this.strategicInsightAgent;
      case "trending":
        return this.trendingAgent;
      case "story":
        return this.storyAgent;
      default:
        return this.researchAgent;
    }
  }

  getOtherPhasesData(phases, excludePhase) {
    const otherData = {};
    Object.entries(phases).forEach(([phase, data]) => {
      if (phase !== excludePhase && data) {
        otherData[phase] = data;
      }
    });
    return otherData;
  }

  async generateCollaborativeDiscussion(context, phases) {
    try {
      console.log("🔄 Generating dynamic collaborative discussion...");

      // Generate dynamic collaborative messages using each agent's actual collaborative input
      const [
        researchMessage,
        strategicInsightMessage,
        trendingMessage,
        storyMessage,
      ] = await Promise.all([
        this.generateCollaborativeMessage(
          this.researchAgent,
          context,
          phases,
          "research"
        ),
        this.generateCollaborativeMessage(
          this.strategicInsightAgent,
          context,
          phases,
          "strategic_insight"
        ),
        this.generateCollaborativeMessage(
          this.trendingAgent,
          context,
          phases,
          "trending"
        ),
        this.generateCollaborativeMessage(
          this.storyAgent,
          context,
          phases,
          "story"
        ),
      ]);

      console.log("✅ Dynamic collaborative discussion generated");

      return [
        {
          speaker: "Research & Audience GPT",
          message: researchMessage,
        },
        {
          speaker: "Strategic Insight GPT",
          message: strategicInsightMessage,
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
    } catch (error) {
      console.error("❌ Dynamic collaborative discussion failed:", error);

      // If all dynamic generation fails, return minimal structure
      return [
        {
          speaker: "Research & Audience GPT",
          message: "Research insights contributed to collaborative strategy.",
        },
        {
          speaker: "Strategic Insight GPT",
          message: "Strategic insights contributed to collaborative strategy.",
        },
        {
          speaker: "Trending News GPT",
          message: "Trending analysis contributed to collaborative strategy.",
        },
        {
          speaker: "Story Angles & Headlines GPT",
          message: "Story angles contributed to collaborative strategy.",
        },
      ];
    }
  }

  async generateCollaborativeMessage(
    agent,
    campaignContext,
    phases,
    agentPhase
  ) {
    try {
      console.log(`🔄 Generating collaborative message for ${agent.name}...`);

      // Use the agent's own collaborative input method to generate the message
      const collaborativeInput = await agent.collaborativeInput(phases);

      if (collaborativeInput && collaborativeInput.contribution) {
        console.log(`✅ ${agent.name} provided collaborative input`);
        return collaborativeInput.contribution;
      } else {
        console.warn(
          `⚠️ ${agent.name} collaborative input was empty or invalid`
        );
        throw new Error(`Invalid collaborative input from ${agent.name}`);
      }
    } catch (error) {
      console.warn(
        `❌ Collaborative message generation failed for ${agent.name}:`,
        error.message
      );

      // Generate a dynamic message using the agent's conversation response capability
      try {
        console.log(
          `🔄 Fallback: Using ${agent.name} conversation response for collaboration...`
        );

        const fallbackMessage = await agent.generateConversationResponse(
          campaignContext,
          "collaborative_summary",
          {
            phases: phases,
            role: agentPhase,
            context:
              "Providing collaborative input for final strategy synthesis",
          }
        );

        if (fallbackMessage && typeof fallbackMessage === "string") {
          console.log(
            `✅ ${agent.name} provided fallback collaborative message`
          );
          return fallbackMessage;
        } else {
          throw new Error(
            `Fallback message generation failed for ${agent.name}`
          );
        }
      } catch (fallbackError) {
        console.error(
          `❌ All collaborative message generation failed for ${agent.name}:`,
          fallbackError.message
        );

        // Only as last resort, return a minimal but specific message
        return `${agent.name} has completed ${agentPhase} analysis and contributed insights to the collaborative strategy development.`;
      }
    }
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

  async synthesizeFinalStrategy(phases, collaborativeResults) {
    const research = phases.research?.insights;
    const strategicInsight = phases.strategic_insight?.insights;
    const trending = phases.trending?.trends;
    const story = phases.story?.storyAngles;

    if (!research || !strategicInsight || !story) {
      console.warn("⚠️ Incomplete phase data for strategy synthesis");
      return {
        error: "Unable to synthesize strategy due to incomplete phase data",
        missingPhases: [
          !research ? "research" : null,
          !strategicInsight ? "strategic_insight" : null,
          !trending ? "trending" : null,
          !story ? "story" : null,
        ].filter(Boolean),
      };
    }

    try {
      console.log("🔄 Generating comprehensive strategy synthesis...");

      // Use the human truth as the foundation for strategy
      const humanTruth =
        strategicInsight.human_truth ||
        "Audience seeks authentic connection and meaningful experiences";

      const strategy = {
        theme: `Campaign built on human truth: ${humanTruth}`,
        humanTruth: humanTruth,
        targetAudience: research.primarySegments ||
          research.segments || ["Target audience"],
        keyMessages: strategicInsight.strategic_implications || {},
        storyAngles: story.angles || story,
        trends: trending || [],
        emotionalDrivers: strategicInsight.emotional_drivers || [],
        confidence: strategicInsight.confidence_score || 85,
      };

      return strategy;
    } catch (error) {
      console.error("❌ Strategy synthesis failed:", error);
      return {
        error: "Strategy synthesis failed",
        fallback: "Generic campaign strategy focused on audience engagement",
      };
    }
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

  // Add new methods to extract specific details from brief
  extractTargetMarket(brief) {
    const text = brief.toLowerCase();
    const markets = [];

    if (text.includes("millennial")) markets.push("Millennials");
    if (text.includes("gen z")) markets.push("Gen Z");
    if (text.includes("business")) markets.push("Business travelers");
    if (text.includes("family") || text.includes("families"))
      markets.push("Families");
    if (text.includes("luxury")) markets.push("Luxury travelers");
    if (text.includes("wellness")) markets.push("Wellness seekers");
    if (text.includes("eco") || text.includes("sustainable"))
      markets.push("Eco-conscious travelers");

    return markets.length > 0 ? markets.join(" and ") : "General market";
  }

  extractFocusAreas(brief) {
    const text = brief.toLowerCase();
    const areas = [];

    if (text.includes("sustain") || text.includes("eco"))
      areas.push("Sustainability");
    if (text.includes("wellness") || text.includes("spa"))
      areas.push("Wellness");
    if (text.includes("luxury")) areas.push("Luxury experiences");
    if (text.includes("community")) areas.push("Community engagement");
    if (text.includes("technology") || text.includes("digital"))
      areas.push("Technology innovation");
    if (text.includes("culture") || text.includes("local"))
      areas.push("Cultural immersion");

    return areas;
  }
}

module.exports = AgentOrchestrator;
