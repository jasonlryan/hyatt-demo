# Hive Agent Flow – Feedback & Responses

> Consolidated 2025-07-31

---

## 1. Are brand lenses applied by humans or by the technology?

**Response:** Fully automated. The `BrandLensAgent` class builds an LLM prompt and returns structured JSON that feeds the next steps. Humans may review/edit in the UI, but the first pass is machine-generated.

---

## 2. How is the output delivered – e-mail or in-platform?

**Response:** Currently in-platform only. The React frontend polls `GET /api/hive-orchestrate/:id` for real-time updates. No SMTP code exists yet; adding e-mail would require a small post-workflow hook and a mail provider.

---

## 3. Cultural moment vs. brand influence – which drives which?

**Response:** Moments are detected first (`TrendingNewsAgent`), then re-interpreted through the brand lens. To let brands steer moment selection, pass brand filters into the trend-analysis prompt.

**PeakMetrics note:** Create a dedicated PeakMetrics _Workspace_ for each client brand and pull its top narratives via `GET /workspaces/{workspaceId}/narratives`. Feed those brand-filtered narratives directly into the trending step to ensure only brand-relevant cultural moments are considered.

---

## 4. Voice-over of the process prior to the “decision”

**Response:** The conversation log already records every step; pipe that text into a TTS service. A temporary `/tts` route or a `NarratorAgent` can generate an MP3 for tomorrow’s demo.

---

## 5. Risk score & prompt best practices

- No risk-scoring exists yet. Extend the `BrandQAAgent` JSON schema with a `riskScore` field and prime the prompt.
- **PeakMetrics note:** Use `avgSentiment` and `mentionCount` returned by `/workspaces/{id}/narratives` as quantitative inputs for the LLM when producing a `riskScore`.
- Prompt guidelines used in repo: centralized markdown prompts, JSON outputs, low temp for strategy, higher temp for creative.

---

## 6. 4th agent (deployment/optimization) & synthetic audience testing

- Not implemented. Add a `DeploymentOptimizerAgent` after Brand QA.
- Synthetic audience testing can be inserted as `SyntheticAudienceAgent` between Visual and Brand QA.

---

## 7. Feeding performance metrics back into the system

Ingest post-campaign KPIs via webhook/cron, store against `workflow.id`, and surface them in early agents to close the loop.

**PeakMetrics note:** Schedule periodic pulls of `mentionCount`, `avgSentiment`, and channel mix from `/workspaces/{id}/narratives` after launch; attach these metrics to the original workflow as performance feedback.

---

## 8. Generating the best assets: source files vs. prompts

Both paths are supported. Pass `sourceImageUrl` or `previousAsset` into the `VisualPromptGeneratorAgent` context to bias generative output.

---

## 9. Quantifying trend “staying power”

Add a `TrendLongevityEstimatorAgent` that returns metrics such as predicted shares over 30 days.

**PeakMetrics note:** Build the estimator on top of historical mention decay curves. Query `/workspaces/{id}/mentions` for multiple time windows (e.g., 7-day, 30-day) and fit a trendline to forecast future share volume.

---

## Recommended Next Steps

1. Implement e-mail export via SendGrid when `workflow.status === "completed"`.
2. Update `BrandQAAgent` prompt to include a `riskScore`.
3. Prototype `DeploymentOptimizerAgent` & `SyntheticAudienceAgent`.
4. For tomorrow’s demo: auto-generate TTS narration of the log up to the decision node.

---

_Document generated automatically from code-base analysis._
