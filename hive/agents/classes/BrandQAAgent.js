const BaseAgent = require("./BaseAgent");
const { calculateRiskScore } = require("../../utils/metricsTransform");

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

    // Extract PeakMetrics data if available
    let peakMetricsContext = "";
    let numericalSignals = {};

    if (process.env.ENABLE_PEAK_METRICS === 'true' && trendInsights?.peakMetrics) {
      const pm = trendInsights.peakMetrics;
      numericalSignals = {
        totalMentions: pm.totalMentions,
        sentimentOverview: pm.sentimentOverview,
        highRiskTopics: pm.highRiskTopics?.length || 0,
      };

      peakMetricsContext = `
PEAK METRICS NUMERICAL SIGNALS:
- Total Mentions: ${pm.totalMentions}
- Sentiment Overview: ${pm.sentimentOverview}
- High Risk Topics: ${pm.highRiskTopics?.length || 0}
- Workspace: ${pm.workspaceTitle}
`;
    }

    const userContent = `
Base Visual Prompt:
${text}

Modular Elements:
${JSON.stringify(modulars, null, 2)}

Trend Insights:
${JSON.stringify(trendInsights, null, 2)}

Brand Lens:
${JSON.stringify(brandLens, null, 2)}

${peakMetricsContext}

Review the complete campaign package for:
1. Brand alignment and consistency
2. Visual quality and appeal
3. Trend relevance and timeliness
4. Modular element effectiveness
5. Overall campaign coherence
6. Risk assessment based on numerical signals

Provide feedback on each aspect and indicate in JSON format:
{
  "approved": true/false,
  "feedback": "...",
  "suggestions": ["..."],
  "qualityScore": 0-100,
  "riskScore": 0-100,
  "riskFactors": ["..."],
  "peakMetricsInsights": "..."
}

The riskScore should consider:
- Sentiment trends (negative sentiment = higher risk)
- Mention volume (very high volume = potential oversaturation)
- Brand alignment with current narratives
- Timing and cultural sensitivity
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
        peakMetricsInsights: trendInsights?.peakMetrics
          ? `Based on ${trendInsights.peakMetrics.totalMentions} mentions`
          : "No PeakMetrics data available",
      };
    }
  }
}

module.exports = BrandQAAgent;
