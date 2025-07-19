import { useState, useEffect, Suspense } from "react";
import { useOrchestrationNavigation } from "./hooks/useOrchestrationNavigation";
import GlobalNav from "./components/GlobalNav";
import AgentsPage from "./components/AgentsPage";
import WorkflowsPage from "./components/WorkflowsPage";
import OrchestrationsPage from "./components/OrchestrationsPage";
import HyattOrchestrationPage from "./components/orchestrations/HyattOrchestrationPage";
import HiveOrchestrationPage from "./components/orchestrations/HiveOrchestrationPage";
import TemplateOrchestrationPage from "./components/orchestrations/TemplateOrchestrationPage";
import OrchestrationBuilderPage from "./components/orchestrations/OrchestrationBuilderPage";
import GenericOrchestrationPage from "./components/orchestrations/GenericOrchestrationPage";
import {
  loadOrchestrationPage,
  GeneratedOrchestrationPageProps,
} from "./components/orchestrations/generated";
import HitlReviewModal from "./components/HitlReviewModal";
import StylePanel from "./components/StylePanel";
import "./components/deliverableStyles.css";

const OrchestrationPageLoader = ({ orchestrationId, ...props }: GeneratedOrchestrationPageProps) => {
  const [OrchestrationComponent, setOrchestrationComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        const Component = await loadOrchestrationPage(orchestrationId);
        setOrchestrationComponent(() => Component);
      } catch (err: any) {
        console.error(`Failed to load orchestration page for ${orchestrationId}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [orchestrationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading orchestration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">Failed to load orchestration</p>
          <p className="text-text-secondary">Using generic template</p>
        </div>
      </div>
    );
  }

  return OrchestrationComponent ? <OrchestrationComponent {...props} /> : null;
};

function App() {
  const {
    currentView,
    selectedOrchestration,
    navigateToAgents,
    navigateToWorkflows,
    navigateToOrchestrations,
    selectOrchestration,
  } = useOrchestrationNavigation();

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
    selectOrchestration(orchestrationId);
  };

  const handleNavigateToAgents = () => {
    navigateToAgents();
  };

  const handleNavigateToWorkflows = () => {
    navigateToWorkflows();
  };

  const handleNavigateToOrchestrations = () => {
    navigateToOrchestrations();
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
        case "template":
          return (
            <TemplateOrchestrationPage
              orchestrationId="hyatt"
              hitlReview={hitlReview}
              onToggleHitl={async () => {
                const newState = !hitlReview;
                await updateHitlReviewState(newState);
                if (newState) {
                  setIsHitlModalOpen(true);
                }
              }}
            />
          );
        case "builder":
          return (
            <OrchestrationBuilderPage
              orchestrationId="builder"
              hitlReview={hitlReview}
              onToggleHitl={async () => {
                const newState = !hitlReview;
                await updateHitlReviewState(newState);
                if (newState) {
                  setIsHitlModalOpen(true);
                }
              }}
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
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading orchestration...</p>
                  </div>
                </div>
              }
            >
              <OrchestrationPageLoader
                orchestrationId={selectedOrchestration}
                orchestrationName={selectedOrchestration}
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
            </Suspense>
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
