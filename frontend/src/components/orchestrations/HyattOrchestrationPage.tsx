import { useState } from "react";
import { useCampaignState } from "../../hooks/useCampaignState";
import { useCampaignPolling } from "../../hooks/useCampaignPolling";
import BaseOrchestrationPage from "./BaseOrchestrationPage";
import SharedOrchestrationLayout from "./SharedOrchestrationLayout";
import SidePanel from "../SidePanel";
import { SharedProgressPanel } from "../shared";
import AgentCollaboration from "../AgentCollaboration";
import { SharedDeliverablePanel } from "../shared";
import AudienceResearchModal from "../AudienceResearchModal";
import RefineInputModal from "../RefineInputModal";
import { SharedCampaignForm } from "../shared";
import DeliverableModal from "../DeliverableModal";
import { Deliverable, AudienceResearch } from "../../types";

interface HyattOrchestrationPageProps {
  selectedOrchestration: string | null;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

const HyattOrchestrationPage: React.FC<HyattOrchestrationPageProps> = ({
  selectedOrchestration,
  hitlReview = true,
  onToggleHitl,
  onNavigateToOrchestrations,
}) => {
  const {
    campaign,
    campaigns,
    conversation,
    deliverables,
    error,
    isLoading,
    setError,
    updateFromApiData,
    selectCampaign,
    startCampaign,
    resetCampaign,
    resumeCampaign,
    refineCampaign,
  } = useCampaignState(selectedOrchestration);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState<Deliverable | null>(
    null
  );
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [modalResearch, setModalResearch] = useState<AudienceResearch | null>(
    null
  );

  // Track which deliverable is being reviewed from phase card
  const [reviewPhaseKey, setReviewPhaseKey] = useState<string | null>(null);


  const handleViewDetails = (deliverable: Deliverable) => {
    if (deliverable.title === "Audience Research") {
      const dummyResearch: AudienceResearch = {
        demographics: {
          age: "N/A",
          income: "N/A",
          geography: "N/A",
          lifestyle: "N/A",
        },
        psychographics: {
          values: "N/A",
          motivations: "N/A",
          travelBehaviors: "N/A",
        },
        segmentation: { primary: "N/A", secondary: "N/A", tertiary: "N/A" },
      };
      setModalResearch(dummyResearch);
      setIsResearchModalOpen(true);
    } else {
      setModalDeliverable(deliverable);
      setIsDeliverableModalOpen(true);
    }
  };


  const handleSelectCampaign = (campaignId: string) => {
    selectCampaign(campaignId);
  };

  const handleNewCampaign = () => {
    resetCampaign();
  };

  const handleStartCampaign = (brief: string) => {
    startCampaign(brief);
  };

  // Poll campaign status
  useCampaignPolling(campaign, updateFromApiData, setError);

  const handleResume = () => {
    resumeCampaign();
  };

  const handleRefine = () => {
    setIsRefineModalOpen(true);
  };

  const handleSubmitRefinement = async (instructions: string) => {
    setIsRefineModalOpen(false);
    await refineCampaign(instructions);
  };

  // New: handle view from phase card
  const handleViewPhaseDeliverable = (phaseKey: string) => {
    // Try to find deliverable by phase key (e.g., "research")
    const key = Object.keys(deliverables).find((k) => k.includes(phaseKey));
    if (key && deliverables[key]) {
      setModalDeliverable(deliverables[key]);
      setIsDeliverableModalOpen(true);
      setReviewPhaseKey(phaseKey);
    }
  };

  // Handle resume from modal
  const handleResumeFromModal = () => {
    setIsDeliverableModalOpen(false);
    setReviewPhaseKey(null);
    handleResume();
  };

  // Handle refine from modal
  const handleRefineFromModal = () => {
    setIsDeliverableModalOpen(false);
    setReviewPhaseKey(null);
    setIsRefineModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* SidePanel is now part of the grid */}

      <div className="container pt-6 pb-8">
        {/* Breadcrumb and HITL Toggle */}
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
              Hyatt Orchestrator
            </span>
          </nav>

          {/* HITL Review Toggle */}
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
                    hitlReview ? "text-white left-1" : "text-text-secondary right-1"
                  }`}
                >
                  {hitlReview ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          )}
        </div>
        <SharedOrchestrationLayout
          isSidePanelOpen={isSidePanelOpen}
          sidePanel={
            <SidePanel
              messages={conversation}
              isOpen={isSidePanelOpen}
              onClose={() => setIsSidePanelOpen(false)}
            />
          }
          rightPanel={
            <SharedDeliverablePanel
              deliverables={Object.values(deliverables)}
              onViewDetails={(id) => {
                const deliverable = Object.values(deliverables).find((d) => d.id === id);
                if (deliverable) handleViewDetails(deliverable);
              }}
            />
          }
        >
          {!campaign ? (
            <SharedCampaignForm
              onCreate={handleStartCampaign}
              onCancel={handleNewCampaign}
              isLoading={isLoading}
              selectedOrchestration={selectedOrchestration}
              onNewCampaign={handleNewCampaign}
              onLoadCampaign={handleSelectCampaign}
              campaigns={campaigns}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
            />
          ) : (
            <>
              <SharedProgressPanel
                campaign={campaign}
                onViewProgress={() => setIsSidePanelOpen(true)}
              />

              <AgentCollaboration
                messages={conversation}
                campaign={campaign}
                onResume={handleResume}
                onRefine={handleRefine}
                onViewDeliverable={handleViewPhaseDeliverable}
              />

              {/* ReviewPanel removed - controls now integrated into phase cards */}
            </>
          )}
        </SharedOrchestrationLayout>
      </div>

      <DeliverableModal
        deliverable={modalDeliverable}
        isOpen={isDeliverableModalOpen}
        onClose={() => {
          setIsDeliverableModalOpen(false);
          setReviewPhaseKey(null);
        }}
        onResume={reviewPhaseKey ? handleResumeFromModal : undefined}
        onRefine={reviewPhaseKey ? handleRefineFromModal : undefined}
      />

      {modalResearch && (
        <AudienceResearchModal
          research={modalResearch}
          isOpen={isResearchModalOpen}
          onClose={() => setIsResearchModalOpen(false)}
        />
      )}

      <RefineInputModal
        isOpen={isRefineModalOpen}
        onClose={() => setIsRefineModalOpen(false)}
        onSubmit={handleSubmitRefinement}
      />
    </div>
  );
};

export default HyattOrchestrationPage;
