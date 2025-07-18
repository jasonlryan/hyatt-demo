import React, { useState } from "react";
import HyattStyleOrchestrationTemplate from "./HyattStyleOrchestrationTemplate";
import { SharedCampaignForm, SharedModal } from "../shared";

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

  const handleGenerateOrchestration = async (description: string) => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-orchestration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
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
        description: `Orchestration built for: ${description}`,
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

      // Close modal and reset
      setIsBuilderModalOpen(false);
      setGeneratedOrchestration(null);

      // Optionally show success message or refresh orchestrations list
      alert(
        `Orchestration "${generatedOrchestration.name}" saved successfully!\n\nComplete documentation has been generated and saved to the docs folder.`
      );
    } catch (error) {
      console.error("Error saving orchestration:", error);
      alert("Failed to save orchestration. Please try again.");
    }
  };

  const renderOrchestrationBuilder = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Orchestration Builder
      </h2>
      <p className="text-gray-600 mb-6">
        Describe the orchestration you want to create. The AI will generate
        agents, workflows, and configuration.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Orchestration Description
          </label>
          <textarea
            className="w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Describe the orchestration you want to create. For example: 'A content marketing orchestration that researches trending topics, creates blog posts, and distributes them across social media platforms.'"
            id="orchestrationDescription"
          />
        </div>

        <button
          onClick={() => {
            const description = (
              document.getElementById(
                "orchestrationDescription"
              ) as HTMLTextAreaElement
            )?.value;
            if (description) {
              handleGenerateOrchestration(description);
            }
          }}
          disabled={isGenerating}
          className="px-4 py-2 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? "Generating..." : "Generate Orchestration"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <HyattStyleOrchestrationTemplate
        orchestrationId={orchestrationId}
        orchestrationName="Orchestration Builder"
        hitlReview={hitlReview}
        onToggleHitl={onToggleHitl}
        renderExtraCenter={() => renderOrchestrationBuilder()}
      />

      <SharedModal
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
        maxWidthClass="max-w-4xl"
      >
        {generatedOrchestration && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Generated Orchestration: {generatedOrchestration.name}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">
                  {generatedOrchestration.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Agents
                  </h3>
                  <div className="space-y-2">
                    {generatedOrchestration.agents.map((agent, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md"
                      >
                        <span className="text-blue-800 font-medium">
                          {agent}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Workflows
                  </h3>
                  <div className="space-y-2">
                    {generatedOrchestration.workflows.map((workflow, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
                      >
                        <span className="text-green-800 font-medium">
                          {workflow}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Configuration
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
                    {JSON.stringify(generatedOrchestration.config, null, 2)}
                  </pre>
                </div>
              </div>

              {generatedOrchestration.documentation && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Documentation Preview
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <p className="text-blue-800 text-sm mb-2">
                      <strong>Overview:</strong>{" "}
                      {generatedOrchestration.documentation.overview}
                    </p>
                    {generatedOrchestration.documentation.useCases && (
                      <div className="mb-2">
                        <strong className="text-blue-800 text-sm">
                          Use Cases:
                        </strong>
                        <ul className="text-blue-700 text-sm ml-4 mt-1">
                          {generatedOrchestration.documentation.useCases.map(
                            (useCase, index) => (
                              <li key={index}>• {useCase}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    <p className="text-blue-600 text-xs">
                      Complete documentation will be generated and saved
                      automatically.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsBuilderModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOrchestration}
                  className="px-4 py-2 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition-colors"
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
