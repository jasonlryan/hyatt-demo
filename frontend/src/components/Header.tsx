import React, { useState, useEffect, useRef } from "react";
import { Building, ChevronDown, FolderOpen } from "lucide-react";

interface Campaign {
  id: string;
  brief: string;
  status: string;
  createdAt: string;
}

interface HeaderProps {
  onNewCampaign: () => void;
  onLoadCampaign?: (campaignId: string) => void;
  campaigns?: Campaign[];
  hitlReview: boolean;
  onToggleHitl: () => void;
  currentView?: "campaigns" | "agents";
}

const Header: React.FC<HeaderProps> = ({
  onNewCampaign,
  onLoadCampaign,
  campaigns = [],
  hitlReview,
  onToggleHitl,
  currentView = "campaigns",
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
    <header className="bg-slate-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <div className="text-amber-400 mr-3">
            <Building size={36} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
              Hive Agents System
            </h1>
            <p className="text-slate-300 text-sm">
              Collaborative AI agents for PR campaign development
            </p>
          </div>
        </div>

        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <button
            className="bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 py-2 px-4 rounded-lg text-white font-medium"
            onClick={onNewCampaign}
          >
            New Campaign
          </button>

          {/* Load Campaign Dropdown */}
          {currentView === "campaigns" && (
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
                      <div className="p-4 text-slate-500 text-sm text-center">
                        No campaigns available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center">
            <span className="mr-2 text-slate-300">HITL Review</span>
            <div
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                hitlReview ? "bg-green-500" : "bg-slate-500"
              }`}
              onClick={onToggleHitl}
            >
              <div
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  hitlReview ? "transform translate-x-6" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
