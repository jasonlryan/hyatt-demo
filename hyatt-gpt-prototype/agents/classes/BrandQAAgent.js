const BaseAgent = require("./BaseAgent");

class BrandQAAgent extends BaseAgent {
  constructor() {
    super("brand_qa", {
      model: "gpt-4o-2024-08-06",
      promptFile: "brand_qa.md",
      temperature: 0.4,
      maxTokens: 600,
    });
  }

  async reviewPrompt(basePrompt, modulars, trendInsights, brandLens) {
    const text =
      typeof basePrompt === "string" ? basePrompt : basePrompt.promptText;

    const userContent = `
Base Visual Prompt:
${text}

Modular Elements:
${JSON.stringify(modulars, null, 2)}

Trend Insights:
${JSON.stringify(trendInsights, null, 2)}

Brand Lens:
${JSON.stringify(brandLens, null, 2)}

Review the complete campaign package for:
1. Brand alignment and consistency
2. Visual quality and appeal
3. Trend relevance and timeliness
4. Modular element effectiveness
5. Overall campaign coherence

Provide feedback on each aspect and indicate "approved": true/false in JSON format like {"approved": true, "feedback": "...", "suggestions": ["..."], "qualityScore": 85} (no markdown).`;

    const raw = await this.chat(userContent);
    try {
      return JSON.parse(raw);
    } catch (_) {
      return {
        approved: false,
        feedback: raw,
        suggestions: ["Review feedback provided above"],
        qualityScore: 70,
      };
    }
  }
}

module.exports = BrandQAAgent;
