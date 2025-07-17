import React from "react";
import { Bot } from "lucide-react";

interface GlobalNavProps {
  currentView: "orchestrations" | "campaigns" | "agents" | "workflows";
  onNavigateToCampaigns: () => void;
  onNavigateToAgents: () => void;
  onNavigateToWorkflows: () => void;
  onNavigateToOrchestrations: () => void;
  hitlReview: boolean;
  onToggleHitl: () => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({
  currentView,
  onNavigateToCampaigns,
  onNavigateToAgents,
  onNavigateToWorkflows,
  onNavigateToOrchestrations,
  hitlReview,
  onToggleHitl,
}) => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-[73px]">
          {/* Brand */}
          <div className="flex items-center">
            <div className="text-xl font-bold">
              <span className="text-green-600">ZENO</span>
              <span className="text-gray-800"> AI HIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* HITL Review Toggle */}
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

            {/* Navigation */}
            <div className="flex gap-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${
                  currentView === "orchestrations"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={onNavigateToOrchestrations}
              >
                Orchestrations
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${
                  currentView === "campaigns"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={onNavigateToCampaigns}
              >
                Campaigns
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded flex items-center ${
                  currentView === "agents"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={onNavigateToAgents}
              >
                <Bot size={14} className="mr-1" />
                Agents
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${
                  currentView === "workflows"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={onNavigateToWorkflows}
              >
                Workflows
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlobalNav;
