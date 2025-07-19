import React, { useState } from 'react';

/**
 * SharedCampaignForm replicates Hyatt's campaign creation form.
 *
 * Tailwind classes:
 * - `bg-white rounded-lg shadow-md p-6` – card container styling
 * - `text-2xl font-bold text-slate-800 mb-4` – heading
 * - `mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md` – selected orchestration banner
 * - `block text-sm font-medium text-slate-600 mb-2` – label styling
 * - `w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition` – textarea
 * - Buttons use utility classes like `px-4 py-2`, `bg-primary`, `hover:bg-primary-hover`, etc.
 */
export interface SharedCampaignFormProps {
  onCreate: (brief: string) => void;
  isLoading: boolean;
  onCancel: () => void;
  selectedOrchestration?: string | null;
  onNewCampaign: () => void;
  onLoadCampaign: (campaignId: string) => void;
  campaigns: any[];
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}

const SharedCampaignForm: React.FC<SharedCampaignFormProps> = ({
  onCreate,
  isLoading,
  onCancel,
  selectedOrchestration,
  onNewCampaign,
  onLoadCampaign,
  campaigns,
  dropdownOpen,
  setDropdownOpen,
}) => {
  const [brief, setBrief] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brief.trim()) {
      onCreate(brief.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Create New Campaign</h2>
      {selectedOrchestration && (
        <div className="mb-4 p-3 bg-primary-light border border-border rounded-md">
          <p className="text-sm text-primary">
            <strong>Selected Orchestration:</strong>{' '}
            {selectedOrchestration === 'hive' ? 'Hive Orchestrator' : 'Hyatt Orchestrator'}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="campaignBrief" className="block text-sm font-medium text-text-secondary mb-2">
            Campaign Brief
          </label>
          <textarea
            id="campaignBrief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="w-full h-32 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="We're launching a new property next quarter..."
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onNewCampaign}
              className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary-hover transition-colors"
            >
              New Campaign
            </button>
            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-white text-text-primary font-medium rounded border border-border hover:border-border-focus flex items-center transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                Load Campaign
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-1 w-80 bg-white rounded border border-border shadow-sm z-50">
                  <div className="p-3 border-b border-border">
                    <div className="text-text-primary font-medium text-sm">All Campaigns ({campaigns.length})</div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {campaigns.length > 0 ? (
                      campaigns.map((campaign) => (
                        <button
                          key={campaign.id}
                          onClick={() => {
                            onLoadCampaign(campaign.id);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left p-3 hover:bg-secondary border-b border-border last:border-b-0"
                        >
                          <div className="text-text-primary text-sm">{campaign.brief.substring(0, 60)}...</div>
                          <div className="text-xs text-text-muted mt-1">Status: {campaign.status}</div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-text-muted text-sm">No campaigns available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !brief.trim()}
              className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary-hover disabled:bg-secondary disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Campaign'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-secondary text-text-primary font-medium rounded hover:bg-secondary-hover transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SharedCampaignForm;
