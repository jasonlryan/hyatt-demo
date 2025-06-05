import React from 'react';
import DeliverableCard from './DeliverableCard.jsx';

function DeliverablesPanel({ deliverables, onOpen }) {
  const entries = Object.entries(deliverables);

  return (
    <div className="bg-slate-700 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Campaign Deliverables</h2>
      {entries.length === 0 ? (
        <div className="bg-slate-600 bg-opacity-50 rounded-lg p-4 text-center">
          <p>No deliverables available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(([agent, deliv]) => (
            <DeliverableCard
              key={agent}
              deliverable={{ ...deliv, agent }}
              onViewDetails={() => onOpen(agent)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DeliverablesPanel;
