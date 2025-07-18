# Orchestration Component Migration Checklist

This checklist tracks which orchestration pages still rely on the old non‑shared components. Once a page has been migrated to the shared layer the checkbox can be marked as complete.

| Page | Campaign Form | Progress Panel | Deliverable Panel | Deliverable Modal | Refine Modal |
| ---- | ------------- | -------------- | ---------------- | ----------------- | ------------ |
| `HyattOrchestrationPage` | Old | Old | Old | Old | Old |
| `HyattStyleOrchestrationTemplate` | Old | Old | Old | Old | Old |
| `HiveOrchestrationPage` | N/A | N/A | N/A | N/A | N/A |
| `TemplateOrchestrationPage` | Inherits Hyatt template (Old) | Old | Old | Old | Old |

- **Old** – imports components from `../CampaignForm`, `../CampaignProgress`, `../CampaignDeliverables`, `../DeliverableModal`, and `../RefineInputModal`.
- **Shared** – should import from `./shared` once migrated.

Once all pages are migrated and tests pass the old component files can be safely removed.
