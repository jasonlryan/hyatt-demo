import React from "react";

export interface SharedHitlToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const SharedHitlToggle: React.FC<SharedHitlToggleProps> = ({ enabled, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">HITL Review</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-12 items-center rounded-full ${
          enabled ? "bg-green-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
        />
        <span
          className={`absolute text-xs font-medium ${
            enabled ? "text-white left-1" : "text-gray-600 right-1"
          }`}
        >
          {enabled ? "ON" : "OFF"}
        </span>
      </button>
    </div>
  );
};

export default SharedHitlToggle;
