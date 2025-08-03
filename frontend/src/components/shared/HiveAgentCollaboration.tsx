import React from "react";
import { HiveWorkflowState } from "../../types";
import { CheckCircle, Loader2, AlertCircle, Eye } from "lucide-react";

interface HiveAgentCollaborationProps {
  workflow: HiveWorkflowState;
  onViewDeliverable?: (phaseKey: string) => void;
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
}) => {
  // Always show all 7 steps, using status from workflow.phases if present, else default to 'pending'
  const phases = phaseConfig.map((p) => ({
    ...p,
    status: workflow.phases[p.key]?.status || "pending",
    deliverable: workflow.deliverables[p.key],
  }));

  const renderStatusIcon = (status: string) => {
    if (status === "running")
      return <Loader2 size={16} className="animate-spin text-primary" />;
    if (status === "completed")
      return <CheckCircle size={16} className="text-success" />;
    if (status === "failed")
      return <AlertCircle size={16} className="text-error" />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">Hive Workflow</h2>
      </div>
      <div className="p-6 space-y-4">
        {phases.map((phase) => (
          <div
            key={phase.key}
            className="p-4 border rounded-lg flex items-center gap-3"
          >
            <div className="text-lg">{phase.icon}</div>
            <div className="flex-1">
              <span className="font-medium text-text-primary">
                {phase.label}
              </span>
            </div>
            {renderStatusIcon(phase.status)}
            {phase.deliverable && onViewDeliverable && (
              <button
                onClick={() => onViewDeliverable(phase.key)}
                className="ml-3 text-sm text-primary underline flex items-center gap-1"
              >
                <Eye size={14} /> View
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiveAgentCollaboration;
