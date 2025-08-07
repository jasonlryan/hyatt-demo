# PeakMetrics Analytics Integration Plan

**Document**: PeakMetrics Analytics Integration Plan  
**Version**: 3.0 (Consolidated)  
**Date**: 2025-01-08  
**Status**: Ready for Implementation  
**Previous Versions**: Consolidated from v1.0 and v2.0  

---

## Executive Summary

Integrate PeakMetrics real-time media intelligence into the Hive platform to provide data-driven insights for orchestrations and enable intelligent, metrics-aware agent decision making.

---

## 1. Objective

Provide a unified analytics layer that:
- Surfaces real-time PeakMetrics data in Hive UI
- Feeds actionable brand intelligence to orchestration agents
- Enables proactive crisis management and opportunity detection
- Maintains system performance and security standards

---

## 2. Architecture Overview

```text
PeakMetrics API → peakMetricsClient.js → PeakMetricsDataService → API Router → Frontend
                                     ↘ Cache Layer (Memory/Redis) ↗             ↘ Agents
                                           ↓
                                    Error Handler + Monitoring
```

### Component Status Assessment:
| Component | Status | Description |
|-----------|--------|-------------|
| **peakMetricsClient.js** | ✅ EXISTS | Low-level REST wrapper (needs security enhancements) |
| **PeakMetricsDataService** | ❌ NEW | Brand-oriented business logic façade |
| **Cache Layer** | ❌ NEW | LRU cache with TTL and request deduplication |
| **API Router** | ❌ NEW | Express endpoints for frontend consumption |
| **Error Handler** | ❌ NEW | Centralized error management |
| **Frontend Components** | ❌ NEW | Dashboard and side-panel integrations |
| **Agent Integration** | 🔄 PARTIAL | Some agents have basic PeakMetrics integration |

---

## 3. Data Architecture

### Core Data Structures

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

interface BrandDetail extends BrandOverview {
  topNarratives: Narrative[];
  sentimentBreakdown: SentimentData;
  channelBreakdown: ChannelData;
  samples: MentionSample[];
}

interface Narrative {
  title: string;
  mentionCount: number;
  avgSentiment: number;
  relevancy: number;
  summary: string;
  riskScore: number;
}

