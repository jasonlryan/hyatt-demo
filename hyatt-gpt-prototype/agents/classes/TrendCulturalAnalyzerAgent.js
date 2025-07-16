const BaseAgent = require("./BaseAgent");

class TrendCulturalAnalyzerAgent extends BaseAgent {
  constructor() {
    super("trend_cultural_analyzer", {
      model: "gpt-4o-2024-08-06",
      promptFile: "trend_cultural_analyzer.md",
      temperature: 0.7,
      maxTokens: 800,
    });
  }

  async analyzeTrends(context) {
    const userContent = `
Campaign: ${context.campaign}
Moment Type: ${context.momentType}

What trends or cultural moments are relevant to the visual objective \"${context.visualObjective}\"?\nRespond with a short summary and bullet list.`;
    return await this.chat(userContent);
  }
}

module.exports = TrendCulturalAnalyzerAgent;
