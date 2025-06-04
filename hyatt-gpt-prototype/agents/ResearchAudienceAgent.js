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
      // Try multiple possible paths for different environments
      // Prioritize local GPTs directory for Vercel deployment
      const possiblePaths = [
        path.join(__dirname, "../GPTs/research_audience_gpt.md"), // Local GPTs in app folder (Vercel)
        path.join(process.cwd(), "GPTs/research_audience_gpt.md"), // Vercel deployment alternative
        path.join(__dirname, "../../GPTs/research_audience_gpt.md"), // Local development (parent dir)
        path.join(__dirname, "../../../GPTs/research_audience_gpt.md"), // Alternative path
      ];

      let prompt = null;
      let successPath = null;

      for (const promptPath of possiblePaths) {
        try {
          if (fs.existsSync(promptPath)) {
            prompt = fs.readFileSync(promptPath, "utf8");
            successPath = promptPath;
            break;
          }
        } catch (err) {
          // Continue to next path
          continue;
        }
      }

      if (prompt) {
        console.log(
          `✅ ${this.name}: Loaded system prompt from ${successPath}`
        );
        return prompt;
      } else {
        throw new Error("No valid prompt file found in any expected location");
      }
    } catch (error) {
      console.warn(
        `⚠️ ${this.name}: Could not load system prompt from file, using fallback:`,
        error.message
      );
      return `You are Research & Audience GPT, a specialized AI assistant for Hyatt Hotels that provides expert insights about traveler demographics, preferences, and behaviors. You excel at collaborative work with other specialized GPTs and provide data-driven insights.`;
    }
  }

  async analyzeAudience(campaignBrief, externalData = null) {
    // Simulate processing time - configurable via environment
    const delay = parseInt(process.env.RESEARCH_DELAY) || 4000;
    await this.delay(delay);

    // Use OpenAI API with system prompt to analyze audience dynamically
    const insights = await this.generateInsightsUsingPrompt(
      campaignBrief,
      externalData
    );

    return {
      agent: this.name,
      timestamp: new Date().toISOString(),
      phase: "research",
      insights: insights,
      nextPhase: "trending",
    };
  }

  async generateInsightsUsingPrompt(campaignBrief, externalData = null) {
    try {
      console.log(
        `🔄 ${this.name}: Analyzing audience using built-in knowledge + campaign brief...`
      );

      // Simple prompt - let the centralized GPT prompt handle everything
      const prompt = `
CAMPAIGN BRIEF TO ANALYZE:
${campaignBrief}

${
  externalData
    ? `
SUPPLEMENTARY DATA CONTEXT:
${JSON.stringify(externalData, null, 2)}
`
    : ""
}

MESSAGE TYPE: audience_analysis

Generate the appropriate response based on your conversation scenarios in your system prompt.
`;

      console.log(`🔍 ATTEMPTING REAL OPENAI API CALL...`);
      console.log(`🔍 API Key: ${this.openai.apiKey ? "SET" : "MISSING"}`);
      console.log(`🔍 Model: ${this.model}`);

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      console.log(
        `🔍 DEBUG: OpenAI Responses API call succeeded, response:`,
        response.output_text ? "SUCCESS" : "NO_OUTPUT"
      );

      // Return the raw output - let the centralized prompt handle structure
      const insights = {
        analysis: response.output_text,
        lastUpdated: new Date().toISOString(),
        dataQuality: externalData?.dataQuality || "responses_api_based",
      };

      console.log(
        `✅ ${this.name}: Generated dynamic audience analysis using Responses API`
      );
      return insights;
    } catch (error) {
      console.error(`❌ ${this.name}: REAL API ERROR:`, error.message);
      console.error(`❌ ${this.name}: ERROR TYPE:`, error.constructor.name);
      console.error(`❌ ${this.name}: FULL ERROR:`, error);

      // Return OBVIOUS fallback data so we can see when it's being used
      return {
        analysis: "🚨 FALLBACK DATA - API FAILED 🚨",
        lastUpdated: new Date().toISOString(),
        dataQuality: "FAILED",
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

    // Generate dynamic collaborative input using OpenAI API
    const research = previousPhases.research?.insights;
    if (!research) {
      return {
        agent: this.name,
        contribution:
          "Unable to provide collaborative input without research phase data.",
        dataPoints: [],
      };
    }

    try {
      console.log(
        `🔄 ${this.name}: Generating collaborative input via Responses API...`
      );

      const prompt = `
You are ${this.name} in a collaborative PR strategy session.

YOUR PREVIOUS ANALYSIS:
${JSON.stringify(research, null, 2)}

OTHER AGENTS' FINDINGS:
- Trending Analysis: ${JSON.stringify(
        previousPhases.trending?.trends || "Not yet available",
        null,
        2
      )}
- Story Angles: ${JSON.stringify(
        previousPhases.story?.storyAngles || "Not yet available",
        null,
        2
      )}

Based on ALL the insights gathered, provide your collaborative contribution that:
1. Highlights the most important findings from your research
2. Shows how your insights connect with the trending and story angles
3. Suggests strategic implications for the final campaign
4. Uses specific data points and percentages from your analysis

Be concise but insightful. Reference specific findings and data points.
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
        dataPoints: [],
        strategicImplication:
          "Strategic recommendations provided in contribution",
      };
    } catch (error) {
      console.error(
        `❌ ${this.name}: Collaborative input generation failed:`,
        error
      );

      // Return minimal fallback only on complete failure
      return {
        agent: this.name,
        contribution: `Based on my research analysis, I've identified key audience segments and their motivations that should guide our campaign strategy.`,
        dataPoints: [],
        strategicImplication:
          "Further analysis needed for strategic recommendations.",
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
      return `I'll be analyzing target audience demographics and psychographics for this campaign using industry research methodologies.`;
    }
  }
}

module.exports = ResearchAudienceAgent;
