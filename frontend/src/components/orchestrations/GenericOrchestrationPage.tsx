import React, { useState } from "react";
import { useCampaignState } from "../../hooks/useCampaignState";
import { useCampaignPolling } from "../../hooks/useCampaignPolling";
import BaseOrchestrationPage from "./BaseOrchestrationPage";
import SharedOrchestrationLayout from "./SharedOrchestrationLayout";
import SidePanel from "../SidePanel";
import {
  SharedProgressPanel,
  SharedDeliverablePanel,
  SharedCampaignForm,
} from "../shared";
import AgentCollaboration from "../AgentCollaboration";
import DeliverableModal from "../DeliverableModal";
import RefineInputModal from "../RefineInputModal";
import AudienceResearchModal from "../AudienceResearchModal";
import { Deliverable, AudienceResearch } from "../../types";

interface GenericOrchestrationPageProps {
  orchestrationId: string;
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

const GenericOrchestrationPage: React.FC<GenericOrchestrationPageProps> = ({
  orchestrationId,
  orchestrationName,
  hitlReview = true,
  onToggleHitl,
}) => {
  const {
    campaign,
    campaigns,
    conversation,
    deliverables,
    isLoading,
    updateFromApiData,
    selectCampaign,
    startCampaign,
    resetCampaign,
    resumeCampaign,
    refineCampaign,
  } = useCampaignState(orchestrationId);

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
  const [reviewPhaseKey, setReviewPhaseKey] = useState<string | null>(null);
  const [, setPollingError] = useState<unknown>(null);

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

  // Polling for updates
  useCampaignPolling(campaign, updateFromApiData, setPollingError);

  const handleResume = () => {
    resumeCampaign();
  };

  const handleRefine = () => setIsRefineModalOpen(true);

  const handleSubmitRefinement = async (instructions: string) => {
    setIsRefineModalOpen(false);
    await refineCampaign(instructions);
  };

  const handleViewPhaseDeliverable = (phaseKey: string) => {
    const key = Object.keys(deliverables).find((k) => k.includes(phaseKey));
    if (key && deliverables[key]) {
      setModalDeliverable(deliverables[key]);
      setIsDeliverableModalOpen(true);
      setReviewPhaseKey(phaseKey);
    }
  };

  const handleResumeFromModal = () => {
    setIsDeliverableModalOpen(false);
    setReviewPhaseKey(null);
    handleResume();
  };

  const handleRefineFromModal = () => {
    setIsDeliverableModalOpen(false);
    setReviewPhaseKey(null);
    setIsRefineModalOpen(true);
  };

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
                const d = Object.values(deliverables).find((x) => x.id === id);
                if (d) handleViewDetails(d);
              }}
            />
          }
        >
          {!campaign ? (
            <SharedCampaignForm
              onCreate={handleStartCampaign}
              onCancel={handleNewCampaign}
              isLoading={isLoading}
              selectedOrchestration={orchestrationId}
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
                campaign={campaign}
                onResume={handleResume}
                onRefine={handleRefine}
                onViewDeliverable={handleViewPhaseDeliverable}
              />
            </>
          )}
        </SharedOrchestrationLayout>
      </BaseOrchestrationPage>

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

export default GenericOrchestrationPage;
