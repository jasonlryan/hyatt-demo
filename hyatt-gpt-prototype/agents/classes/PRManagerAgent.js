const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai");

class PRManagerAgent {
  constructor() {
    this.name = "PR Manager";
    this.promptFile = "pr_manager_gpt.md";
    this.systemPrompt = null;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Load configuration from agents.config.json
    this.loadConfiguration();

    console.log(`🤖 PR Manager Agent initialized with model: ${this.model}`);
  }

  loadConfiguration() {
    try {
      const configPath = path.join(__dirname, "../agents.config.json");
      const configData = JSON.parse(
        require("fs").readFileSync(configPath, "utf8")
      );
      const agentConfig = configData.agents["pr-manager"];

      if (agentConfig) {
        this.model = agentConfig.model || "gpt-4o-mini-2024-07-18";
        this.temperature = agentConfig.temperature || 0.7;
        this.maxTokens = agentConfig.maxTokens || 4000;
        this.timeout = agentConfig.timeout || 45000;
        this.delay = agentConfig.delay || 3000;
        this.enabled = agentConfig.enabled !== false;
      } else {
        // Fallback to environment variables if config not found
        this.model = process.env.PR_MANAGER_MODEL || "gpt-4o-mini-2024-07-18";
        this.temperature =
          parseFloat(process.env.PR_MANAGER_TEMPERATURE) || 0.7;
        this.maxTokens = parseInt(process.env.PR_MANAGER_MAX_TOKENS) || 4000;
        this.timeout = parseInt(process.env.PR_MANAGER_TIMEOUT) || 45000;
        this.delay = parseInt(process.env.PR_MANAGER_DELAY) || 3000;
        this.enabled = true;
      }
    } catch (error) {
      console.warn(
        "Failed to load agent configuration, using defaults:",
        error.message
      );
      // Fallback to environment variables
      this.model = process.env.PR_MANAGER_MODEL || "gpt-4o-mini-2024-07-18";
      this.temperature = parseFloat(process.env.PR_MANAGER_TEMPERATURE) || 0.7;
      this.maxTokens = parseInt(process.env.PR_MANAGER_MAX_TOKENS) || 4000;
      this.timeout = parseInt(process.env.PR_MANAGER_TIMEOUT) || 45000;
      this.delay = parseInt(process.env.PR_MANAGER_DELAY) || 3000;
      this.enabled = true;
    }
  }

  async loadSystemPrompt(attempt = 1) {
    const potentialPaths = [
      path.join(__dirname, "../prompts", this.promptFile), // Consolidated prompts path
      path.join(__dirname, "../GPTs", this.promptFile), // Fallback to old path
      path.join(process.cwd(), "GPTs", this.promptFile), // Fallback to root GPTs
    ];

    for (const p of potentialPaths) {
      try {
        const content = await fs.readFile(p, "utf8");
        this.systemPrompt = content;
        console.log(`Loaded system prompt from ${p}`);
        return;
      } catch (error) {
        // console.warn(`Failed to load prompt from ${p}: ${error.message}`); // Debug log
      }
    }

    console.error(
      `Failed to load system prompt after trying all paths: ${this.promptFile}`
    );
    throw new Error(`Failed to load system prompt: ${this.promptFile}`);
  }

  async generateCampaignIntroduction(campaignBrief, campaignContext) {
    try {
      console.log(
        `🔄 PR Manager generating campaign introduction via Responses API...`
      );

      const prompt = `
ORIGINAL CAMPAIGN BRIEF:
${campaignBrief}

CAMPAIGN ANALYSIS:
- Type: ${campaignContext.campaignType || "general_campaign"}
- Urgency: ${campaignContext.urgency || "medium"}
- Target Market: ${campaignContext.targetMarket || "general market"}
- Focus Areas: ${
        campaignContext.focusAreas && Array.isArray(campaignContext.focusAreas)
          ? campaignContext.focusAreas.join(", ")
          : "general focus"
      }
- Keywords: ${
        campaignContext.keywords && Array.isArray(campaignContext.keywords)
          ? campaignContext.keywords.join(", ")
          : "none identified"
      }

Based on the ORIGINAL CAMPAIGN BRIEF above, generate a campaign introduction that:
1. References specific details from the campaign brief
2. Sets the strategic direction for the team based on the brief's objectives
3. Directs the Research & Audience agent to begin analysis of the specific target market mentioned in the brief
4. Establishes the campaign's unique positioning and goals

Be specific to THIS campaign - reference the actual campaign details, objectives, and requirements from the brief. Avoid generic language.
`;

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      const introduction = response.output_text.trim();

      console.log(
        `✅ PR Manager generated introduction via Responses API: ${introduction.substring(
          0,
          100
        )}...`
      );
      return introduction;
    } catch (error) {
      console.error(
        "❌ PR Manager Responses API introduction generation failed:",
        error
      );
      return "Campaign introduction unavailable - please retry";
    }
  }

