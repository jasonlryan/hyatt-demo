import React from 'react';
import { Campaign } from '../../types';
import { RefreshCw } from 'lucide-react';

/**
 * Displays basic campaign status with a call to view detailed progress.
 *
 * Tailwind classes used:
 * - `bg-slate-700 rounded-lg shadow-md p-6` – container
 * - `text-2xl font-bold text-white mb-4` – heading
 * - `text-sm text-slate-300 mb-1` – labels
 * - status badge colors (`bg-blue-100`, `bg-green-100`, etc.)
 * - button `px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md`
 */
export interface SharedProgressPanelProps {
  campaign: Campaign;
  onViewProgress: () => void;
}

const SharedProgressPanel: React.FC<SharedProgressPanelProps> = ({ campaign, onViewProgress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary-light text-primary';
      case 'completed':
        return 'bg-success-light text-success';
      case 'failed':
        return 'bg-error text-white';
      default:
        return 'bg-secondary text-text-primary';
    }
  };

  return (
    <div className="bg-primary-hover rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Campaign Progress</h2>
      <div className="mb-4">
        <div className="text-sm text-text-muted mb-1">Campaign ID: {campaign.id}</div>
        <div className="flex items-center">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(campaign.status)}`}>{campaign.status}</span>
        </div>
      </div>
      <button
        className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors text-sm"
        onClick={onViewProgress}
      >
        <RefreshCw size={16} className="mr-2" />
        View Detailed Progress
      </button>
    </div>
  );
};

export default SharedProgressPanel;
