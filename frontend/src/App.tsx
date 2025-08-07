import { useState, useEffect, Suspense } from "react";
import { useOrchestrationNavigation } from "./hooks/useOrchestrationNavigation";
import { useGenericImplementation, getFeatureFlags } from "./config/feature-flags";
import GlobalNav from "./components/GlobalNav";
import AgentsPage from "./components/AgentsPage";
import WorkflowsPage from "./components/WorkflowsPage";
import OrchestrationsPage from "./components/OrchestrationsPage";
import InsightsPage from "./components/insights/InsightsPage";
import { getAvailableOrchestrations, getOrchestrationConfig } from "./services/orchestrationService";
import HyattOrchestrationPage from "./components/orchestrations/HyattOrchestrationPage";
import HiveOrchestrationPage from "./components/orchestrations/HiveOrchestrationPage";
import TestConfigurableHyatt from "./components/orchestrations/TestConfigurableHyatt";
import TestConfigurableHive from "./components/orchestrations/TestConfigurableHive";
import OrchestrationBuilderPage from "./components/orchestrations/OrchestrationBuilderPage";
import { loadOrchestrationPage } from "./components/orchestrations/generated";
// Test imports removed - cleaned up failed unified architecture attempt
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

    // If an orchestration is selected, show the appropriate orchestration page
    if (selectedOrchestration) {
      // Dynamic orchestration loading based on configuration
      const orchestrationConfig = getOrchestrationConfig(selectedOrchestration);
      
      if (!orchestrationConfig) {
        return (
          <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-text-primary mb-4">Orchestration Not Found</h1>
              <p className="text-text-secondary">Unknown orchestration type: {selectedOrchestration}</p>
              <button 
                onClick={handleNavigateToOrchestrations}
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
              >
                Back to Orchestrations
              </button>
            </div>
          </div>
        );
      }
      
      // Handle special cases that need specific components
      if (selectedOrchestration === "builder") {
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
      }
      
      // Dynamic component selection based on feature flags and orchestration type
      if (useGenericImplementation(selectedOrchestration)) {
        // Use configurable components when feature flag is enabled
        const ConfigurableComponent = selectedOrchestration === 'hyatt' ? TestConfigurableHyatt : TestConfigurableHive;
        return (
          <ConfigurableComponent
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
      } else {
        // Use legacy orchestration-specific components
        const LegacyComponent = selectedOrchestration === 'hyatt' ? HyattOrchestrationPage : HiveOrchestrationPage;
        return (
          <LegacyComponent
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

  const flags = getFeatureFlags();

  return (
    <div className="min-h-screen">
      <GlobalNav
        currentView={isInsightsView ? "insights" : currentView}
        onNavigateToAgents={handleNavigateToAgents}
        onNavigateToWorkflows={handleNavigateToWorkflows}
        onNavigateToOrchestrations={handleNavigateToOrchestrations}
        onNavigateToInsights={handleNavigateToInsights}
      />

      {/* Feature Flag Implementation Indicator */}
      {flags.showImplementationIndicator && (flags.useGenericHiveImplementation || flags.useGenericHyattImplementation) && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-1 text-sm font-medium z-50 shadow-lg">
          🚀 GENERIC SYSTEM ACTIVE: 
          {flags.useGenericHiveImplementation && " Hive"}
          {flags.useGenericHyattImplementation && " Hyatt"}
          {flags.useGenericHiveImplementation && flags.useGenericHyattImplementation && " (Both)"}
          <button 
            onClick={() => window.location.search.includes('test=') ? window.location.href = window.location.pathname : null}
            className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs hover:bg-white/30"
          >
            Reset
          </button>
        </div>
      )}

      <div className={flags.showImplementationIndicator && (flags.useGenericHiveImplementation || flags.useGenericHyattImplementation) ? "pt-6" : ""}>
        {renderCurrentView()}
      </div>

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
