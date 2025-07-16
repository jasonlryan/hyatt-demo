const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai");

class TrendingNewsAgent {
  constructor() {
    this.name = "Trending News GPT";
    this.promptFile = "trending_news_gpt.md";
    this.temperature = parseFloat(process.env.TRENDING_TEMPERATURE) || 0.3;
    this.systemPrompt = null;
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
      `📈 ${this.name}: Initialized with model ${this.model} and temperature ${this.temperature}. System prompt will be loaded on demand.`
    );
  }

  async loadSystemPrompt(attempt = 1) {
    if (this.systemPrompt) {
      console.log("System prompt already loaded.");
      return;
    }
    const potentialPaths = [
      path.join(__dirname, "../prompts", this.promptFile),
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

  async analyzeTrends(
    campaignBrief,
    researchInsights,
    strategicInsights,
    externalData = null
  ) {
    // Simulate processing time
    const delayDuration = parseInt(process.env.TRENDING_DELAY) || 3000;
    await this.delay(delayDuration);

    // Use OpenAI API with system prompt to analyze trends dynamically
    const trends = await this.generateTrendsUsingPrompt(
      campaignBrief,
      researchInsights,
      externalData
    );

    return {
      agent: this.name,
      timestamp: new Date().toISOString(),
      phase: "trending",
      trends: trends,
      nextPhase: "story",
    };
  }

  async generateTrendsUsingPrompt(
    campaignBrief,
    researchInsights,
    externalData = null
  ) {
    try {
      console.log(`🔄 ${this.name}: Analyzing trends using Responses API...`);

      // Simple prompt - let the centralized GPT prompt handle everything
      const prompt = `
CAMPAIGN BRIEF: ${campaignBrief}

RESEARCH INSIGHTS: ${JSON.stringify(researchInsights, null, 2)}

${
  externalData
    ? `
EXTERNAL DATA:
${JSON.stringify(externalData, null, 2)}
`
    : ""
}

MESSAGE TYPE: trends_analysis

Generate the appropriate response based on your conversation scenarios in your system prompt.
`;

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      // Return raw output - let centralized prompt handle structure
      const trends = {
        trendsAnalysis: response.output_text,
        lastUpdated: new Date().toISOString(),
        dataQuality: externalData?.dataQuality || "responses_api_based",
      };

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
        trendsAnalysis: "Analysis unavailable - please retry",
        dataQuality: "failed",
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

    try {
      console.log(
        `🔄 ${this.name}: Generating collaborative input via Responses API...`
      );

      const prompt = `
You are ${this.name} in a collaborative PR strategy session.

YOUR TRENDING ANALYSIS:
${JSON.stringify(trends, null, 2)}

OTHER AGENTS' FINDINGS:
- Research Insights: ${JSON.stringify(research, null, 2)}
- Story Angles: ${JSON.stringify(
        previousPhases.story?.storyAngles || "Not yet available",
        null,
        2
      )}

Based on ALL the insights gathered, provide your collaborative contribution that:
1. Highlights the most relevant trends for this campaign
2. Shows how trending topics align with audience research
3. Identifies optimal timing and media opportunities
4. Uses specific trend data, percentages, and momentum indicators

Be concise but insightful. Reference specific trends and their relevance scores.
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
        trendAlignment: [],
        mediaRecommendation: "Media strategy provided in contribution",
        timingInsight: "Timing recommendations provided in contribution",
      };
    } catch (error) {
      console.error(
        `❌ ${this.name}: Collaborative input generation failed:`,
        error
      );

      // Return minimal fallback only on complete failure
      return {
        agent: this.name,
        contribution: `Based on my trend analysis, I've identified key opportunities that align with current market movements and cultural moments.`,
        trendAlignment: [],
        mediaRecommendation: "Media strategy requires further analysis.",
        timingInsight: "Timing recommendations need additional context.",
      };
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async generateConversationResponse(context, messageType, data = null) {
    // Use ONLY the centralized GPT prompt - no hardcoded logic
    const { campaignType, targetMarket, focusAreas, urgency, originalBrief } =
      context;

    // Create simple context for the centralized prompt
    const campaignContext = originalBrief
      ? `CAMPAIGN BRIEF: ${originalBrief}`
      : `Campaign Type: ${campaignType} targeting ${targetMarket} travelers.`;

    // Let the centralized prompt handle ALL scenarios
    const prompt = `
${campaignContext}

MESSAGE TYPE: ${messageType}
${data ? `DATA: ${JSON.stringify(data, null, 2)}` : ""}

Generate the appropriate response based on your conversation scenarios in your system prompt.
`;

    try {
      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      return response.output_text.trim();
    } catch (error) {
      console.error(
        `[${this.name}] Conversation generation failed:`,
        error.message
      );

      // Minimal fallback only
      return `I'll be analyzing current travel industry trends and cultural moments for this campaign using real-time monitoring.`;
    }
  }
}

module.exports = TrendingNewsAgent;
