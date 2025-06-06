import React from "react";
import { Campaign } from "../types";
import { RefreshCw } from "lucide-react";

interface CampaignProgressProps {
  campaign: Campaign;
  onViewProgress: () => void;
}

const CampaignProgress: React.FC<CampaignProgressProps> = ({
  campaign,
  onViewProgress,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Campaign Progress
      </h2>
      <div className="mb-4">
        <div className="text-sm text-slate-500 mb-1">
          Campaign ID: {campaign.id}
        </div>
        <div className="flex items-center">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(
              campaign.status
            )}`}
          >
            {campaign.status}
          </span>
        </div>
      </div>
      <button
        className="flex items-center justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors text-sm"
        onClick={onViewProgress}
      >
        <RefreshCw size={16} className="mr-2" />
        View Detailed Progress
      </button>
    </div>
  );
};

export default CampaignProgress;
