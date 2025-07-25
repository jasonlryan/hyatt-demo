import React from "react";

interface ReviewPanelProps {
  isVisible: boolean;
  awaitingReview?: string;
  pendingPhase?: string;
  onResume: () => void;
  onRefine: () => void;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({
  isVisible,
  awaitingReview,
  pendingPhase,
  onResume,
  onRefine,
}) => {
  if (!isVisible) return null;

  const phaseName = awaitingReview || "current phase";
  const nextPhase = pendingPhase || "next phase";

  return (
    <div className="bg-amber-50 rounded-lg p-6 mb-6 border border-amber-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          🔍 Manual Review Required
        </h3>
        <p className="text-slate-700">
          Awaiting review of the <strong>{phaseName}</strong> phase.
        </p>
        <p className="text-sm text-slate-600 mt-1">Next: {nextPhase}</p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors font-medium"
          onClick={onResume}
        >
          ✅ Resume Campaign
        </button>
        <button
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium"
          onClick={onRefine}
        >
          ✏️ Refine & Retry
        </button>
      </div>
    </div>
  );
};

export default ReviewPanel;
