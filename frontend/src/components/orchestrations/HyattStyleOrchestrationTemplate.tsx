import { ReactNode, useEffect, useRef, useState } from "react";
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
import {
  Campaign,
  ConversationMessage,
  Deliverable,
  AudienceResearch,
} from "../../types";

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
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [deliverables, setDeliverables] = useState<{ [key: string]: Deliverable }>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const intervalRef = useRef<number | null>(null);

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

  // Load existing campaigns on mount
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to load campaigns");
        const data = await res.json();
        setCampaigns(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  const handleSelectCampaign = async (campaignId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (!res.ok) throw new Error("Failed to load campaign");
      const data = await res.json();
      if ((data as any).campaignId && !data.id) {
        data.id = (data as any).campaignId;
      }
      setCampaign(data);
      if (data.conversation) {
        setConversation(data.conversation);
      }
      const extracted: { [key: string]: Deliverable } = {};
      if (data.phases?.research?.insights) {
        extracted["research"] = {
          id: "research",
          title: "Audience Research",
          status: "completed",
          agent: "Research & Audience GPT",
          timestamp:
            data.phases.research.insights.lastUpdated || new Date().toISOString(),
          content: data.phases.research.insights.analysis,
          lastUpdated: data.phases.research.insights.lastUpdated,
        };
      }
      if (data.conversation) {
        data.conversation.forEach((msg: any, index: number) => {
          if (msg.deliverable) {
            const id = `deliverable-${index}`;
            extracted[id] = {
              id,
              title: msg.speaker || "Deliverable",
              status: "completed",
              agent: msg.speaker || "AI Agent",
              timestamp: msg.timestamp || new Date().toISOString(),
              content: msg.deliverable.analysis || msg.deliverable,
              lastUpdated: msg.timestamp,
            };
          }
        });
      }
      setDeliverables(extracted);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCampaign = () => {
    setCampaign(null);
    setConversation([]);
    setDeliverables({});
    setError(null);
  };

  const startCampaign = async (brief: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignBrief: brief, orchestration: orchestrationId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create campaign");
      }
      const data = await res.json();
      if (data.campaignId && !data.id) data.id = data.campaignId;
      setCampaign(data);
      setConversation(data.conversation || []);
      setDeliverables({});
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling for updates
  useEffect(() => {
    if (campaign && campaign.status !== "completed" && campaign.status !== "failed") {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/campaigns/${campaign.id}`);
          if (!res.ok) throw new Error("Failed to fetch campaign status");
          const data = await res.json();
          setCampaign(data);
          setConversation(data.conversation || []);
          const extracted: { [key: string]: Deliverable } = {};
          if (data.conversation) {
            data.conversation.forEach((msg: any, index: number) => {
              if (msg.deliverable) {
                const agentName = msg.agent || msg.speaker || "AI Agent";
                const key = agentName.toLowerCase().replace(/\s+/g, "-");
                extracted[key] = {
                  id: key,
                  title: `${agentName} Analysis`,
                  status: "completed",
                  agent: agentName,
                  timestamp: msg.timestamp || new Date().toISOString(),
                  content: msg.deliverable,
                  lastUpdated: msg.timestamp,
                };
              }
            });
          }
          setDeliverables(extracted);
          setError(null);
          if (data.status === "completed" || data.status === "failed") {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        } catch (e: any) {
          setError("Connection lost");
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [campaign]);

  const handleResume = async () => {
    if (!campaign) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/campaigns/${campaign.id}/resume`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to resume campaign");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = () => setIsRefineModalOpen(true);

  const handleSubmitRefinement = async (instructions: string) => {
    if (!campaign) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/campaigns/${campaign.id}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions }),
      });
      if (!res.ok) throw new Error("Failed to refine campaign");
      setIsRefineModalOpen(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
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
              onCreate={startCampaign}
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
