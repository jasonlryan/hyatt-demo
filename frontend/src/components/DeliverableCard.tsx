import React from "react";
import { Deliverable } from "../types";

interface DeliverableCardProps {
  deliverable: Deliverable;
  onViewDetails: (id: string) => void;
}

const DeliverableCard: React.FC<DeliverableCardProps> = ({
  deliverable,
  onViewDetails,
}) => {
  return (
    <div className="card mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <span className="text-xl mr-2">📋</span>
          <h3 className="text-lg font-semibold text-primary">
            DELIVERABLE: {deliverable.title}
          </h3>
        </div>
        <div
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            deliverable.status === "ready"
              ? "bg-success text-white"
              : deliverable.status === "reviewed"
              ? "bg-primary text-white"
              : "bg-warning text-white"
          }`}
        >
          {deliverable.status === "ready"
            ? "Ready"
            : deliverable.status === "reviewed"
            ? "Reviewed"
            : "Pending"}
        </div>
      </div>

      <div className="flex items-center mb-4">
        <span className="text-xl mr-2">
          {deliverable.agent?.includes("Research") ? "🔍" : "👨‍💼"}
        </span>
        <div className="text-sm text-secondary">
          {deliverable.agent || "AI Agent"}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="btn btn-primary text-sm"
          onClick={() => onViewDetails(deliverable.id)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DeliverableCard;
