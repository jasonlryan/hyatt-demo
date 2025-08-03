import { useState, useEffect, useCallback } from 'react';
import { 
  BrandOverview, 
  BrandDetail, 
  Narrative, 
  TrendInsights,
  PeakMetricsResponse,
  NarrativeOptions,
  MentionOptions,
  MentionSample
} from '../types/peakMetrics';

const API_BASE = '/api/peakmetrics';

// Helper to check if PeakMetrics is enabled
async function checkPeakMetricsEnabled(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return data.service?.enabled === true;
  } catch {
    return false;
  }
}

// Custom hook for fetching all brands overview
export function useBrandsOverview(options?: { 
  sortBy?: string; 
  filterByRisk?: number;
  refreshInterval?: number;
  enabled?: boolean;
}) {
  const [data, setData] = useState<BrandOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cached, setCached] = useState(false);
  const [enabled, setEnabled] = useState<boolean | null>(null);

  const fetchBrands = useCallback(async () => {
    if (options?.enabled === false) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if enabled
      const isEnabled = await checkPeakMetricsEnabled();
      setEnabled(isEnabled);
      
      if (!isEnabled) {
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (options?.sortBy) params.append('sortBy', options.sortBy);
      if (options?.filterByRisk !== undefined) params.append('filterByRisk', options.filterByRisk.toString());

      const response = await fetch(`${API_BASE}/brands?${params}`);
      const result: PeakMetricsResponse<BrandOverview[]> = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      setData(result.data || []);
      setCached(result.cached);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch brands'));
    } finally {
      setLoading(false);
    }
  }, [options?.sortBy, options?.filterByRisk, options?.enabled]);

  useEffect(() => {
    if (options?.enabled === true) {
      fetchBrands();

      // Set up refresh interval if specified
      if (options?.refreshInterval && options.refreshInterval > 0) {
        const interval = setInterval(fetchBrands, options.refreshInterval);
        return () => clearInterval(interval);
      }
    }
  }, [fetchBrands, options?.refreshInterval, options?.enabled]);

  return { data, loading, error, cached, enabled, refetch: fetchBrands };
}

// Custom hook for fetching brand details
export function useBrandDetail(brandId: string | null, options?: { 
  refreshInterval?: number;
  enabled?: boolean;
}) {
  const [data, setData] = useState<BrandDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cached, setCached] = useState(false);

  const fetchBrand = useCallback(async () => {
    if (!brandId || options?.enabled === false) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/brands/${encodeURIComponent(brandId)}`);
      const result: PeakMetricsResponse<BrandDetail> = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      setData(result.data);
      setCached(result.cached);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch brand details'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [brandId, options?.enabled]);

  useEffect(() => {
    if (brandId && options?.enabled === true) {
      fetchBrand();

      // Set up refresh interval if specified
      if (options?.refreshInterval && options.refreshInterval > 0) {
        const interval = setInterval(fetchBrand, options.refreshInterval);
        return () => clearInterval(interval);
      }
    }
  }, [brandId, fetchBrand, options?.refreshInterval, options?.enabled]);

  return { data, loading, error, cached, refetch: fetchBrand };
}

// Custom hook for fetching narratives
export function useBrandNarratives(
  brandId: string | null, 
  options?: NarrativeOptions & { enabled?: boolean }
) {
  const [data, setData] = useState<Narrative[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cached, setCached] = useState(false);

  const fetchNarratives = useCallback(async () => {
    if (!brandId || options?.enabled === false) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.sort) params.append('sort', options.sort);
      if (options?.since) params.append('since', options.since);
      if (options?.to) params.append('to', options.to);
      if (options?.sentimentMin !== undefined) params.append('sentimentMin', options.sentimentMin.toString());
      if (options?.sentimentMax !== undefined) params.append('sentimentMax', options.sentimentMax.toString());

      const response = await fetch(`${API_BASE}/brands/${encodeURIComponent(brandId)}/narratives?${params}`);
      const result: PeakMetricsResponse<Narrative[]> = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      setData(result.data || []);
      setCached(result.cached);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch narratives'));
    } finally {
      setLoading(false);
    }
  }, [brandId, options?.enabled, options?.limit, options?.sort, options?.since, options?.to, options?.sentimentMin, options?.sentimentMax]);

  useEffect(() => {
    if (options?.enabled === true) {
      fetchNarratives();
    }
  }, [brandId, options?.enabled, options?.limit, options?.sort, options?.since, options?.to, options?.sentimentMin, options?.sentimentMax]);

  return { data, loading, error, cached, refetch: fetchNarratives };
}

// Custom hook for fetching mentions
export function useBrandMentions(
  brandId: string | null,
  options?: MentionOptions & { enabled?: boolean }
) {
  const [data, setData] = useState<MentionSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cached, setCached] = useState(false);

  const fetchMentions = useCallback(async () => {
    if (!brandId || options?.enabled === false) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.sort) params.append('sort', options.sort);
      if (options?.order) params.append('order', options.order);
      if (options?.since) params.append('since', options.since);
      if (options?.to) params.append('to', options.to);
      if (options?.channel) params.append('channel', options.channel);

      const response = await fetch(`${API_BASE}/brands/${encodeURIComponent(brandId)}/mentions?${params}`);
      const result: PeakMetricsResponse<MentionSample[]> = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      setData(result.data || []);
      setCached(result.cached);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch mentions'));
    } finally {
      setLoading(false);
    }
  }, [brandId, options?.enabled, options?.limit, options?.sort, options?.order, options?.since, options?.to, options?.channel]);

  useEffect(() => {
    if (options?.enabled === true) {
      fetchMentions();
    }
  }, [brandId, options?.enabled, options?.limit, options?.sort, options?.order, options?.since, options?.to, options?.channel]);

  return { data, loading, error, cached, refetch: fetchMentions };
}

// Custom hook for fetching trend insights
export function useBrandTrends(brandId: string | null, options?: {
  enabled?: boolean;
  refreshInterval?: number;
}) {
  const [data, setData] = useState<TrendInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cached, setCached] = useState(false);

  const fetchTrends = useCallback(async () => {
    if (!brandId || options?.enabled === false) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/brands/${encodeURIComponent(brandId)}/trends`);
      const result: PeakMetricsResponse<TrendInsights> = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      setData(result.data);
      setCached(result.cached);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trends'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [brandId, options?.enabled]);

  useEffect(() => {
    if (options?.enabled === true) {
      fetchTrends();

      // Set up refresh interval if specified
      if (options?.refreshInterval && options.refreshInterval > 0) {
        const interval = setInterval(fetchTrends, options.refreshInterval);
        return () => clearInterval(interval);
      }
    }
  }, [fetchTrends, options?.refreshInterval, options?.enabled]);

  return { data, loading, error, cached, refetch: fetchTrends };
}

// Hook for cache management
export function usePeakMetricsCache() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/cache/stats`);
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch cache stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/cache/clear`, { method: 'POST' });
      await fetchStats(); // Refresh stats after clearing
    } catch (err) {
      console.error('Failed to clear cache:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, fetchStats, clearCache };
}