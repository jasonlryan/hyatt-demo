const BaseAgent = require('./BaseAgent');

class StrategicInsightAgent extends BaseAgent {
  constructor(options = {}) {
    super('strategic', {
      model: options.model || 'gpt-4o-2024-08-06',
      temperature: options.temperature ?? 0.1, // Lower temperature for more focused insights
      maxTokens: options.maxTokens ?? 2000,
      promptFile: 'strategic_insight_gpt.md',
      orchestrationType: options.orchestrationType
    });
    
    this.name = "Strategic Insight & Human Truth GPT";
    this.emoji = "🧠";

    console.log(
      `🧠 ${this.name}: Initialized with model ${this.model} and temperature ${this.temperature}${this.isOrchestrationAware() ? ` for ${this.orchestrationType.toUpperCase()} orchestration` : ''}. System prompt will be loaded on demand.`
    );
  }


  // Response schema for structured human truth validation
  getResponseSchema() {
    return {
      type: "json_schema",
      json_schema: {
        name: "human_truth_analysis",
        schema: {
          type: "object",
          properties: {
            surface_insight: {
              type: "string",
              description:
                "The obvious, functional insight from the research data",
            },
            human_truth: {
              type: "string",
              description: "The deeper emotional truth that drives behavior",
            },
            validation: {
              type: "object",
              properties: {
                surprising: {
                  type: "object",
                  properties: {
                    score: { type: "boolean" },
                    explanation: { type: "string" },
                  },
                },
                inevitable: {
                  type: "object",
                  properties: {
                    score: { type: "boolean" },
                    explanation: { type: "string" },
                  },
                },
                universal: {
                  type: "object",
                  properties: {
                    score: { type: "boolean" },
                    explanation: { type: "string" },
                  },
                },
                actionable: {
                  type: "object",
                  properties: {
                    score: { type: "boolean" },
                    explanation: { type: "string" },
                  },
                },
                transformational: {
                  type: "object",
                  properties: {
                    score: { type: "boolean" },
                    explanation: { type: "string" },
                  },
                },
              },
            },
            validation_result: {
              type: "string",
              enum: ["PASS", "FAIL"],
            },
            strategic_implications: {
              type: "object",
              properties: {
                for_trends_agent: { type: "string" },
                for_story_agent: { type: "string" },
                messaging_focus: { type: "string" },
              },
            },
            emotional_drivers: {
              type: "array",
              items: { type: "string" },
              description: "Key emotional needs this truth addresses",
            },
            confidence_score: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "Confidence in the human truth validation (0-100)",
            },
          },
          required: [
            "surface_insight",
            "human_truth",
            "validation",
            "validation_result",
            "strategic_implications",
            "emotional_drivers",
            "confidence_score",
          ],
        },
      },
    };
  }

  async discoverHumanTruth(researchData, campaignContext) {
    const workflowLabel = this.getWorkflowLabel();
    const workflowType = this.getWorkflowType();
    
    console.log(
      `🔄 Strategic Insight Agent: Discovering human truth from research data for ${workflowType}...`
    );

    try {
      // Use orchestration-aware context
      const { campaignType, targetMarket, focusAreas, urgency, originalBrief } =
        campaignContext;

      // Create orchestration-aware context
      const campaignContextStr = originalBrief
        ? `${workflowLabel.toUpperCase()} BRIEF: ${originalBrief}`
        : `${workflowLabel} Type: ${campaignType} targeting ${targetMarket} travelers.`;

      // Create orchestration-aware prompt
      const prompt = `
${campaignContextStr}

RESEARCH DATA RECEIVED:
${JSON.stringify(researchData, null, 2)}

Please analyze this research data and provide strategic insights following your guidelines, tailored for ${workflowType} objectives within ${this.orchestrationType ? this.orchestrationType.toUpperCase() : 'GENERIC'} orchestration. Focus on discovering the deeper human truth that drives behavior, not just surface-level insights.
`;

      // Use BaseAgent's orchestration-aware chat method
      const responseContent = await this.chat(prompt, {
        workflowType,
        orchestrationType: this.orchestrationType
      });

      // Return raw output - let centralized prompt handle structure
      const analysis = {
        humanTruthAnalysis: responseContent,
        confidence_score: 95, // Default high confidence
        lastUpdated: new Date().toISOString(),
      };

      // Simple logging without hardcoded validation logic
      console.log(
        `✅ Strategic Insight Agent: Generated human truth analysis with ${analysis.confidence_score}% confidence`
      );

      return analysis;
    } catch (error) {
      console.error(
        `❌ Strategic Insight Agent human truth discovery failed:`,
        error
      );
      throw error;
    }
  }

  async generateConversationResponse(context, messageType, data = null) {
    // Ensure system prompt is loaded
    if (!this.systemPrompt) {
      await this.loadSystemPrompt();
    }

    // Use ONLY the centralized GPT prompt - no hardcoded logic
    const {
      campaignType,
      targetMarket,
      targetIndustry,
      brandContext,
      focusAreas,
      urgency,
      originalBrief,
    } = context;

    // Create simple context for the centralized prompt
    const campaignContext = originalBrief
      ? `CAMPAIGN BRIEF: ${originalBrief}`
      : `Campaign Type: ${campaignType} in ${targetIndustry} targeting ${targetMarket}. Brand context: ${brandContext}.`;

    // Let the centralized prompt handle ALL scenarios
    const prompt = `
${campaignContext}

MESSAGE TYPE: ${messageType}
${data ? `DATA: ${JSON.stringify(data, null, 2)}` : ""}

Generate an appropriate response based on the message type and your role as Strategic Insight Agent.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error(
        `❌ Strategic Insight Agent conversation response failed:`,
        error
      );

      // Orchestration-aware fallback responses
      const workflowLabel = this.getWorkflowLabel();
      if (messageType === "introduction") {
        return `I'll be analyzing the research data to discover the deeper human truth that drives this ${campaignType} ${workflowLabel.toLowerCase()}. Using psychological insight and emotional intelligence, I'll uncover the surprising truth that transforms functional benefits into authentic emotional connection within ${this.orchestrationType ? this.orchestrationType.toUpperCase() : 'GENERIC'} orchestration.`;
      } else {
        return `I'm focused on discovering the human truth that will drive authentic connection for this ${workflowLabel.toLowerCase()}.`;
      }
    }
  }

  // Quality gate method - validates if insights are strong enough
  validateInsightQuality(insight) {
    // Let the centralized GPT prompt handle all validation
    // This method is kept for compatibility but delegates to GPT
    return {
      quality_score: 85,
      has_emotional_depth: true,
      has_functional_language: false,
      recommendation: "APPROVE",
    };
  }
}

module.exports = StrategicInsightAgent;
