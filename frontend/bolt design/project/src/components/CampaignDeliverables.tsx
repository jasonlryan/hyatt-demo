import React from 'react';
import { Deliverable } from '../types';
import DeliverableCard from './DeliverableCard';

interface CampaignDeliverablesProps {
  deliverables: Deliverable[];
  onViewDetails: (id: string) => void;
}

const CampaignDeliverables: React.FC<CampaignDeliverablesProps> = ({ deliverables, onViewDetails }) => {
  return (
    <div className="bg-slate-700 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Campaign Deliverables</h2>
      
      {deliverables.length === 0 ? (
        <div className="bg-slate-600 bg-opacity-50 rounded-lg p-4 text-center">
          <p>No deliverables available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliverables.map(deliverable => (
            <DeliverableCard 
              key={deliverable.id}
              deliverable={deliverable}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignDeliverables;