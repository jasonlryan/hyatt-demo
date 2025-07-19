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
    <nav className="bg-white border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-[73px]">
          {/* Brand */}
          <div className="flex items-center">
            <div className="text-xl font-bold">
              <span className="text-success">ZENO</span>
              <span className="text-text-primary"> AI HIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation */}
            <div className="flex gap-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${
                  currentView === "orchestrations"
                    ? "bg-success text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-secondary"
                }`}
                onClick={onNavigateToOrchestrations}
              >
                Orchestrations
              </button>

              <button
                className={`px-4 py-2 text-sm font-medium rounded flex items-center ${
                  currentView === "agents"
                    ? "bg-success text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-secondary"
                }`}
                onClick={onNavigateToAgents}
              >
                <Bot size={14} className="mr-1" />
                Agents
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${
                  currentView === "workflows"
                    ? "bg-success text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-secondary"
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
