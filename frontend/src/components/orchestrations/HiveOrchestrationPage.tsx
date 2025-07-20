import React from "react";
import OrchestrationPageTemplate from "./OrchestrationPageTemplate";
import { Campaign } from "../../types";

// Interfaces
interface AgentStatus {
  name: string;
  status: "idle" | "running" | "completed" | "error";
}

interface HiveOrchestratorProps {
  orchestrationId: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

// Sample agent data
const agents: AgentStatus[] = [
  { name: "Trend Cultural Analyzer", status: "idle" },
  { name: "Brand Lens", status: "idle" },
  { name: "Visual Prompt Generator", status: "idle" },
  { name: "Modular Elements Recommender", status: "idle" },
  { name: "Brand QA", status: "idle" },
];

// Hive Orchestrator Component (for renderExtraCenter)
const HiveOrchestrator: React.FC<{ campaign: Campaign | null }> = ({
  campaign,
}) => {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Agent Status Monitoring
        </h2>
        <ul className="space-y-4">
          {agents.map((agent) => (
            <li
              key={agent.name}
              className={`p-4 rounded-lg border border-border ${
                agent.status === "running"
                  ? "bg-primary text-white"
                  : agent.status === "completed"
                  ? "bg-success text-white"
                  : "bg-bg-primary text-text-secondary"
              }`}
            >
              <span className="font-medium">{agent.name}</span>: {agent.status}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Workflow Visualization
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-text-secondary">
          <li>Trend Cultural Analysis</li>
          <li>Brand Lens Application</li>
          <li>Visual Prompt Generation</li>
          <li>Modular Elements Recommendation</li>
          <li>Brand Quality Assurance</li>
        </ol>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Configuration Options
        </h2>
        <div className="text-text-secondary">
          <p>
            Configure each agent's parameters to tailor the orchestration
            process.
          </p>
          {/* Configuration options would be implemented here */}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Execution Controls
        </h2>
        <button
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium focus:ring-2 focus:ring-primary focus:border-primary"
          aria-label="Start Orchestration"
        >
          Start Orchestration
        </button>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Results Display
        </h2>
        <div className="text-text-secondary">
          <p>
            View the results of the orchestration process here once completed.
          </p>
          {/* Results display would be implemented here */}
        </div>
      </section>
    </div>
  );
};

// Main Hive Orchestration Page
const HiveOrchestrationPage: React.FC<HiveOrchestratorProps> = ({
  orchestrationId,
  hitlReview = true,
  onToggleHitl,
  onNavigateToOrchestrations,
}) => {
  return (
    <OrchestrationPageTemplate
      orchestrationId={orchestrationId}
      orchestrationName="Hive Orchestrator"
      hitlReview={hitlReview}
      onToggleHitl={onToggleHitl}
      renderExtraCenter={(campaign) => <HiveOrchestrator campaign={campaign} />}
    />
  );
};

export default HiveOrchestrationPage;
