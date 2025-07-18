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
 * - Buttons use utility classes like `px-4 py-2`, `bg-green-600`, `hover:bg-green-700`, etc.
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
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Create New Campaign</h2>
      {selectedOrchestration && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected Orchestration:</strong>{' '}
            {selectedOrchestration === 'hive' ? 'Hive Orchestrator' : 'Hyatt Orchestrator'}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="campaignBrief" className="block text-sm font-medium text-slate-600 mb-2">
            Campaign Brief
          </label>
          <textarea
            id="campaignBrief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="We're launching a new property next quarter..."
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onNewCampaign}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors"
            >
              New Campaign
            </button>
            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-white text-gray-700 font-medium rounded border border-gray-300 hover:border-gray-400 flex items-center transition-colors"
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
                <div className="absolute left-0 mt-1 w-80 bg-white rounded border border-gray-200 shadow-sm z-50">
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-gray-900 font-medium text-sm">All Campaigns ({campaigns.length})</div>
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
                          className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-gray-900 text-sm">{campaign.brief.substring(0, 60)}...</div>
                          <div className="text-xs text-gray-500 mt-1">Status: {campaign.status}</div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">No campaigns available</div>
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
              className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Campaign'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors"
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
