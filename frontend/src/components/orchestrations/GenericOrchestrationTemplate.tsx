import { ReactNode, useState } from "react";
import BaseOrchestrationPage from "./BaseOrchestrationPage";
import SharedOrchestrationLayout from "./SharedOrchestrationLayout";
import SidePanel from "../SidePanel";
import { ConversationMessage } from "../../types";

interface GenericOrchestrationTemplateProps {
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  /** Main content to render in the center column */
  children: ReactNode;
  /** Optional messages for the side panel */
  messages?: ConversationMessage[];
  /** Optional right panel content (deliverables, outputs, etc.) */
  rightPanelContent?: ReactNode;
  /** Whether to show the side panel by default */
  defaultSidePanelOpen?: boolean;
}

const GenericOrchestrationTemplate: React.FC<
  GenericOrchestrationTemplateProps
> = ({
  orchestrationName,
  hitlReview = true,
  onToggleHitl,
  children,
  messages = [],
  rightPanelContent,
  defaultSidePanelOpen = false,
}) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(defaultSidePanelOpen);

  return (
    <div className="min-h-screen">
      <BaseOrchestrationPage
        orchestrationName={orchestrationName}
        hitlReview={hitlReview}
        onToggleHitl={onToggleHitl}
      >
        <SharedOrchestrationLayout
          isSidePanelOpen={isSidePanelOpen}
          sidePanel={
            messages.length > 0 ? (
              <SidePanel
                messages={messages}
                isOpen={isSidePanelOpen}
                onClose={() => setIsSidePanelOpen(false)}
              />
            ) : null
          }
          rightPanel={rightPanelContent}
        >
          {children}
        </SharedOrchestrationLayout>
      </BaseOrchestrationPage>
    </div>
  );
};

export default GenericOrchestrationTemplate;
