import React from 'react';
import { Campaign } from '../types';
import { RefreshCw } from 'lucide-react';

interface CampaignProgressProps {
  campaign: Campaign;
  onViewProgress: () => void;
}

const CampaignProgress: React.FC<CampaignProgressProps> = ({ campaign, onViewProgress }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Campaign Progress</h2>
      
      <div className="mb-4">
        <div className="text-sm text-slate-500 mb-1">Campaign ID: {campaign.id}</div>
        <div className="flex items-center">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
            Active
          </span>
          <div className="text-slate-500 text-sm">Status: {campaign.status}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-in-out"
            style={{ width: `${campaign.progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-500 mt-1 text-right">{campaign.progress}% complete</div>
      </div>
      
      <button 
        className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors text-sm"
        onClick={onViewProgress}
      >
        <RefreshCw size={16} className="mr-2" />
        View Progress
      </button>
    </div>
  );
};

export default CampaignProgress;