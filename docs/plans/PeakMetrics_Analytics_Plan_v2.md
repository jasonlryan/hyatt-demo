# PeakMetrics Analytics Integration Plan

_Version 2.0 · 2025-08-02_  
_Updated based on risk assessment findings_

---

## 1 · Objective

Provide a unified, data-driven analytics layer inside the Hive platform that surfaces real-time media intelligence from PeakMetrics for every client brand and feeds actionable insights directly into Hive orchestrations.

---

## 2 · Architecture Overview

```text
PeakMetrics API  →  peakMetricsClient.js  →  PeakMetricsDataService  →  API Router  →  Hive UI
                                       ↘  Cache Layer (Redis/Memory)  ↗            ↘  Hive Agents
                                              ↓
                                          Error Handler
```

### Components Status:
1. **peakMetricsClient.js** ✅ EXISTS - Low-level REST wrapper (needs security enhancements).
2. **PeakMetricsDataService** ❌ NEW - Brand-oriented façade that returns:
   - `getAllBrandsOverview()` → lightweight list for dashboards.
   - `getBrandById(name|id)` → full BrandDetail object.
   - `getNarratives(id, opts)` / `getMentions(id, opts)` for drill-downs.
   - `getTrendInsights(id)` (velocity, half-life, growth rate).
   - Built-in error handling and retry logic.
3. **Cache layer** ❌ NEW - LRU cache with:
   - 10-minute TTL for brand overviews
   - 5-minute TTL for narratives/mentions
   - Request deduplication
   - Cache warming for frequently accessed brands
4. **API Router** ❌ NEW - Express endpoints for frontend access:
   - `GET /api/peakmetrics/brands`
   - `GET /api/peakmetrics/brands/:id`
   - `GET /api/peakmetrics/brands/:id/narratives`
5. **Error Handler** ❌ NEW - Centralized error management with user notifications.

---

## 3 · Data Shapes

| Structure         | Key Fields                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **BrandOverview** | `id`, `title`, `last48hMentions`, `avgSentiment`, `velocity`, `riskScore`                |
| **BrandDetail**   | BrandOverview + `topNarratives[]`, `sentimentBreakdown`, `channelBreakdown`, `samples[]` |
| **Narrative**     | `title`, `mentionCount`, `avgSentiment`, `relevancy`, `summary`, `riskScore`             |
| **TrendInsights** | `firstSeen`, `growthRate24h`, `halfLifeDays`, `momentum`                                 |

### TypeScript Interfaces (NEW)
```typescript
interface PeakMetricsResponse<T> {
  data: T;
  error?: string;
  cached: boolean;
  timestamp: number;
}

interface BrandOverview {
  id: string;
  title: string;
  workspaceId: string;
  last48hMentions: number;
  avgSentiment: number;
  velocity: number;
  riskScore: number;
}
```

`metricsTransform.js` already provides helper functions for most derived KPIs.

---

## 4 · User-Facing Features

1. **Insights Dashboard** (`/insights`)
   - Table of **BrandOverview** rows.
   - Colour-coded velocity & risk columns (green → red).
   - Loading states and error boundaries.
   - Export functionality (CSV/JSON).
   
2. **Brand Analytics Side-Tab**
   - Embedded in every orchestration page.
   - Renders **BrandDetail** (narratives table, sentiment pie, mention list).
   - Real-time updates via polling (configurable interval).
   - Graceful degradation when PeakMetrics unavailable.
   
3. **Alerting Hooks**
   - `velocity > X` or `riskScore > Y` triggers Slack / email.
   - One-click "Start Crisis Workflow" button in UI.
   - Alert history and acknowledgment tracking.

---

## 5 · Agent Utilisation

| Agent                 | Data Consumed                  | Outcome                                          | Status    |
| --------------------- | ------------------------------ | ------------------------------------------------ | --------- |
| TrendingNewsAgent     | `topNarratives`                | More grounded trend analysis                     | ✅ Partial |
| StrategicInsightAgent | `TrendInsights`                | Validates human truth with quantitative momentum | ❌ TODO    |
| BrandLensAgent        | `sentimentBreakdown`, channels | Adapts tone to sentiment & channel mix           | ❌ TODO    |
| BrandQAAgent          | `riskScore`, `narrative.risk`  | Objective approval / rejection                   | ✅ Partial |

---

## 6 · Implementation Roadmap (Revised)

### Pre-Sprint Requirements (MUST COMPLETE FIRST)
| Task                               | Owner | Est. h | Priority |
| ---------------------------------- | ----- | ------ | -------- |
| Secure credential management setup | BE    | 4      | HIGH     |
| TypeScript interfaces & API types  | FE/BE | 4      | HIGH     |
| Error handling framework           | BE    | 4      | HIGH     |
| API endpoint scaffolding           | BE    | 4      | HIGH     |
| **Pre-Sprint Total**               |       | **16** |          |

