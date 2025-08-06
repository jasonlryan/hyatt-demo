import { useState } from "react";
import SharedOrchestrationLayout from "./SharedOrchestrationLayout";
import SidePanel from "../SidePanel";
import { 
  SharedProgressPanel,
  SharedDeliverablePanel,
  SharedCampaignForm 
} from "../shared";
import ConfigurableAgentCollaboration from "../shared/ConfigurableAgentCollaboration";
import { useHyattOrchestration } from "../../hooks/useConfigurableOrchestration";
import { getOrchestrationPhases } from "../../config/phase-definitions";
import { adaptWorkflowData } from "../../utils/workflow-adapters";
import AudienceResearchModal from "../AudienceResearchModal";
import RefineInputModal from "../RefineInputModal";
import DeliverableModal from "../DeliverableModal";
import { Deliverable, AudienceResearch } from "../../types";

interface TestConfigurableHyattProps {
  selectedOrchestration: string | null;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

/**
 * Test Implementation of Hyatt Orchestration using Generic Components
 * 
 * This component uses:
 * - useHyattOrchestration() - convenience hook using generic system
 * - ConfigurableAgentCollaboration - generic agent collaboration component
 * - Phase definitions from centralized config
 * - Data adapters for unified data structure
 * 
 * Phase 5.1 of Orchestration Unification Plan - Integration Testing
 */
const TestConfigurableHyatt: React.FC<TestConfigurableHyattProps> = ({
  selectedOrchestration,
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
  } = useHyattOrchestration();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState<Deliverable | null>(null);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);

  // Get Hyatt phase configuration
  const hyattPhases = getOrchestrationPhases('hyatt');

  const handleStart = async (context: any) => {
    if (!selectedOrchestration) {
      setError('Please select an orchestration first');
      return;
    }
    // For Hyatt, context should include the campaign brief
    await startOrchestration({ 
      brief: context.campaign || context.brief,
      orchestration: selectedOrchestration 
    }, hitlReview);
  };

  const handleSelectCampaign = (campaign: any) => {
    // In original, this would select existing campaign
    // For test, we'll just log it
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

  const handleViewResearch = (research: AudienceResearch) => {
    setIsResearchModalOpen(true);
  };

  // Convert orchestration data to generic format for ConfigurableAgentCollaboration
  const adaptedWorkflowData = orchestration ? adaptWorkflowData(orchestration, 'hyatt') : null;

  return (
    <div className="h-full bg-gray-50">
      <SharedOrchestrationLayout
        title="Test Configurable Hyatt Orchestration"
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
                  title="Start Hyatt Orchestration (Generic)"
                  hitlEnabled={hitlReview}
                  onToggleHitl={onToggleHitl}
                  campaigns={[]} // No existing campaigns for test
                />
              ) : (
                <div className="space-y-6">
                  <ConfigurableAgentCollaboration
                    phases={hyattPhases}
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
        <AudienceResearchModal
          isOpen={isResearchModalOpen}
          onClose={() => setIsResearchModalOpen(false)}
          research={null} // Would need to extract from deliverables
        />

        <RefineInputModal
          isOpen={isRefineModalOpen}
          onClose={() => setIsRefineModalOpen(false)}
          onSubmit={handleRefine}
          isLoading={isLoading}
        />

        <DeliverableModal
          deliverable={modalDeliverable}
          isOpen={isDeliverableModalOpen}
          onClose={handleCloseModal}
        />
      </SharedOrchestrationLayout>

      {/* Test Indicator Banner */}
      <div className="fixed top-0 left-0 right-0 bg-purple-600 text-white text-center py-1 text-sm font-medium z-50">
        🧪 TEST MODE: Generic Configurable Hyatt Implementation
      </div>
    </div>
  );
};

export default TestConfigurableHyatt;