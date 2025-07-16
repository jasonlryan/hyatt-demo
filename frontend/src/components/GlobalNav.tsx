import React, { useState, useEffect, useRef } from "react";
import { Building, Bot, ChevronDown, FolderOpen } from "lucide-react";

interface Campaign {
  id: string;
  brief: string;
  status: string;
  createdAt: string;
}

interface GlobalNavProps {
  currentView: "campaigns" | "agents" | "workflows";
  onNavigateToCampaigns: () => void;
  onNavigateToAgents: () => void;
  onNavigateToWorkflows: () => void;
  onNewCampaign: () => void;
  onLoadCampaign?: (campaignId: string) => void;
  campaigns?: Campaign[];
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoadCampaign = (campaignId: string) => {
    if (onLoadCampaign) {
      onLoadCampaign(campaignId);
    }
    setIsDropdownOpen(false);
  };
  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Building className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-white">
                Hyatt GPT Agents System
              </h1>
              <p className="text-sm text-slate-300">
                Collaborative AI agents for PR campaign development
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Campaign-specific controls */}
            {currentView === "campaigns" && (
              <>
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 py-2 px-4 rounded-lg text-white font-medium"
                  onClick={onNewCampaign}
                >
                  New Campaign
                </button>

                {/* Load Campaign Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="bg-slate-600 hover:bg-slate-500 transition-colors duration-200 py-2 px-4 rounded-lg text-white font-medium flex items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <FolderOpen size={16} className="mr-2" />
                    Load Campaign
                    <ChevronDown size={16} className="ml-2" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 border border-slate-200">
                      <div className="p-3 border-b border-slate-200">
                        <div className="text-slate-800 font-semibold text-sm">
                          All Campaigns ({campaigns.length})
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {campaigns.length > 0 ? (
                          campaigns.map((campaign, index) => (
                            <button
                              key={campaign.id}
                              onClick={() => handleLoadCampaign(campaign.id)}
                              className="w-full text-left p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <div className="text-slate-900 font-medium text-sm leading-tight flex-1 pr-2">
                                  {campaign.brief.substring(0, 80)}...
                                </div>
                                <div className="text-xs text-slate-500 whitespace-nowrap">
                                  #{index + 1}
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-slate-600">
                                  Status:{" "}
                                  <span className="font-medium">
                                    {campaign.status}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500">
                                  {new Date(
                                    campaign.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-slate-500 text-sm">
                            No campaigns available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* HITL Review Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-300">HITL Review</span>
                  <button
                    onClick={onToggleHitl}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      hitlReview ? "bg-green-500" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        hitlReview ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                    <span
                      className={`absolute text-xs font-medium transition-colors ${
                        hitlReview
                          ? "text-white left-1"
                          : "text-slate-300 right-1"
                      }`}
                    >
                      {hitlReview ? "ON" : "OFF"}
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* Navigation Tabs - Always on the right */}
            <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
              <button
                className={`py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  currentView === "campaigns"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-600"
                }`}
                onClick={onNavigateToCampaigns}
              >
                Campaigns
              </button>
              <button
                className={`py-2 px-4 rounded-md font-medium transition-colors duration-200 flex items-center ${
                  currentView === "agents"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-600"
                }`}
                onClick={onNavigateToAgents}
              >
                <Bot size={16} className="mr-2" />
                Agents
              </button>
              <button
                className={`py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  currentView === "workflows"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-600"
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