  async generateHandoffMessage(campaignContext, nextPhase, previousData) {
    try {
      console.log(
        `🔄 PR Manager generating handoff to ${nextPhase} via Responses API...`
      );

      const prompt = `
ORIGINAL CAMPAIGN BRIEF:
${campaignContext.originalBrief || "Campaign brief not available"}

CAMPAIGN ANALYSIS:
- Type: ${campaignContext.campaignType || "general_campaign"}
- Urgency: ${campaignContext.urgency || "medium"}
- Target Market: ${campaignContext.targetMarket || "general market"}
- Focus Areas: ${
        campaignContext.focusAreas && Array.isArray(campaignContext.focusAreas)
          ? campaignContext.focusAreas.join(", ")
          : "general focus"
      }
- Keywords: ${
        campaignContext.keywords && Array.isArray(campaignContext.keywords)
          ? campaignContext.keywords.join(", ")
          : "none identified"
      }

PREVIOUS PHASE DATA: 
${JSON.stringify(previousData, null, 2)}

NEXT PHASE: ${nextPhase}

Based on the ORIGINAL CAMPAIGN BRIEF and the insights from the previous phase, generate a handoff message that:
1. References specific details from the original campaign brief
2. Summarizes key insights from the previous phase
3. Connects those insights to the next phase requirements
4. Provides specific direction for the upcoming analysis
5. Maintains strategic momentum

Be specific to THIS campaign - avoid generic language. Reference the actual campaign details.
`;

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      const handoff = response.output_text.trim();

      console.log(
        `✅ PR Manager generated handoff via Responses API: ${handoff.substring(
          0,
          100
        )}...`
      );
      return handoff;
    } catch (error) {
      console.error(
        "❌ PR Manager Responses API handoff generation failed:",
        error
      );
      return "Handoff message unavailable - please retry";
    }
  }

  async generateFinalDelivery(campaignContext, allPhaseData) {
    try {
      console.log(
        `🔄 PR Manager generating final delivery via Responses API...`
      );

      const prompt = `
ORIGINAL CAMPAIGN BRIEF:
${campaignContext.originalBrief || "Campaign brief not available"}

CAMPAIGN ANALYSIS:
- Type: ${campaignContext.campaignType || "general_campaign"}
- Urgency: ${campaignContext.urgency || "medium"}
- Target Market: ${campaignContext.targetMarket || "general market"}
- Focus Areas: ${
        campaignContext.focusAreas && Array.isArray(campaignContext.focusAreas)
          ? campaignContext.focusAreas.join(", ")
          : "general focus"
      }
- Keywords: ${
        campaignContext.keywords && Array.isArray(campaignContext.keywords)
          ? campaignContext.keywords.join(", ")
          : "none identified"
      }

ALL PHASE DATA: 
${JSON.stringify(allPhaseData, null, 2)}

As the PR Manager, you must create a COMPREHENSIVE, PROFESSIONAL-GRADE campaign plan that synthesizes all agent contributions into a detailed strategic deliverable based on the ORIGINAL CAMPAIGN BRIEF. This is the final campaign strategy that will be presented to executives and stakeholders.

CRITICAL: Base your strategy on the SPECIFIC DETAILS from the original campaign brief. Do NOT use generic templates or placeholder content. Reference the actual campaign objectives, target audience, unique selling propositions, and specific requirements mentioned in the brief.

REQUIREMENTS FOR FINAL DELIVERABLE:
1. STRATEGIC OVERVIEW (200+ words): Executive summary, campaign theme, strategic positioning SPECIFIC to this campaign
2. TARGET AUDIENCE ANALYSIS (150+ words): Detailed segmentation based on the brief's target market
3. MESSAGING ARCHITECTURE (100+ words): Primary/secondary messages that address the brief's objectives
4. MEDIA STRATEGY (150+ words): Multi-channel approach tailored to this campaign's goals
5. CONTENT STRATEGY (100+ words): Content pillars relevant to this specific campaign
6. IMPLEMENTATION TIMELINE: Specific phases, milestones, dependencies for THIS campaign
7. SUCCESS METRICS: Quantifiable KPIs relevant to the campaign's objectives
8. BUDGET FRAMEWORK: Resource allocation appropriate for this campaign type
9. RISK MANAGEMENT: Challenges specific to this campaign and industry
10. NEXT STEPS: Immediate actions specific to this campaign's requirements

The deliverable must be comprehensive, actionable, and meet professional PR industry standards. Minimum 1000+ words of substantive strategic content SPECIFIC to the original campaign brief.

Generate a final delivery message that presents this comprehensive campaign plan with authority and detail.
`;

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      const delivery = response.output_text.trim();

      if (!delivery || typeof delivery !== "string") {
        console.warn(
          "⚠️ Final delivery is empty or not a string, using fallback"
        );
        return "Comprehensive campaign strategy has been generated. Please check the deliverables panel for full details.";
      }

      console.log(
        `✅ PR Manager generated comprehensive final delivery via Responses API: ${delivery.substring(
          0,
          100
        )}...`
      );
      return delivery;
    } catch (error) {
      console.error(
        "❌ PR Manager Responses API final delivery generation failed:",
        error
      );
      return "Final delivery message unavailable - please retry";
    }
  }