### Development Sprints
| Sprint    | Deliverable                                          | Owner | Est. h | Dependencies      |
| --------- | ---------------------------------------------------- | ----- | ------ | ----------------- |
| 1         | PeakMetricsDataService implementation                | BE    | 12     | Pre-sprint done   |
| 1         | In-memory cache with LRU + TTL                      | BE    | 8      | Service exists    |
| 2         | API Router endpoints + middleware                    | BE    | 8      | Service complete  |
| 2         | Insights Dashboard React components                  | FE    | 16     | API available     |
| 2         | Frontend state management for PeakMetrics            | FE    | 8      | Types defined     |
| 3         | Side-Tab integration in orchestration pages          | FE    | 12     | Dashboard done    |
| 3         | Enhanced agent integration (fix existing)            | BE    | 8      | Service stable    |
| 4         | Alerting infrastructure + webhooks                   | BE    | 10     | All features done |
| 4         | Performance optimization & monitoring                | BE    | 6      | In production     |
| 4         | Documentation, tests, and deployment                 | FE/BE | 8      | Feature complete  |
| **Total** | **≈ 96 h** (was 54h)                                |       |        |                   |

---

## 7 · Open Questions & Decisions Needed

### Business Decisions
1. Threshold values for velocity & risk that trigger alerts.
2. Access control: should Insights be visible to all users or admin-only?
3. Data retention policy for cached PeakMetrics data.
4. Budget for API calls and rate limits.

### Technical Decisions
1. Redis vs in-memory cache (scalability vs simplicity).
2. Store PeakMetrics snapshots in DB for audit/historics?
3. Synchronous vs asynchronous data fetching strategy.
4. Circuit breaker thresholds for API failures.
5. Monitoring and alerting infrastructure (Datadog, New Relic, etc.).

### Security Decisions
1. Credential storage solution (AWS Secrets Manager, Vault, etc.).
2. API key rotation schedule.
3. Audit logging requirements.
4. Data encryption at rest and in transit.

---

## 8 · Next Actions (Priority Order)

### Immediate (Before ANY Development)
1. **Security Review** - Choose and implement secure credential management.
2. **Architecture Review** - Approve revised architecture with all stakeholders.
3. **Define API Contract** - Document all endpoints, request/response formats.
4. **Create TypeScript Types** - Full type definitions for PeakMetrics data.

### Week 1
1. Set up secure credential management system.
2. Implement PeakMetricsDataService with proper abstraction.
3. Create basic in-memory cache implementation.
4. Set up error handling and logging framework.

### Week 2
1. Build API router and endpoints.
2. Begin frontend component development.
3. Create integration tests for service layer.
4. Document API usage for frontend team.

### Tracking
1. Create detailed Jira tickets with acceptance criteria.
2. Set up monitoring dashboards for API usage.
3. Schedule weekly sync meetings for cross-team coordination.
4. Establish code review process for all PeakMetrics changes.

---

## 9 · Risk Mitigation Strategies

### Technical Risks
1. **API Rate Limits** → Implement request queuing and backoff strategies.
2. **Service Outages** → Graceful degradation with cached data fallback.
3. **Performance Impact** → Async loading, lazy evaluation, progressive enhancement.
4. **Data Inconsistency** → Version tracking, cache invalidation strategies.

### Security Risks
1. **Credential Exposure** → Vault integration, principle of least privilege.
2. **Data Leakage** → Audit logs, access controls, data classification.
3. **Token Compromise** → Short-lived tokens, automatic rotation.

### Business Risks
1. **Cost Overruns** → Usage monitoring, budget alerts, quota management.
2. **User Adoption** → Phased rollout, user training, feedback loops.
3. **Feature Creep** → Strict scope management, MVP focus.

---

## 10 · Phased Rollout Strategy (NEW)

### Phase 1: Foundation (Weeks 1-2)
- Backend service with feature flag
- Basic caching and error handling
- Internal testing only

### Phase 2: Read-Only Dashboard (Weeks 3-4)
- Insights dashboard for admins
- No agent integration yet
- Gather usage metrics and feedback

### Phase 3: Agent Enhancement (Weeks 5-6)
- Enable PeakMetrics in agents
- A/B test with select brands
- Monitor performance impact

### Phase 4: Full Integration (Weeks 7-8)
- Enable for all users
- Alerting and automation
- Production monitoring

---

_Author: Hive Team · Last updated: 2025-08-02 (v2.0 - Post Risk Assessment)_