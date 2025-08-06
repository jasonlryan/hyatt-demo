import React from "react";
import { CheckCircle, Loader2, AlertCircle, Eye, Check, Edit, Pause } from "lucide-react";
import { PhaseConfig } from "../../config/phase-definitions";

// Generic workflow data interface that works for both Hive and Hyatt
export interface GenericWorkflowData {
  id: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'initializing' | 'active' | string;
  currentPhase?: string;
  phases: Record<string, { status: string }>;
  isPaused?: boolean;
  pausedAt?: string;
  awaitingReview?: string;
  deliverables: Record<string, any>;
}

interface ConfigurableAgentCollaborationProps {
  workflowData: GenericWorkflowData;
  phases: PhaseConfig[];
  workflowTitle: string;
  onViewDeliverable?: (phaseKey: string) => void;
  onResume?: () => void;
  onRefine?: () => void;
}

const ConfigurableAgentCollaboration: React.FC<ConfigurableAgentCollaborationProps> = ({
  workflowData,
  phases,
  workflowTitle,
  onViewDeliverable,
  onResume,
  onRefine,
}) => {
  // Map phases with their current status from workflow data
  const phasesWithStatus = phases.map((phaseConfig) => ({
    ...phaseConfig,
    status: workflowData.phases?.[phaseConfig.key]?.status || "pending",
    deliverable: workflowData.deliverables?.[phaseConfig.key],
  }));

  // Determine if workflow needs review
  const needsReview = (
    workflowData.status === 'paused' && workflowData.isPaused
  ) || (
    workflowData.status === 'paused' && workflowData.awaitingReview
  );
  
  // Determine which phase is paused for review
  const pausedPhase = workflowData.pausedAt || workflowData.awaitingReview;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">{workflowTitle}</h2>
      </div>
      <div className="p-6 space-y-4">
        {phasesWithStatus.map((phase) => {
          const isCompleted = phase.status === "completed";
          const isCurrent = phase.status === "running" || phase.status === "active";
          const needsReviewForThisPhase = needsReview && pausedPhase === phase.key;

          return (
            <div
              key={phase.key}
              className={`p-4 rounded-lg border ${
                needsReviewForThisPhase
                  ? "border-orange-300 bg-orange-50"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-lg">{phase.icon}</div>
                <div className="flex-1">
                  <span className="font-medium text-text-primary">
                    {phase.label}
                  </span>
                  {phase.description && (
                    <p className="text-sm text-text-secondary mt-1">
                      {phase.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <CheckCircle size={16} className="text-success" />
                  )}
                  {isCurrent && (
                    <div className="flex items-center gap-1 text-primary">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-xs">Working...</span>
                    </div>
                  )}
                  {needsReviewForThisPhase && (
                    <div className="flex items-center gap-1 text-orange-500">
                      <Pause size={14} />
                      <span className="text-xs">Review</span>
                    </div>
                  )}
                </div>
              </div>

              {/* HITL Controls - Show when this phase needs review */}
              {needsReviewForThisPhase && onResume && onRefine && (
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={16} className="text-orange-500" />
                    <span className="text-sm font-medium text-orange-700">
                      Manual Review Required
                    </span>
                  </div>
                  <div className="flex gap-3 items-center">
                    {onViewDeliverable && phase.deliverable && (
                      <button
                        onClick={() => onViewDeliverable(phase.key)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-text-primary rounded-md hover:bg-secondary-hover transition-colors text-sm font-medium"
                      >
                        <Eye size={16} /> View Deliverable
                      </button>
                    )}
                    <button
                      onClick={onResume}
                      className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-md hover:bg-success-hover transition-colors text-sm"
                    >
                      <Check size={16} />
                      Resume Workflow
                    </button>
                    <button
                      onClick={onRefine}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-sm"
                    >
                      <Edit size={16} />
                      Refine & Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConfigurableAgentCollaboration;