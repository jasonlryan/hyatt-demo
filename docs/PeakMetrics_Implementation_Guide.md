# PeakMetrics Integration Implementation Guide

## Overview

This guide documents the implementation of the PeakMetrics Analytics integration based on the v2.0 plan. The implementation provides a robust, cached, and error-handled service layer for accessing PeakMetrics data throughout the Hive platform.

## Architecture Components

### 1. TypeScript Types (`frontend/src/types/peakMetrics.ts`)
- Comprehensive type definitions for all PeakMetrics data structures
- Ensures type safety across frontend components
- Includes interfaces for API responses, brand data, narratives, and trends

### 2. PeakMetricsDataService (`hive/services/PeakMetricsDataService.js`)
- Centralized service layer with brand-oriented API
- Key methods:
  - `getAllBrandsOverview()` - Lightweight brand list
  - `getBrandById(id)` - Detailed brand information
  - `getNarratives(id, options)` - Brand narratives
  - `getMentions(id, options)` - Brand mentions
  - `getTrendInsights(id)` - Trend analysis
- Singleton pattern for consistent instance management

### 3. LRU Cache (`hive/services/LRUCache.js`)
- In-memory caching with configurable TTL
- Features:
  - Request deduplication
  - Cache statistics tracking
  - Automatic expiration
  - LRU eviction policy
- Default TTLs:
  - Brand overviews: 10 minutes
  - Narratives/mentions: 5 minutes
  - Trend insights: 15 minutes

### 4. API Router (`hive/routes/peakmetrics.js`)
- RESTful endpoints for frontend access:
  - `GET /api/peakmetrics/brands` - All brands overview
  - `GET /api/peakmetrics/brands/:id` - Brand details
  - `GET /api/peakmetrics/brands/:id/narratives` - Brand narratives
  - `GET /api/peakmetrics/brands/:id/mentions` - Brand mentions
  - `GET /api/peakmetrics/brands/:id/trends` - Trend insights
  - `GET /api/peakmetrics/health` - Service health check
  - `GET /api/peakmetrics/cache/stats` - Cache statistics
  - `POST /api/peakmetrics/cache/clear` - Clear cache

### 5. Error Handling (`hive/utils/errorHandler.js`)
- Centralized error management
- Features:
  - Custom error types with codes
  - Structured logging
  - Retry logic with exponential backoff
  - Circuit breaker pattern
  - Express error middleware

### 6. Updated Agent Integrations
- **TrendingNewsAgent**: Now uses PeakMetricsDataService for brand data
- **BrandQAAgent**: Enhanced with PeakMetrics risk signals

## Configuration

### Environment Variables
```bash
# Enable PeakMetrics feature
ENABLE_PEAK_METRICS=true

# PeakMetrics API credentials
PEAKMETRICS_UN=your_username
PEAKMETRICS_PW=your_password
PEAKMETRICS_CLIENT_ID=hive-integration
```

### Feature Flag
The entire integration is protected by the `ENABLE_PEAK_METRICS` feature flag. When disabled:
- Service returns "not available" responses
- API endpoints return 503 status
- Agents fall back to non-PeakMetrics behavior

## Usage Examples

### Frontend (TypeScript)
```typescript
import { BrandOverview, PeakMetricsResponse } from '@/types/peakMetrics';

// Fetch all brands
const response = await fetch('/api/peakmetrics/brands');
const data: PeakMetricsResponse<BrandOverview[]> = await response.json();

if (!data.error) {
  console.log(`Found ${data.data.length} brands (cached: ${data.cached})`);
}
```

### Backend (Node.js)
```javascript
const { getInstance } = require('./services/PeakMetricsDataService');

const service = getInstance();
const result = await service.getBrandById('brand-name');

if (!result.error) {
  console.log(`Brand ${result.data.title} has ${result.data.last48hMentions} mentions`);
}
```

## Testing

Run the test suite:
```bash
npm test -- hive/tests/peakMetricsService.test.js
```

The tests cover:
- Service initialization
- API method functionality
- Caching behavior
- Error handling
- Edge cases

## Monitoring

### Health Check
```bash
curl http://localhost:3000/api/peakmetrics/health
```

### Cache Statistics
```bash
curl http://localhost:3000/api/peakmetrics/cache/stats
```

## Next Steps

1. **Frontend Implementation**
   - Build Insights Dashboard component
   - Add Brand Analytics side-tab
   - Implement real-time updates

2. **Enhanced Agent Integration**
   - Update StrategicInsightAgent
   - Update BrandLensAgent
   - Add risk-based workflow triggers

3. **Production Readiness**
   - Implement secure credential management
   - Add comprehensive monitoring
   - Set up alerting infrastructure
   - Configure rate limiting

4. **Performance Optimization**
   - Consider Redis for distributed caching
   - Implement cache warming strategies
   - Add request batching

## Troubleshooting

### Service Not Available
- Check `ENABLE_PEAK_METRICS` environment variable
- Verify credentials are set correctly
- Check API connectivity

### Cache Issues
- Use `/api/peakmetrics/cache/stats` to monitor
- Clear cache with POST to `/api/peakmetrics/cache/clear`
- Check TTL configurations

### API Errors
- Monitor logs for detailed error messages
- Check circuit breaker state in logs
- Verify rate limits haven't been exceeded

---

_Implementation completed: 2025-08-02_