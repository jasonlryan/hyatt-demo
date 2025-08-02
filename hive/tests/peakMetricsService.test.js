const { PeakMetricsDataService } = require('../services/PeakMetricsDataService');
const LRUCache = require('../services/LRUCache');
const { PeakMetricsError, ErrorCodes } = require('../utils/errorHandler');

// Mock the PeakMetricsClient
jest.mock('../utils/peakMetricsClient');

describe('PeakMetricsDataService', () => {
  let service;
  let mockClient;

  beforeEach(() => {
    // Reset environment
    process.env.ENABLE_PEAK_METRICS = 'true';
    
    // Create service instance
    service = new PeakMetricsDataService();
    
    // Get mock client
    mockClient = service.client;
    
    // Clear cache before each test
    service.clearCache();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    test('should initialize when feature flag is enabled', () => {
      expect(service.isAvailable()).toBe(true);
      expect(service.client).toBeTruthy();
    });

    test('should not initialize when feature flag is disabled', () => {
      process.env.ENABLE_PEAK_METRICS = 'false';
      const disabledService = new PeakMetricsDataService();
      expect(disabledService.isAvailable()).toBe(false);
      expect(disabledService.client).toBeNull();
    });
  });

  describe('getAllBrandsOverview', () => {
    test('should return brands overview with calculated metrics', async () => {
      // Mock workspace data
      const mockWorkspaces = [
        { id: '1', title: 'Brand A', query: 'brand-a' },
        { id: '2', title: 'Brand B', query: 'brand-b' }
      ];

      const mockNarratives = [
        {
          title: 'Narrative 1',
          aggregations: { mentionCount: 100, avgSentiment: 20, relevancyScore: 80 }
        },
        {
          title: 'Narrative 2',
          aggregations: { mentionCount: 50, avgSentiment: -10, relevancyScore: 60 }
        }
      ];

      mockClient.getWorkspaces = jest.fn().mockResolvedValue(mockWorkspaces);
      mockClient.getNarratives = jest.fn().mockResolvedValue(mockNarratives);

      const result = await service.getAllBrandsOverview();

      expect(result.error).toBeNull();
      expect(result.cached).toBe(false);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({
        id: '1',
        title: 'Brand A',
        workspaceId: '1',
        last48hMentions: 150, // sum of mention counts
        velocity: expect.any(Number),
        riskScore: expect.any(Number)
      });
    });

    test('should return cached data on subsequent calls', async () => {
      // First call
      mockClient.getWorkspaces = jest.fn().mockResolvedValue([
        { id: '1', title: 'Brand A', query: 'brand-a' }
      ]);
      mockClient.getNarratives = jest.fn().mockResolvedValue([]);

      const firstResult = await service.getAllBrandsOverview();
      expect(firstResult.cached).toBe(false);

      // Second call
      const secondResult = await service.getAllBrandsOverview();
      expect(secondResult.cached).toBe(true);
      expect(mockClient.getWorkspaces).toHaveBeenCalledTimes(1);
    });

    test('should handle API errors gracefully', async () => {
      mockClient.getWorkspaces = jest.fn().mockRejectedValue(new Error('API Error'));

      const result = await service.getAllBrandsOverview();

      expect(result.error).toBeTruthy();
      expect(result.error.code).toBe('PEAKMETRICS_ERROR');
      expect(result.error.message).toContain('Failed to retrieve brands overview');
      expect(result.data).toBeNull();
    });
  });

  describe('getBrandById', () => {
    test('should return detailed brand information', async () => {
      const mockWorkspaces = [
        { id: '1', title: 'Brand A', query: 'brand-a' }
      ];

      const mockNarratives = [
        {
          id: 'n1',
          title: 'Top Story',
          summary: 'Summary text',
          aggregations: { mentionCount: 100, avgSentiment: 20, relevancyScore: 90 }
        }
      ];

      const mockMentions = [
        {
          id: 'm1',
          title: 'Article 1',
          url: 'https://example.com/1',
          published: '2024-01-01T00:00:00Z',
          sentiment: 15
        }
      ];

      mockClient.getWorkspaces = jest.fn().mockResolvedValue(mockWorkspaces);
      mockClient.getNarratives = jest.fn().mockResolvedValue(mockNarratives);
      mockClient.getMentions = jest.fn().mockResolvedValue(mockMentions);

      const result = await service.getBrandById('1');

      expect(result.error).toBeNull();
      expect(result.data).toMatchObject({
        id: '1',
        title: 'Brand A',
        topNarratives: expect.any(Array),
        sentimentBreakdown: expect.any(Object),
        channelBreakdown: expect.any(Object),
        samples: expect.any(Array),
        lastUpdated: expect.any(String)
      });
    });

    test('should find brand by name', async () => {
      const mockWorkspaces = [
        { id: '1', title: 'Brand A', query: 'brand-a' },
        { id: '2', title: 'Brand B', query: 'brand-b' }
      ];

      mockClient.getWorkspaces = jest.fn().mockResolvedValue(mockWorkspaces);
      mockClient.getNarratives = jest.fn().mockResolvedValue([]);
      mockClient.getMentions = jest.fn().mockResolvedValue([]);

      const result = await service.getBrandById('brand b');

      expect(result.error).toBeNull();
      expect(result.data.id).toBe('2');
      expect(result.data.title).toBe('Brand B');
    });

    test('should return error for non-existent brand', async () => {
      mockClient.getWorkspaces = jest.fn().mockResolvedValue([]);

      const result = await service.getBrandById('non-existent');

      expect(result.error).toBeTruthy();
      expect(result.error.message).toContain('Brand not found');
    });
  });

  describe('Cache functionality', () => {
    test('should cache data with correct TTL', async () => {
      const cacheKey = 'test:key';
      const testData = { test: 'data' };
      
      // Set cache directly
      service.cache.set(cacheKey, testData, 5000);

      // Verify cached
      expect(service.cache.has(cacheKey)).toBe(true);
      expect(service.cache.get(cacheKey)).toEqual(testData);

      // Check stats
      const stats = service.getCacheStats();
      expect(stats.size).toBe(1);
    });

    test('should clear cache', () => {
      // Add some data
      service.cache.set('key1', 'data1');
      service.cache.set('key2', 'data2');
      
      expect(service.cache.size()).toBe(2);

      // Clear cache
      service.clearCache();
      
      expect(service.cache.size()).toBe(0);
    });
  });

  describe('getTrendInsights', () => {
    test('should calculate trend insights correctly', async () => {
      const now = new Date();
      const mockRecentNarratives = [
        { aggregations: { mentionCount: 100 } },
        { aggregations: { mentionCount: 50 } }
      ];
      const mockYesterdayNarratives = [
        { aggregations: { mentionCount: 60 } },
        { aggregations: { mentionCount: 40 } }
      ];

      mockClient.getNarratives = jest.fn()
        .mockResolvedValueOnce(mockRecentNarratives)
        .mockResolvedValueOnce(mockYesterdayNarratives)
        .mockResolvedValueOnce([]);

      const result = await service.getTrendInsights('brand1');

      expect(result.error).toBeNull();
      expect(result.data).toMatchObject({
        workspaceId: 'brand1',
        growthRate24h: 50, // (150-100)/100 * 100
        momentum: 'steady',
        totalMentions: 150
      });
    });
  });

  describe('Error handling', () => {
    test('should handle service unavailable', async () => {
      service.client = null;

      const result = await service.getAllBrandsOverview();

      expect(result.error).toBeTruthy();
      expect(result.error.message).toContain('service not available');
    });

    test('should handle network errors with retry', async () => {
      let callCount = 0;
      mockClient.getWorkspaces = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount < 2) {
          throw new Error('Network error');
        }
        return [];
      });

      const result = await service.getAllBrandsOverview();

      // Should eventually succeed after retry
      expect(result.error).toBeNull();
      expect(result.data).toEqual([]);
    });
  });
});

