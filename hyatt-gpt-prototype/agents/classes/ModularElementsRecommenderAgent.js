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

  async recommendElements(context, basePrompt, trendInsights, brandLens) {
    const text =
      typeof basePrompt === "string" ? basePrompt : basePrompt.promptText;

    const userContent = `
Campaign: ${context.campaign}
Visual Objective: ${context.visualObjective}
Base Visual Prompt: ${text}

Trend Insights: ${JSON.stringify(trendInsights, null, 2)}
Brand Lens: ${JSON.stringify(brandLens, null, 2)}

Create 5-8 modular visual elements that can be used across different campaign channels. Each element should:
1. Build on the base visual prompt
2. Incorporate trend insights
3. Align with brand positioning
4. Work for specific channels (social, web, print, etc.)

For each element, provide:
- Element description (detailed visual prompt)
- Rationale (why this element works)
- Target channel (where to use it)
- Image generation prompt (optimized for AI image generation)

Format as JSON array with "element", "rationale", "targetChannel", and "imagePrompt" keys.`;

    const raw = await this.chat(userContent);
    try {
      const elements = JSON.parse(raw);

      // Generate thumbnail images for each element
      const elementsWithImages = await Promise.all(
        elements.map(async (element) => {
          const imageUrl = await this.generateElementImage(element.imagePrompt);
          return {
            ...element,
            imageUrl,
          };
        })
      );

      return elementsWithImages;
    } catch (err) {
      console.warn("Failed to parse modular elements:", err);
      return raw.split("\n").filter((l) => l.trim());
    }
  }

  async generateElementImage(promptText) {
    try {
      const axios = require("axios");
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "gpt-image-1",
          prompt: promptText,
          n: 1,
          size: "512x512", // Smaller thumbnails
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const b64 = response.data.data[0].b64_json;
      return `data:image/png;base64,${b64}`;
    } catch (err) {
      console.warn("Element image generation failed:", err?.message || err);
      return null;
    }
  }
}

module.exports = ModularElementsRecommenderAgent;
