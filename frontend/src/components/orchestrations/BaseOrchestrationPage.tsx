import React, { ReactNode } from "react";

interface BaseOrchestrationPageProps {
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  children: ReactNode;
}

const BaseOrchestrationPage: React.FC<BaseOrchestrationPageProps> = ({
  orchestrationName,
  hitlReview = true,
  onToggleHitl,
  children,
}) => {
  return (
    <div className="min-h-screen">
      <div className="container pt-3 pb-8">
        {/* Breadcrumb and HITL Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => window.history.back()}
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
      </div>
    </div>
  );
};

export default BaseOrchestrationPage;