describe('LRUCache', () => {
  let cache;

  beforeEach(() => {
    cache = new LRUCache({ maxSize: 3, defaultTTL: 1000 });
  });

  test('should evict least recently used item when full', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    
    // Access 'a' to make it recently used
    cache.get('a');
    
    // Add new item, should evict 'b'
    cache.set('d', 4);
    
    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
    expect(cache.has('c')).toBe(true);
    expect(cache.has('d')).toBe(true);
  });

  test('should expire items after TTL', async () => {
    cache.set('temp', 'data', 100); // 100ms TTL
    
    expect(cache.get('temp')).toBe('data');
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 150));
    
    expect(cache.get('temp')).toBeUndefined();
  });

  test('should deduplicate concurrent requests', async () => {
    let callCount = 0;
    const fetchFn = jest.fn().mockImplementation(async () => {
      callCount++;
      await new Promise(resolve => setTimeout(resolve, 100));
      return `result-${callCount}`;
    });

    // Make concurrent requests
    const [result1, result2] = await Promise.all([
      cache.dedupe('key', fetchFn),
      cache.dedupe('key', fetchFn)
    ]);

    expect(result1).toBe('result-1');
    expect(result2).toBe('result-1');
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  test('should track statistics correctly', () => {
    cache.set('a', 1);
    cache.get('a'); // hit
    cache.get('b'); // miss
    cache.get('a'); // hit

    const stats = cache.getStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBe('66.67%');
  });
});