import React, { ReactNode } from "react";

interface SharedOrchestrationLayoutProps {
  /** Whether the left SidePanel is open */
  isSidePanelOpen: boolean;
  /** Optional SidePanel component */
  sidePanel?: ReactNode;
  /** Main content rendered in the center column */
  children: ReactNode;
  /** Right column content such as CampaignDeliverables */
  rightPanel: ReactNode;
}

/**
 * Provides the standard three‑column grid used across orchestration pages.
 * Preserves Hyatt’s spacing and responsive behavior.
 */
const SharedOrchestrationLayout: React.FC<SharedOrchestrationLayoutProps> = ({
  isSidePanelOpen,
  sidePanel,
  children,
  rightPanel,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {isSidePanelOpen && <div className="lg:col-span-3">{sidePanel}</div>}
      <div
        className={`${isSidePanelOpen ? "lg:col-span-5" : "lg:col-span-8"} space-y-6`}
      >
        {children}
      </div>
      <div className="lg:col-span-4">{rightPanel}</div>
    </div>
  );
};

export default SharedOrchestrationLayout;
