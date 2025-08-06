import { useState } from "react";
import SharedOrchestrationLayout from "./SharedOrchestrationLayout";
import SidePanel from "../SidePanel";
import {
  SharedDeliverablePanel,
  SharedProgressPanel,
  SharedCampaignForm,
} from "../shared";
import ConfigurableAgentCollaboration from "../shared/ConfigurableAgentCollaboration";
import { useHiveOrchestration } from "../../hooks/useConfigurableOrchestration";
import { getOrchestrationPhases } from "../../config/phase-definitions";
import { adaptWorkflowData } from "../../utils/workflow-adapters";
import DeliverableModal from "../DeliverableModal";
import RefineInputModal from "../RefineInputModal";
import ErrorBoundary from "../ErrorBoundary";
import { Deliverable } from "../../types";

interface TestConfigurableHiveProps {
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

/**
 * Test Implementation of Hive Orchestration using Generic Components
 * 
 * This component uses:
 * - useHiveOrchestration() - convenience hook using generic system
 * - ConfigurableAgentCollaboration - generic agent collaboration component
 * - Phase definitions from centralized config
 * - Data adapters for unified data structure
 * 
 * Phase 5.1 of Orchestration Unification Plan - Integration Testing
 */
const TestConfigurableHive: React.FC<TestConfigurableHiveProps> = ({
  hitlReview = true,
  onToggleHitl,
  onNavigateToOrchestrations,
}) => {
  // Use the generic hook through convenience wrapper
  const {
    data: orchestration,
    isLoading,
    error,
    startOrchestration,
    resetOrchestration,
    refineOrchestration,
    resumeOrchestration,
    setError,
  } = useHiveOrchestration();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState<Deliverable | null>(null);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);

  // Get Hive phase configuration
  const hivePhases = getOrchestrationPhases('hive');

  const handleStart = async (context: any) => {
    await startOrchestration(context, hitlReview);
  };

  const handleSelectCampaign = (campaign: any) => {
    // Not implemented in original - keeping consistent
    console.log("Select campaign:", campaign);
  };

  const handleViewDeliverable = (deliverable: Deliverable) => {
    setModalDeliverable(deliverable);
    setIsDeliverableModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeliverableModalOpen(false);
    setModalDeliverable(null);
  };

  const handleRefine = (instructions: string) => {
    refineOrchestration(instructions);
    setIsRefineModalOpen(false);
  };

  const handleResume = () => {
    resumeOrchestration();
  };

  // Convert orchestration data to generic format for ConfigurableAgentCollaboration
  const adaptedWorkflowData = orchestration ? adaptWorkflowData(orchestration, 'hive') : null;

  return (
    <ErrorBoundary>
      <div className="h-full bg-gray-50">
        <SharedOrchestrationLayout
          title="Test Configurable Hive Orchestration"
          subtitle="Using Generic Hook + Generic Components"
          onNavigateBack={onNavigateToOrchestrations}
        >
          <div className="flex h-full">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-6 overflow-auto">
                {!orchestration ? (
                  <SharedCampaignForm
                    onSubmit={handleStart}
                    onSelectCampaign={handleSelectCampaign}
                    isLoading={isLoading}
                    error={error}
                    onDismissError={() => setError(null)}
                    title="Start Hive Orchestration (Generic)"
                    hitlEnabled={hitlReview}
                    onToggleHitl={onToggleHitl}
                  />
                ) : (
                  <div className="space-y-6">
                    <ConfigurableAgentCollaboration
                      phases={hivePhases}
                      workflowData={adaptedWorkflowData}
                      onResume={handleResume}
                      onRefine={() => setIsRefineModalOpen(true)}
                      onViewDeliverable={handleViewDeliverable}
                    />
                  </div>
                )}
              </div>
            </div>

            <SidePanel
              isOpen={isSidePanelOpen}
              onToggle={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <div className="space-y-6">
                <SharedProgressPanel
                  workflow={orchestration}
                  onReset={resetOrchestration}
                  isLoading={isLoading}
                />
                
                {orchestration?.deliverables && (
                  <SharedDeliverablePanel
                    deliverables={orchestration.deliverables}
                    onViewDeliverable={handleViewDeliverable}
                  />
                )}
              </div>
            </SidePanel>
          </div>

          {/* Modals */}
          <DeliverableModal
            deliverable={modalDeliverable}
            isOpen={isDeliverableModalOpen}
            onClose={handleCloseModal}
          />

          <RefineInputModal
            isOpen={isRefineModalOpen}
            onClose={() => setIsRefineModalOpen(false)}
            onSubmit={handleRefine}
            isLoading={isLoading}
          />
        </SharedOrchestrationLayout>

        {/* Test Indicator Banner */}
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-1 text-sm font-medium z-50">
          🧪 TEST MODE: Generic Configurable Hive Implementation
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TestConfigurableHive;