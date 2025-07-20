import React from 'react';
import { HiveWorkflowState } from '../../types';
import { CheckCircle } from 'lucide-react';

interface HiveAgentCollaborationProps {
  workflow: HiveWorkflowState;
  onViewDeliverable?: (phaseKey: string) => void;
}

const phases = [
  { key: 'trend_analysis', label: 'Trend Analysis', icon: '📈' },
  { key: 'visual_prompt', label: 'Visual Prompt', icon: '🎨' },
  { key: 'modular_elements', label: 'Modular Elements', icon: '🧩' },
  { key: 'qa_review', label: 'Quality Review', icon: '✅' },
];

const HiveAgentCollaboration: React.FC<HiveAgentCollaborationProps> = ({ workflow, onViewDeliverable }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">Hive Workflow</h2>
      </div>
      <div className="p-6 space-y-4">
        {phases.map((phase) => {
          const deliverable = workflow.deliverables[phase.key];
          const completed = Boolean(deliverable);
          return (
            <div key={phase.key} className="p-4 border rounded-lg flex items-center gap-3">
              <div className="text-lg">{phase.icon}</div>
              <div className="flex-1">
                <span className="font-medium text-text-primary">{phase.label}</span>
              </div>
              {completed && <CheckCircle size={16} className="text-success" />}
              {completed && onViewDeliverable && (
                <button
                  onClick={() => onViewDeliverable(phase.key)}
                  className="ml-3 text-sm text-primary underline"
                >
                  View
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HiveAgentCollaboration;
