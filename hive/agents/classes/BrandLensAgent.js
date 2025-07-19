const BaseAgent = require("./BaseAgent");

class BrandLensAgent extends BaseAgent {
  constructor() {
    super("brand_lens", {
      model: "gpt-4o-2024-08-06",
      promptFile: "brand_lens.md",
      temperature: 0.4,
      maxTokens: 800,
    });
  }

  async analyzeBrandPerspective(trendInsights, campaignContext) {
    const userContent = `
Campaign Context: ${campaignContext.campaign}
Target Market: ${campaignContext.targetMarket}
Brand Guidelines: ${
      campaignContext.brandGuidelines || "Hyatt luxury hospitality"
    }

Trend Insights:
${trendInsights}

How should our brand authentically respond to these trends? Provide:
1. Brand positioning angle
2. Authentic brand voice for this moment
3. Key brand principles to emphasize
4. Potential brand risks/opportunities

Respond in JSON format with "brandPositioning", "brandVoice", "keyPrinciples", and "risksOpportunities" keys.`;

    const raw = await this.chat(userContent);
    try {
      return JSON.parse(raw);
    } catch (_) {
      return {
        brandPositioning: raw,
        brandVoice: "Authentic luxury hospitality",
        keyPrinciples: ["Quality", "Service", "Innovation"],
        risksOpportunities: "Analysis provided in brandPositioning",
      };
    }
  }
}

module.exports = BrandLensAgent;
