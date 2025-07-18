import React from "react";
import { Campaign } from "../types";

interface CampaignSelectorProps {
  campaigns: Campaign[];
  onSelectCampaign: (id: string) => void;
  onNewCampaign: () => void;
  isLoading: boolean;
}

const CampaignSelector: React.FC<CampaignSelectorProps> = ({
  campaigns,
  onSelectCampaign,
  onNewCampaign,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Select Campaign
        </h2>
        <p className="text-slate-600">
          Choose an existing campaign or create a new one.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onNewCampaign}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-semibold text-left shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <span className="text-xl">+</span>
            </div>
            <div>
              <div className="font-semibold">Create New Campaign</div>
              <div className="text-blue-100 text-sm">
                Start a fresh PR campaign with AI-powered insights
              </div>
            </div>
          </div>
        </button>

        {campaigns.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">
              Recent Campaigns
            </h3>
            <div className="space-y-2">
              {campaigns.slice(0, 5).map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => onSelectCampaign(campaign.id)}
                  className="w-full text-left p-4 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">
                        {campaign.brief.substring(0, 60)}...
                      </div>
                      <div className="text-sm text-blue-200 mt-1">
                        Status: {campaign.status} • Created:{" "}
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-blue-200">→</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {campaigns.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p>
              No campaigns found. Create your first campaign to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignSelector;
