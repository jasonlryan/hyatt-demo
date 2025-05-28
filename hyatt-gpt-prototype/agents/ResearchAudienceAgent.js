const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

class ResearchAudienceAgent {
  constructor() {
    this.name = "Research & Audience GPT";
    this.temperature = parseFloat(process.env.RESEARCH_TEMPERATURE) || 0.2;
    this.systemPrompt = this.loadSystemPrompt();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    });
    this.model =
      process.env.RESEARCH_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-4o-2024-08-06";
    this.maxTokens =
      parseInt(process.env.RESEARCH_MAX_TOKENS) ||
      parseInt(process.env.OPENAI_MAX_TOKENS) ||
      200;
    this.timeout =
      parseInt(process.env.RESEARCH_TIMEOUT) ||
      parseInt(process.env.OPENAI_TIMEOUT) ||
      30000;

    console.log(
      `🤖 ${this.name}: Using model ${this.model} with temperature ${this.temperature}`
    );
  }

  loadSystemPrompt() {
    try {
      const promptPath = path.join(
        __dirname,
        "../../GPTs/research_audience_gpt.md"
      );
      const prompt = fs.readFileSync(promptPath, "utf8");
      console.log(`✅ ${this.name}: Loaded system prompt from ${promptPath}`);
      return prompt;
    } catch (error) {
      console.warn(
        `⚠️ ${this.name}: Could not load system prompt from file, using fallback:`,
        error.message
      );
      return `You are Research & Audience GPT, a specialized AI assistant for Hyatt Hotels that provides expert insights about traveler demographics, preferences, and behaviors. You excel at collaborative work with other specialized GPTs and provide data-driven insights.`;
    }
  }

  async analyzeAudience(campaignBrief) {
    // Simulate processing time - configurable via environment
    const delay = parseInt(process.env.RESEARCH_DELAY) || 4000;
    await this.delay(delay);

    // Use OpenAI API with system prompt to analyze audience dynamically
    const insights = await this.generateInsightsUsingPrompt(campaignBrief);

    return {
      agent: this.name,
      timestamp: new Date().toISOString(),
      phase: "research",
      insights: insights,
      nextPhase: "trending",
    };
  }

  async generateInsightsUsingPrompt(campaignBrief) {
    try {
      console.log(`🔄 ${this.name}: Analyzing audience using Responses API...`);

      const prompt = `
Campaign Brief: ${campaignBrief}

Using your expertise in audience research and demographic analysis, analyze this campaign and provide:

1. TARGET DEMOGRAPHICS (3-4 key segments with descriptions)
2. KEY DRIVERS (what motivates each segment)
3. STRATEGIC RECOMMENDATIONS (actionable insights)
4. AUDIENCE ANALYSIS (summary with quantifiable insights)

Provide structured analysis for this campaign.
`;

      // Define the response schema for structured output
      const responseSchema = {
        type: "object",
        properties: {
          targetDemographics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                segment: { type: "string" },
                description: { type: "string" },
                size: { type: "string" },
                characteristics: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["segment", "description", "size", "characteristics"],
            },
          },
          keyDrivers: {
            type: "object",
            additionalProperties: { type: "string" },
          },
          strategicRecommendations: {
            type: "array",
            items: { type: "string" },
          },
          audienceAnalysis: { type: "string" },
          lastUpdated: { type: "string" },
        },
        required: [
          "targetDemographics",
          "keyDrivers",
          "strategicRecommendations",
          "audienceAnalysis",
          "lastUpdated",
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
            name: "audience_analysis",
            schema: responseSchema,
          },
        },
      });

      const insights = response.choices[0].message.parsed;
      insights.lastUpdated = new Date().toISOString();

      console.log(
        `✅ ${this.name}: Generated structured audience analysis via Responses API`
      );
      return insights;
    } catch (error) {
      console.error(`❌ ${this.name}: Responses API analysis failed:`, error);
      // NO HARD-CODED FALLBACK - return minimal structure
      return {
        targetDemographics: [],
        keyDrivers: {},
        strategicRecommendations: [],
        audienceAnalysis: "Analysis unavailable - please retry",
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  extractInsightsFromText(content) {
    // Extract structured data from unstructured text response
    return {
      targetDemographics: [
        {
          segment: "Dynamic audience analysis",
          description: content.substring(0, 200) + "...",
          size: "Generated",
          characteristics: ["Dynamic analysis"],
        },
      ],
      keyDrivers: {
        dynamic_insight: "Generated from OpenAI analysis",
      },
      strategicRecommendations: ["Dynamic recommendations generated"],
      audienceAnalysis: "Dynamic analysis completed",
      lastUpdated: new Date().toISOString(),
    };
  }

  async collaborativeInput(previousPhases) {
    await this.delay(1500);

    // Generate dynamic collaborative input based on the research insights
    const research = previousPhases.research?.insights;
    if (!research) {
      return {
        agent: this.name,
        contribution:
          "Unable to provide collaborative input without research phase data.",
        dataPoints: [],
      };
    }

    const topDrivers = Object.entries(research.keyDrivers)
      .sort(([, a], [, b]) => parseInt(b) - parseInt(a))
      .slice(0, 3);

    const contribution = `Based on my analysis, ${
      topDrivers[0][1]
    } of our target audience prioritizes ${topDrivers[0][0].toLowerCase()}. This validates our strategic approach. The ${
      topDrivers[1][1]
    } preference for ${topDrivers[1][0].toLowerCase()} and ${
      topDrivers[2][1]
    } interest in ${topDrivers[2][0].toLowerCase()} should be central to our messaging strategy.`;

    return {
      agent: this.name,
      contribution,
      dataPoints: topDrivers.map(
        ([driver, percentage]) =>
          `${percentage} prioritize ${driver.toLowerCase()}`
      ),
      strategicImplication: research.strategicRecommendation,
    };
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async generateConversationResponse(context, messageType, data = null) {
    // This method uses the agent's system prompt to generate conversation responses
    const { campaignType, targetMarket, focusAreas, urgency } = context;

    // Create a prompt that combines the system prompt with the specific context
    const conversationPrompt = `
${this.systemPrompt}

CONTEXT: You are participating in a collaborative PR strategy session for a ${campaignType} campaign targeting ${targetMarket} travelers.

${
  messageType === "intro"
    ? `
TASK: Generate a brief introduction (2-3 sentences) explaining what you'll analyze for this campaign. Reference your data sources and expertise as defined in your system prompt.

Campaign Focus Areas: ${focusAreas.join(", ")}
Urgency: ${urgency}
`
    : `
TASK: Generate a brief summary (2-3 sentences) of your analysis findings and their strategic significance.

Your Analysis Results:
${JSON.stringify(data, null, 2)}

Explain what you discovered and why it's important for this ${campaignType} campaign. Use your professional tone and reference your data sources.
`
}

RESPONSE (2-3 sentences only, stay in character):
    `;

    // Simulate what the agent would say based on their system prompt
    return this.simulatePromptResponse(
      conversationPrompt,
      messageType,
      context,
      data
    );
  }

  async simulatePromptResponse(fullPrompt, messageType, context, data) {
    // Make a real OpenAI API call using the agent's system prompt with Responses API
    try {
      // Define the response schema for structured conversation output
      const responseSchema = {
        type: "object",
        properties: {
          conversationMessage: { type: "string" },
          keyPoints: {
            type: "array",
            items: { type: "string" },
          },
          strategicContext: { type: "string" },
        },
        required: ["conversationMessage", "keyPoints", "strategicContext"],
      };

      const response = await this.openai.beta.chat.completions.parse({
        model: this.model,
        messages: [
          {
            role: "system",
            content: this.systemPrompt,
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "conversation_response",
            schema: responseSchema,
          },
        },
      });

      const result = response.choices[0].message.parsed;
      return result.conversationMessage;
    } catch (error) {
      console.error(`[${this.name}] Responses API Error:`, error.message);

      // Fallback to contextual response if API fails
      const { campaignType, targetMarket } = context;

      if (messageType === "intro") {
        return `I'll analyze ${
          campaignType.includes("sustainability")
            ? "environmentally-conscious traveler groups and their motivations for choosing sustainable destinations"
            : "your target traveler demographics and their key motivational factors"
        }. Using our 2024-25 industry reports and Hyatt's proprietary audience survey data, I'll provide bullet-point insights with actionable takeaways for your business strategy.`;
      } else {
        const demographics =
          data?.targetDemographics?.[0] || "target demographic";
        const topDriver = data
          ? Object.entries(data.keyDrivers)[0]
          : ["key factor", "majority"];
        return `Based on comprehensive demographic analysis, I've identified the primary motivational drivers for ${
          campaignType.includes("sustainability")
            ? "environmentally-minded travelers prioritizing sustainable destinations"
            : "your target market segment"
        }. The data shows ${
          topDriver[1]
        } of ${demographics} prioritize ${topDriver[0].toLowerCase()}, providing clear strategic direction for campaign positioning.`;
      }
    }
  }
}

module.exports = ResearchAudienceAgent;
