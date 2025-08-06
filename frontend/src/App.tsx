import { useState, useEffect, Suspense } from "react";
import { useOrchestrationNavigation } from "./hooks/useOrchestrationNavigation";
import GlobalNav from "./components/GlobalNav";
import AgentsPage from "./components/AgentsPage";
import WorkflowsPage from "./components/WorkflowsPage";
import OrchestrationsPage from "./components/OrchestrationsPage";
import InsightsPage from "./components/insights/InsightsPage";
import HyattOrchestrationPage from "./components/orchestrations/HyattOrchestrationPage";
import HiveOrchestrationPage from "./components/orchestrations/HiveOrchestrationPage";
import OrchestrationBuilderPage from "./components/orchestrations/OrchestrationBuilderPage";
// Removed unused import: GenericOrchestrationPage
import { loadOrchestrationPage } from "./components/orchestrations/generated";
// Test imports for unified architecture
import TestUnifiedHive from "./components/orchestrations/TestUnifiedHive";
import TestUnifiedDebug from "./components/orchestrations/TestUnifiedDebug";
type OrchestrationPageProps = {
  orchestrationId: string;
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
};
import HitlReviewModal from "./components/HitlReviewModal";
import StylePanel from "./components/StylePanel";
import "./components/deliverableStyles.css";

const OrchestrationPageLoader = ({
  orchestrationId,
  ...props
}: OrchestrationPageProps) => {
  const [OrchestrationComponent, setOrchestrationComponent] =
    useState<React.ComponentType<OrchestrationPageProps> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        const Component = await loadOrchestrationPage(orchestrationId);
        setOrchestrationComponent(() => Component);
      } catch (err: unknown) {
        console.error(
          `Failed to load orchestration page for ${orchestrationId}:`,
          err
        );
        setError(err instanceof Error ? err : new Error(String(err)));
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

  return OrchestrationComponent ? (
    <OrchestrationComponent {...props} orchestrationId={orchestrationId} />
  ) : null;
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
  const [isInsightsView, setIsInsightsView] = useState(false);

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
    setIsInsightsView(false);
    navigateToAgents();
  };

  const handleNavigateToWorkflows = () => {
    setIsInsightsView(false);
    navigateToWorkflows();
  };

  const handleNavigateToOrchestrations = () => {
    setIsInsightsView(false);
    navigateToOrchestrations();
  };

  const handleNavigateToInsights = () => {
    setIsInsightsView(true);
    window.history.pushState({ view: 'insights' }, '', '/insights');
  };

  const renderCurrentView = () => {
    // If insights view is active, show insights page
    if (isInsightsView) {
      return <InsightsPage />;
    }

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
        case "test-unified-hive":
          try {
            return (
              <TestUnifiedHive
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
          } catch (error) {
            console.error('Error rendering TestUnifiedHive:', error);
            return (
              <div className="min-h-screen p-8 bg-red-50">
                <h1 className="text-3xl font-bold text-red-700">Error Loading Unified Test</h1>
                <pre className="mt-4 p-4 bg-white rounded text-red-600">
                  {String(error)}
                </pre>
              </div>
            );
          }
        default:
          return (
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">
                      Loading orchestration...
                    </p>
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
        currentView={isInsightsView ? "insights" : currentView}
        onNavigateToAgents={handleNavigateToAgents}
        onNavigateToWorkflows={handleNavigateToWorkflows}
        onNavigateToOrchestrations={handleNavigateToOrchestrations}
        onNavigateToInsights={handleNavigateToInsights}
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
