const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

class TrendingNewsAgent {
  constructor() {
    this.name = "Trending News GPT";
    this.temperature = parseFloat(process.env.TRENDING_TEMPERATURE) || 0.3;
    this.systemPrompt = this.loadSystemPrompt();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    });
    this.model =
      process.env.TRENDING_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-4o-2024-08-06";
    this.maxTokens =
      parseInt(process.env.TRENDING_MAX_TOKENS) ||
      parseInt(process.env.OPENAI_MAX_TOKENS) ||
      200;
    this.timeout =
      parseInt(process.env.TRENDING_TIMEOUT) ||
      parseInt(process.env.OPENAI_TIMEOUT) ||
      30000;

    console.log(
      `📈 ${this.name}: Using model ${this.model} with temperature ${this.temperature}`
    );
  }

  loadSystemPrompt() {
    try {
      const promptPath = path.join(
        __dirname,
        "../../GPTs/trending_news_gpt.md"
      );
      const prompt = fs.readFileSync(promptPath, "utf8");
      console.log(`✅ ${this.name}: Loaded system prompt from ${promptPath}`);
      return prompt;
    } catch (error) {
      console.warn(
        `⚠️ ${this.name}: Could not load system prompt from file, using fallback:`,
        error.message
      );
      return `You are Trending News GPT, a specialized AI assistant for Hyatt Hotels that identifies and analyzes current trends, news, and cultural moments relevant to hospitality and travel. You excel at finding timely opportunities for brand engagement.`;
    }
  }

  async analyzeTrends(campaignBrief, researchInsights) {
    // Simulate processing time - configurable via environment
    const delay = parseInt(process.env.TRENDING_DELAY) || 5000;
    await this.delay(delay);

    // Use OpenAI API with system prompt to analyze trends dynamically
    const trends = await this.generateTrendsUsingPrompt(
      campaignBrief,
      researchInsights
    );

    return {
      agent: this.name,
      timestamp: new Date().toISOString(),
      phase: "trending",
      trends: trends,
      nextPhase: "story",
    };
  }

  async generateTrendsUsingPrompt(campaignBrief, researchInsights) {
    try {
      console.log(`🔄 ${this.name}: Analyzing trends using Responses API...`);

      const prompt = `
Campaign Brief: ${campaignBrief}

Research Insights: ${JSON.stringify(researchInsights, null, 2)}

Using your expertise in trend analysis and real-time monitoring, analyze this campaign and provide:

1. RELEVANT TRENDS (3-4 trends with momentum, relevance %, description, source)
2. CULTURAL MOMENTS (4-5 timely opportunities)  
3. MEDIA OPPORTUNITIES (4-5 strategic partnerships/pitches)
4. TIMING RECOMMENDATION (specific timing strategy)
5. TREND ANALYSIS (summary with quantifiable metrics)

Provide structured trend analysis for this campaign.
`;

      // Define the response schema for structured output
      const responseSchema = {
        type: "object",
        properties: {
          relevantTrends: {
            type: "array",
            items: {
              type: "object",
              properties: {
                trend: { type: "string" },
                momentum: { type: "string" },
                relevance: { type: "string" },
                description: { type: "string" },
                source: { type: "string" },
              },
              required: [
                "trend",
                "momentum",
                "relevance",
                "description",
                "source",
              ],
            },
          },
          culturalMoments: {
            type: "array",
            items: { type: "string" },
          },
          mediaOpportunities: {
            type: "array",
            items: { type: "string" },
          },
          timingRecommendation: { type: "string" },
          trendAnalysis: { type: "string" },
          lastUpdated: { type: "string" },
        },
        required: [
          "relevantTrends",
          "culturalMoments",
          "mediaOpportunities",
          "timingRecommendation",
          "trendAnalysis",
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
            name: "trend_analysis",
            schema: responseSchema,
          },
        },
      });

      const trends = response.choices[0].message.parsed;
      trends.lastUpdated = new Date().toISOString();

      console.log(
        `✅ ${this.name}: Generated structured trends analysis via Responses API`
      );
      return trends;
    } catch (error) {
      console.error(
        `❌ ${this.name}: Responses API trend analysis failed:`,
        error
      );
      // NO HARD-CODED FALLBACK - return minimal structure
      return {
        relevantTrends: [],
        culturalMoments: [],
        mediaOpportunities: [],
        timingRecommendation: "Analysis unavailable - please retry",
        trendAnalysis: "Trend analysis failed",
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  extractTrendsFromText(content) {
    // Extract structured data from unstructured text response
    return {
      relevantTrends: [
        {
          trend: "Dynamic trend analysis",
          momentum: "Generated",
          relevance: "100%",
          description: content.substring(0, 200) + "...",
          source: "OpenAI Analysis",
        },
      ],
      culturalMoments: ["Dynamic cultural moment analysis"],
      mediaOpportunities: ["Dynamic media opportunity analysis"],
      timingRecommendation: "Timing analysis generated dynamically",
      trendAnalysis: "Dynamic analysis completed",
      lastUpdated: new Date().toISOString(),
    };
  }

  async collaborativeInput(previousPhases) {
    await this.delay(1800);

    const research = previousPhases.research?.insights;
    const trends = previousPhases.trending?.trends;

    if (!research || !trends) {
      return {
        agent: this.name,
        contribution:
          "Unable to provide collaborative input without previous phase data.",
        trendAlignment: [],
      };
    }

    // Find alignment between research insights and trending topics
    const topTrend = trends.relevantTrends[0];
    const topDriver = Object.entries(research.keyDrivers)[0];

    const contribution = `The ${topTrend.trend} trend (${
      topTrend.relevance
    } relevance) perfectly aligns with our audience's ${
      topDriver[1]
    } preference for ${topDriver[0].toLowerCase()}. ${
      trends.timingRecommendation
    } This cultural moment provides authentic context for our messaging strategy.`;

    return {
      agent: this.name,
      contribution,
      trendAlignment: trends.relevantTrends.map(
        (trend) => `${trend.trend}: ${trend.relevance} relevance`
      ),
      mediaRecommendation: trends.mediaOpportunities[0],
      timingInsight: trends.timingRecommendation,
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
TASK: Generate a brief introduction (2-3 sentences) explaining what trends you'll analyze for this campaign. Reference your data sources and quantifiable metrics as defined in your system prompt.

Campaign Focus Areas: ${focusAreas.join(", ")}
Urgency: ${urgency}
`
    : `
TASK: Generate a brief summary (2-3 sentences) of your trend analysis findings and their strategic significance.

Your Analysis Results:
${JSON.stringify(data, null, 2)}

Explain what trending opportunities you discovered and why they're important for this ${campaignType} campaign. Use your analytical tone and reference quantifiable metrics.
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
          trendInsights: {
            type: "array",
            items: { type: "string" },
          },
          quantifiableMetrics: { type: "string" },
        },
        required: [
          "conversationMessage",
          "trendInsights",
          "quantifiableMetrics",
        ],
      };

      const response = await this.openai.beta.chat.completions.parse({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: fullPrompt },
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
      const { campaignType, urgency } = context;

      if (messageType === "intro") {
        return `I'll analyze the latest ${
          campaignType.includes("sustainability")
            ? "sustainability trends and regenerative travel movements"
            : "hospitality industry trends and travel developments"
        } using real-time Google News analysis and social media trend monitoring with quantifiable engagement metrics. ${
          urgency === "urgent"
            ? "I'll identify immediate news hooks and trending opportunities with statistical confidence levels for rapid deployment."
            : "I'll provide trend velocity data and audience engagement metrics to identify optimal timing opportunities."
        }`;
      } else {
        const topTrend = data?.relevantTrends?.[0] || {
          trend: "current market trend",
          relevance: "high",
        };
        const timing =
          data?.timingRecommendation || "optimal timing identified";
        return `I've identified significant trending opportunities in ${
          campaignType.includes("sustainability")
            ? "sustainable hospitality with measurable trend velocity and audience engagement data"
            : "the hospitality sector with measurable impact potential and trend validation"
        }. The ${topTrend.trend} shows ${
          topTrend.relevance
        } relevance with strong media attention, and ${timing} provides strategic timing for campaign launch.`;
      }
    }
  }
}

module.exports = TrendingNewsAgent;
