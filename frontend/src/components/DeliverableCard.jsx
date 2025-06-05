import React from 'react';

function DeliverableCard({ deliverable, onViewDetails }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <span className="text-xl mr-2">📋</span>
          <h3 className="text-lg font-semibold text-slate-800">
            DELIVERABLE: {deliverable.title}
          </h3>
        </div>
        <div className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Ready
        </div>
      </div>

      <div className="flex items-center mb-4">
        <span className="text-xl mr-2">{deliverable.avatar || '👨‍💼'}</span>
        <div className="text-sm text-slate-700">{deliverable.agent}</div>
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors text-sm"
          onClick={onViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default DeliverableCard;
