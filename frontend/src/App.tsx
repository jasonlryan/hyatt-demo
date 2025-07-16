import { useState, useEffect, useRef } from "react";
import GlobalNav from "./components/GlobalNav";
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
import AgentsPage from "./components/AgentsPage";
import WorkflowsPage from "./components/WorkflowsPage";
import StylePanel from "./components/StylePanel";
import {
  Campaign,
  ConversationMessage,
  Deliverable,
  AudienceResearch,
} from "./types";

function App() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [deliverables, setDeliverables] = useState<{
    [key: string]: Deliverable;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<
    "campaigns" | "agents" | "workflows"
  >("campaigns");

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [hitlReview, setHitlReview] = useState(true);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState<Deliverable | null>(
    null
  );
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [modalResearch, setModalResearch] = useState<AudienceResearch | null>(
    null
  );

  // Load HITL review state from backend
  const loadHitlReviewState = async () => {
    try {
      const response = await fetch("/api/manual-review");
      if (response.ok) {
        const data = await response.json();
        setHitlReview(data.enabled);
      }
    } catch (error) {
      console.error("Failed to load HITL review state:", error);
    }
  };

  // Update HITL review state on backend
  const updateHitlReviewState = async (enabled: boolean) => {
    try {
      const response = await fetch("/api/manual-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        const data = await response.json();
        setHitlReview(data.enabled);
      } else {
        console.error("Failed to update HITL review state");
      }
    } catch (error) {
      console.error("Failed to update HITL review state:", error);
    }
  };

  // Load initial HITL state when component mounts
  useEffect(() => {
    loadHitlReviewState();
  }, []);

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

  // Load existing campaigns on app start
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
      // Ensure campaign has id property for consistency
      if ((data as any).campaignId && !data.id) {
        data.id = (data as any).campaignId;
      }
      setCampaign(data);

      // Load conversation and deliverables
      if (data.conversation) {
        setConversation(data.conversation);
      }

      // Extract deliverables from backend data
      const extractedDeliverables: { [key: string]: any } = {};

      // Get research deliverable
      if (data.phases?.research?.insights) {
        extractedDeliverables["research"] = {
          id: "research",
          title: "Audience Research",
          status: "completed",
          agent: "Research & Audience GPT",
          timestamp:
            data.phases.research.insights.lastUpdated ||
            new Date().toISOString(),
          content: data.phases.research.insights.analysis,
          lastUpdated: data.phases.research.insights.lastUpdated,
        };
      }

      // Get deliverables from conversation
      if (data.conversation) {
        data.conversation.forEach((msg: any, index: number) => {
          if (msg.deliverable) {
            const id = `deliverable-${index}`;
            extractedDeliverables[id] = {
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

      setDeliverables(extractedDeliverables);
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
    setCurrentView("campaigns");
  };

  const handleNavigateToAgents = () => {
    setCurrentView("agents");
  };

  const handleNavigateToWorkflows = () => {
    setCurrentView("workflows");
  };

  const startCampaign = async (brief: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignBrief: brief }),
      });
      if (!res.ok) throw new Error("Failed to start campaign");
      const data = await res.json();
      // Fix: Backend returns campaignId, but we need id for consistency
      if ((data as any).campaignId && !data.id) {
        data.id = (data as any).campaignId;
      }
      setCampaign(data);

      // Reload campaigns list to include the new one
      const campaignsRes = await fetch("/api/campaigns");
      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (
      campaign &&
      campaign.id &&
      campaign.status !== "completed" &&
      campaign.status !== "failed"
    ) {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/campaigns/${campaign.id}`);
          if (!res.ok) throw new Error("Network error");
          const data: Campaign = await res.json();

          // Ensure campaign has id property for consistency
          if (data.campaignId && !data.id) {
            data.id = data.campaignId;
          }
          setCampaign(data);
          if (data.conversation) {
            setConversation(data.conversation);
          }

          // Extract deliverables from the backend data structure
          const extractedDeliverables: { [key: string]: any } = {};

          // Get research deliverable from phases
          if (data.phases?.research?.insights) {
            extractedDeliverables["research"] = {
              id: "research",
              title: "Audience Research",
              status: "completed",
              agent: "Research & Audience GPT",
              timestamp:
                data.phases.research.insights.lastUpdated ||
                new Date().toISOString(),
              content: data.phases.research.insights.analysis,
              lastUpdated: data.phases.research.insights.lastUpdated,
            };
          }

          // Get deliverables from conversation messages
          if (data.conversation) {
            data.conversation.forEach((msg: any, index: number) => {
              if (msg.deliverable) {
                const id = `deliverable-${index}`;
                extractedDeliverables[id] = {
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

          setDeliverables(extractedDeliverables);
          setError(null);

          // Show review panel if campaign is paused for manual review
          if (data.status === "paused" && data.awaitingReview) {
            setShowReviewPanel(true);
          } else {
            setShowReviewPanel(false);
          }

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

  const handleResume = async () => {
    if (!campaign || !campaign.id) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/campaigns/${campaign.id}/resume`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to resume campaign");

      setShowReviewPanel(false);
      // The polling will pick up the status change
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = () => {
    setIsRefineModalOpen(true);
  };

  const handleSubmitRefinement = async (instructions: string) => {
    if (!campaign || !campaign.id) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/campaigns/${campaign.id}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions }),
      });

      if (!res.ok) throw new Error("Failed to refine campaign");

      setShowReviewPanel(false);
      setIsRefineModalOpen(false);
      // The polling will pick up the status change
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <GlobalNav
        currentView={currentView}
        onNavigateToCampaigns={() => setCurrentView("campaigns")}
        onNavigateToAgents={handleNavigateToAgents}
        onNavigateToWorkflows={handleNavigateToWorkflows}
        onNewCampaign={handleNewCampaign}
        onLoadCampaign={handleSelectCampaign}
        campaigns={campaigns}
        hitlReview={hitlReview}
        onToggleHitl={async () => {
          const newState = !hitlReview;
          await updateHitlReviewState(newState);
          if (newState) {
            setIsHitlModalOpen(true);
          }
        }}
      />

      <SidePanel
        messages={conversation}
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />

      {currentView === "workflows" && <WorkflowsPage />}
      {currentView === "agents" ? (
        <AgentsPage />
      ) : (
        <div className="min-h-screen">
          <div className="container py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {!campaign ? (
                  <CampaignForm
                    onCreate={startCampaign}
                    onCancel={handleNewCampaign}
                    isLoading={isLoading}
                  />
                ) : (
                  <>
                    <CampaignProgress
                      campaign={campaign}
                      onViewProgress={() => setIsSidePanelOpen(true)}
                    />

                    <AgentCollaboration messages={conversation} />

                    <ReviewPanel
                      isVisible={showReviewPanel}
                      awaitingReview={campaign?.awaitingReview}
                      pendingPhase={campaign?.pendingPhase}
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
        </div>
      )}

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

      {/* Style Designer Panel */}
      <StylePanel />
    </div>
  );
}

export default App;
