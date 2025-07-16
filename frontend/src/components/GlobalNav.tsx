import React, { useState } from "react";
import { Building, Bot, ChevronDown, FolderOpen } from "lucide-react";

interface GlobalNavProps {
  currentView: "campaigns" | "agents" | "workflows";
  onNavigateToCampaigns: () => void;
  onNavigateToAgents: () => void;
  onNavigateToWorkflows: () => void;
  onNewCampaign: () => void;
  onLoadCampaign?: (campaignId: string) => void;
  campaigns?: any[];
  hitlReview: boolean;
  onToggleHitl: () => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({
  currentView,
  onNavigateToCampaigns,
  onNavigateToAgents,
  onNavigateToWorkflows,
  onNewCampaign,
  onLoadCampaign,
  campaigns = [],
  hitlReview,
  onToggleHitl,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-[73px]">
          {/* Brand */}
          <div className="flex items-center">
            <Building className="w-6 h-6 text-success mr-3" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Hyatt GPT Agents System
              </h1>
              <p className="text-xs text-gray-500">
                Collaborative AI agents for PR campaign development
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Campaign controls */}
            {currentView === "campaigns" && (
              <>
                <button
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                  onClick={onNewCampaign}
                >
                  New Campaign
                </button>

                <div className="relative">
                  <button
                    className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:border-gray-400 flex items-center"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <FolderOpen size={14} className="mr-2" />
                    Load Campaign
                    <ChevronDown size={14} className="ml-2" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-1 w-80 bg-white rounded border border-gray-200 shadow-sm z-50">
                      <div className="p-3 border-b border-gray-100">
                        <div className="text-gray-900 font-medium text-sm">
                          All Campaigns ({campaigns.length})
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {campaigns.length > 0 ? (
                          campaigns.map((campaign, index) => (
                            <button
                              key={campaign.id}
                              onClick={() => {
                                onLoadCampaign?.(campaign.id);
                                setDropdownOpen(false);
                              }}
                              className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="text-gray-900 text-sm">
                                {campaign.brief.substring(0, 60)}...
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Status: {campaign.status}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            No campaigns available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
                        hitlReview
                          ? "text-white left-1"
                          : "text-gray-600 right-1"
                      }`}
                    >
                      {hitlReview ? "ON" : "OFF"}
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex gap-1">
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
