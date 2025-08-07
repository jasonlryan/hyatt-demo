const BaseAgent = require("./BaseAgent");
const { calculateRiskScore } = require("../../utils/metricsTransform");

class BrandQAAgent extends BaseAgent {
  constructor(options = {}) {
    super("brand_qa", {
      model: options.model || "gpt-4o-2024-08-06",
      promptFile: "brand_qa.md",
      temperature: options.temperature ?? 0.4,
      maxTokens: options.maxTokens ?? 600,
      orchestrationType: options.orchestrationType
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

Provide feedback on each aspect and indicate in JSON format:
{
  "approved": true/false,
  "feedback": "...",
  "suggestions": ["..."],
  "qualityScore": 0-100,
  "riskScore": 0-100,
  "riskFactors": ["..."]
}
`;

    const raw = await this.chat(userContent);
    try {
      const result = JSON.parse(raw);

      // Ensure riskScore is included
      if (typeof result.riskScore !== "number") {
        result.riskScore = calculateRiskScore(trendInsights?.peakMetrics || {});
      }

      return result;
    } catch (_) {
      return {
        approved: false,
        feedback: raw,
        suggestions: ["Review feedback provided above"],
        qualityScore: 70,
        riskScore: calculateRiskScore(trendInsights?.peakMetrics || {}),
        riskFactors: ["Unable to parse structured feedback"],
      };
    }
  }
}

module.exports = BrandQAAgent;
