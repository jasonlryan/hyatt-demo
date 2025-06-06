import React from 'react';

interface ReviewPanelProps {
  isVisible: boolean;
  onResume: () => void;
  onRefine: () => void;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({ isVisible, onResume, onRefine }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 rounded-lg p-6 mb-6 border border-amber-200">
      <p className="text-center text-slate-700 mb-4">Awaiting review of the research phase.</p>
      
      <div className="flex justify-center space-x-4">
        <button 
          className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors"
          onClick={onResume}
        >
          Resume
        </button>
        <button 
          className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition-colors"
          onClick={onRefine}
        >
          Refine
        </button>
      </div>
    </div>
  );
};

export default ReviewPanel;