interface TrendInsights {
  firstSeen: string;
  growthRate24h: number;
  halfLifeDays: number;
  momentum: 'rising' | 'stable' | 'declining';
}
```

### Service Layer API

| Method | Returns | Purpose |
|--------|---------|---------|
| `getAllBrandsOverview()` | `BrandOverview[]` | Dashboard data |
| `getBrandById(id)` | `BrandDetail` | Detailed brand analytics |
| `getNarratives(id, opts)` | `Narrative[]` | Narrative drill-down |
| `getTrendInsights(id)` | `TrendInsights` | Growth analytics |

---

## 4. User-Facing Features

### 4.1 Insights Dashboard (`/insights`)
- **Purpose**: Central brand monitoring hub
- **Components**:
  - Sortable table of all brands with key metrics
  - Color-coded risk indicators (🟢 → 🔴)
  - Export functionality (CSV/JSON)
  - Real-time updates with configurable polling
  - Loading states and error boundaries

### 4.2 Orchestration Side Panel
- **Purpose**: Contextual brand data during workflow creation
- **Components**:
  - Brand analytics tab in orchestration pages
  - Narrative summary cards
  - Sentiment breakdown charts
  - Recent mentions timeline
  - Graceful degradation when offline

### 4.3 Intelligent Alerting
- **Threshold-based notifications**:
  - Velocity spikes (configurable threshold)
  - Risk score escalation
  - Sentiment shifts
- **Action triggers**:
  - One-click crisis workflow initiation
  - Slack/email notifications
  - Alert acknowledgment tracking

---

## 5. Agent Enhancement Integration

### Agent Intelligence Upgrades

| Agent | Data Integration | Enhanced Capability | Implementation Status |
|-------|------------------|-------------------|---------------------|
| **TrendingNewsAgent** | `topNarratives`, `velocity` | Real-time trend validation vs. social data | 🔄 Partial |
| **StrategicInsightAgent** | `TrendInsights`, `momentum` | Quantitative validation of human truths | ❌ TODO |
| **BrandLensAgent** | `sentimentBreakdown`, `channelBreakdown` | Context-aware tone adaptation | ❌ TODO |
| **BrandQAAgent** | `riskScore`, `narrative.risk` | Data-driven approval decisions | 🔄 Partial |

### Integration Pattern
```javascript
// Example: Enhanced TrendingNewsAgent
async analyzeTrends(topic, context = {}, orchestrationType = 'hyatt') {
  // Get PeakMetrics data for context brand
  const brandData = await this.peakMetricsService.getBrandById(context.brandId);
  
  // Combine external trends with brand-specific narratives
  const combinedInsights = this.synthesizeTrends(topic, brandData.topNarratives);
  
  // Return orchestration-aware insights
  return this.formatForOrchestration(combinedInsights, orchestrationType);
}
```

---

## 6. Implementation Roadmap

### Pre-Implementation Requirements (Week 0)
| Task | Owner | Hours | Priority |
|------|-------|-------|----------|
| Secure credential management setup | DevOps | 4 | CRITICAL |
| TypeScript interface definitions | FE/BE | 4 | HIGH |
| Error handling framework design | BE | 4 | HIGH |
| API endpoint specification | BE | 4 | HIGH |
| **Pre-Sprint Total** | | **16h** | |

### Development Phases

#### Phase 1: Service Foundation (Weeks 1-2)
| Task | Owner | Hours | Dependencies |
|------|-------|-------|--------------|
| PeakMetricsDataService implementation | BE | 12 | Pre-req complete |
| In-memory LRU cache with TTL | BE | 8 | Service exists |
| API router endpoints + middleware | BE | 8 | Cache working |
| Basic error handling integration | BE | 4 | All above |
| **Phase 1 Total** | | **32h** | |

#### Phase 2: Frontend Integration (Weeks 3-4)
| Task | Owner | Hours | Dependencies |
|------|-------|-------|--------------|
| Insights Dashboard components | FE | 16 | API available |
| Frontend state management | FE | 8 | Components ready |
| Side-panel orchestration integration | FE | 12 | State management |
| Loading states and error boundaries | FE | 6 | UI components |
| **Phase 2 Total** | | **42h** | |

#### Phase 3: Intelligence Enhancement (Weeks 5-6)
| Task | Owner | Hours | Dependencies |
|------|-------|-------|--------------|
| Enhanced agent integrations | BE | 12 | All agents updated |
| Alerting infrastructure | BE | 8 | Service stable |
| Performance optimization | BE | 6 | Full integration |
| **Phase 3 Total** | | **26h** | |

#### Phase 4: Production Readiness (Weeks 7-8)
| Task | Owner | Hours | Dependencies |
|------|-------|-------|--------------|
| Monitoring and observability | DevOps | 8 | Feature complete |
| Documentation and testing | FE/BE | 8 | All features |
| Performance testing and tuning | BE | 6 | Production env |
| **Phase 4 Total** | | **22h** | |

### **Total Estimated Effort: 138 hours** (17 development days)

---

## 7. Technical Implementation Details

### 7.1 Caching Strategy
- **Brand Overviews**: 10-minute TTL, high frequency access
- **Brand Details**: 5-minute TTL, moderate frequency
- **Narratives/Mentions**: 5-minute TTL, high volatility
- **Cache Warming**: Pre-fetch for frequently accessed brands
- **Request Deduplication**: Prevent concurrent identical requests

### 7.2 Performance Considerations
- Async loading for all PeakMetrics data
- Progressive enhancement (UI works without data)
- Request batching where possible
- Circuit breaker for API failures
- Graceful degradation strategies

### 7.3 Security Implementation
- Secure credential storage (AWS Secrets Manager/Vault)
- API key rotation schedule (monthly)
- Audit logging for all API calls
- Rate limiting and abuse protection
- Data encryption in transit and at rest

---

## 8. Risk Assessment & Mitigation

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| **API Rate Limits** | HIGH | Request queuing, backoff strategies, caching |
| **Service Outages** | MEDIUM | Cached fallback, graceful degradation |
| **Performance Impact** | MEDIUM | Async loading, lazy evaluation, monitoring |
| **Data Inconsistency** | LOW | Version tracking, cache invalidation |

### Security Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Credential Exposure** | HIGH | Vault integration, principle of least privilege |
| **Data Leakage** | HIGH | Access controls, audit logs, data classification |
| **Token Compromise** | MEDIUM | Short-lived tokens, automatic rotation |

### Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Cost Overruns** | MEDIUM | Usage monitoring, budget alerts, quotas |
| **Low Adoption** | LOW | Phased rollout, training, feedback loops |
| **Feature Creep** | LOW | Strict scope management, MVP focus |

---

## 9. Success Metrics

### Technical Metrics
- **API Response Time**: <500ms p95
- **Cache Hit Rate**: >80%
- **Error Rate**: <1%
- **Availability**: >99.5%

### Business Metrics
- **User Engagement**: Dashboard usage >70% of active users
- **Agent Enhancement**: Measurable improvement in orchestration quality
- **Crisis Response**: Faster incident detection and response
- **Cost Efficiency**: API usage within budget constraints

### User Experience Metrics
- **Load Time**: Dashboard loads in <2 seconds
- **Error Recovery**: Graceful handling of API failures
- **Data Freshness**: 95% of data <10 minutes old

---

## 10. Phased Rollout Strategy

### Phase A: Internal Testing (Weeks 1-4)
- Backend services with feature flags
- Admin-only dashboard access
- Internal team testing and feedback
- Performance baseline establishment

### Phase B: Limited Beta (Weeks 5-6)
- Enable for select power users
- A/B test agent enhancements
- Gather usage analytics and feedback
- Monitor system performance impact

### Phase C: Full Deployment (Weeks 7-8)
- Enable for all users
- Full alerting and automation
- Production monitoring and support
- Documentation and training

---

## 11. Open Questions & Decisions Required

### Business Decisions
1. **Alert Thresholds**: What velocity/risk scores should trigger notifications?
2. **Access Control**: Admin-only insights or all-user access?
3. **Data Retention**: How long to cache/store PeakMetrics snapshots?
4. **Budget Allocation**: API call limits and cost monitoring thresholds?

### Technical Decisions
1. **Cache Backend**: Redis cluster vs. in-memory for scalability?
2. **Data Persistence**: Store historical snapshots for trend analysis?
3. **Fetching Strategy**: Real-time polling vs. webhook notifications?
4. **Monitoring Stack**: Integration with existing observability tools?

---

## 12. Next Steps (Priority Order)

### Immediate Actions (Before Development)
1. **🔒 Security Review**: Implement secure credential management
2. **📋 Architecture Approval**: Stakeholder sign-off on design
3. **📖 API Documentation**: Complete endpoint specifications
4. **🏗️ Environment Setup**: Development and staging environment preparation

### Week 1 Deliverables
1. Secure credential management implementation
2. PeakMetricsDataService foundation
3. Basic caching framework
4. Error handling and logging setup

### Project Management
1. Create detailed Jira epic with story breakdown
2. Set up monitoring dashboards for development progress
3. Establish weekly cross-team sync meetings
4. Define code review process for PeakMetrics features

---

## 13. Integration with Current System

### Dynamic Orchestration Compatibility
This PeakMetrics integration is designed to work seamlessly with the newly implemented dynamic orchestration system:

- **Agent Enhancement**: All orchestration-aware agents can leverage PeakMetrics data
- **Configuration-Driven**: PeakMetrics integration follows the same config-based approach
- **Cross-Orchestration**: Works with both Hive (Spark) and Hyatt (Campaign) workflows
- **Future-Proof**: Architecture supports additional orchestration types

### Backward Compatibility
- Feature flags ensure gradual rollout
- Existing functionality unaffected during implementation
- Graceful degradation maintains system stability

---

_This consolidated plan incorporates insights from previous versions and aligns with current system architecture. Author: Hive Development Team · Last updated: 2025-01-08_