# Post-Migration To-Do List

This document lists potential improvements and refactoring ideas to be considered _after_ the initial React migration is complete and verified.

---

### Refactoring Suggestions

- **Merge `CampaignProgress` and `AgentCollaboration` Components**:
  - **Suggestion**: The `CampaignProgress` and `AgentCollaboration` components in `App.tsx` could potentially be merged into a single, more streamlined component.
  - **Reasoning**: Both components are responsible for displaying aspects of the campaign's ongoing progress and conversation log. Combining them could simplify the component tree and reduce prop drilling.
  - **Status**: Deferred. The current priority is to replicate the existing HTML version's structure as per the migration plan. This can be revisited after the migration is complete.
