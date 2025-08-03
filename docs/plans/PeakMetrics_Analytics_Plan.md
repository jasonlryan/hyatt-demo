# PeakMetrics Analytics Integration Plan

_Version 2.0 · 2025-08-02_
_Updated based on risk assessment findings_

---

## 1 · Objective

Provide a unified, data-driven analytics layer inside the Hive platform that surfaces real-time media intelligence from PeakMetrics for every client brand and feeds actionable insights directly into Hive orchestrations.

---

## 2 · Architecture Overview

```text
PeakMetrics API  →  peakMetricsClient.js  →  PeakMetricsDataService  →  Hive UI & Agents
                                       ↘  In-memory cache (10 min)
```

1. **peakMetricsClient.js** Low-level REST wrapper (auth, GET helpers).
2. **PeakMetricsDataService** Brand-oriented façade that returns:
   - `getAllBrandsOverview()` → lightweight list for dashboards.
   - `getBrandById(name|id)` → full BrandDetail object.
   - `getNarratives(id, opts)` / `getMentions(id, opts)` for drill-downs.
   - `getTrendInsights(id)` (velocity, half-life, growth rate).
3. **Cache layer** Simple in-memory LRU keyed by endpoint + params.
4. **UI components** and **Hive agents** query the service—not the client.

---

## 3 · Data Shapes

| Structure         | Key Fields                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **BrandOverview** | `id`, `title`, `last48hMentions`, `avgSentiment`, `velocity`, `riskScore`                |
| **BrandDetail**   | BrandOverview + `topNarratives[]`, `sentimentBreakdown`, `channelBreakdown`, `samples[]` |
| **Narrative**     | `title`, `mentionCount`, `avgSentiment`, `relevancy`, `summary`, `riskScore`             |
| **TrendInsights** | `firstSeen`, `growthRate24h`, `halfLifeDays`, `momentum`                                 |

`metricsTransform.js` already provides helper functions for most derived KPIs.

---

## 4 · User-Facing Features

1. **Insights Dashboard** (`/insights`)
   - Table of **BrandOverview** rows.
   - Colour-coded velocity & risk columns (green → red).
2. **Brand Analytics Side-Tab**
   - Embedded in every orchestration page.
   - Renders **BrandDetail** (narratives table, sentiment pie, mention list).
3. **Alerting Hooks**
   - `velocity > X` or `riskScore > Y` triggers Slack / email.
   - One-click “Start Crisis Workflow” button in UI.

---

## 5 · Agent Utilisation

| Agent                 | Data Consumed                  | Outcome                                          |
| --------------------- | ------------------------------ | ------------------------------------------------ |
| TrendingNewsAgent     | `topNarratives`                | More grounded trend analysis                     |
| StrategicInsightAgent | `TrendInsights`                | Validates human truth with quantitative momentum |
| BrandLensAgent        | `sentimentBreakdown`, channels | Adapts tone to sentiment & channel mix           |
| BrandQAAgent          | `riskScore`, `narrative.risk`  | Objective approval / rejection                   |

---

## 6 · Implementation Roadmap

| Sprint    | Deliverable                                          | Owner | Est. h |
| --------- | ---------------------------------------------------- | ----- | ------ |
| 1         | PeakMetricsDataService (overview & detail endpoints) | BE    | 8      |
| 1         | Cache layer + rate-limit handling                    | BE    | 4      |
| 2         | Insights Dashboard React components                  | FE    | 12     |
| 2         | Side-Tab integration in orchestration pages          | FE    | 8      |
| 3         | Agent wiring: TrendingNewsAgent uses narratives      | BE    | 6      |
| 3         | Risk scoring in BrandQAAgent                         | BE    | 4      |
| 4         | Alerting hooks (Slack + email)                       | BE    | 6      |
| 4         | UX polish, QA, documentation                         | FE/BE | 6      |
| **Total** | **≈ 54 h**                                           |       |        |

---

## 7 · Open Questions

1. Threshold values for velocity & risk that trigger alerts.
2. Do we store PeakMetrics data snapshots in DB for audit / historics?
3. Access control: should Insights be visible to all users or admin-only?

---

## 8 · Next Actions

1. Approve data shapes & UI placement (stakeholders).
2. Create Jira tickets per sprint-task.
3. Start Sprint 1 with service + cache implementation.

---

_Author: Hive Team · Last updated: 2025-08-02_
