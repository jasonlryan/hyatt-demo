import React, { useState, useMemo } from "react";
import {
  useBrandDetail,
  useBrandNarratives,
  useBrandTrends,
} from "../../hooks/usePeakMetrics";
import { BrandDetail, Narrative, TrendInsights } from "../../types/peakMetrics";

interface BrandAnalyticsTabProps {
  brandName: string;
  isOpen: boolean;
  onClose: () => void;
  refreshInterval?: number;
}

const BrandAnalyticsTab: React.FC<BrandAnalyticsTabProps> = ({
  brandName,
  isOpen,
  onClose,
  refreshInterval = 0, // No polling by default
}) => {
  const [activeView, setActiveView] = useState<
    "overview" | "narratives" | "trends"
  >("overview");

  const {
    data: brandDetail,
    loading: detailLoading,
    error: detailError,
    cached: detailCached,
    refetch: refetchBrand,
  } = useBrandDetail(brandName, {
    refreshInterval: 0, // No polling
    enabled: isOpen, // Only load when tab is open
  });

  const {
    data: trends,
    loading: trendsLoading,
    error: trendsError,
    refetch: refetchTrends,
  } = useBrandTrends(brandName, {
    enabled: activeView === "trends" && isOpen,
    refreshInterval: 0, // No polling
  });

  // Memoize the narratives options to prevent infinite re-renders
  const narrativesOptions = useMemo(
    () => ({
      enabled: activeView === "narratives" && isOpen,
      limit: 20,
      sort: "relevancy" as const,
    }),
    [activeView, isOpen]
  );

  const {
    data: narratives,
    loading: narrativesLoading,
    error: narrativesError,
    refetch: refetchNarratives,
  } = useBrandNarratives(brandName, narrativesOptions);

  if (!isOpen) return null;

  const renderSentimentChart = (breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  }) => (
    <div className="w-full">
      <div className="mb-3">
        <div className="flex h-5 rounded-full overflow-hidden bg-gray-100">
          <div
            className="bg-green-500"
            style={{ width: `${breakdown.positive}%` }}
            title={`Positive: ${breakdown.positive}%`}
          />
          <div
            className="bg-yellow-500"
            style={{ width: `${breakdown.neutral}%` }}
            title={`Neutral: ${breakdown.neutral}%`}
          />
          <div
            className="bg-red-500"
            style={{ width: `${breakdown.negative}%` }}
            title={`Negative: ${breakdown.negative}%`}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-green-600 flex items-center gap-1">
          😊 {breakdown.positive}%
        </span>
        <span className="text-yellow-600 flex items-center gap-1">
          😐 {breakdown.neutral}%
        </span>
        <span className="text-red-600 flex items-center gap-1">
          😟 {breakdown.negative}%
        </span>
      </div>
    </div>
  );

  const renderChannelBreakdown = (channels: { [key: string]: number }) => (
    <div className="space-y-2">
      {Object.entries(channels).map(([channel, count]) => (
        <div
          key={channel}
          className="flex justify-between items-center p-2 bg-secondary rounded"
        >
          <span className="text-text-secondary capitalize">{channel}</span>
          <span className="font-semibold text-text-primary">{count}</span>
        </div>
      ))}
    </div>
  );

  const renderOverview = () => {
    if (detailLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Loading brand analytics...</p>
        </div>
      );
    }

    if (detailError || !brandDetail) {
      return (
        <div className="text-center py-12">
          <p className="text-error mb-2">Failed to load brand analytics</p>
          <p className="text-text-secondary text-sm">
            {detailError?.message || "Brand not found"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary p-4 rounded-lg text-center">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              48h Mentions
            </h4>
            <p className="text-2xl font-bold text-text-primary">
              {brandDetail.last48hMentions.toLocaleString()}
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg text-center">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              Velocity
            </h4>
            <p className="text-2xl font-bold text-text-primary">
              {brandDetail.velocity}/day
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg text-center">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              Risk Score
            </h4>
            <p
              className={`text-2xl font-bold ${
                brandDetail.riskScore >= 70
                  ? "text-error"
                  : brandDetail.riskScore >= 40
                  ? "text-warning"
                  : "text-success"
              }`}
            >
              {brandDetail.riskScore}
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg text-center">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              Avg Sentiment
            </h4>
            <p className="text-2xl font-bold text-text-primary">
              {brandDetail.avgSentiment.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Analysis Sections */}
        <div className="space-y-6">
          {/* Sentiment Breakdown */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Sentiment Breakdown
            </h4>
            {renderSentimentChart(brandDetail.sentimentBreakdown)}
          </div>

          {/* Channel Distribution */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Channel Distribution
            </h4>
            {renderChannelBreakdown(brandDetail.channelBreakdown)}
          </div>

          {/* Top Narratives */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Top Narratives
            </h4>
            <div className="space-y-3 mb-4">
              {brandDetail.topNarratives.slice(0, 3).map((narrative, index) => (
                <div
                  key={narrative.id}
                  className="flex gap-3 p-3 bg-secondary rounded"
                >
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary mb-1 line-clamp-2">
                      {narrative.title}
                    </p>
                    <div className="flex gap-3 text-xs text-text-secondary">
                      <span>Mentions: {narrative.mentionCount}</span>
                      <span>Relevance: {narrative.relevancy}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded transition-colors text-sm font-medium"
              onClick={() => setActiveView("narratives")}
            >
              View All Narratives →
            </button>
          </div>

          {/* Recent Mentions */}
          {brandDetail.samples.length > 0 && (
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-4">
                Recent Mentions
              </h4>
              <div className="space-y-4">
                {brandDetail.samples.slice(0, 2).map((mention) => (
                  <div key={mention.id} className="p-3 bg-secondary rounded">
                    <h5 className="text-sm font-medium text-text-primary mb-2 line-clamp-2">
                      {mention.title}
                    </h5>
                    <p className="text-xs text-text-secondary mb-2 line-clamp-3">
                      {mention.excerpt}
                    </p>
                    <div className="flex gap-3 text-xs text-text-muted">
                      <span>
                        {new Date(mention.published).toLocaleDateString()}
                      </span>
                      <span>Source: {mention.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {detailCached && (
          <div className="text-center text-xs text-text-secondary bg-blue-50 text-blue-600 p-3 rounded">
            📦 Showing cached data
          </div>
        )}
      </div>
    );
  };

  const renderNarratives = () => {
    if (narrativesLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Loading narratives...</p>
        </div>
      );
    }

    if (narrativesError) {
      return (
        <div className="text-center py-12">
          <p className="text-error mb-2">Failed to load narratives</p>
          <p className="text-text-secondary text-sm">
            {narrativesError.message}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {narratives.map((narrative, index) => (
          <div
            key={narrative.id}
            className="border border-border rounded-lg p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary mb-1">
                  {narrative.title}
                </h4>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  narrative.riskScore >= 70
                    ? "bg-red-100 text-red-800"
                    : narrative.riskScore >= 40
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                Risk: {narrative.riskScore}
              </span>
            </div>
            <p className="text-xs text-text-secondary mb-3 line-clamp-3">
              {narrative.summary}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-text-muted">
              <span>📊 {narrative.mentionCount} mentions</span>
              <span>📈 {narrative.relevancy}% relevance</span>
              <span>😊 {narrative.avgSentiment.toFixed(1)} sentiment</span>
              <span>📅 {new Date(narrative.created).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTrends = () => {
    if (trendsLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Loading trend analysis...</p>
        </div>
      );
    }

    if (trendsError || !trends) {
      return (
        <div className="text-center py-12">
          <p className="text-error mb-2">Failed to load trend insights</p>
          <p className="text-text-secondary text-sm">
            {trendsError?.message || "No trend data available"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Trend Metrics */}
        <div className="space-y-4">
          <div className="bg-secondary p-4 rounded-lg text-center">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              24h Growth Rate
            </h4>
            <p
              className={`text-2xl font-bold ${
                trends.growthRate24h > 0 ? "text-success" : "text-error"
              }`}
            >
              {trends.growthRate24h > 0 ? "+" : ""}
              {trends.growthRate24h}%
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg text-center">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              Momentum
            </h4>
            <p className="text-2xl font-bold text-text-primary">
              {trends.momentum === "accelerating"
                ? "🚀"
                : trends.momentum === "steady"
                ? "➡️"
                : "📉"}
              {trends.momentum}
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg text-center">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
              Half-life
            </h4>
            <p className="text-2xl font-bold text-text-primary">
              {trends.halfLifeDays} days
            </p>
          </div>
        </div>

        {/* Trend Lists */}
        <div className="space-y-6">
          <div className="border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Top Trends
            </h4>
            <ul className="space-y-2">
              {trends.topTrends.map((trend, index) => (
                <li
                  key={index}
                  className="text-sm text-text-secondary border-b border-gray-100 pb-2 last:border-b-0"
                >
                  {trend}
                </li>
              ))}
            </ul>
          </div>

          {trends.highRiskTopics.length > 0 && (
            <div className="border border-error rounded-lg p-4">
              <h4 className="text-sm font-semibold text-error mb-4">
                🚨 High Risk Topics
              </h4>
              <ul className="space-y-2">
                {trends.highRiskTopics.map((topic, index) => (
                  <li
                    key={index}
                    className="text-sm text-error font-medium border-b border-red-100 pb-2 last:border-b-0"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-border bg-secondary">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            📊 {brandName} Analytics
          </h3>
          <div className="flex items-center gap-2">
            {/* Manual Refresh Button */}
            <button
              className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 transition-colors"
              onClick={() => {
                refetchBrand();
                if (activeView === "narratives") refetchNarratives();
                if (activeView === "trends") refetchTrends();
              }}
              title="Refresh data manually"
            >
              🔄 Refresh
            </button>
            <button
              className="text-text-secondary hover:text-text-primary hover:bg-white rounded p-1 transition-colors"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeView === "overview"
                ? "bg-primary text-white"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-border"
            }`}
            onClick={() => setActiveView("overview")}
          >
            Overview
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeView === "narratives"
                ? "bg-primary text-white"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-border"
            }`}
            onClick={() => setActiveView("narratives")}
          >
            Narratives
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeView === "trends"
                ? "bg-primary text-white"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-border"
            }`}
            onClick={() => setActiveView("trends")}
          >
            Trends
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeView === "overview" && renderOverview()}
        {activeView === "narratives" && renderNarratives()}
        {activeView === "trends" && renderTrends()}
      </div>
    </div>
  );
};

export default BrandAnalyticsTab;
