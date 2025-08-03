// PeakMetrics API Response Types

export interface PeakMetricsResponse<T> {
  data: T;
  error?: string;
  cached: boolean;
  timestamp: number;
}

// Brand Types
export interface BrandOverview {
  id: string;
  title: string;
  workspaceId: string;
  last48hMentions: number;
  avgSentiment: number;
  velocity: number;
  riskScore: number;
  query?: string;
}

export interface BrandDetail extends BrandOverview {
  topNarratives: Narrative[];
  sentimentBreakdown: SentimentBreakdown;
  channelBreakdown: ChannelBreakdown;
  samples: MentionSample[];
  lastUpdated: string;
}

// Narrative Types
export interface Narrative {
  id: string;
  title: string;
  summary: string;
  mentionCount: number;
  avgSentiment: number;
  relevancy: number;
  riskScore: number;
  created: string;
  aggregations?: {
    mentionCount: number;
    avgSentiment: number;
    relevancyScore: number;
  };
}

// Trend Analysis Types
export interface TrendInsights {
  workspaceId: string;
  firstSeen: string;
  growthRate24h: number;
  halfLifeDays: number;
  momentum: 'accelerating' | 'steady' | 'decelerating';
  topTrends: string[];
  totalMentions: number;
  sentimentOverview: 'positive' | 'neutral' | 'negative';
  highRiskTopics: string[];
}

// Mention Types
export interface MentionSample {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  published: string;
  source: string;
  sentiment: number;
  relevancy: number;
}

// Breakdown Types
export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ChannelBreakdown {
  [channel: string]: number; // e.g., { twitter: 45, news: 30, reddit: 25 }
}

// Alert Types
export interface PeakMetricsAlert {
  id: string;
  brandId: string;
  type: 'velocity' | 'risk' | 'sentiment';
  threshold: number;
  currentValue: number;
  triggered: string;
  acknowledged?: string;
  message: string;
}

// Cache Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

// API Request Options
export interface NarrativeOptions {
  limit?: number;
  sort?: 'relevancy' | 'created' | 'mentionCount';
  since?: string;
  to?: string;
  sentimentMin?: number;
  sentimentMax?: number;
}

export interface MentionOptions {
  limit?: number;
  sort?: 'published' | 'relevancy' | 'sentiment';
  order?: 'asc' | 'desc';
  since?: string;
  to?: string;
  channel?: string;
}

// Service Response Types
export interface ServiceError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Frontend State Types
export interface PeakMetricsState {
  brands: {
    overview: BrandOverview[];
    details: { [brandId: string]: BrandDetail };
    loading: boolean;
    error: ServiceError | null;
    lastFetch: number;
  };
  narratives: {
    byBrand: { [brandId: string]: Narrative[] };
    loading: { [brandId: string]: boolean };
    error: { [brandId: string]: ServiceError };
  };
  alerts: {
    active: PeakMetricsAlert[];
    history: PeakMetricsAlert[];
    unreadCount: number;
  };
  cache: {
    size: number;
    hits: number;
    misses: number;
  };
}

// Component Props Types
export interface BrandAnalyticsProps {
  brandId: string;
  onAlertTrigger?: (alert: PeakMetricsAlert) => void;
  refreshInterval?: number;
}

export interface InsightsDashboardProps {
  filterByRisk?: number;
  sortBy?: 'velocity' | 'risk' | 'mentions' | 'sentiment';
  onBrandSelect?: (brand: BrandOverview) => void;
}

// Workspace Types (from PeakMetrics API)
export interface Workspace {
  id: string;
  title: string;
  query: string;
  created: string;
  modified: string;
  settings?: {
    channels?: string[];
    languages?: string[];
  };
}