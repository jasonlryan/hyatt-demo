# React Frontend Migration Plan

This document outlines the step-by-step plan to migrate the existing HTML/JS frontend to the new React/TypeScript frontend structure located in `/frontend/src`.

### **Analysis of New Frontend Structure**

The new project is structured as a modern React application:

- **`main.tsx`**: The entry point of the React application.
- **`App.tsx`**: The root component, responsible for state management and overall layout.
- **`index.css`**: For global application styles.
- **`components/`**: This directory will contain all reusable UI components (e.g., Header, Panels, Modals).
- **`types/`**: This will house TypeScript type definitions for data models (e.g., `Campaign`, `Message`, `Deliverable`).
- **`data/`**: Intended for mock data or data-fetching logic.

---

### **Detailed Migration Plan**

#### **Phase 1: Setup & Backend Integration** [COMPLETED]

1.  **Install Dependencies**: Navigate to the `frontend` directory and run `npm install` to set up the project. [COMPLETED]
2.  **Configure API Proxy**: To prevent CORS errors, modify `vite.config.js` to proxy all API requests from `/api` to the backend server (e.g., `http://localhost:3000`). [COMPLETED]
3.  **Run Dev Servers**: Start both the backend server (`nodemon`) and the new frontend dev server (`npm run dev`) to ensure they can communicate. [PENDING]

#### **Phase 2: Core Logic & State Management** [COMPLETED]

4.  **Define Data Types**: Create TypeScript interfaces for `Campaign`, `ConversationMessage`, and `Deliverable` in the `frontend/src/types/` directory to ensure type safety. [COMPLETED]
5.  **Re-implement State in `App.tsx`**:
    - Use React's `useState` hook in `frontend/src/App.tsx` to manage the application's state (`campaignId`, `conversation`, `deliverables`, `error`, etc.). [COMPLETED]
6.  **Re-implement API Polling**:
    - Use the `useEffect` hook in `App.tsx`, triggered by changes to `campaignId`, to poll the `/api/campaigns/:id` endpoint.
    - This effect will fetch campaign data, update the relevant state, and handle logic for stopping the poll on campaign completion or connection failure. [COMPLETED]

#### **Phase 3: Component Implementation (Following New Designs)**

7.  **Build `Header` Component**:
    - Create `Header.tsx` in `frontend/src/components`. It will include the app title, "New Campaign" button, and "HITL Review" toggle. It will receive event handlers (`onNewCampaign`, `onToggleHitl`) as props from `App.tsx`. [COMPLETED]
8.  **Build `CampaignForm` Component**:
    - Create `CampaignForm.tsx` in `components`. It will manage the campaign brief input and call the `startCampaign` function from `App.tsx` on submission. [COMPLETED]
9.  **Build `ProgressPanel` Component**:
    - Create `ProgressPanel.tsx` to display the `conversation` messages. It will be styled with agent avatars and color-coding, based on the new design templates. [COMPLETED]
10. **Build `DeliverablesPanel` Component**:
    - Create `DeliverablesPanel.tsx` to display `deliverables` in styled cards. Each card will have a button to trigger the `openModal` function in `App.tsx`. [COMPLETED]
11. **Build `SidePanel` and `DeliverableModal` Components**:
    - Re-create `SidePanel.tsx` and `DeliverableModal.tsx` in `components`, styled to match the new professional design, to show the event log and deliverable content. [COMPLETED]

#### **Phase 4: Final Assembly & Cleanup**

12. **Assemble in `App.tsx`**: Import and arrange all the new components within `App.tsx`, connecting all state and props.
13. **Global Styling**: Apply global styles, such as background colors and fonts, in `frontend/src/index.css`.
14. **Delete Old Frontend**: After verifying that the new React frontend has achieved full functionality, the old `public` directory and its contents can be safely deleted.
