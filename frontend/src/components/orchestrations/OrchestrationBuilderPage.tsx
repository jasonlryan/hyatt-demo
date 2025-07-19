import React, { useState } from "react";
import GenericOrchestrationTemplate from "./GenericOrchestrationTemplate";
import { SharedModal } from "../shared";

interface OrchestrationBuilderPageProps {
  orchestrationId: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
}

interface OrchestrationSpec {
  name: string;
  description: string;
  agents: string[];
  workflows: string[];
  config: {
    maxConcurrentWorkflows: number;
    timeout: number;
    retryAttempts: number;
    enableLogging: boolean;
    reactiveFramework?: boolean;
    parallelExecution?: boolean;
  };
  documentation?: {
    overview?: string;
    useCases?: string[];
    workflowDescription?: string;
    agentRoles?: Record<string, string>;
    deliverables?: string[];
    configuration?: string;
    bestPractices?: string[];
    limitations?: string[];
    examples?: {
      goodInputs?: string[];
      poorInputs?: string[];
    };
  };
}

const OrchestrationBuilderPage: React.FC<OrchestrationBuilderPageProps> = ({
  orchestrationId,
  hitlReview = true,
  onToggleHitl,
}) => {
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [generatedOrchestration, setGeneratedOrchestration] =
    useState<OrchestrationSpec | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateOrchestration = async (brief: string) => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-orchestration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: brief }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate orchestration: ${response.statusText}`
        );
      }

      const generatedOrchestration = await response.json();
      setGeneratedOrchestration(generatedOrchestration);
      setIsBuilderModalOpen(true);
    } catch (error) {
      console.error("Error generating orchestration:", error);
      // Fallback to mock data if AI generation fails
      const mockGenerated: OrchestrationSpec = {
        name: "AI-Generated Orchestrator",
        description: `Orchestration built for: ${brief}`,
        agents: ["research", "trending", "pr-manager"],
        workflows: ["research_workflow", "trending_workflow"],
        config: {
          maxConcurrentWorkflows: 3,
          timeout: 300000,
          retryAttempts: 2,
          enableLogging: true,
          reactiveFramework: true,
          parallelExecution: true,
        },
      };

      setGeneratedOrchestration(mockGenerated);
      setIsBuilderModalOpen(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveOrchestration = async () => {
    if (!generatedOrchestration) return;

    try {
      const response = await fetch("/api/save-orchestration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedOrchestration),
      });

      if (!response.ok) {
        throw new Error(`Failed to save orchestration: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Orchestration saved:", result);
      setIsBuilderModalOpen(false);
      setGeneratedOrchestration(null);
      alert(
        `Orchestration "${generatedOrchestration.name}" saved successfully!\n\nComplete documentation has been generated and saved to the docs folder.`
      );
    } catch (error) {
      console.error("Error saving orchestration:", error);
      alert("Failed to save orchestration. Please try again.");
    }
  };

  const renderOrchestrationBuilder = () => {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Orchestration Builder
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Describe your orchestration needs in natural language, and our AI
            will generate a complete orchestration configuration with agents,
            workflows, and comprehensive documentation.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Create New Orchestration
          </h2>

          <div className="mb-4">
            <label
              htmlFor="orchestration-description"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Orchestration Description
            </label>
            <textarea
              id="orchestration-description"
              className="w-full h-32 p-3 border border-border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Example: Create a content marketing orchestration that researches trending topics, generates blog posts, and distributes them across social media platforms..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  const target = e.target as HTMLTextAreaElement;
                  handleGenerateOrchestration(target.value);
                }
              }}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                const textarea = document.getElementById(
                  "orchestration-description"
                ) as HTMLTextAreaElement;
                if (textarea && textarea.value.trim()) {
                  handleGenerateOrchestration(textarea.value.trim());
                } else {
                  alert("Please enter a description for your orchestration.");
                }
              }}
              disabled={isGenerating}
              className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate Orchestration</span>
                  <span className="text-sm opacity-75">(Ctrl+Enter)</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-text-muted">
            <p>
              💡 <strong>Tip:</strong> Be specific about your use case, desired
              agents, and expected outputs for better results.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <GenericOrchestrationTemplate
        orchestrationId={orchestrationId}
        orchestrationName="Orchestration Builder"
        hitlReview={hitlReview}
        onToggleHitl={onToggleHitl}
      >
        {renderOrchestrationBuilder()}
      </GenericOrchestrationTemplate>

      <SharedModal
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
        maxWidthClass="max-w-4xl"
      >
        {generatedOrchestration && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Generated Orchestration: {generatedOrchestration.name}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Description
                </h3>
                <p className="text-text-secondary">
                  {generatedOrchestration.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Agents
                  </h3>
                  <ul className="list-disc list-inside text-text-secondary space-y-1">
                    {generatedOrchestration.agents.map((agent, index) => (
                      <li key={index}>{agent}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Workflows
                  </h3>
                  <ul className="list-disc list-inside text-text-secondary space-y-1">
                    {generatedOrchestration.workflows.map((workflow, index) => (
                      <li key={index}>{workflow}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Configuration
                </h3>
                <pre className="bg-secondary p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(generatedOrchestration.config, null, 2)}
                </pre>
              </div>

              {generatedOrchestration.documentation && (
                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Documentation Preview
                  </h3>
                  <div className="bg-primary-light p-4 rounded-md border border-border">
                    <h4 className="font-semibold text-primary mb-2">
                      Overview
                    </h4>
                    <p className="text-primary text-sm mb-3">
                      {generatedOrchestration.documentation.overview ||
                        "Documentation will be generated and saved to the docs folder."}
                    </p>
                    {generatedOrchestration.documentation.useCases && (
                      <>
                        <h4 className="font-semibold text-primary mb-2">
                          Use Cases
                        </h4>
                        <ul className="list-disc list-inside text-primary text-sm space-y-1">
                          {generatedOrchestration.documentation.useCases.map(
                            (useCase, index) => (
                              <li key={index}>{useCase}</li>
                            )
                          )}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsBuilderModalOpen(false)}
                  className="px-4 py-2 bg-secondary text-text-primary font-medium rounded hover:bg-secondary-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOrchestration}
                  className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary-hover transition-colors"
                >
                  Save Orchestration
                </button>
              </div>
            </div>
          </div>
        )}
      </SharedModal>
    </>
  );
};

export default OrchestrationBuilderPage;
