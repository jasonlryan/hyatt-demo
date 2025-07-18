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
Target Market: ${context.targetMarket}
Industry: ${context.industry || "hospitality"}

Analyze current cultural trends and moments relevant to this campaign:

1. What's culturally relevant/hot right now?
2. What trends are emerging in our target market?
3. What cultural moments should we be aware of?
4. How are these trends affecting consumer behavior?

Provide a comprehensive trend analysis with:
- Primary cultural trends
- Market-specific insights
- Consumer behavior shifts
- Timing recommendations

Format as JSON with "trends", "marketInsights", "behaviorShifts", and "timing" keys.`;

    const raw = await this.chat(userContent);
    try {
      return JSON.parse(raw);
    } catch (_) {
      return {
        trends: raw,
        marketInsights: "Market analysis provided in trends",
        behaviorShifts: "Behavior changes identified in trends",
        timing: "Optimal timing recommendations",
      };
    }
  }
}

module.exports = TrendCulturalAnalyzerAgent;
