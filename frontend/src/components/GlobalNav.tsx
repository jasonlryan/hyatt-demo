import React from "react";
import { Bot } from "lucide-react";

interface GlobalNavProps {
  currentView: "orchestrations" | "agents" | "workflows";
  onNavigateToAgents: () => void;
  onNavigateToWorkflows: () => void;
  onNavigateToOrchestrations: () => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({
  currentView,
  onNavigateToAgents,
  onNavigateToWorkflows,
  onNavigateToOrchestrations,
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
