import DeliverableCard from './DeliverableCard.jsx';

function CampaignDeliverables({ deliverables, onViewDetails }) {
  const entries = Array.isArray(deliverables)
    ? deliverables
    : Object.values(deliverables);
  return (
    <div className="bg-slate-700 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Campaign Deliverables</h2>
      {entries.length === 0 ? (
        <div className="bg-slate-600 bg-opacity-50 rounded-lg p-4 text-center">
          <p>No deliverables available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((deliv, idx) => (
            <DeliverableCard
              key={deliv.id || idx}
              deliverable={deliv}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CampaignDeliverables;