  async generateCampaignConclusion(campaignContext, finalStrategy) {
    try {
      console.log(
        `🔄 PR Manager generating campaign conclusion via Responses API...`
      );

      const prompt = `
Campaign Context:
- Type: ${campaignContext.campaignType || "general_campaign"}
- Urgency: ${campaignContext.urgency || "medium"}
- Target Market: ${campaignContext.targetMarket || "general market"}
- Focus Areas: ${
        campaignContext.focusAreas && Array.isArray(campaignContext.focusAreas)
          ? campaignContext.focusAreas.join(", ")
          : "general focus"
      }

Final Strategy: ${JSON.stringify(finalStrategy, null, 2)}

Generate a campaign conclusion that:
1. Thanks the team for collaborative work
2. Summarizes the strategic approach created
3. Provides implementation timeline recommendations
4. Sets success metrics and next steps

Keep it executive-level and action-oriented.
`;

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      const conclusion = response.output_text.trim();

      if (!conclusion || typeof conclusion !== "string") {
        console.warn("⚠️ Conclusion is empty or not a string, using fallback");
        return "Campaign strategy has been finalized. Implementation can begin immediately.";
      }

      console.log(
        `✅ PR Manager generated conclusion via Responses API: ${conclusion.substring(
          0,
          100
        )}...`
      );
      return conclusion;
    } catch (error) {
      console.error(
        "❌ PR Manager Responses API conclusion generation failed:",
        error
      );
      return "Campaign conclusion unavailable - please retry";
    }
  }

  async synthesizeComprehensiveStrategy(allPhaseData) {
    try {
      console.log(
        `🔄 PR Manager synthesizing comprehensive strategy via Responses API...`
      );

      const prompt = `
You are the PR Manager responsible for creating the final comprehensive campaign strategy. You must synthesize ALL the insights from your team into a detailed, professional-grade strategic deliverable.

TEAM INSIGHTS TO SYNTHESIZE:

RESEARCH INSIGHTS:
${JSON.stringify(allPhaseData.researchInsights, null, 2)}

TRENDING ANALYSIS:
${JSON.stringify(allPhaseData.trendingAnalysis, null, 2)}

STORY ANGLES:
${JSON.stringify(allPhaseData.storyAngles, null, 2)}

COLLABORATIVE INPUTS:
${JSON.stringify(allPhaseData.collaborativeInputs, null, 2)}

REQUIREMENTS:
Create a comprehensive campaign strategy that includes:

1. STRATEGIC OVERVIEW: Campaign theme, positioning, executive summary
2. TARGET AUDIENCE: Demographics, psychographics, motivations, pain points
3. MESSAGING ARCHITECTURE: Primary/secondary messages, proof points, tone
4. MEDIA STRATEGY: Channels, content types, timing, reach/frequency
5. CONTENT STRATEGY: Content pillars, deliverables, calendar framework
6. IMPLEMENTATION TIMELINE: Phases, milestones, dependencies
7. SUCCESS METRICS: KPIs with specific targets and benchmarks
8. BUDGET FRAMEWORK: Resource allocation across activities
9. RISK MANAGEMENT: Challenges, mitigation strategies, contingencies
10. NEXT STEPS: Immediate, short-term, long-term actions

CRITICAL: Base everything on the actual data provided. Do NOT use generic placeholders or templates. Extract real insights from the team's work and synthesize them into a cohesive, actionable strategy.

The strategy must be comprehensive (1000+ words), specific to this campaign, and ready for executive presentation.
`;

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      const strategy = response.output_text.trim();

      console.log(
        `✅ PR Manager synthesized comprehensive strategy: ${strategy.strategicOverview.campaignTheme}`
      );
      return strategy;
    } catch (error) {
      console.error(
        "❌ PR Manager comprehensive strategy synthesis failed:",
        error
      );
      throw error;
    }
  }
}

module.exports = PRManagerAgent;
