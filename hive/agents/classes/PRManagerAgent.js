const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai");
const orchestrationConfig = require("../../orchestrations/OrchestrationConfig");

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
        this.delayMs = agentConfig.delay || 3000;
        this.enabled = agentConfig.enabled !== false;
      } else {
        // Fallback to environment variables if config not found
        this.model = process.env.PR_MANAGER_MODEL || "gpt-4o-mini-2024-07-18";
        this.temperature =
          parseFloat(process.env.PR_MANAGER_TEMPERATURE) || 0.7;
        this.maxTokens = parseInt(process.env.PR_MANAGER_MAX_TOKENS) || 4000;
        this.timeout = parseInt(process.env.PR_MANAGER_TIMEOUT) || 45000;
        this.delayMs = parseInt(process.env.PR_MANAGER_DELAY) || 3000;
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
      this.delayMs = parseInt(process.env.PR_MANAGER_DELAY) || 3000;
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

  async generateCampaignIntroduction(campaignBrief, campaignContext, orchestrationType = 'hyatt') {
    try {
      console.log(
        `🔄 PR Manager generating campaign introduction via Chat API...`
      );

      // Ensure system prompt is loaded before making API call
      if (!this.systemPrompt) {
        console.log(
          `🔄 ${this.name}: System prompt not loaded, loading now...`
        );
        await this.loadSystemPrompt();
      }

      // Get orchestration configuration
      const orchestration = orchestrationConfig.getOrchestration(orchestrationType);
      if (!orchestration) {
        throw new Error(`Unknown orchestration type: ${orchestrationType}`);
      }

      const workflowDescription = orchestrationConfig.getWorkflowDescription(orchestrationType);
      const nextAgentInfo = orchestrationConfig.getNextAgent(orchestrationType, 'pr-manager');
      
      const prompt = `
CRITICAL INSTRUCTION: You are the PR Manager in the ${orchestration.name} orchestration.

THE ONLY AGENTS IN THIS ORCHESTRATION ARE:
${orchestration.workflow.map(step => `- ${step.name}: ${step.role}`).join('\n')}

DO NOT MENTION ANY OTHER AGENTS THAT ARE NOT LISTED ABOVE.

YOUR NEXT AGENT IS: ${nextAgentInfo ? nextAgentInfo.name : 'None'}
THEIR ROLE IS: ${nextAgentInfo ? nextAgentInfo.role : 'N/A'}

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

GENERATE A CAMPAIGN INTRODUCTION FOLLOWING THESE RULES:
1. Reference specific details from the campaign brief
2. Set strategic direction based on the brief's objectives
3. In your "Next Steps" section, you MUST write: "I am directing the ${nextAgentInfo ? nextAgentInfo.name : 'next agent'} to ${nextAgentInfo ? nextAgentInfo.role : 'proceed with their analysis'}."
4. DO NOT mention "Research & Audience Agent" unless it is specifically listed in the agents above
5. ONLY reference agents that exist in the ${orchestration.name} orchestration

Be specific to THIS campaign - reference the actual campaign details.
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const introduction = response.choices[0].message.content?.trim() || "[No content returned]";

      // Validate response doesn't contain wrong agent references
      if (orchestrationType === 'hive' && introduction.includes('Research & Audience')) {
        console.warn('⚠️  WARNING: Response contains incorrect agent reference for HIVE orchestration');
        console.warn('🔧 Auto-correcting: Research & Audience Agent → Trending News Agent');
        
        // More comprehensive correction
        let correctedIntro = introduction
          .replace(/Research & Audience Agent/g, 'Trending News Agent')
          .replace(/Research & Audience/g, 'Trending News Agent')
          .replace(/Audience analysis and market research/g, 'Analyze current trends and cultural moments');
        
        console.log('✅ Response corrected for HIVE orchestration');
        return correctedIntro;
      }

      console.log(
        `✅ PR Manager generated introduction via Chat API: ${introduction.substring(
          0,
          100
        )}...`
      );
      return introduction;
    } catch (error) {
      console.error(
        "❌ PR Manager Chat API introduction generation failed:",
        error
      );
      return "Campaign introduction unavailable - please retry";
    }
  }

  async generateHandoffMessage(campaignContext, nextPhase, previousData, orchestrationType = 'hyatt') {
    try {
      console.log(
        `🔄 PR Manager generating handoff to ${nextPhase} via Chat API...`
      );

      // Ensure system prompt is loaded before making API call
      if (!this.systemPrompt) {
        console.log(
          `🔄 ${this.name}: System prompt not loaded, loading now...`
        );
        await this.loadSystemPrompt();
      }

      // Get orchestration configuration
      const orchestration = orchestrationConfig.getOrchestration(orchestrationType);
      if (!orchestration) {
        throw new Error(`Unknown orchestration type: ${orchestrationType}`);
      }

      const workflowDescription = orchestrationConfig.getWorkflowDescription(orchestrationType);
      const availableAgents = orchestrationConfig.getWorkflow(orchestrationType)
        .map(step => `${step.name} (${step.role})`)
        .join('\n- ');

      const prompt = `
CRITICAL CONTEXT: You are operating in the ${orchestration.name} orchestration.
Workflow: ${workflowDescription}

AVAILABLE AGENTS IN THIS ORCHESTRATION:
- ${availableAgents}

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
4. Provides specific direction for the ${nextPhase} phase
5. Maintains strategic momentum
6. IMPORTANT: Only reference agents listed above that exist in the ${orchestration.name} workflow

Be specific to THIS campaign - avoid generic language. Reference the actual campaign details.
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const handoff = response.choices[0].message.content?.trim() || "[No content returned]";

      console.log(
        `✅ PR Manager generated handoff via Chat API: ${handoff.substring(
          0,
          100
        )}...`
      );
      return handoff;
    } catch (error) {
      console.error(
        "❌ PR Manager Chat API handoff generation failed:",
        error
      );
      return "Handoff message unavailable - please retry";
    }
  }

  async generateFinalDelivery(campaignContext, allPhaseData, orchestrationType = 'hyatt') {
    try {
      console.log(
        `🔄 PR Manager generating final delivery via Chat API...`
      );

      // Ensure system prompt is loaded before making API call
      if (!this.systemPrompt) {
        console.log(
          `🔄 ${this.name}: System prompt not loaded, loading now...`
        );
        await this.loadSystemPrompt();
      }

      // Get orchestration configuration
      const orchestration = orchestrationConfig.getOrchestration(orchestrationType);
      if (!orchestration) {
        throw new Error(`Unknown orchestration type: ${orchestrationType}`);
      }

      const workflowDescription = orchestrationConfig.getWorkflowDescription(orchestrationType);

      const prompt = `
ORCHESTRATION: ${orchestration.name}
Workflow: ${workflowDescription}

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

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const delivery = response.choices[0].message.content?.trim() || "[No content returned]";

      if (!delivery || typeof delivery !== "string") {
        console.warn(
          "⚠️ Final delivery is empty or not a string, using fallback"
        );
        return "Comprehensive campaign strategy has been generated. Please check the deliverables panel for full details.";
      }

      console.log(
        `✅ PR Manager generated comprehensive final delivery via Chat API: ${delivery.substring(
          0,
          100
        )}...`
      );
      return delivery;
    } catch (error) {
      console.error(
        "❌ PR Manager Chat API final delivery generation failed:",
        error
      );
      return "Final delivery message unavailable - please retry";
    }
  }

  async generateCampaignConclusion(campaignContext, finalStrategy, orchestrationType = 'hyatt') {
    try {
      console.log(
        `🔄 PR Manager generating campaign conclusion via Chat API...`
      );

      // Get orchestration configuration
      const orchestration = orchestrationConfig.getOrchestration(orchestrationType);
      if (!orchestration) {
        throw new Error(`Unknown orchestration type: ${orchestrationType}`);
      }

      const prompt = `
Orchestration: ${orchestration.name}

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

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const conclusion = response.choices[0].message.content?.trim() || "[No content returned]";

      if (!conclusion || typeof conclusion !== "string") {
        console.warn("⚠️ Conclusion is empty or not a string, using fallback");
        return "Campaign strategy has been finalized. Implementation can begin immediately.";
      }

      console.log(
        `✅ PR Manager generated conclusion via Chat API: ${conclusion.substring(
          0,
          100
        )}...`
      );
      return conclusion;
    } catch (error) {
      console.error(
        "❌ PR Manager Chat API conclusion generation failed:",
        error
      );
      return "Campaign conclusion unavailable - please retry";
    }
  }

  async synthesizeComprehensiveStrategy(allPhaseData, orchestrationType = 'hyatt') {
    try {
      console.log(
        `🔄 PR Manager synthesizing comprehensive strategy via Chat API...`
      );

      // Get orchestration configuration
      const orchestration = orchestrationConfig.getOrchestration(orchestrationType);
      if (!orchestration) {
        throw new Error(`Unknown orchestration type: ${orchestrationType}`);
      }

      const workflowDescription = orchestrationConfig.getWorkflowDescription(orchestrationType);

      const prompt = `
You are the PR Manager in the ${orchestration.name} orchestration.
Workflow: ${workflowDescription}

You are responsible for creating the final comprehensive campaign strategy. You must synthesize ALL the insights from your team into a detailed, professional-grade strategic deliverable.

TEAM INSIGHTS TO SYNTHESIZE:

RESEARCH INSIGHTS:
${JSON.stringify(allPhaseData.researchInsights, null, 2)}

TRENDING ANALYSIS:
${JSON.stringify(allPhaseData.trendingAnalysis, null, 2)}

STORY ANGLES:
${JSON.stringify(allPhaseData.storyAngles, null, 2)}

COLLABORATIVE INPUTS:
${JSON.stringify(allPhaseData.collaborativeInputs, null, 2)}

ORCHESTRATION TYPE: ${orchestrationType}

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

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const strategy = response.choices[0].message.content?.trim() || "[No content returned]";

      console.log(
        `✅ PR Manager synthesized comprehensive strategy via Chat API`
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
