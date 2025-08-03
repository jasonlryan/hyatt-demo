import React, { useState, useMemo } from "react";
import { useBrandsOverview } from "../../hooks/usePeakMetrics";
import { BrandOverview } from "../../types/peakMetrics";

interface InsightsDashboardProps {
  onBrandSelect?: (brand: BrandOverview) => void;
}

type SortField = "title" | "velocity" | "risk" | "mentions" | "sentiment";
type SortOrder = "asc" | "desc";

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({
  onBrandSelect,
}) => {
  const [sortField, setSortField] = useState<SortField>("risk");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [riskFilter, setRiskFilter] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: brands,
    loading,
    error,
    cached,
    enabled,
    refetch,
  } = useBrandsOverview({
    filterByRisk: riskFilter,
    refreshInterval: 0, // No polling
    enabled: true, // Always enabled - load once on mount to check connection
  });

  // Sort and filter brands
  const processedBrands = useMemo(() => {
    let filtered = [...brands];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((brand) =>
        brand.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortField) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "velocity":
          aVal = a.velocity;
          bVal = b.velocity;
          break;
        case "risk":
          aVal = a.riskScore;
          bVal = b.riskScore;
          break;
        case "mentions":
          aVal = a.last48hMentions;
          bVal = b.last48hMentions;
          break;
        case "sentiment":
          aVal = a.avgSentiment;
          bVal = b.avgSentiment;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [brands, sortField, sortOrder, searchTerm]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getVelocityIndicator = (velocity: number): string => {
    if (velocity > 100) return "🔥";
    if (velocity > 50) return "📈";
    if (velocity > 20) return "➡️";
    return "📉";
  };

  const getSentimentIcon = (sentiment: number): string => {
    if (sentiment > 20) return "😊";
    if (sentiment < -20) return "😟";
    return "😐";
  };

  if (enabled === false) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            PeakMetrics Insights
          </h2>
          <p className="text-text-secondary mb-2">
            PeakMetrics integration is currently disabled.
          </p>
          <p className="text-text-secondary">
            Please enable the ENABLE_PEAK_METRICS feature flag to use this
            feature.
          </p>
        </div>
      </div>
    );
  }

  // Show loading screen while checking connection
  if (brands.length === 0 && loading) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">
            Checking PeakMetrics connection...
          </p>
        </div>
      </div>
    );
  }

  // Show loading screen when refreshing
  if (loading && brands.length > 0) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Refreshing brand insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary p-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-error mb-4">
            Error Loading Insights
          </h2>
          <p className="text-text-secondary mb-6">{error.message}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-6">
          Brand Insights Dashboard
        </h1>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Risk Filter:
            </label>
            <select
              value={riskFilter || ""}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
            >
              <option value="">All</option>
              <option value="70">High Risk (70+)</option>
              <option value="40">Medium Risk (40+)</option>
              <option value="0">Low Risk</option>
            </select>
          </div>

          <button
            onClick={() => refetch()}
            disabled={loading}
            className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:bg-text-muted text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? "↻" : "🔄"} Refresh
          </button>
          {cached && (
            <span className="text-sm text-text-secondary flex items-center gap-1">
              📦 Cached
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-2">
            Total Brands
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {brands.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-2">
            High Risk
          </h3>
          <p className="text-3xl font-bold text-error">
            {brands.filter((b) => b.riskScore >= 70).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-2">
            Total Mentions
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {brands
              .reduce((sum, b) => sum + b.last48hMentions, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-2">
            Avg Sentiment
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {brands.length > 0
              ? (
                  brands.reduce((sum, b) => sum + b.avgSentiment, 0) /
                  brands.length
                ).toFixed(1)
              : "0"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th
                onClick={() => handleSort("title")}
                className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Brand{" "}
                {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("mentions")}
                className="px-6 py-4 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                48h Mentions{" "}
                {sortField === "mentions" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("velocity")}
                className="px-6 py-4 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Velocity{" "}
                {sortField === "velocity" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("sentiment")}
                className="px-6 py-4 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Sentiment{" "}
                {sortField === "sentiment" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("risk")}
                className="px-6 py-4 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Risk Score{" "}
                {sortField === "risk" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {processedBrands.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-text-secondary italic"
                >
                  {searchTerm
                    ? "No brands match your search."
                    : "No brand data available."}
                </td>
              </tr>
            ) : (
              processedBrands.map((brand) => (
                <tr
                  key={brand.id}
                  onClick={() => onBrandSelect?.(brand)}
                  className="hover:bg-secondary transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                    {brand.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary text-center">
                    {brand.last48hMentions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary text-center">
                    <span className="flex items-center justify-center gap-1">
                      {getVelocityIndicator(brand.velocity)} {brand.velocity}
                      /day
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary text-center">
                    <span className="flex items-center justify-center gap-1">
                      {getSentimentIcon(brand.avgSentiment)}{" "}
                      {brand.avgSentiment.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        brand.riskScore >= 70
                          ? "bg-red-100 text-red-800"
                          : brand.riskScore >= 40
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {brand.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white text-text-primary rounded text-xs font-medium transition-colors transform hover:translate-x-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBrandSelect?.(brand);
                      }}
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {processedBrands.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-text-secondary">
            Showing {processedBrands.length} of {brands.length} brands
          </p>
          <p className="text-text-muted text-sm mt-2">
            Click "Refresh" to update data manually
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightsDashboard;
