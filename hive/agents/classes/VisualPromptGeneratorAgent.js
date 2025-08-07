const BaseAgent = require("./BaseAgent");

class VisualPromptGeneratorAgent extends BaseAgent {
  constructor(options = {}) {
    super("visual_prompt_generator", {
      model: options.model || "gpt-4o-2024-05-13", // use a valid chat model for prompt generation
      promptFile: "visual_prompt_generator.md",
      temperature: options.temperature ?? 0.7,
      maxTokens: options.maxTokens ?? 1000,
      orchestrationType: options.orchestrationType
    });
  }

  async generatePrompt(context) {
    // 1) Build the text prompt first via chat model (gpt-4o)
    const userContent = `
Campaign: ${context.campaign}
Moment Type: ${context.momentType}
Visual Objective: ${context.visualObjective}

Hero Visual Description:
${context.heroVisualDescription}

Existing Prompt Snippet:
${context.promptSnippet || "[none]"}

Modular Elements (if any): ${
      Array.isArray(context.modularElements)
        ? context.modularElements.join(", ")
        : "None"
    }

Provide ONE vivid Midjourney-style visual prompt. Keep it one line, no markdown.`;

    const promptText = await this.chat(userContent);

    // If no key / placeholder, return without image generation to avoid extra failure.
    if (promptText.startsWith("[Placeholder")) {
      return { promptText, imageUrl: null };
    }

    // 2) Generate image with gpt-image-1 using axios (like backend)
    try {
      const axios = require("axios");
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "gpt-image-1",
          prompt: promptText,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const b64 = response.data.data[0].b64_json;
      const imageUrl = `data:image/png;base64,${b64}`;
      return { promptText, imageUrl };
    } catch (err) {
      console.warn("Image generation failed:", err?.message || err);
      return { promptText, imageUrl: null };
    }
  }
}

module.exports = VisualPromptGeneratorAgent;
