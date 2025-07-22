# Hive Orchestration Modernization Plan

## Overview

- **Purpose:** Make Hive orchestration industry-agnostic and implement the new PR Manager-led, 7-agent, moment-based workflow.
- This plan supersedes the previous separate genericization and transformation plans.

---

## Track 1: Genericization

- Refactor all campaign analysis, agent prompts, and context passing to be industry-agnostic.
- Remove any hard-coded industry/brand logic from Hive.
- Update all agent prompts to use [INDUSTRY], [BRAND_CONTEXT], etc.
- Test with multiple industries and campaign types.
- **Success:** Hive works for any industry/brand/campaign type, no hard-coded logic remains.

---

## Track 2: Workflow Transformation

- Implement PR Manager-led, 7-agent workflow using **existing agent class names**:
  1. PRManagerAgent (orchestrate overall strategy)
  2. TrendingNewsAgent (analyze manual moment input)
  3. StrategicInsightAgent (creative opportunity analysis)
  4. StoryAnglesAgent (narrative angle generation)
  5. BrandLensAgent (how brand tells the story)
  6. VisualGeneratorAgent (create key visual)
  7. BrandQAAgent (final assessment)
- **Agent Naming:**
  - We will reuse existing agent classes (e.g., StoryAnglesAgent, StrategicInsightAgent, etc.).
  - Prompts from the Curser plan will be mapped to these agents (see mapping table below).
- **Trend Crawler:**
  - Automated trend detection (Trend Crawler) is a future phase. For now, manual moment input is the workflow trigger.
- **Internal Reviewer:**
  - The internal reviewer step is optional and not included in this phase.
- Update agent roles, prompts, and context passing for each phase.
- Update API endpoints and frontend to support new workflow and deliverables.
- Test end-to-end with manual moment input and all deliverable types.
- **Success:** PR Manager orchestrates the full workflow, all 7 deliverables are produced and displayed correctly.

---

## Agent Prompt Mapping (Curser Plan → Existing Agents)

| Curser Plan Role          | Existing Agent Class  | Prompt/Responsibility                                                     |
| ------------------------- | --------------------- | ------------------------------------------------------------------------- |
| PR Manager (Orchestrator) | PRManagerAgent        | Orchestrate workflow, manage handoffs, log outputs                        |
| Moment Analyst            | TrendingNewsAgent     | Analyze manual moment input (for now), provide moment analysis            |
| Angle Writer              | StoryAnglesAgent      | Generate 3 headline-style story angles                                    |
| Concept Builder           | StrategicInsightAgent | Expand chosen angle into pitch-level idea, provide justification and KPIs |
| Visual Strategist         | BrandLensAgent        | Convert concept summary into visual objectives and hero description       |
| Prompt Composer           | VisualGeneratorAgent  | Compose image prompt and generate key visual                              |
| Brand QA                  | BrandQAAgent          | Assess concept and visual for brand alignment and effectiveness           |

_Note: Trend Crawler (automated detection) and Internal Reviewer are not included in this phase._

---

## Implementation Timeline

- **Week 1:** Complete genericization of Hive (refactor, prompt updates, context passing)
- **Week 2:** Implement and test new 7-agent workflow (backend, API, frontend)
- **Week 3:** End-to-end testing, documentation, and validation

---

## Risk Mitigation

- Incremental testing after each major change
- Rollback plan in case of workflow or context failures
- Comprehensive documentation and test cases

---

## Conclusion

- This plan ensures Hive is both industry-agnostic and PR Manager-led, ready for any brand or campaign scenario.
- Agent naming is unified with existing codebase; Curser plan prompt requirements are mapped to these agents.
- Trend Crawler and Internal Reviewer are deferred to future phases for simplicity and focus.
