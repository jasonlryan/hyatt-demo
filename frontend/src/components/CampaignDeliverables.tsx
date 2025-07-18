import React from "react";
import { Deliverable } from "../types";
import DeliverableCard from "./DeliverableCard";
import { FileText } from "lucide-react";
import "./deliverableStyles.css";

interface CampaignDeliverablesProps {
  deliverables: Deliverable[];
  onViewDetails: (id: string) => void;
}

const CampaignDeliverables: React.FC<CampaignDeliverablesProps> = ({
  deliverables,
  onViewDetails,
}) => {
  return (
    <div className="deliverable-card">
      <div className="deliverable-header">
        <div className="deliverable-title">
          <span className="deliverable-icon">
            <FileText size={20} />
          </span>
          <h2 className="deliverable-title-text">Campaign Deliverables</h2>
        </div>
        <div className="deliverable-status ready">
          {deliverables.length} Available
        </div>
      </div>

      {deliverables.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No deliverables available yet.</p>
          <p className="text-sm">Start a campaign to see deliverables here.</p>
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
