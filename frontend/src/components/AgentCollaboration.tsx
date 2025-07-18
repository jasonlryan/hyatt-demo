import React from "react";
import { ConversationMessage, Campaign } from "../types";
import {
  Clock,
  CheckCircle,
  Play,
  Pause,
  AlertCircle,
  Check,
  Edit,
  Eye,
} from "lucide-react";

interface AgentCollaborationProps {
  messages: ConversationMessage[];
  campaign?: Campaign | null;
  onResume?: () => void;
  onRefine?: () => void;
  onViewDeliverable?: (phaseKey: string) => void;
}

const AgentCollaboration: React.FC<AgentCollaborationProps> = ({
  messages,
  campaign,
  onResume,
  onRefine,
  onViewDeliverable,
}) => {
  const getCurrentPhase = () => {
    if (!campaign) return null;

    if (campaign.status === "paused" && campaign.awaitingReview) {
      return {
        phase: campaign.awaitingReview,
        status: "paused",
        message: `Paused for review after ${campaign.awaitingReview} phase`,
      };
    }

    // Check for active phases by looking at the phases object
    if (campaign.phases?.research && !campaign.phases?.strategic_insight) {
      return {
        phase: "research",
        status: "active",
        message: "Research & Audience GPT is analyzing target demographics...",
      };
    }

    if (campaign.phases?.strategic_insight && !campaign.phases?.trending) {
      return {
        phase: "strategic_insight",
        status: "active",
        message: "Strategic Insight GPT is discovering human truths...",
      };
    }

    if (campaign.phases?.trending && !campaign.phases?.story) {
      return {
        phase: "trending",
        status: "active",
        message: "Trending News GPT is analyzing current trends...",
      };
    }

    if (campaign.phases?.story && !campaign.phases?.collaborative) {
      return {
        phase: "story",
        status: "active",
        message: "Story Angles GPT is crafting compelling narratives...",
      };
    }

    if (campaign.phases?.collaborative) {
      return {
        phase: "collaborative",
        status: "active",
        message: "All agents are collaborating on final strategy...",
      };
    }

    if (campaign.status === "completed") {
      return {
        phase: "completed",
        status: "completed",
        message: "Campaign analysis completed successfully",
      };
    }

    return {
      phase: "initializing",
      status: "active",
      message: "Initializing campaign...",
    };
  };

  const currentPhase = getCurrentPhase();
  const completedPhases = campaign?.phases ? Object.keys(campaign.phases) : [];
  const needsReview = campaign?.status === "paused" && campaign?.awaitingReview;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Campaign Progress</h2>
      </div>
      <div className="p-6">
        {/* Current Status */}
        {currentPhase && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              {currentPhase.status === "active" && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Play size={16} />
                  <span className="font-semibold">Active</span>
                </div>
              )}
              {currentPhase.status === "paused" && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Pause size={16} />
                  <span className="font-semibold">Paused</span>
                </div>
              )}
              {currentPhase.status === "completed" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
            </div>
            <p className="text-slate-700">{currentPhase.message}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800 mb-3">Campaign Phases</h3>

          {[
            { key: "research", label: "Audience Research", icon: "🔍" },
            {
              key: "strategic_insight",
              label: "Strategic Insights",
              icon: "💡",
            },
            { key: "trending", label: "Trend Analysis", icon: "📈" },
            { key: "story", label: "Story Development", icon: "✍️" },
            { key: "collaborative", label: "Collaborative Review", icon: "🤝" },
          ].map((phase) => {
            const isCompleted = completedPhases.includes(phase.key);
            const isCurrent =
              currentPhase?.phase === phase.key &&
              currentPhase.status === "active";
            const isPaused =
              currentPhase?.phase === phase.key &&
              currentPhase.status === "paused";
            const needsReviewForThisPhase =
              needsReview && campaign?.awaitingReview === phase.key;

            return (
              <div
                key={phase.key}
                className={`p-4 rounded-lg border ${
                  needsReviewForThisPhase
                    ? "border-orange-300 bg-orange-50"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-lg">{phase.icon}</div>
                  <div className="flex-1">
                    <span className="font-medium text-slate-700">
                      {phase.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                    {isCurrent && (
                      <div className="flex items-center gap-1 text-blue-500">
                        <Clock size={14} />
                        <span className="text-xs">Working...</span>
                      </div>
                    )}
                    {isPaused && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <AlertCircle size={14} />
                        <span className="text-xs">Review</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Review Controls - Integrated into the phase card */}
                {needsReviewForThisPhase && onResume && onRefine && (
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle size={16} className="text-orange-500" />
                      <span className="text-sm font-medium text-orange-700">
                        Manual Review Required
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      {onViewDeliverable && (
                        <button
                          onClick={() => onViewDeliverable(phase.key)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                        >
                          <Eye size={16} /> View Deliverable
                        </button>
                      )}
                      <button
                        onClick={onResume}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        <Check size={16} />
                        Resume Campaign
                      </button>
                      <button
                        onClick={onRefine}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
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

        {/* Campaign Info */}
        {campaign && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">
              Campaign Details
            </h4>
            <div className="text-sm text-slate-600 space-y-1">
              <div>
                <strong>ID:</strong> {campaign.id}
              </div>
              <div>
                <strong>Status:</strong> {campaign.status}
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {new Date(campaign.createdAt).toLocaleDateString()}
              </div>
              {campaign.lastUpdated && (
                <div>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(campaign.lastUpdated).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCollaboration;
