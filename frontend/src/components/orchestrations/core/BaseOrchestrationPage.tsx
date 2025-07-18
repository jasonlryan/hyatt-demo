import React, { ReactNode } from "react";
import { Action } from "./types";

export interface BaseOrchestrationPageProps {
  orchestrationId: string;
  orchestrationName: string;
  onNavigateToOrchestrations: () => void;
  hitlReview: boolean;
  onToggleHitl: () => void;
  layout?: "single" | "sidebar" | "multi-panel";
  theme?: "default" | "dark" | "custom";
  children: ReactNode;
  showStatusBar?: boolean;
  showActionPanel?: boolean;
  customActions?: Action[];
}

const BaseOrchestrationPage: React.FC<BaseOrchestrationPageProps> = ({
  orchestrationName,
  orchestrationId,
  onNavigateToOrchestrations,
  hitlReview,
  onToggleHitl,
  layout = "single",
  theme = "default",
  showStatusBar = false,
  showActionPanel = false,
  customActions,
  children,
}) => {
  return (
    <div className="min-h-screen">
      <div className="container pt-3 pb-8">
        {/* Breadcrumb and HITL Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={onNavigateToOrchestrations}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              Orchestrations
            </button>
            <span>›</span>
            <span className="text-gray-800 font-medium">
              {orchestrationName}
            </span>
          </nav>

          {/* HITL Review Toggle */}
          {onToggleHitl && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">HITL Review</span>
              <button
                onClick={onToggleHitl}
                className={`relative inline-flex h-6 w-12 items-center rounded-full ${
                  hitlReview ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                    hitlReview ? "translate-x-7" : "translate-x-1"
                  }`}
                />
                <span
                  className={`absolute text-xs font-medium ${
                    hitlReview ? "text-white left-1" : "text-gray-600 right-1"
                  }`}
                >
                  {hitlReview ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Orchestration Content */}
        {children}

        {showStatusBar && (
          <div className="mt-4 text-sm text-gray-600">Status: {hitlReview ? 'HITL' : 'Auto'}</div>
        )}

        {showActionPanel && (
          <div className="mt-4 flex gap-2">
            {customActions?.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="px-2 py-1 text-sm bg-gray-200 rounded"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseOrchestrationPage;
