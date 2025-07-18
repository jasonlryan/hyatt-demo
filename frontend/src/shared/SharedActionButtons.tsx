import React from "react";
import { Check, Edit } from "lucide-react";

export interface SharedActionButtonsProps {
  onResume?: () => void;
  onRefine?: () => void;
}

const SharedActionButtons: React.FC<SharedActionButtonsProps> = ({ onResume, onRefine }) => {
  if (!onResume && !onRefine) return null;
  return (
    <div className="flex gap-3 items-center">
      {onResume && (
        <button
          onClick={onResume}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          <Check size={16} /> Resume Campaign
        </button>
      )}
      {onRefine && (
        <button
          onClick={onRefine}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Edit size={16} /> Refine & Retry
        </button>
      )}
    </div>
  );
};

export default SharedActionButtons;
