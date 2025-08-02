const BaseAgent = require("./BaseAgent");

class TrendingNewsAgent extends BaseAgent {
  constructor() {
    super("trending_news", {
      model: "gpt-4o-2024-08-06",
      promptFile: "trending_news_gpt.md",
      temperature: 0.3,
      maxTokens: 3000,
    });
  }

  async analyzeTrends(topic, context = {}) {
    console.log(`🔄 Trending News Agent: Analyzing trends for "${topic}"`);

    // Build the prompt
    let userContent = `Topic: ${topic}\n`;

    userContent += `
Please analyze current cultural trends and moments relevant to this topic.
Consider what's culturally relevant/hot right now and how it might affect consumer behavior.
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
    return await super.generateConversationResponse(
      context,
      messageType,
      data
    );
  }
}

module.exports = TrendingNewsAgent;