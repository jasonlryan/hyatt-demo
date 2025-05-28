const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const ResearchAudienceAgent = require("./agents/ResearchAudienceAgent");
const TrendingNewsAgent = require("./agents/TrendingNewsAgent");
const StoryAnglesAgent = require("./agents/StoryAnglesAgent");
const PRManagerAgent = require("./agents/PRManagerAgent");

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
          campaignContext,
          campaignBrief
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
      campaignType,
      urgency,
      complexity,
      keywords,
      targetIndustry: this.identifyIndustry(brief),
      estimatedDuration: this.estimateDuration(complexity, urgency),
      riskLevel: this.assessRiskLevel(brief),
      dataRequirements: this.identifyDataRequirements(brief),
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
        campaign.brief,
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
        deliverable: "Audience Research & Insights",
        data: researchResult.insights,
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
              "Now let's analyze current trends and cultural moments that could amplify our campaign.",
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
        campaign.brief,
        campaign.phases.research.insights,
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
        deliverable: "Current Trend Analysis",
        data: trendingResult.trends,
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
        deliverable: "Story Angles & Headlines",
        data: storyResult.storyAngles,
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
      !campaign.phases.trending ||
      !campaign.phases.story
    )
      return;

    try {
      console.log(`[${campaignId}] Starting collaborative phase...`);
      campaign.status = "collaborative";
      campaign.lastUpdated = new Date().toISOString();

      // Enhanced collaborative discussion with real agent interaction
      let collaborativeResults = [];

      if (this.enableAgentInteraction) {
        collaborativeResults =
          await this.generateEnhancedCollaborativeDiscussion(
            campaignContext,
            campaign.phases
          );
      } else {
        collaborativeResults = await this.generateCollaborativeDiscussion(
          campaignContext,
          campaign.phases
        );
      }

      // Add collaborative messages to conversation
      collaborativeResults.forEach((result) => {
        campaign.conversation.push({
          speaker: result.speaker,
          message: result.message,
          timestamp: new Date().toISOString(),
        });
      });

      // Quality control - validate data synthesis
      let synthesisValidation = { isCoherent: true, alignmentScore: 85 };
      if (this.enableQualityControl) {
        synthesisValidation = this.qualityController.validateDataSynthesis(
          campaign.phases.research.insights,
          campaign.phases.trending.trends,
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
      }

      campaign.phases.collaborative = {
        phase: "collaborative",
        contributions: collaborativeResults,
        synthesisQuality: synthesisValidation,
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
        "Based on the trending analysis and story angles, how would you refine your audience insights?",
      trending:
        "Given the research findings and story direction, which trends should we prioritize?",
      story:
        "Considering the audience research and trending data, how can we strengthen our story angles?",
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
    const { campaignType } = context;

    // Safe data extraction with fallbacks
    const primaryAngle =
      phases.story?.storyAngles?.primaryAngle?.angle ||
      "Primary campaign angle";
    const topTrend =
      phases.trending?.trends?.relevantTrends?.[0]?.trend ||
      "Key trending topic";
    const topDriverEntry = phases.research?.insights?.keyDrivers
      ? Object.entries(phases.research.insights.keyDrivers)[0]
      : ["audience motivation", "key driver"];

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
    try {
      // Use the agent's own collaborative input method to generate the message
      const collaborativeInput = await agent.collaborativeInput(phases);
      return collaborativeInput.contribution;
    } catch (error) {
      console.warn(
        `Collaborative message generation failed for ${agent.name}:`,
        error
      );
      return `I've contributed my ${agentPhase} analysis to this ${campaignContext.campaignType} campaign.`;
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

    // Safe data extraction with fallbacks
    const topDriverEntry = Object.entries(research.keyDrivers || {})[0] || [
      "engagement",
      "key metric",
    ];
    const topTrend = trends.relevantTrends?.[0] || {
      trend: "industry trend",
      relevance: "75%",
    };
    const primaryAngle = story.primaryAngle || {
      angle: "Primary campaign angle",
      emotionalHook: "Key message",
    };

    // Format target audience properly - extract segment names from objects
    const targetAudienceNames =
      (research.targetDemographics || [])
        .map((demo) => demo.segment || demo.name || demo)
        .join(", ") || "Target audience";

    // Calculate strategic alignment properly - extract numeric values from relevance percentages
    let strategicAlignment = "N/A";
    try {
      const relevanceStr = topTrend.relevance || "75%";
      const relevanceMatch = relevanceStr.toString().match(/(\d+)/);
      const relevanceNum = relevanceMatch ? parseInt(relevanceMatch[1]) : 75;
      strategicAlignment = `${relevanceNum}%`;
    } catch (error) {
      strategicAlignment = "75%"; // Default fallback
    }

    return {
      campaignTheme: primaryAngle.angle,
      primaryHeadline: story.headlines?.[0] || "Campaign Headline",
      targetAudience: targetAudienceNames,
      keyMessage: primaryAngle.emotionalHook || "Key campaign message",
      strategicAlignment: strategicAlignment,
      launchTiming: trends.timingRecommendation || "Optimal timing recommended",
      mediaStrategy: (trends.mediaOpportunities || []).slice(0, 3),
      successMetrics: [
        `${topDriverEntry[0]} engagement rate`,
        `${topTrend.trend} mention share`,
        "Campaign reach and impressions",
        "Audience sentiment analysis",
      ],
      collaborativeInsights: collaborativeResults.map((result) => ({
        agent: result.agent || result.speaker,
        keyInsight: result.contribution || result.message,
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
