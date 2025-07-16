import React from "react";
import { Deliverable } from "../types";
import DeliverableCard from "./DeliverableCard";

interface CampaignDeliverablesProps {
  deliverables: Deliverable[];
  onViewDetails: (id: string) => void;
}

const CampaignDeliverables: React.FC<CampaignDeliverablesProps> = ({
  deliverables,
  onViewDetails,
}) => {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Campaign Deliverables
      </h2>

      {deliverables.length === 0 ? (
        <div className="bg-secondary rounded-lg p-4 text-center">
          <p className="text-secondary">No deliverables available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliverables.map((deliverable) => (
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
