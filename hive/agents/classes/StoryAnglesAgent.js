const BaseAgent = require('./BaseAgent');

class StoryAnglesAgent extends BaseAgent {
  constructor(options = {}) {
    super('story', {
      model: options.model || process.env.STORY_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-2024-08-06',
      temperature: options.temperature ?? (parseFloat(process.env.STORY_TEMPERATURE) || 0.4),
      maxTokens: options.maxTokens ?? (parseInt(process.env.STORY_MAX_TOKENS) || parseInt(process.env.OPENAI_MAX_TOKENS) || 2000),
      promptFile: 'story_angles_headlines_gpt.md',
      orchestrationType: options.orchestrationType
    });
    
    this.name = "Story Angles & Headlines GPT";
    this.timeout = parseInt(process.env.STORY_TIMEOUT) || parseInt(process.env.OPENAI_TIMEOUT) || 30000;

    console.log(
      `✍️ ${this.name}: Initialized with model ${this.model} and temperature ${this.temperature}${this.isOrchestrationAware() ? ` for ${this.orchestrationType.toUpperCase()} orchestration` : ''}. System prompt will be loaded on demand.`
    );
  }

  // Delay utility method (for backward compatibility)
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async generateStoryAngles(campaignBrief, researchInsights, trendingData) {
    // Simulate processing time
    const delayDuration = parseInt(process.env.STORY_DELAY) || 4000;
    await this.delay(delayDuration);

    // Use OpenAI API with system prompt to generate story angles dynamically
    const storyAngles = await this.createStoryAnglesUsingPrompt(
      campaignBrief,
      researchInsights,
      trendingData
    );

    return {
      agent: this.name,
      timestamp: new Date().toISOString(),
      phase: "story",
      storyAngles: storyAngles,
      nextPhase: "collaborative",
    };
  }

