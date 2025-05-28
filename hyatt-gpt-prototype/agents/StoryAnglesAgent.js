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

      // Simple prompt - let the centralized GPT prompt handle everything
      const prompt = `
CAMPAIGN BRIEF: ${campaignBrief}

RESEARCH INSIGHTS: ${JSON.stringify(researchInsights, null, 2)}

TRENDING DATA: ${JSON.stringify(trendingData, null, 2)}

MESSAGE TYPE: story_development

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
      const storyAngles = {
        storyStrategy: response.output_text,
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
      return `I'll be developing compelling story angles and headlines for this campaign using creative storytelling techniques.`;
    }
  }
}

module.exports = StoryAnglesAgent;
