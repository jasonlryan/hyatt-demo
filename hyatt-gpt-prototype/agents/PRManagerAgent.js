const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

class PRManagerAgent {
  constructor() {
    this.name = "PR Manager";
    this.systemPrompt = this.loadSystemPrompt();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.PR_MANAGER_MODEL || "gpt-4o-mini-2024-07-18";
    this.temperature = parseFloat(process.env.PR_MANAGER_TEMPERATURE) || 0.7;
    this.maxTokens = parseInt(process.env.PR_MANAGER_MAX_TOKENS) || 2000;
    this.timeout = parseInt(process.env.PR_MANAGER_TIMEOUT) || 30000;

    console.log(`🤖 PR Manager Agent initialized with model: ${this.model}`);
  }

  loadSystemPrompt() {
    try {
      const promptPath = path.join(__dirname, "../../GPTs/pr_manager_gpt.md");
      const prompt = fs.readFileSync(promptPath, "utf8");
      console.log(`✅ Loaded PR Manager system prompt from ${promptPath}`);
      return prompt;
    } catch (error) {
      console.error("❌ Failed to load PR Manager system prompt:", error);
      return "You are an expert PR Manager specializing in hospitality campaigns.";
    }
  }

  async generateCampaignIntroduction(campaignBrief, campaignContext) {
    try {
      console.log(
        `🔄 PR Manager generating campaign introduction via Responses API...`
      );

      const prompt = `
Campaign Brief: ${campaignBrief}

Campaign Context:
- Type: ${campaignContext.campaignType}
- Urgency: ${campaignContext.urgency}
- Target Market: ${campaignContext.targetMarket}
- Focus Areas: ${campaignContext.focusAreas.join(", ")}

Generate a campaign introduction that sets the strategic direction for the team and directs the Research & Audience agent to begin analysis. Be specific about what insights we need based on this campaign type and context.
`;

      // Define the response schema for structured output
      const responseSchema = {
        type: "object",
        properties: {
          introduction: { type: "string" },
          strategicDirection: { type: "string" },
          researchDirectives: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["introduction", "strategicDirection", "researchDirectives"],
      };

      const response = await this.openai.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "campaign_introduction",
            schema: responseSchema,
          },
        },
      });

      const result = response.choices[0].message.parsed;
      const introduction = `${result.introduction} ${result.strategicDirection}`;

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
Campaign Context:
- Type: ${campaignContext.campaignType}
- Urgency: ${campaignContext.urgency}
- Target Market: ${campaignContext.targetMarket}
- Focus Areas: ${campaignContext.focusAreas.join(", ")}

Previous Phase Data: ${JSON.stringify(previousData, null, 2)}

Next Phase: ${nextPhase}

Generate a handoff message that:
1. Summarizes key insights from the previous phase
2. Connects those insights to the next phase requirements
3. Provides specific direction for the upcoming analysis
4. Maintains strategic momentum

Keep it concise but strategic.
`;

      // Define the response schema for structured output
      const responseSchema = {
        type: "object",
        properties: {
          handoffMessage: { type: "string" },
          keyInsights: {
            type: "array",
            items: { type: "string" },
          },
          nextPhaseDirectives: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["handoffMessage", "keyInsights", "nextPhaseDirectives"],
      };

      const response = await this.openai.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "handoff_message",
            schema: responseSchema,
          },
        },
      });

      const result = response.choices[0].message.parsed;
      const handoff = result.handoffMessage;

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
Campaign Context:
- Type: ${campaignContext.campaignType}
- Urgency: ${campaignContext.urgency}
- Target Market: ${campaignContext.targetMarket}
- Focus Areas: ${campaignContext.focusAreas.join(", ")}

All Phase Data: ${JSON.stringify(allPhaseData, null, 2)}

Generate a final delivery message that:
1. Synthesizes all agent contributions
2. Highlights strategic alignment and opportunities
3. Emphasizes the integrated nature of the campaign plan
4. Sets expectations for implementation

Keep it professional and results-focused.
`;

      // Define the response schema for structured output
      const responseSchema = {
        type: "object",
        properties: {
          finalDelivery: { type: "string" },
          strategicSynthesis: { type: "string" },
          implementationGuidance: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "finalDelivery",
          "strategicSynthesis",
          "implementationGuidance",
        ],
      };

      const response = await this.openai.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "final_delivery",
            schema: responseSchema,
          },
        },
      });

      const result = response.choices[0].message.parsed;
      const delivery = result.finalDelivery;

      console.log(
        `✅ PR Manager generated final delivery via Responses API: ${delivery.substring(
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
- Type: ${campaignContext.campaignType}
- Urgency: ${campaignContext.urgency}
- Target Market: ${campaignContext.targetMarket}
- Focus Areas: ${campaignContext.focusAreas.join(", ")}

Final Strategy: ${JSON.stringify(finalStrategy, null, 2)}

Generate a campaign conclusion that:
1. Thanks the team for collaborative work
2. Summarizes the strategic approach created
3. Provides implementation timeline recommendations
4. Sets success metrics and next steps

Keep it executive-level and action-oriented.
`;

      // Define the response schema for structured output
      const responseSchema = {
        type: "object",
        properties: {
          conclusion: { type: "string" },
          teamAcknowledgment: { type: "string" },
          implementationTimeline: {
            type: "array",
            items: { type: "string" },
          },
          successMetrics: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "conclusion",
          "teamAcknowledgment",
          "implementationTimeline",
          "successMetrics",
        ],
      };

      const response = await this.openai.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "campaign_conclusion",
            schema: responseSchema,
          },
        },
      });

      const result = response.choices[0].message.parsed;
      const conclusion = result.conclusion;

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
}

module.exports = PRManagerAgent;
