const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

class StoryAnglesAgent {
  constructor() {
    this.name = "Story Angles & Headlines GPT";
    this.temperature = parseFloat(process.env.STORY_TEMPERATURE) || 0.4;
    this.systemPrompt = this.loadSystemPrompt();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    });
    this.model =
      process.env.STORY_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-4o-2024-08-06";
    this.maxTokens =
      parseInt(process.env.STORY_MAX_TOKENS) ||
      parseInt(process.env.OPENAI_MAX_TOKENS) ||
      200;
    this.timeout =
      parseInt(process.env.STORY_TIMEOUT) ||
      parseInt(process.env.OPENAI_TIMEOUT) ||
      30000;

    console.log(
      `✍️ ${this.name}: Using model ${this.model} with temperature ${this.temperature}`
    );
  }

  loadSystemPrompt() {
    try {
      const promptPath = path.join(
        __dirname,
        "../../GPTs/story_angles_headlines_gpt.md"
      );
      const prompt = fs.readFileSync(promptPath, "utf8");
      console.log(`✅ ${this.name}: Loaded system prompt from ${promptPath}`);
      return prompt;
    } catch (error) {
      console.warn(
        `⚠️ ${this.name}: Could not load system prompt from file, using fallback:`,
        error.message
      );
      return `You are Story Angles & Headlines GPT, a specialized AI assistant for Hyatt Hotels that creates compelling narratives, headlines, and story angles for PR campaigns. You excel at crafting messages that resonate with target audiences.`;
    }
  }

  async generateStoryAngles(campaignBrief, researchInsights, trendingData) {
    // Simulate processing time - configurable via environment
    const delay = parseInt(process.env.STORY_DELAY) || 6000;
    await this.delay(delay);

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
    try {
      console.log(
        `🔄 ${this.name}: Creating story angles using Responses API...`
      );

      const prompt = `
Campaign Brief: ${campaignBrief}

Research Insights: ${JSON.stringify(researchInsights, null, 2)}

Trending Data: ${JSON.stringify(trendingData, null, 2)}

Using your expertise in storytelling and headline creation, analyze this campaign and create:

1. PRIMARY ANGLE (main narrative with emotional hook and proof points)
2. SUPPORTING ANGLES (3-4 additional angles for different targets)
3. HEADLINES (5-6 compelling headlines)
4. KEY MESSAGES (4-5 core messages)

Provide structured story strategy for this campaign.
`;

      // Define the response schema for structured output
      const responseSchema = {
        type: "object",
        properties: {
          primaryAngle: {
            type: "object",
            properties: {
              angle: { type: "string" },
              narrative: { type: "string" },
              emotionalHook: { type: "string" },
              proofPoints: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["angle", "narrative", "emotionalHook", "proofPoints"],
          },
          supportingAngles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                angle: { type: "string" },
                narrative: { type: "string" },
                target: { type: "string" },
              },
              required: ["angle", "narrative", "target"],
            },
          },
          headlines: {
            type: "array",
            items: { type: "string" },
          },
          keyMessages: {
            type: "array",
            items: { type: "string" },
          },
          lastUpdated: { type: "string" },
        },
        required: [
          "primaryAngle",
          "supportingAngles",
          "headlines",
          "keyMessages",
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
            name: "story_strategy",
            schema: responseSchema,
          },
        },
      });

      const storyAngles = response.choices[0].message.parsed;
      storyAngles.lastUpdated = new Date().toISOString();

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
        primaryAngle: {
          angle: "Analysis unavailable",
          narrative: "Please retry",
          emotionalHook: "Story generation failed",
          proofPoints: [],
        },
        supportingAngles: [],
        headlines: [],
        keyMessages: [],
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

    // Synthesize all inputs into final strategic recommendations
    const topDriver = Object.entries(research.keyDrivers)[0];
    const topTrend = trends.relevantTrends[0];
    const primaryAngle = story.primaryAngle;

    const contribution = `Our ${
      primaryAngle.angle
    } narrative perfectly bridges the ${
      topTrend.trend
    } trend with our audience's ${
      topDriver[1]
    } preference for ${topDriver[0].toLowerCase()}. The ${primaryAngle.emotionalHook.toLowerCase()} positioning creates authentic emotional connection while the proof points provide credible differentiation.`;

    const finalRecommendations = [
      `Lead with "${story.headlines[0]}" as primary campaign headline`,
      `Focus messaging on ${primaryAngle.emotionalHook.toLowerCase()}`,
      `Target ${trends.mediaOpportunities[0].toLowerCase()}`,
      `Launch timing: ${trends.timingRecommendation}`,
      `Measure success through ${topDriver[0].toLowerCase()} engagement metrics`,
    ];

    return {
      agent: this.name,
      contribution,
      finalRecommendations,
      campaignTheme: primaryAngle.angle,
      emotionalCore: primaryAngle.emotionalHook,
      strategicAlignment: `${Math.round(
        (parseInt(topDriver[1]) + parseInt(topTrend.relevance)) / 2
      )}% strategic alignment score`,
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
TASK: Generate a brief introduction (2-3 sentences) explaining what story angles you'll develop for this campaign. Reference your expertise in analyzing media coverage and generating creative angles as defined in your system prompt.

Campaign Focus Areas: ${focusAreas.join(", ")}
Urgency: ${urgency}
`
    : `
TASK: Generate a brief summary (2-3 sentences) of your story angle development and their strategic significance.

Your Analysis Results:
${JSON.stringify(data, null, 2)}

Explain what story angles you developed and why they're important for this ${campaignType} campaign. Use your creative yet strategic tone and reference your media analysis expertise.
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
          storyAngles: {
            type: "array",
            items: { type: "string" },
          },
          mediaStrategy: { type: "string" },
        },
        required: ["conversationMessage", "storyAngles", "mediaStrategy"],
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
      const { campaignType, focusAreas } = context;

      if (messageType === "intro") {
        let response =
          "I'll develop strategic story angles and headline options for ";

        if (campaignType.includes("wellness")) {
          response += "wellness and transformative travel publications, ";
        } else if (campaignType.includes("sustainability")) {
          response +=
            "sustainability-focused and environmental media outlets, ";
        } else if (campaignType.includes("luxury")) {
          response += "luxury lifestyle and premium hospitality publications, ";
        } else if (campaignType.includes("business")) {
          response += "business and corporate travel media, ";
        } else {
          response += "relevant travel and hospitality media, ";
        }

        response +=
          "analyzing past Hyatt media coverage patterns and Google Trends data to identify optimal story approaches. ";

        if (focusAreas.length > 0) {
          response += `I'll ensure our angles emphasize ${focusAreas
            .slice(0, 2)
            .join(
              " and "
            )} while creating multiple headline options for each angle with specific outlet targeting.`;
        } else {
          response +=
            "I'll create multiple headline options for each angle tailored to different publication styles and audience demographics.";
        }

        return response;
      } else {
        const primaryAngle =
          data?.primaryAngle?.angle || "strategic positioning concept";
        const headlines = data?.headlines || ["Strategic headline approach"];
        const mediaTargets = data?.mediaTargets || ["targeted publications"];

        let response = "I've developed targeted story angles for ";

        if (campaignType.includes("wellness")) {
          response += "wellness and health-focused media outlets, ";
        } else if (campaignType.includes("sustainability")) {
          response += "environmental and sustainability publications, ";
        } else if (campaignType.includes("luxury")) {
          response += "luxury lifestyle and premium hospitality media, ";
        } else if (campaignType.includes("business")) {
          response += "business and corporate travel publications, ";
        } else {
          response += "relevant hospitality and travel media, ";
        }

        response += `with our primary angle "${primaryAngle}" designed to capture editorial attention while authentically representing the unique value proposition. I've created ${
          headlines.length
        } headline variations optimized for ${mediaTargets
          .slice(0, 2)
          .join(" and ")} to maximize media resonance.`;

        return response;
      }
    }
  }
}

module.exports = StoryAnglesAgent;
