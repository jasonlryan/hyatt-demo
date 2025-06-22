import { useState } from 'react';

function CampaignForm({ onCreate }) {
  const [brief, setBrief] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (brief.trim()) {
      onCreate(brief.trim());
      setBrief('');
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New Campaign</h2>
        <p className="text-slate-600">Launch a new PR campaign with AI-powered insights and deliverables.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Campaign Brief
          </label>
          <textarea
            className="w-full border-2 border-slate-200 rounded-lg p-4 text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            rows="6"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Describe your campaign objectives, target audience, key messages, and any specific requirements. For example: 'We're launching a new eco-resort in Costa Rica targeting environmentally-conscious luxury travelers...'"
          ></textarea>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            AI agents will collaborate to create comprehensive campaign deliverables
          </div>
          <button
            type="submit"
            disabled={!brief.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Launch Campaign
          </button>
        </div>
      </form>
    </div>
  );
}

export default CampaignForm;
