const BaseAgent = require("./BaseAgent");

class ModularElementsRecommenderAgent extends BaseAgent {
  constructor() {
    super("modular_elements_recommender", {
      model: "gpt-4o-2024-08-06",
      promptFile: "modular_elements_recommender.md",
      temperature: 0.7,
      maxTokens: 800,
    });
  }

  async recommendElements(context, basePrompt) {
    const text =
      typeof basePrompt === "string" ? basePrompt : basePrompt.promptText;
    const userContent = `
Campaign: ${context.campaign}
Visual Objective: ${context.visualObjective}
Base Visual Prompt:
${text}

Provide a JSON array (no markdown) of 5-10 modular visual elements. Each element should be an object with \"element\" and \"rationale\" keys.`;
    const raw = await this.chat(userContent);
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (err) {
      // Fallback: return lines
      return raw.split("\n").filter((l) => l.trim());
    }
  }
}

module.exports = ModularElementsRecommenderAgent;
