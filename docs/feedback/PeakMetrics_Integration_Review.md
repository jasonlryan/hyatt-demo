# Integrating Peak Metrics into the Hive Orchestration Stack

_Prepared 2025-07-31_

---

## Contents

1. [Why Peak Metrics is a good fit](#1-why-peakmetrics-is-a-good-fit)
2. [Integration points inside the Hive workflow](#2-integration-points-inside-the-hive-workflow)
3. [Technical implementation plan](#3-technical-implementation-plan)
4. [Agent-level changes & sample code](#4-agent-level-changes--sample-code)
5. [Analytics capabilities unlocked](#5-analytics-capabilities-unlocked)
6. [Roll-out roadmap & effort estimate](#6-roll-out-roadmap--effort-estimate)

---

## 1. Why Peak Metrics is a good fit

- Quantitative media telemetry (volume, sentiment, channel mix, relevancy) grounds the Hive’s LLM-generated insights in real data.
- The Peak Metrics hierarchy—**Workspaces → Narratives → Mentions**—maps cleanly to the Hive’s concepts of _brand_, _cultural moment_, and _evidence_.
- Clean JSON schemas with powerful filters (date, channels, sentiment) make it trivial to pull only the required slice.
- Simple JWT bearer flow for authentication (`POST /access/token`) fits neatly into Node back-end services.

---

## 2. Integration points inside the Hive workflow

| Hive Step                              | Current Behaviour                        | Peak Metrics Enhancement                                                                                                                           |
| -------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pre-workflow**                       | PR-Manager receives brand context only.  | Look up or store the brand’s `workspaceId` (`GET /workspaces`) and place it in `context.peakMetrics.workspaceId`.                                  |
| **Step 2 – TrendingNewsAgent**         | LLM scans the internet for hot topics.   | `GET /workspaces/{id}/narratives` (last 48 h) → top narratives with `mentionCount`, `avgSentiment`, `relevancyScore`. Feed to LLM for explanation. |
| **Step 3 – StrategicInsightAgent**     | Generates "human truth" from LLM only.   | Provide channel distribution & sample mentions as grounding evidence.                                                                              |
| **Step 5 – BrandLensAgent**            | Applies brand lens on LLM output.        | Pre-filter narratives by brand pillars before prompting.                                                                                           |
| **BrandQAAgent**                       | Approves/denies based on creative rules. | Add numerical signals (`mentionCount`, `avgSentiment`, `relevancyScore`) – LLM outputs `riskScore`.                                                |
| **TrendLongevityEstimatorAgent (new)** | N/A                                      | `/workspaces/{id}/mentions` over 7- & 30-day windows → decay curve → forecast `predictedMentions30d`, `halfLifeDays`.                              |
| **DeploymentOptimizerAgent (new)**     | N/A                                      | Daily poll narratives post-launch; trigger creative refresh when sentiment drops or volume stalls.                                                 |

---

## 3. Technical implementation plan

### Authentication & Client Wrapper

```ts
// hive/utils/peakMetricsClient.js
class PeakMetricsClient {
  constructor({ username, password, clientId }) {
    /* store creds */
  }
  async getToken() {
    /* POST /access/token */
  }
  async get(path, params) {
    /* bearer request with cached JWT; refresh on 401 */
  }
}
```

- Cache JWT in memory/Redis for the reported `ExpiresIn` seconds.

### Rate Limiting & Caching

- Limit narratives calls to ≤50 rows per workflow.
- Store the result once in `context.peakMetrics` so multiple agents reuse the same data.

### Data-shaping helpers

```ts
export const topNarratives = (arr, k = 5) =>
  arr.sort((a, b) => b.relevancyScore - a.relevancyScore).slice(0, k);
export const sentimentRisk = (s) =>
  s < -20 ? "High" : s < 0 ? "Medium" : "Low";
```

---

## 4. Agent-level changes & sample code

### TrendingNewsAgent (excerpt)

```js
async analyzeTrends(topic, ctx) {
  const wid = ctx.peakMetrics?.workspaceId;
  if (wid) {
    const data = await peak.get(`/workspaces/${wid}/narratives`, {
      since: ctx.since, to: ctx.to, sort: 'relevancy', limit: 20
    });
    ctx.trendData = data;            // stash
    return data;                     // optionally still call LLM for narrative text
  }
  return await super.analyzeTrends(topic, ctx); // fallback
}
```

### BrandQAAgent – prompt snippet

```
Numerical signals:
- Total mentions: {{mentionCount}}
- Avg sentiment: {{avgSentiment}}
- Relevancy score: {{relevancyScore}}

Using these plus creative criteria, output:
{
  approved: boolean,
  riskScore: 0-100,
  feedback: "…"
}
```

### TrendLongevityEstimatorAgent (new)

```js
const series7  = await peak.get(`/workspaces/${wid}/mentions`, { since: now-7d,  to: now });
const series30 = await peak.get(`/workspaces/${wid}/mentions`, { since: now-30d, to: now });
const slope = regression(series30.map(p=>p.mentionCount));
return {
  halfLifeDays: Math.log(2)/-slope,
  predictedMentions30d: forecast(series7, slope)
};
```

---

## 5. Analytics capabilities unlocked

- Real-time narrative feed in Hive UI (spark-line of mention volume & sentiment).
- Campaign health widget: risk heat-map, channel diffusion, longevity forecast.
- Automated weekly wrap-up slides/PDF pulling Peak Metrics charts + Hive creative.

---

## 6. Roll-out roadmap & effort estimate

| Phase     | Scope                                    | Est. hours |
| --------- | ---------------------------------------- | ---------- |
| 1         | `PeakMetricsClient` + env wiring         | 4          |
| 2         | TrendingNewsAgent integration            | 6          |
| 3         | Risk scoring in BrandQAAgent             | 3          |
| 4         | TrendLongevityEstimatorAgent + UI        | 8          |
| 5         | DeploymentOptimizerAgent with daily cron | 6          |
| 6         | QA, rate-limit hardening, docs           | 4          |
| **Total** | **~31 h (one sprint)**                   |            |

---

### Bottom line

Peak Metrics transforms the Hive from a purely generative system into a **data-grounded, closed-loop platform**—quantifying audience reaction, validating creative risk, and continuously optimising output based on live signals.
