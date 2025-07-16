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

  async reviewPrompt(basePrompt, modulars, trendInsights) {
    const text =
      typeof basePrompt === "string" ? basePrompt : basePrompt.promptText;
    const userContent = `
Base Visual Prompt:
${text}

Modular Elements:
${JSON.stringify(modulars, null, 2)}

Trend Insights:
${trendInsights}

Please provide feedback on brand alignment, tone and quality, suggest edits if needed, and indicate \"approved\": true/false in JSON like {"approved": true, "feedback": "..."} (no markdown).`;
    const raw = await this.chat(userContent);
    try {
      return JSON.parse(raw);
    } catch (_) {
      return { approved: false, feedback: raw };
    }
  }
}

module.exports = BrandQAAgent;
