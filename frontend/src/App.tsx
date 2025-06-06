import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import SidePanel from "./components/SidePanel";
import CampaignProgress from "./components/CampaignProgress";
import AgentCollaboration from "./components/AgentCollaboration";
import CampaignDeliverables from "./components/CampaignDeliverables";
import AudienceResearchModal from "./components/AudienceResearchModal";
import RefineInputModal from "./components/RefineInputModal";
import ReviewPanel from "./components/ReviewPanel";
import HitlReviewModal from "./components/HitlReviewModal";
import CampaignForm from "./components/CampaignForm";
import DeliverableModal from "./components/DeliverableModal";
import {
  Campaign,
  ConversationMessage,
  Deliverable,
  AudienceResearch,
} from "./types";

function App() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [deliverables, setDeliverables] = useState<{
    [key: string]: Deliverable;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [hitlReview, setHitlReview] = useState(true);
  const [showReviewPanel, setShowReviewPanel] = useState(true);
  const [modalDeliverable, setModalDeliverable] = useState<Deliverable | null>(
    null
  );
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [modalResearch, setModalResearch] = useState<AudienceResearch | null>(
    null
  );

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

  const handleNewCampaign = () => {
    setCampaign(null);
    setConversation([]);
    setDeliverables({});
    setError(null);
  };

  const startCampaign = async (brief: string) => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignBrief: brief }),
      });
      if (!res.ok) throw new Error("Failed to start campaign");
      const data = await res.json();
      // The backend returns a full campaign object on start now
      setCampaign(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (
      campaign &&
      campaign.status !== "completed" &&
      campaign.status !== "failed"
    ) {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/campaigns/${campaign.id}`);
          if (!res.ok) throw new Error("Network error");
          const data: Campaign = await res.json();

          setCampaign(data);
          if (data.conversation) {
            setConversation(data.conversation);
          }
          if (data.deliverables) {
            setDeliverables(data.deliverables);
          }
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [campaign]);

  const handleResume = () => {
    setShowReviewPanel(false);
    alert("Campaign resumed. Moving to the next phase.");
  };

  const handleRefine = () => {
    setIsRefineModalOpen(true);
  };

  const handleSubmitRefinement = (instructions: string) => {
    console.log("Refinement instructions:", instructions);
    setShowReviewPanel(false);
    alert("Refinement instructions submitted. Adjusting research phase...");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        onNewCampaign={handleNewCampaign}
        hitlReview={hitlReview}
        onToggleHitl={() => {
          setHitlReview(!hitlReview);
          if (!hitlReview) {
            setIsHitlModalOpen(true);
          }
        }}
      />

      <SidePanel
        messages={conversation}
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!campaign ? (
              <CampaignForm onCreate={startCampaign} isLoading={!!campaign} />
            ) : (
              <>
                <CampaignProgress
                  campaign={campaign}
                  onViewProgress={() => setIsSidePanelOpen(true)}
                />

                <AgentCollaboration messages={conversation} />

                <ReviewPanel
                  isVisible={showReviewPanel}
                  onResume={handleResume}
                  onRefine={handleRefine}
                />
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <CampaignDeliverables
              deliverables={Object.values(deliverables)}
              onViewDetails={(id) => {
                const deliverable = Object.values(deliverables).find(
                  (d) => d.id === id
                );
                if (deliverable) handleViewDetails(deliverable);
              }}
            />
          </div>
        </div>
      </div>

      <DeliverableModal
        deliverable={modalDeliverable}
        isOpen={isDeliverableModalOpen}
        onClose={() => setIsDeliverableModalOpen(false)}
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

      <HitlReviewModal
        isOpen={isHitlModalOpen}
        onClose={() => setIsHitlModalOpen(false)}
      />
    </div>
  );
}

export default App;
