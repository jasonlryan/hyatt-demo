# Hyatt Orchestration Feature Parity Checklist

This checklist inventories the existing Hyatt orchestration UI and backend capabilities. Use it when creating new orchestrations to ensure nothing is lost during migration.

## Core Layout & Navigation
- Three‑column grid layout
  - **Left:** Transcript SidePanel with message log and agent icons
  - **Center:** Campaign progress, forms and collaboration controls
  - **Right:** Deliverable list with cards and status badges
  - **Classes:** `grid grid-cols-1 lg:grid-cols-12 gap-6` with
    `lg:col-span-3` for the SidePanel,
    `lg:col-span-5` (or `lg:col-span-8` when closed) for the center column,
    and `lg:col-span-4` for deliverables. Wrapped in `container pt-6 pb-8`.
- Global navigation bar with links to **Orchestrations**, **Agents**, and **Workflows**
- Breadcrumb at top of Hyatt orchestration page
- HITL (Human‑in‑the‑loop) toggle displayed in page header

## Campaign Workflow Features
- CampaignForm to create a new campaign from a brief
- Ability to load existing campaigns from dropdown
- Polling every few seconds for campaign status updates
- Progress panel showing phases:
  - Audience Research
  - Strategic Insights
  - Trend Analysis
  - Story Development
  - Collaborative Review
- Manual review workflow:
  - Campaign pauses after each phase when HITL is enabled
  - Resume or Refine actions resume execution or open refine modal
  - Resume/Refine also accessible from deliverable modals
- Resume and Refine endpoints (`/api/campaigns/:id/resume` and `/api/campaigns/:id/refine`)
- Conversation transcript accessible via SidePanel

## Deliverables
- CampaignDeliverables panel listing deliverable cards
- Card shows agent icon, status (ready/reviewed/pending) and download/view buttons
- DeliverableModal with content preview and actions: download, resume or refine
- Markdown/JSON styling provided by `deliverableStyles.css`

## Style System
- Tailwind base with simplified design system (`frontend/src/index.css`)
- Colors and spacing variables defined via CSS custom properties
- Buttons (`btn`, `btn-primary`, `btn-secondary`), cards (`card`, `card-compact`), modals (`modal`, `modal-content`), and utilities
- StylePanel component allowing live preview and saving of custom CSS via `/api/save-css`
- Accessible focus states and responsive breakpoints

## Agent Presentation
- `agentStyles.tsx` defines icon and accent color for each agent
- AgentCollaboration component displays current phase status with icons and manual review actions
- SidePanel logs conversation messages with agent styling

## Interactions & UX
- SidePanel toggle to view detailed log
- Deliverable card click opens DeliverableModal
- Resume and Refine controls show when campaign paused
- AudienceResearchModal for viewing research details
- RefineInputModal for sending refinement instructions
- Error handling and loading states across pages

---
Use this document to verify parity whenever a new orchestration or shared component is introduced. All listed features, styles and interactions should remain available unless explicitly replaced by an improved equivalent.
