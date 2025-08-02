const BaseAgent = require("./BaseAgent");
const PeakMetricsClient = require("../../utils/peakMetricsClient");
const {
  formatNarrativesForLLM,
  extractKeyInsights,
} = require("../../utils/metricsTransform");

class TrendingNewsAgent extends BaseAgent {
  constructor() {
    super("trending_news", {
      model: "gpt-4o-2024-08-06",
      promptFile: "trending_news_gpt.md",
      temperature: 0.3,
      maxTokens: 3000,
    });

    // Initialize PeakMetrics client
    this.peakMetrics = null;
    try {
      this.peakMetrics = new PeakMetricsClient();
    } catch (error) {
      console.warn("⚠️ PeakMetrics client not available:", error.message);
    }
  }

  async analyzeTrends(topic, context = {}) {
    console.log(`🔄 Trending News Agent: Analyzing trends for "${topic}"`);

    let peakMetricsData = null;
    let workspaceId = null;

    // Try to get PeakMetrics data if available
    if (this.peakMetrics) {
      try {
        // Look for workspace by topic/brand
        const workspace = await this.peakMetrics.findWorkspaceByQuery(topic);
        if (workspace) {
          workspaceId = workspace.id;
          console.log(
            `📊 PeakMetrics: Found workspace "${workspace.title}" (ID: ${workspaceId})`
          );

          // Get narratives for this workspace
          const narratives = await this.peakMetrics.getNarratives(workspaceId, {
            limit: 20,
            sort: "relevancy",
          });

          peakMetricsData = {
            workspace: workspace,
            narratives: narratives,
            insights: extractKeyInsights(narratives),
            formattedNarratives: formatNarrativesForLLM(narratives),
          };

          console.log(
            `📈 PeakMetrics: Retrieved ${narratives.length} narratives with ${peakMetricsData.insights.totalMentions} total mentions`
          );
        } else {
          console.log(`⚠️ PeakMetrics: No workspace found for "${topic}"`);
        }
      } catch (error) {
        console.error("❌ PeakMetrics API error:", error.message);
        // Continue with LLM-only approach
      }
    }

    // Build the prompt with PeakMetrics data if available
    let userContent = `Topic: ${topic}\n`;

    if (peakMetricsData) {
      userContent += `
PEAK METRICS DATA:
- Workspace: ${peakMetricsData.workspace.title}
- Total Mentions: ${peakMetricsData.insights.totalMentions}
- Sentiment Overview: ${peakMetricsData.insights.sentimentOverview}
- Top Trends: ${peakMetricsData.insights.topTrends.join(", ")}
- High Risk Topics: ${peakMetricsData.insights.highRiskTopics.join(", ")}

TOP NARRATIVES:
${peakMetricsData.formattedNarratives
  .map(
    (n) =>
      `- ${n.title} (${n.mentionCount} mentions, ${n.avgSentiment} sentiment, ${n.relevancyScore} relevancy)`
  )
  .join("\n")}

Please analyze these real-time narratives and provide insights on:
1. Why these trends are culturally relevant
2. How they might impact the target audience
3. Potential opportunities for brand engagement
4. Risk factors to consider

`;
    } else {
      // Fallback to original LLM-only approach
      userContent += `
Please analyze current cultural trends and moments relevant to this topic.
Consider what's culturally relevant/hot right now and how it might affect consumer behavior.
`;
    }

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

      // Enhance result with PeakMetrics data
      if (peakMetricsData) {
        result.peakMetrics = {
          workspaceId: workspaceId,
          workspaceTitle: peakMetricsData.workspace.title,
          totalMentions: peakMetricsData.insights.totalMentions,
          sentimentOverview: peakMetricsData.insights.sentimentOverview,
          topNarratives: peakMetricsData.insights.topTrends,
          highRiskTopics: peakMetricsData.insights.highRiskTopics,
          dataSource: "PeakMetrics API",
        };
      }

      return result;
    } catch (_) {
      // Fallback to string response
      return {
        trends: raw,
        peakMetrics: peakMetricsData
          ? {
              workspaceId: workspaceId,
              workspaceTitle: peakMetricsData.workspace.title,
              totalMentions: peakMetricsData.insights.totalMentions,
              dataSource: "PeakMetrics API",
            }
          : null,
      };
    }
  }

  async generateConversationResponse(context, messageType, data = null) {
    // Enhanced conversation response with PeakMetrics context
    let response = await super.generateConversationResponse(
      context,
      messageType,
      data
    );

    // Add PeakMetrics context if available
    if (data?.peakMetrics) {
      response += `\n\n📊 *PeakMetrics Insights:* Based on ${data.peakMetrics.totalMentions} mentions across ${data.peakMetrics.workspaceTitle} workspace.`;
    }

    return response;
  }
}

module.exports = TrendingNewsAgent;