  async createStoryAnglesUsingPrompt(
    campaignBrief,
    researchInsights,
    trendingData
  ) {
    const workflowLabel = this.getWorkflowLabel();
    const workflowType = this.getWorkflowType();
    
    try {
      console.log(
        `🔄 ${this.name}: Creating story angles for ${workflowType}...`
      );

      // Orchestration-aware prompt
      const prompt = `
${workflowLabel.toUpperCase()} BRIEF: ${campaignBrief}

RESEARCH INSIGHTS: ${JSON.stringify(researchInsights, null, 2)}

TRENDING DATA: ${JSON.stringify(trendingData, null, 2)}

MESSAGE TYPE: story_development

Generate the appropriate response based on your conversation scenarios in your system prompt, tailored for ${workflowType} objectives within ${this.orchestrationType ? this.orchestrationType.toUpperCase() : 'GENERIC'} orchestration.
`;

      // Use BaseAgent's orchestration-aware chat method
      const responseContent = await this.chat(prompt, {
        workflowType,
        orchestrationType: this.orchestrationType,
        messageType: 'story_development'
      });

      // Return raw output - let centralized prompt handle structure
      const storyAngles = {
        storyStrategy: responseContent,
        lastUpdated: new Date().toISOString(),
      };

      console.log(
        `✅ ${this.name}: Generated structured story strategy via Responses API`
      );
      return storyAngles;
    } catch (error) {
      console.error(
        `❌ ${this.name}: Responses API story creation failed:`,
        error
      );
      // NO HARD-CODED FALLBACK - return minimal structure
      return {
        storyStrategy: "Story development failed - please retry",
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  extractStoryAnglesFromText(content) {
    // Extract structured data from unstructured text response
    return {
      primaryAngle: {
        angle: "Dynamic story angle",
        narrative: content.substring(0, 200) + "...",
        emotionalHook: "Generated from OpenAI analysis",
        proofPoints: ["Dynamic analysis"],
      },
      supportingAngles: [
        {
          angle: "Supporting angle",
          narrative: "Generated dynamically",
          target: "Dynamic target",
        },
      ],
      headlines: ["Dynamic headline generated"],
      keyMessages: ["Dynamic message generated"],
      lastUpdated: new Date().toISOString(),
    };
  }

  async collaborativeInput(previousPhases) {
    await this.delay(2000);

    const research = previousPhases.research?.insights;
    const trends = previousPhases.trending?.trends;
    const story = previousPhases.story?.storyAngles;

    if (!research || !trends || !story) {
      return {
        agent: this.name,
        contribution:
          "Unable to provide collaborative input without complete phase data.",
        finalRecommendations: [],
      };
    }

    try {
      console.log(
        `🔄 ${this.name}: Generating collaborative input via Responses API...`
      );

      const prompt = `
You are ${this.name} in a collaborative PR strategy session.

YOUR STORY ANGLES:
${JSON.stringify(story, null, 2)}

OTHER AGENTS' FINDINGS:
- Research Insights: ${JSON.stringify(research, null, 2)}
- Trending Analysis: ${JSON.stringify(trends, null, 2)}

Based on ALL the insights gathered, provide your collaborative contribution that:
1. Shows how your story angles synthesize audience insights and trends
2. Highlights the strategic narrative that ties everything together
3. Provides specific recommendations for campaign execution
4. References specific angles, headlines, and emotional hooks

Be concise but strategic. Connect your creative angles to measurable outcomes.
`;

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      // Return the raw response text instead of trying to parse as JSON
      console.log(`✅ ${this.name}: Generated dynamic collaborative input`);

      return {
        agent: this.name,
        contribution: response.output_text.trim(),
        finalRecommendations: [],
        campaignTheme: "Campaign theme provided in contribution",
        emotionalCore: "Emotional positioning provided in contribution",
        strategicAlignment: "Strategic alignment provided in contribution",
      };
    } catch (error) {
      console.error(
        `❌ ${this.name}: Collaborative input generation failed:`,
        error
      );

      // Return minimal fallback only on complete failure
      return {
        agent: this.name,
        contribution: `Based on my story angle development, I've created narratives that bridge audience insights with trending opportunities.`,
        finalRecommendations: [],
        campaignTheme: "Campaign theme requires further synthesis.",
        emotionalCore: "Emotional positioning needs refinement.",
        strategicAlignment: "Strategic alignment pending full analysis.",
      };
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async generateConversationResponse(context, messageType, data = null) {
    const workflowLabel = this.getWorkflowLabel();
    const workflowType = this.getWorkflowType();
    
    // Use orchestration-aware context
    const {
      campaignType,
      targetMarket,
      targetIndustry,
      brandContext,
      focusAreas,
      urgency,
      originalBrief,
    } = context;

    // Create orchestration-aware context
    const campaignContext = originalBrief
      ? `${workflowLabel.toUpperCase()} BRIEF: ${originalBrief}`
      : `${workflowLabel} Type: ${campaignType} in ${targetIndustry} targeting ${targetMarket}. Brand context: ${brandContext}.`;

    // Create orchestration-aware prompt
    const prompt = `
${campaignContext}

MESSAGE TYPE: ${messageType}
${data ? `DATA: ${JSON.stringify(data, null, 2)}` : ""}

Generate the appropriate response based on your conversation scenarios in your system prompt, tailored for ${workflowType} objectives within ${this.orchestrationType ? this.orchestrationType.toUpperCase() : 'GENERIC'} orchestration.
`;

    try {
      // Use BaseAgent's orchestration-aware chat method
      return await this.chat(prompt, {
        workflowType,
        orchestrationType: this.orchestrationType,
        messageType
      });
    } catch (error) {
      console.error(
        `[${this.name}] Conversation generation failed:`,
        error.message
      );

      // Orchestration-aware minimal fallback
      const workflowLabel = this.getWorkflowLabel();
      return `I'll be developing compelling story angles and headlines for this ${workflowLabel.toLowerCase()} using creative storytelling techniques within ${this.orchestrationType ? this.orchestrationType.toUpperCase() : 'GENERIC'} orchestration.`;
    }
  }
}

module.exports = StoryAnglesAgent;
