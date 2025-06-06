import React, { useState } from "react";

interface CampaignFormProps {
  onCreate: (brief: string) => void;
  isLoading: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onCreate, isLoading }) => {
  const [brief, setBrief] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brief.trim()) {
      onCreate(brief.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Create New Campaign
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="campaignBrief"
            className="block text-sm font-medium text-slate-600 mb-2"
          >
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
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !brief.trim()}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
