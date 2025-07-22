import { useState } from "react";
import SharedOrchestrationLayout from "./SharedOrchestrationLayout";
import SidePanel from "../SidePanel";
import {
  SharedDeliverablePanel,
  SharedProgressPanel,
  SharedCampaignForm,
} from "../shared";
import HiveAgentCollaboration from "../shared/HiveAgentCollaboration";
import { useHiveWorkflowState } from "../../hooks/useHiveWorkflowState";
import DeliverableModal from "../DeliverableModal";
import { Deliverable } from "../../types";

interface HiveOrchestrationPageProps {
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

const HiveOrchestrationPage: React.FC<HiveOrchestrationPageProps> = ({
  hitlReview = true,
  onToggleHitl,
  onNavigateToOrchestrations,
}) => {
  const { workflow, isLoading, startOrchestration, resetWorkflow } =
    useHiveWorkflowState();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState<Deliverable | null>(
    null
  );
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);

  const handleStart = async (context: any) => {
    await startOrchestration(context);
  };

  const handleSelectCampaign = (campaign: any) => {
    // This function is not fully implemented in the new_code,
    // so it will be a placeholder for now.
    console.log("Selecting campaign:", campaign);
    // In a real scenario, you would update the workflow state
    // with the selected campaign and potentially trigger a new orchestration.
  };

  const deliverables = workflow ? Object.values(workflow.deliverables) : [];

  return (
    <div className="min-h-screen">
      <div className="container pt-6 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-text-secondary">
            <button
              onClick={
                onNavigateToOrchestrations || (() => window.history.back())
              }
              className="text-success hover:text-success-hover transition-colors"
            >
              Orchestrations
            </button>
            <span>›</span>
            <span className="text-text-primary font-medium">
              Hive Orchestrator
            </span>
          </nav>
          {onToggleHitl && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">HITL Review</span>
              <button
                onClick={onToggleHitl}
                className={`relative inline-flex h-6 w-12 items-center rounded-full ${
                  hitlReview ? "bg-success" : "bg-secondary"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                    hitlReview ? "translate-x-7" : "translate-x-1"
                  }`}
                />
                <span
                  className={`absolute text-xs font-medium ${
                    hitlReview
                      ? "text-white left-1"
                      : "text-text-secondary right-1"
                  }`}
                >
                  {hitlReview ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          )}
        </div>
        {workflow && (
          <div className="mb-6">
            <SharedProgressPanel
              campaign={{ id: workflow.id, status: workflow.status } as any}
              onViewProgress={() => setIsSidePanelOpen(true)}
            />
          </div>
        )}
        <SharedOrchestrationLayout
          isSidePanelOpen={isSidePanelOpen}
          sidePanel={
            <SidePanel
              messages={[]}
              isOpen={isSidePanelOpen}
              onClose={() => setIsSidePanelOpen(false)}
            />
          }
          rightPanel={
            <SharedDeliverablePanel
              deliverables={deliverables}
              onViewDetails={(id) => {
                const d = deliverables.find((x) => x.id === id);
                if (d) {
                  setModalDeliverable(d);
                  setIsDeliverableModalOpen(true);
                }
              }}
            />
          }
        >
          {!workflow ? (
            <SharedCampaignForm
              onCreate={(brief) => handleStart({ campaign: brief })}
              onCancel={resetWorkflow}
              isLoading={isLoading}
              selectedOrchestration={"hive"}
              onNewCampaign={resetWorkflow}
              onLoadCampaign={handleSelectCampaign}
              campaigns={[]}
              dropdownOpen={false}
              setDropdownOpen={() => {}}
            />
          ) : (
            <HiveAgentCollaboration
              workflow={workflow}
              onViewDeliverable={(phase) => {
                const d = workflow.deliverables[phase];
                if (d) {
                  setModalDeliverable(d);
                  setIsDeliverableModalOpen(true);
                }
              }}
            />
          )}
        </SharedOrchestrationLayout>
      </div>
      <DeliverableModal
        deliverable={modalDeliverable}
        isOpen={isDeliverableModalOpen}
        onClose={() => setIsDeliverableModalOpen(false)}
      />
    </div>
  );
};

export default HiveOrchestrationPage;
