const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai");

class ResearchAudienceAgent {
  constructor() {
    this.name = "Research & Audience GPT";
    this.promptFile = "research_audience_gpt.md";
    this.systemPrompt = null;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    });

    // Load configuration from agents.config.json
    this.loadConfiguration();

    console.log(
      `🤖 ${this.name}: Using model ${this.model} with temperature ${this.temperature}`
    );
  }

  loadConfiguration() {
    try {
      const configPath = path.join(__dirname, "../agents.config.json");
      const configData = JSON.parse(
        require("fs").readFileSync(configPath, "utf8")
      );
      const agentConfig = configData.agents["research"];

      if (agentConfig) {
        this.model = agentConfig.model || "gpt-4o-2024-08-06";
        this.temperature = agentConfig.temperature || 0.2;
        this.maxTokens = agentConfig.maxTokens || 2500;
        this.timeout = agentConfig.timeout || 45000;
        this.delay = agentConfig.delay || 4000;
        this.enabled = agentConfig.enabled !== false;
      } else {
        // Fallback to environment variables if config not found
        this.model =
          process.env.RESEARCH_MODEL ||
          process.env.OPENAI_MODEL ||
          "gpt-4o-2024-08-06";
        this.temperature = parseFloat(process.env.RESEARCH_TEMPERATURE) || 0.2;
        this.maxTokens =
          parseInt(process.env.RESEARCH_MAX_TOKENS) ||
          parseInt(process.env.OPENAI_MAX_TOKENS) ||
          2500;
        this.timeout =
          parseInt(process.env.RESEARCH_TIMEOUT) ||
          parseInt(process.env.OPENAI_TIMEOUT) ||
          45000;
        this.delay = parseInt(process.env.RESEARCH_DELAY) || 4000;
        this.enabled = true;
      }
    } catch (error) {
      console.warn(
        "Failed to load agent configuration, using defaults:",
        error.message
      );
      // Fallback to environment variables
      this.model =
        process.env.RESEARCH_MODEL ||
        process.env.OPENAI_MODEL ||
        "gpt-4o-2024-08-06";
      this.temperature = parseFloat(process.env.RESEARCH_TEMPERATURE) || 0.2;
      this.maxTokens =
        parseInt(process.env.RESEARCH_MAX_TOKENS) ||
        parseInt(process.env.OPENAI_MAX_TOKENS) ||
        2500;
      this.timeout =
        parseInt(process.env.RESEARCH_TIMEOUT) ||
        parseInt(process.env.OPENAI_TIMEOUT) ||
        45000;
      this.delay = parseInt(process.env.RESEARCH_DELAY) || 4000;
      this.enabled = true;
    }
  }

  async loadSystemPrompt(attempt = 1) {
    const potentialPaths = [
      path.join(__dirname, "../prompts", this.promptFile), // Consolidated prompts path
      // Fallback paths (can be removed if the above is robust)
      // path.join(process.cwd(), 'GPTs', this.promptFile),
      // path.join(process.cwd(), 'hyatt-gpt-prototype', 'GPTs', this.promptFile),
      // path.join(__dirname, '../../GPTs', this.promptFile) // If agents are nested deeper
    ];

    for (const p of potentialPaths) {
      try {
        // console.log(`Attempting to load prompt from: ${p}`); // Debug log
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

    // Old logic for reference, to be replaced by the loop above
    /*
    try {
      let promptPath = path.join(__dirname, '../../GPTs/', this.promptFile); // original path
      // Check if running in Vercel by checking for VERCEL_ENV environment variable
      if (process.env.VERCEL_ENV) {
          // Try a path relative to process.cwd() for Vercel
          promptPath = path.join(process.cwd(), 'GPTs', this.promptFile);
          try {
            await fs.access(promptPath);
          } catch (e) {
            // If not found, try another common Vercel structure if GPTs is inside hyatt-gpt-prototype
            promptPath = path.join(process.cwd(), 'hyatt-gpt-prototype', 'GPTs', this.promptFile);
            try {
                await fs.access(promptPath);
            } catch (e2) {
                // Fallback to original __dirname if specific Vercel paths fail
                promptPath = path.join(__dirname, '../../GPTs/', this.promptFile); 
            }
          }
      } else {
        // Local development: try a path relative to where AgentOrchestrator might be if it's at project root
        const localPath1 = path.join(__dirname, '../GPTs', this.promptFile); // Assumes agents/ is sibling to GPTs/
        const localPath2 = path.join(process.cwd(), 'GPTs', this.promptFile); // Assumes running from DEMO, GPTs is sibling
        const localPath3 = path.join(process.cwd(), 'hyatt-gpt-prototype', 'GPTs', this.promptFile); // Assumes running from DEMO, then into app

        const checkPaths = [localPath1, localPath2, localPath3, promptPath]; 
        let foundPath = false;
        for (const p of checkPaths) {
            try {
                await fs.access(p);
                promptPath = p;
                foundPath = true;
                break;
            } catch (e) {}
        }
        if (!foundPath) {
            console.log(`Prompt not found at any typical local paths, defaulting to: ${promptPath}`);
        }

      }

      console.log(`Attempting to load system prompt from: ${promptPath}`);
      const content = await fs.readFile(promptPath, 'utf8');
      this.systemPrompt = content;
      console.log(`Loaded system prompt from ${promptPath}`);
    } catch (error) {
      console.error(`Error loading system prompt (attempt ${attempt}): ${error.message} from path related to ${this.promptFile}`);
      if (attempt < 3) {
        console.log(`Retrying to load system prompt... (attempt ${attempt + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        await this.loadSystemPrompt(attempt + 1);
      } else {
        console.error(`Failed to load system prompt after ${attempt} attempts: ${this.promptFile}`);
        throw error; 
      }
    }
    */
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
