const BaseAgent = require("./BaseAgent");
const orchestrationConfig = require('../../orchestrations/OrchestrationConfig');

class BrandLensAgent extends BaseAgent {
  constructor(orchestrationType = 'hive') {
    super("brand_lens", {
      model: "gpt-4o-2024-08-06",
      promptFile: "brand_lens.md",
      temperature: 0.4,
      maxTokens: 800,
    });
    this.orchestrationType = orchestrationType;
    this.orchestrationConfig = orchestrationConfig.getOrchestration(orchestrationType);
  }

  async analyzeBrandPerspective(trendInsights, campaignContext) {
    // Get orchestration-specific terminology
    const workflowLabel = this.orchestrationConfig?.workflowLabel || 'Campaign';
    const workflowType = this.orchestrationConfig?.workflowType || 'campaign';
    
    const userContent = `
${workflowLabel} Context: ${campaignContext.campaign || campaignContext[workflowType]}
Target Market: ${campaignContext.targetMarket}
Brand Guidelines: ${campaignContext.brandGuidelines || campaignContext.brandContext || "general"}
Orchestration Type: ${this.orchestrationType}
Workflow Type: ${workflowType}

Trend Insights:
${trendInsights}

How should our brand authentically respond to these trends within the ${this.orchestrationType.toUpperCase()} orchestration context? Provide:
1. Brand positioning angle (tailored for ${workflowType} objectives)
2. Authentic brand voice for this moment
3. Key brand principles to emphasize
4. Potential brand risks/opportunities specific to ${workflowType} execution

Respond in JSON format with "brandPositioning", "brandVoice", "keyPrinciples", and "risksOpportunities" keys.`;

    const raw = await this.chat(userContent);
    try {
      return JSON.parse(raw);
    } catch (_) {
      return {
        brandPositioning: raw,
        brandVoice: "Authentic brand voice",
        keyPrinciples: ["Quality", "Service", "Innovation"],
        risksOpportunities: "Analysis provided in brandPositioning",
      };
    }
  }
}

module.exports = BrandLensAgent;
