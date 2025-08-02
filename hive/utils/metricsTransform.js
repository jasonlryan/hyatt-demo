/**
 * Helper functions for transforming PeakMetrics API responses
 */

// Get top N narratives by relevancy score
exports.topNarratives = (narratives, k = 5) => {
  if (!Array.isArray(narratives)) return [];
  return narratives
    .sort(
      (a, b) =>
        (b.aggregations?.relevancyScore || 0) -
        (a.aggregations?.relevancyScore || 0)
    )
    .slice(0, k);
};

// Categorize sentiment risk level
exports.sentimentRisk = (sentiment) => {
  if (sentiment < -20) return "High";
  if (sentiment < 0) return "Medium";
  return "Low";
};

// Calculate trend velocity (mentions per day)
exports.calculateTrendVelocity = (narratives) => {
  if (!Array.isArray(narratives) || narratives.length === 0) return 0;

  const totalMentions = narratives.reduce(
    (sum, n) => sum + (n.aggregations?.mentionCount || 0),
    0
  );
  const avgMentionsPerDay = totalMentions / 2; // Assuming 48-hour window

  return Math.round(avgMentionsPerDay);
};

// Get channel distribution from narratives
exports.getChannelDistribution = (narratives) => {
  const channels = {};

  narratives.forEach((narrative) => {
    // This would need to be enhanced based on actual API response structure
    // For now, returning a placeholder
    channels["twitter"] = (channels["twitter"] || 0) + 1;
    channels["news"] = (channels["news"] || 0) + 1;
  });

  return channels;
};

// Format narrative data for LLM consumption
exports.formatNarrativesForLLM = (narratives) => {
  return narratives.map((narrative) => ({
    title: narrative.title,
    summary: narrative.summary,
    mentionCount: narrative.aggregations?.mentionCount || 0,
    avgSentiment: narrative.aggregations?.avgSentiment || 0,
    relevancyScore: narrative.aggregations?.relevancyScore || 0,
    created: narrative.created,
  }));
};

// Calculate risk score based on multiple factors
exports.calculateRiskScore = (narrative) => {
  let score = 50; // Base score

  // Sentiment factor
  const sentiment = narrative.aggregations?.avgSentiment || 0;
  if (sentiment < -30) score += 30;
  else if (sentiment < -10) score += 15;
  else if (sentiment > 30) score -= 10;

  // Volume factor
  const mentions = narrative.aggregations?.mentionCount || 0;
  if (mentions > 1000) score += 20;
  else if (mentions > 100) score += 10;

  // Relevancy factor
  const relevancy = narrative.aggregations?.relevancyScore || 0;
  if (relevancy < 50) score += 20;
  else if (relevancy > 80) score -= 10;

  return Math.max(0, Math.min(100, score));
};

// Extract key insights from narratives
exports.extractKeyInsights = (narratives) => {
  const insights = {
    topTrends: [],
    sentimentOverview: "neutral",
    totalMentions: 0,
    highRiskTopics: [],
  };

  if (!Array.isArray(narratives)) return insights;

  insights.totalMentions = narratives.reduce(
    (sum, n) => sum + (n.aggregations?.mentionCount || 0),
    0
  );

  // Get top trends
  insights.topTrends = this.topNarratives(narratives, 3).map((n) => n.title);

  // Calculate overall sentiment
  const avgSentiment =
    narratives.reduce(
      (sum, n) => sum + (n.aggregations?.avgSentiment || 0),
      0
    ) / narratives.length;
  if (avgSentiment < -10) insights.sentimentOverview = "negative";
  else if (avgSentiment > 10) insights.sentimentOverview = "positive";

  // Identify high-risk topics
  insights.highRiskTopics = narratives
    .filter((n) => this.calculateRiskScore(n) > 70)
    .map((n) => n.title);

  return insights;
};
