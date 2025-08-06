import React, { useState, useEffect } from "react";

interface Orchestration {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: {
    maxConcurrentWorkflows: number;
    timeout: number;
    retryAttempts: number;
    enableLogging: boolean;
    reactiveFramework?: boolean;
    parallelExecution?: boolean;
  };
  workflows: string[];
  agents: string[];
}

interface OrchestrationsPageProps {
  onSelectOrchestration: (orchestrationId: string) => void;
}

const OrchestrationsPage: React.FC<OrchestrationsPageProps> = ({
  onSelectOrchestration,
}) => {
  const [orchestrations, setOrchestrations] = useState<Orchestration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrchestrations = async () => {
      try {
        setIsLoading(true);

        // Load orchestrations from API
        const response = await fetch("/api/orchestrations");
        if (response.ok) {
          const data = await response.json();
          // Convert orchestrators object to array
          const orchestrationsArray = Object.values(
            data.orchestrators || {}
          ) as Orchestration[];
          
          setOrchestrations(orchestrationsArray);
        } else {
          // Fallback to demo data if API fails
          setOrchestrations([
            {
              id: "hyatt",
              name: "Hyatt Orchestrator",
              description:
                "Hive Agents System - Collaborative AI agents for PR campaign development.",
              enabled: true,
              config: {
                maxConcurrentWorkflows: 5,
                timeout: 300000,
                retryAttempts: 3,
                enableLogging: true,
              },
              workflows: [
                "pr_campaign_workflow",
                "content_creation_workflow",
                "research_workflow",
              ],
              agents: [
                "pr_manager",
                "research_audience",
                "strategic_insight",
                "trending_news",
                "story_angles",
              ],
            },
            {
              id: "builder",
              name: "Orchestration Builder",
              description:
                "AI-powered orchestration generator. Describe what you want, and it creates a custom orchestration for you.",
              enabled: true,
              config: {
                maxConcurrentWorkflows: 3,
                timeout: 300000,
                retryAttempts: 2,
                enableLogging: true,
              },
              workflows: ["orchestration_generation_workflow"],
              agents: [
                "research",
                "strategic",
                "pr-manager",
              ],
            },
            {
              id: "hive",
              name: "Hive Orchestrator",
              description:
                "Reactive framework orchestration with parallel agent collaboration. Perfect for complex PR campaigns with multiple stakeholders.",
              enabled: true,
              config: {
                maxConcurrentWorkflows: 10,
                timeout: 600000,
                retryAttempts: 2,
                enableLogging: true,
                reactiveFramework: true,
                parallelExecution: true,
              },
              workflows: [
                "hive_pr_campaign",
                "hive_content_creation",
                "hive_research_collaboration",
              ],
              agents: [
                "pr_manager",
                "research_audience",
                "strategic_insight",
                "trending_news",
                "story_angles",
                "visual_prompt_generator",
                "brand_qa",
                "modular_elements_recommender",
              ],
            },
          ]);
        }
        setIsLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
      }
    };

    loadOrchestrations();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading orchestrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">
            Error loading orchestrations: {error}
          </p>
          <p className="text-text-secondary">Using demo orchestrations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Choose Your Orchestration
          </h1>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            Select the orchestration framework that best fits your campaign
            needs. Each orchestrator has different capabilities and execution
            patterns.
          </p>
        </div>

        {/* Orchestrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {orchestrations.map((orchestration) => (
            <div
              key={orchestration.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-text-primary">
                    {orchestration.name}
                  </h2>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      orchestration.enabled
                        ? "bg-success-light text-success"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {orchestration.enabled ? "Active" : "Inactive"}
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {orchestration.description}
                </p>
              </div>

              {/* Features */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-secondary rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {orchestration.config.maxConcurrentWorkflows}
                    </div>
                    <div className="text-xs text-text-secondary">
                      Max Workflows
                    </div>
                  </div>
                  <div className="text-center p-2 bg-secondary rounded-lg">
                    <div className="text-lg font-bold text-success">
                      {orchestration.agents.length}
                    </div>
                    <div className="text-xs text-text-secondary">Agents</div>
                  </div>
                </div>

                {/* Special Features */}
                {orchestration.config.reactiveFramework && (
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-purple-600 mb-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Reactive Framework
                    </div>
                    <div className="flex items-center text-sm text-primary">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Parallel Execution
                    </div>
                  </div>
                )}

                {/* Agents */}
                <div className="mb-4">
                  <h4 className="font-semibold text-text-primary mb-2 text-sm">
                    Available Agents
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {orchestration.agents.slice(0, 4).map((agent) => (
                      <span
                        key={agent}
                        className="px-2 py-1 bg-primary-light text-primary text-xs rounded-full"
                      >
                        {agent.replace("_", " ")}
                      </span>
                    ))}
                    {orchestration.agents.length > 4 && (
                      <span className="px-2 py-1 bg-secondary text-text-secondary text-xs rounded-full">
                        +{orchestration.agents.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onSelectOrchestration(orchestration.id)}
                  disabled={!orchestration.enabled}
                  className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    orchestration.enabled
                      ? "bg-success hover:bg-success-hover text-white shadow-lg hover:shadow-xl"
                      : "bg-secondary text-text-muted cursor-not-allowed"
                  }`}
                >
                  {orchestration.enabled
                    ? "Select Orchestration"
                    : "Currently Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center">
          <div className="bg-primary-light border border-border rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Need Help Choosing?
            </h3>
            <p className="text-primary">
              <strong>Hyatt Orchestrator:</strong> Specialized for hotel and
              hospitality PR campaigns with sequential workflow execution.
              <br />
              <strong>Hive Orchestrator:</strong> Best for complex campaigns
              requiring real-time collaboration and parallel processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationsPage;
