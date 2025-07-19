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
      <div className="bg-white rounded-xl shadow-lg border border-border p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-text-secondary">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-border p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Select Campaign
        </h2>
        <p className="text-text-secondary">
          Choose an existing campaign or create a new one.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onNewCampaign}
          className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary-hover text-white px-6 py-4 rounded-lg font-semibold text-left shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <span className="text-xl">+</span>
            </div>
            <div>
              <div className="font-semibold">Create New Campaign</div>
              <div className="text-primary-light text-sm">
                Start a fresh PR campaign with AI-powered insights
              </div>
            </div>
          </div>
        </button>

        {campaigns.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Recent Campaigns
            </h3>
            <div className="space-y-2">
              {campaigns.slice(0, 5).map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => onSelectCampaign(campaign.id)}
                  className="w-full text-left p-4 bg-gradient-to-r from-primary-hover to-primary-hover hover:from-primary-hover hover:to-primary-hover rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">
                        {campaign.brief.substring(0, 60)}...
                      </div>
                      <div className="text-sm text-primary-lighter mt-1">
                        Status: {campaign.status} • Created:{" "}
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-primary-lighter">→</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {campaigns.length === 0 && (
          <div className="text-center py-8 text-text-muted">
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
