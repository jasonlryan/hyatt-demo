# Frontend Verification Checklist

This checklist is to ensure the new React frontend (`http://localhost:5173`) has 100% feature parity with the original HTML frontend (`http://localhost:3000`) before the old version is deprecated.

---

### Core Functionality

| #   | Feature                        | Status | Notes                                                                        |
| --- | ------------------------------ | ------ | ---------------------------------------------------------------------------- |
| 1   | **Start New Campaign**         | `[ ]`  | Can a new campaign be initiated from the form?                               |
| 2   | **Campaign Progress Display**  | `[ ]`  | Does the conversation log appear and update correctly?                       |
| 3   | **Deliverables Display**       | `[ ]`  | Are deliverables appearing in the side panel as they are generated?          |
| 4   | **View Deliverable Modal**     | `[ ]`  | Does clicking "View" on a deliverable open a modal with the correct content? |
| 5   | **View Full Log (Side Panel)** | `[ ]`  | Does the side panel open and show the full event log?                        |
| 6   | **HITL Review Toggle**         | `[ ]`  | Does the "HITL Review" toggle work and show the appropriate modal?           |
| 7   | **Error Handling**             | `[ ]`  | Are backend connection errors or campaign failures handled gracefully?       |

### UI & Styling

| #   | Feature                | Status | Notes                                                                 |
| --- | ---------------------- | ------ | --------------------------------------------------------------------- |
| 8   | **Layout Consistency** | `[ ]`  | Does the overall layout match the original's three-column structure?  |
| 9   | **Component Styling**  | `[ ]`  | Do all components (cards, buttons, modals) match the intended design? |

---

Please test each item and update its status.
