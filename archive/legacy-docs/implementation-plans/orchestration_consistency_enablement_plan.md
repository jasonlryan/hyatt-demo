# Orchestration Consistency & Enablement Plan

## Brief

### Objective

Enable the creation of new orchestration pages that are visually, functionally, and structurally consistent with the existing Hyatt orchestration—without losing any features, styles, or user experience.

### Key Requirements

- **Consistency:** All new orchestrations must match Hyatt in layout, navigation, HITL controls, styling, and user flows.
- **Respect for Existing Work:** The plan must build on what works in Hyatt, not replace or break it.
- **Incremental, Non-Destructive Migration:** Shared layouts, templates, and components should be extracted from Hyatt, not invented from scratch. No features or polish should be lost.
- **Developer Enablement:** It should be easy for any developer to create a new orchestration that “just works” and looks/feels like Hyatt, using clear templates and shared components.
- **Feature Parity:** No new orchestration should go live unless it matches Hyatt’s feature set and UX.

### What the Plan Must Deliver

1. **A shared layout component** that provides the Hyatt 3-column structure.
2. **A reusable orchestration template** that wires up navigation, state, polling, HITL, and error handling.
3. **A library of shared UI components** (forms, deliverables, HITL toggle, breadcrumbs, etc.) extracted from Hyatt.
4. **A clear audit/checklist** mapping every Hyatt feature/component to its shared equivalent, so nothing is lost.
5. **Documentation and a developer guide** for using the new system.

### What the Plan Must Avoid

- “Blank slate” or “replace everything” approaches.
- Loss of any existing features, styles, or user experience.
- Forcing all-or-nothing migration—Hyatt must keep working throughout.

### Success Criteria

- New orchestrations can be built in hours, not days.
- All orchestrations are visually and functionally consistent with Hyatt.
- No regression in features, polish, or UX.
- Developers have confidence and clarity in the process.

---

## Guiding Principles

1. **Respect What Works**

   - Preserve all current features and user experiences that are valued.
   - Audit before changing: understand what users and developers rely on.
   - Set a feature parity baseline: “Nothing gets removed or replaced until the new system matches or improves on it.”

2. **Build, Don’t Replace**

   - Add new capabilities and improvements alongside existing systems.
   - Migrate incrementally, not all at once.

3. **Feature Parity First**

   - No feature or workflow is removed or replaced until the new system matches or improves upon it.
   - Maintain a checklist of all current features and UI elements.

4. **Test and Validate at Every Step**

   - After each migration, verify that nothing is lost or broken.
   - Gather feedback from users and developers before deprecating old code.

5. **Remove Only When Ready**

   - Clean up legacy code only after the new system is fully adopted and proven in production.
   - Keep a changelog of what’s migrated, what’s pending, and what’s removed.

6. **Document and Communicate**
   - Keep migration guides, changelogs, and usage docs up to date.
   - Communicate changes and progress clearly to all stakeholders.

---

## Step-by-Step Plan (Addressing the Brief)

### 1. Audit & Feature Parity Checklist (Foundation)

- Inventory every feature, component, and style in Hyatt orchestration.
- Document all Tailwind classes, custom CSS, and component structure.
- List all user interactions and workflows.
- Create a checklist mapping Hyatt features/components to their shared equivalents.
- **Deliverable:** `orchestration-feature-parity-checklist.md`

### 2. Extract & Standardize the Shared Layout (Highest Priority)

- Extract the 3-column grid layout from HyattOrchestrationPage into `SharedOrchestrationLayout.tsx`.
- Ensure all spacing, breakpoints, and responsive behaviors are preserved.
- Document all layout-related classes and custom CSS.
- Test with Hyatt orchestration to ensure no visual or functional regression.

### 3. Build the Orchestration Template (Second Priority)

- Create `HyattStyleOrchestrationTemplate.tsx` that:
  - Wraps the shared layout
  - Wires up navigation, state, polling, HITL, and error handling
  - Provides slots/props for orchestration-specific content
- Scaffold a new orchestration using the template and compare side-by-side with Hyatt.

### 4. Extract and Build Shared UI Components (Third Priority)

- Extract the following from Hyatt and standardize:
  - `SharedCampaignForm.tsx`
  - `SharedProgressPanel.tsx`
  - `SharedDeliverablePanel.tsx` and `SharedDeliverableCard.tsx`
  - `SharedBreadcrumbs.tsx`
  - `SharedHitlToggle.tsx`
  - `SharedActionButtons.tsx`
  - Standardize modals as shared components
- Ensure all props, styles, and behaviors match Hyatt’s current implementation.
- Document all Tailwind classes and custom styles used.

### 5. Extract and Build Shared Hooks/Utilities

- Move polling, state, and error handling into shared hooks/utilities:
  - `useCampaignPolling.ts`
  - `useCampaignState.ts`
  - `useOrchestrationNavigation.ts`
- Abstract API calls for consistency.
- Ensure all edge cases and error states are handled as in Hyatt.

### 6. Centralize Styling (Optional but Recommended)

- Centralize color, spacing, and typography as design tokens.
- Document all Tailwind classes and custom CSS used.
- Ensure all extracted components retain their original styles.

### 7. Developer Documentation & Guide

- Write a clear developer guide for creating new orchestrations using the template and shared components.
- Include the feature parity checklist and migration steps.
- Keep documentation up to date as the system evolves.

### 8. Gradual, Non-Destructive Migration

- Leave existing orchestrations (like Hyatt) unchanged until their migration is complete and tested.
- Gradually refactor Hyatt and others to use the new layout, template, and components.
- Only remove old code when full feature parity and stability are confirmed.

---

## Success Criteria (Restated)

- New orchestrations can be created in hours, not days.
- All orchestrations are visually and functionally consistent with Hyatt.
- No regression in features, polish, or UX.
- Developers have confidence and clarity in the process.

---

**This document is the single authoritative source for expectations, priorities, and process for orchestration consistency and enablement.**
