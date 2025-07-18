import { ReactNode, useState } from "react";
import BaseOrchestrationPage from "./BaseOrchestrationPage";
import SharedOrchestrationLayout from "./SharedOrchestrationLayout";
import SidePanel from "../SidePanel";
import CampaignForm from "../CampaignForm";
import CampaignProgress from "../CampaignProgress";
import AgentCollaboration from "../AgentCollaboration";
import CampaignDeliverables from "../CampaignDeliverables";
import DeliverableModal from "../DeliverableModal";
import RefineInputModal from "../RefineInputModal";
import AudienceResearchModal from "../AudienceResearchModal";
import { Campaign, Deliverable, AudienceResearch } from "../../types";
import { useCampaignState } from "../../hooks/useCampaignState";
import { useCampaignPolling } from "../../hooks/useCampaignPolling";

interface HyattStyleOrchestrationTemplateProps {
  orchestrationId: string;
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  /** Optional extra content rendered below progress & collaboration */
  renderExtraCenter?: (campaign: Campaign | null) => ReactNode;
}

const HyattStyleOrchestrationTemplate: React.FC<
  HyattStyleOrchestrationTemplateProps
> = ({
  orchestrationId,
  orchestrationName,
  hitlReview = true,
  onToggleHitl,
  renderExtraCenter,
}) => {
  const {
    campaign,
    campaigns,
    conversation,
    deliverables,
    error,
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
  useCampaignPolling(campaign, updateFromApiData, setError);

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
            <CampaignDeliverables
              deliverables={Object.values(deliverables)}
              onViewDetails={(id) => {
                const d = Object.values(deliverables).find((x) => x.id === id);
                if (d) handleViewDetails(d);
              }}
            />
          }
        >
          {!campaign ? (
            <CampaignForm
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
              <CampaignProgress campaign={campaign} onViewProgress={() => setIsSidePanelOpen(true)} />
              <AgentCollaboration
                messages={conversation}
                campaign={campaign}
                onResume={handleResume}
                onRefine={handleRefine}
                onViewDeliverable={handleViewPhaseDeliverable}
              />
              {renderExtraCenter && renderExtraCenter(campaign)}
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

export default HyattStyleOrchestrationTemplate;
