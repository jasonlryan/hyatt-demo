const BaseAgent = require("./BaseAgent");
const orchestrationConfig = require("../../orchestrations/OrchestrationConfig");

class TrendingNewsAgent extends BaseAgent {
  constructor(options = {}) {
    super("trending_news", {
      model: options.model || "gpt-4o-2024-08-06",
      promptFile: "trending_news_gpt.md",
      temperature: options.temperature ?? 0.3,
      maxTokens: options.maxTokens ?? 3000,
      orchestrationType: options.orchestrationType
    });
  }

  async analyzeTrends(topic, context = {}, orchestrationType = 'hyatt') {
    console.log(`🔄 Trending News Agent: Analyzing trends for "${topic}" in ${orchestrationType} orchestration`);

    // Get orchestration context
    const orchestration = orchestrationConfig.getOrchestration(orchestrationType);
    const workflow = orchestrationConfig.getWorkflowDescription(orchestrationType);
    const myRole = orchestrationConfig.getAgentRole(orchestrationType, 'trending');

    // Build the prompt
    let userContent = `ORCHESTRATION CONTEXT:
- Workflow: ${orchestration.name}
- My Role: ${myRole}
- Full Workflow: ${workflow}

Topic: ${topic}\n`;

    userContent += `
Please analyze current cultural trends and moments relevant to this topic.
Consider what's culturally relevant/hot right now and how it might affect consumer behavior.
Your analysis will be used by other agents in the ${orchestration.name} workflow.
`;

    // Add any additional context
    if (context.targetMarket) {
      userContent += `Target Market: ${context.targetMarket}\n`;
    }
    if (context.industry) {
      userContent += `Industry: ${context.industry}\n`;
    }

    const raw = await this.chat(userContent);

    try {
      const result = JSON.parse(raw);
      return result;
    } catch (_) {
      // Fallback to string response
      return {
        trends: raw,
      };
    }
  }

  async generateConversationResponse(context, messageType, data = null) {
    // Use ONLY the centralized GPT prompt - no hardcoded logic
    const {
      campaignType,
      targetMarket,
      targetIndustry,
      brandContext,
      focusAreas,
      urgency,
      originalBrief,
    } = context;

    // Create simple context for the centralized prompt
    const campaignContext = originalBrief
      ? `CAMPAIGN BRIEF: ${originalBrief}`
      : `Campaign Type: ${campaignType} in ${targetIndustry} targeting ${targetMarket}. Brand context: ${brandContext}.`;

    // Let the centralized prompt handle ALL scenarios
    const prompt = `
${campaignContext}

MESSAGE TYPE: ${messageType}
${data ? `DATA: ${JSON.stringify(data, null, 2)}` : ""}

Generate the appropriate response based on your conversation scenarios in your system prompt.
`;

    try {
      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: this.temperature,
      });

      return response.output_text;
    } catch (error) {
      console.error(
        `❌ Trending News Agent conversation response failed:`,
        error
      );

      // Fallback responses based on message type
      if (messageType === "introduction") {
        return `I'll be scanning the cultural landscape to identify trending moments and cultural shifts relevant to this ${campaignType} campaign. I'll analyze what's hot right now and how it might impact consumer behavior.`;
      } else if (messageType === "delivery") {
        return "I've analyzed the current cultural trends and moments. Here are the key insights that could shape your campaign strategy.";
      } else {
        return "I'm focused on identifying trending cultural moments that could enhance your campaign's relevance and impact.";
      }
    }
  }
}

module.exports = TrendingNewsAgent;
