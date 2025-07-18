import { useState, useEffect } from "react";
import GlobalNav from "./components/GlobalNav";
import AgentsPage from "./components/AgentsPage";
import WorkflowsPage from "./components/WorkflowsPage";
import OrchestrationsPage from "./components/OrchestrationsPage";
import HyattOrchestrationPage from "./components/orchestrations/HyattOrchestrationPage";
import HiveOrchestrationPage from "./components/orchestrations/HiveOrchestrationPage";
import HitlReviewModal from "./components/HitlReviewModal";
import StylePanel from "./components/StylePanel";
import "./components/deliverableStyles.css";

function App() {
  const [currentView, setCurrentView] = useState<
    "orchestrations" | "agents" | "workflows"
  >("orchestrations");

  const [selectedOrchestration, setSelectedOrchestration] = useState<
    string | null
  >(null);

  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [hitlReview, setHitlReview] = useState(true);

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

  const handleSelectOrchestration = (orchestrationId: string) => {
    setSelectedOrchestration(orchestrationId);
  };

  const handleNavigateToAgents = () => {
    setCurrentView("agents");
    setSelectedOrchestration(null);
  };

  const handleNavigateToWorkflows = () => {
    setCurrentView("workflows");
    setSelectedOrchestration(null);
  };

  const handleNavigateToOrchestrations = () => {
    setCurrentView("orchestrations");
    setSelectedOrchestration(null);
  };

  const renderCurrentView = () => {
    // If an orchestration is selected, show the specific orchestration page
    if (selectedOrchestration) {
      switch (selectedOrchestration) {
        case "hyatt":
          return (
            <HyattOrchestrationPage
              selectedOrchestration={selectedOrchestration}
              hitlReview={hitlReview}
              onToggleHitl={async () => {
                const newState = !hitlReview;
                await updateHitlReviewState(newState);
                if (newState) {
                  setIsHitlModalOpen(true);
                }
              }}
              onNavigateToOrchestrations={handleNavigateToOrchestrations}
            />
          );
        case "hive":
          return (
            <HiveOrchestrationPage
              selectedOrchestration={selectedOrchestration}
              hitlReview={hitlReview}
              onToggleHitl={async () => {
                const newState = !hitlReview;
                await updateHitlReviewState(newState);
                if (newState) {
                  setIsHitlModalOpen(true);
                }
              }}
              onNavigateToOrchestrations={handleNavigateToOrchestrations}
            />
          );
        default:
          return (
            <OrchestrationsPage
              onSelectOrchestration={handleSelectOrchestration}
            />
          );
      }
    }

    // Otherwise show the main view
    switch (currentView) {
      case "orchestrations":
        return (
          <OrchestrationsPage
            onSelectOrchestration={handleSelectOrchestration}
          />
        );
      case "agents":
        return <AgentsPage />;
      case "workflows":
        return <WorkflowsPage />;
      default:
        return (
          <OrchestrationsPage
            onSelectOrchestration={handleSelectOrchestration}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      <GlobalNav
        currentView={currentView}
        onNavigateToAgents={handleNavigateToAgents}
        onNavigateToWorkflows={handleNavigateToWorkflows}
        onNavigateToOrchestrations={handleNavigateToOrchestrations}
      />

      {renderCurrentView()}

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
