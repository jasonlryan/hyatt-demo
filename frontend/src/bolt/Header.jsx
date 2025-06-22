import { Building } from 'lucide-react';

function Header({ onNewCampaign, hitlReview, onToggleHitl }) {
  return (
    <header className="bg-slate-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <div className="text-amber-400 mr-3">
            <Building size={36} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Hyatt GPT Agents System
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
          <div className="flex items-center">
            <span className="mr-2 text-slate-300">HITL Review</span>
            <div
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${hitlReview ? 'bg-green-500' : 'bg-slate-500'}`}
              onClick={onToggleHitl}
            >
              <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${hitlReview ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
