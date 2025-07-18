import { useState, useEffect, useRef } from "react";
import BaseOrchestrationPage from "./BaseOrchestrationPage";
import SidePanel from "../SidePanel";
import CampaignProgress from "../CampaignProgress";
import AgentCollaboration from "../AgentCollaboration";
import CampaignDeliverables from "../CampaignDeliverables";
import AudienceResearchModal from "../AudienceResearchModal";
import RefineInputModal from "../RefineInputModal";
import ReviewPanel from "../ReviewPanel";
import CampaignForm from "../CampaignForm";
import DeliverableModal from "../DeliverableModal";
import {
  Campaign,
  ConversationMessage,
  Deliverable,
  AudienceResearch,
} from "../../types";
import { Eye } from "lucide-react";

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
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [deliverables, setDeliverables] = useState<{
    [key: string]: Deliverable;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState<Deliverable | null>(
    null
  );
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [modalResearch, setModalResearch] = useState<AudienceResearch | null>(
    null
  );

  // Track which deliverable is being reviewed from phase card
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

  // Load existing campaigns on component mount
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
    setShowReviewPanel(false);
  };

  const startCampaign = async (brief: string) => {
    if (!selectedOrchestration) {
      setError("Please select an orchestration first");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignBrief: brief,
          orchestration: selectedOrchestration,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create campaign");
      }

      const data = await res.json();
      // Fix campaign ID inconsistency
      if (data.campaignId && !data.id) {
        data.id = data.campaignId;
      }
      setCampaign(data);
      setConversation(data.conversation || []);
      setDeliverables({});

      // Immediately fetch the latest campaign state after creation
      // This ensures we don't miss the research phase that happens quickly
      setTimeout(async () => {
        try {
          const latestRes = await fetch(`/api/campaigns/${data.id}`);
          if (latestRes.ok) {
            const latestData = await latestRes.json();
            setCampaign(latestData);
            setConversation(latestData.conversation || []);

            // Extract deliverables
            const extractedDeliverables: { [key: string]: any } = {};

            // Only extract deliverables from conversation messages
            // Don't extract from phases.research.insights as it may have incomplete data
            if (latestData.conversation) {
              latestData.conversation.forEach((msg: any, index: number) => {
                if (msg.deliverable) {
                  const agentName = msg.agent || msg.speaker || "AI Agent";
                  const deliverableKey = agentName
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                  extractedDeliverables[deliverableKey] = {
                    id: deliverableKey,
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

            setDeliverables(extractedDeliverables);

            // Check if we should show review panel
            if (latestData.status === "paused" && latestData.awaitingReview) {
              setShowReviewPanel(true);
            }
          }
        } catch (e) {
          console.error("Failed to fetch latest campaign state:", e);
        }
      }, 2000); // Wait 2 seconds for research phase to start
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling effect for campaign updates
  useEffect(() => {
    if (
      campaign &&
      campaign.status !== "completed" &&
      campaign.status !== "failed"
    ) {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/campaigns/${campaign.id}`);
          if (!res.ok) throw new Error("Failed to fetch campaign status");
          const data = await res.json();

          setCampaign(data);
          setConversation(data.conversation || []);

          // Add debug logging
          console.log("Campaign update:", {
            status: data.status,
            awaitingReview: data.awaitingReview,
            pendingPhase: data.pendingPhase,
            hasPhases: !!data.phases,
            hasResearch: !!data.phases?.research,
            hasResearchInsights: !!data.phases?.research?.insights,
            conversationLength: data.conversation?.length,
          });

          // Extract deliverables from backend data
          const extractedDeliverables: { [key: string]: any } = {};

          // Only extract deliverables from conversation messages
          // Don't extract from phases.research.insights as it may have incomplete data
          if (data.conversation) {
            data.conversation.forEach((msg: any, index: number) => {
              if (msg.deliverable) {
                const agentName = msg.agent || msg.speaker || "AI Agent";
                const deliverableKey = agentName
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                extractedDeliverables[deliverableKey] = {
                  id: deliverableKey,
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

          setDeliverables(extractedDeliverables);
          setError(null);

          // Show review panel if campaign is paused for manual review
          if (data.status === "paused" && data.awaitingReview) {
            console.log("Setting showReviewPanel to true");
            setShowReviewPanel(true);
          } else {
            console.log("Setting showReviewPanel to false");
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
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={
                onNavigateToOrchestrations || (() => window.history.back())
              }
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              Orchestrations
            </button>
            <span>›</span>
            <span className="text-gray-800 font-medium">
              Hyatt Orchestrator
            </span>
          </nav>

          {/* HITL Review Toggle */}
          {onToggleHitl && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">HITL Review</span>
              <button
                onClick={onToggleHitl}
                className={`relative inline-flex h-6 w-12 items-center rounded-full ${
                  hitlReview ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                    hitlReview ? "translate-x-7" : "translate-x-1"
                  }`}
                />
                <span
                  className={`absolute text-xs font-medium ${
                    hitlReview ? "text-white left-1" : "text-gray-600 right-1"
                  }`}
                >
                  {hitlReview ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Transcript (optional) */}
          {isSidePanelOpen && (
            <div className="lg:col-span-3">
              <SidePanel
                messages={conversation}
                isOpen={isSidePanelOpen}
                onClose={() => setIsSidePanelOpen(false)}
              />
            </div>
          )}

          {/* Central Panel - Progress & Actions */}
          <div
            className={`${
              isSidePanelOpen ? "lg:col-span-5" : "lg:col-span-8"
            } space-y-6`}
          >
            {!campaign ? (
              <CampaignForm
                onCreate={startCampaign}
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
                <CampaignProgress
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
          </div>

          {/* Right Panel - Deliverables */}
          <div className="lg:col-span-4">
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
