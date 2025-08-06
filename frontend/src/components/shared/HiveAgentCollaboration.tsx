import React from "react";
import { HiveWorkflowState } from "../../types";
import { CheckCircle, Loader2, AlertCircle, Eye, Check, Edit, Pause } from "lucide-react";

interface HiveAgentCollaborationProps {
  workflow: HiveWorkflowState;
  onViewDeliverable?: (phaseKey: string) => void;
  onResume?: () => void;
  onRefine?: () => void;
}

const phaseConfig = [
  { key: "pr_manager", label: "PR Manager", icon: "📋" },
  { key: "trending", label: "Trending News", icon: "📰" },
  { key: "strategic", label: "Strategic Insight", icon: "💡" },
  { key: "story", label: "Story Angles", icon: "✍️" },
  { key: "brand_lens", label: "Brand Lens", icon: "👓" },
  { key: "visual_prompt_generator", label: "Visual Generator", icon: "🎨" },
  { key: "brand_qa", label: "Brand QA", icon: "✅" },
];

const HiveAgentCollaboration: React.FC<HiveAgentCollaborationProps> = ({
  workflow,
  onViewDeliverable,
  onResume,
  onRefine,
}) => {
  // Always show all 7 steps, using status from workflow.phases if present, else default to 'pending'
  const phases = phaseConfig.map((p) => ({
    ...p,
    status: workflow.phases?.[p.key]?.status || "pending",
    deliverable: workflow.deliverables?.[p.key],
  }));

  const needsReview = workflow.status === 'paused' && workflow.isPaused;
  const pausedPhase = workflow.pausedAt;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">Hive Workflow</h2>
      </div>
      <div className="p-6 space-y-4">
        {phases.map((phase) => {
          const isCompleted = phase.status === "completed";
          const isCurrent = phase.status === "running";
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

              {/* HITL Controls - Integrated into the phase card (matching Hyatt pattern) */}
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

export default HiveAgentCollaboration;
