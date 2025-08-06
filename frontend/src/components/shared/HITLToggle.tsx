import React from 'react';

interface HITLToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
}

/**
 * Reusable HITL (Human-in-the-Loop) toggle component
 * Extracted from common code in HiveOrchestrationPage and HyattOrchestrationPage
 */
const HITLToggle: React.FC<HITLToggleProps> = ({
  enabled,
  onToggle,
  label = "HITL Review",
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-text-secondary">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-12 items-center rounded-full ${
          enabled ? "bg-success" : "bg-secondary"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
        />
        <span
          className={`absolute text-xs font-medium ${
            enabled
              ? "text-white left-1"
              : "text-text-secondary right-1"
          }`}
        >
          {enabled ? "ON" : "OFF"}
        </span>
      </button>
    </div>
  );
};

export default HITLToggle;