# Orchestration Developer Guide

This guide explains how to create new orchestration pages using the shared layout, template and component library extracted from the Hyatt orchestration. Follow these steps to ensure visual and functional consistency across the platform.

## 1. Prerequisites

- Familiarity with the repo structure and React + TypeScript in `/frontend/src`.
- The shared components must already be installed and up to date. See `STYLING_SYSTEM_GUIDE.md` for style references.
- Review the **Feature Parity Checklist** (`../../orchestration-feature-parity-checklist.md`). New pages should not omit any item unless it is intentionally replaced with an improved equivalent.

## 2. Creating a New Orchestration

1. **Start from the Template**
   - Import `HyattStyleOrchestrationTemplate` from `components/orchestration/`.
   - Use this template as the root of your page to wire up navigation, state management, polling and HITL controls.
2. **Add Shared Layout**
   - Wrap page content in `SharedOrchestrationLayout`. This provides the three‑column grid used by Hyatt.
3. **Use Shared Components**
   - Forms, progress panels, deliverable lists and breadcrumbs should come from `shared/components/`.
   - Refer to `STYLING_SYSTEM_GUIDE.md` for required Tailwind classes.
4. **Hook Up Utilities**
   - Use the shared hooks (`useCampaignPolling`, `useCampaignState`, `useOrchestrationNavigation`) for API calls and navigation logic.
5. **Style Only What’s Unique**
   - Keep existing spacing, breakpoints and color tokens. Add new styles only for orchestration‑specific visuals.

## 3. Migration Steps

When migrating an existing orchestration to this system, follow the plan outlined in `Plans/orchestration_consistency_enablement_plan.md`:

1. **Audit & Checklist** – Inventory existing features and map them to shared equivalents using the feature parity checklist.
2. **Extract Layout & Components** – Move common layout and UI pieces into the shared library.
3. **Build the Template** – Implement `HyattStyleOrchestrationTemplate` to encapsulate navigation, state, polling and HITL.
4. **Refactor Incrementally** – Update one page or feature at a time. Validate against the checklist after each refactor.
5. **Cleanup** – Remove old code only when the new shared version is proven stable.

## 4. Keeping Documentation Current

- Update this guide whenever shared components or APIs change.
- Document new hooks, props or styles in the appropriate reference file.
- Record major migrations or removals in `Plans/orchestration_consistency_enablement_plan.md` so developers know the current status.

## 5. Additional Resources

- [Feature Parity Checklist](../../orchestration-feature-parity-checklist.md)
- [Orchestration Consistency & Enablement Plan](../../Plans/orchestration_consistency_enablement_plan.md)
- [Unified Styling System Guide](STYLING_SYSTEM_GUIDE.md)

By following this guide and the referenced documents, developers can create new orchestrations quickly while preserving Hyatt’s established user experience.
