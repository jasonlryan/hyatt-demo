import React from "react";
import { Campaign } from "../../types";
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
  campaign?: Campaign | null;
  onResume?: () => void;
  onRefine?: () => void;
  onViewDeliverable?: (phaseKey: string) => void;
}

const SharedAgentCollaboration: React.FC<AgentCollaborationProps> = ({
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

    // Check campaign.status first to determine active phase immediately
    if (campaign.status === "research") {
      return {
        phase: "research",
        status: "active",
        message: "Research & Audience GPT is analyzing target demographics...",
      };
    }

    if (campaign.status === "strategic_insight") {
      return {
        phase: "strategic_insight",
        status: "active",
        message: "Strategic Insight GPT is discovering human truths...",
      };
    }

    if (campaign.status === "trending") {
      return {
        phase: "trending",
        status: "active",
        message: "Trending News GPT is analyzing current trends...",
      };
    }

    if (campaign.status === "story") {
      return {
        phase: "story",
        status: "active",
        message: "Story Angles GPT is crafting compelling narratives...",
      };
    }

    if (campaign.status === "collaborative") {
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
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">
          Campaign Progress
        </h2>
      </div>
      <div className="p-6">
        {/* Current Status */}
        {currentPhase && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              {currentPhase.status === "active" && (
                <div className="flex items-center gap-2 text-primary">
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
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle size={16} />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
            </div>
            <p className="text-text-primary">{currentPhase.message}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="space-y-4">
          <h3 className="font-semibold text-text-primary mb-3">
            Campaign Phases
          </h3>

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
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        <span className="text-xs">Working...</span>
                        {campaign?.agentModels &&
                          campaign.agentModels[
                            phase.key as keyof typeof campaign.agentModels
                          ] && (
                            <span className="text-xs text-text-secondary ml-1">
                              (
                              {
                                campaign.agentModels[
                                  phase.key as keyof typeof campaign.agentModels
                                ]
                              }
                              )
                            </span>
                          )}
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
                        Resume Campaign
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

        {/* Campaign Info */}
        {campaign && (
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <h4 className="font-semibold text-text-primary mb-2">
              Campaign Details
            </h4>
            <div className="text-sm text-text-secondary space-y-1">
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

export default SharedAgentCollaboration;
