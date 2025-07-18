import React, { useState } from "react";

interface HiveOrchestrationPageProps {
  selectedOrchestration: string | null;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

const HiveOrchestrationPage: React.FC<HiveOrchestrationPageProps> = ({
  selectedOrchestration,
  hitlReview = true,
  onToggleHitl,
  onNavigateToOrchestrations,
}) => {
  return (
    <div className="min-h-screen">
      <div className="container pt-3 pb-8">
        {/* Breadcrumb and HITL Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={
                onNavigateToOrchestrations || (() => window.history.back())
              }
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              Orchestrations
            </button>
            <span>›</span>
            <span className="text-gray-800 font-medium">Hive Orchestrator</span>
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

        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Hive Orchestrator
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Reactive framework orchestration with parallel agent collaboration
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Coming Soon
            </h2>
            <p className="text-yellow-700">
              The Hive Orchestrator interface is under development. This will
              feature:
            </p>
            <ul className="text-left text-yellow-700 mt-4 space-y-2">
              <li>• Real-time parallel agent collaboration</li>
              <li>• Visual workflow with parallel stages</li>
              <li>• Interactive agent communication</li>
              <li>• Advanced reactive framework controls</li>
            </ul>
          </div>

          <div className="mt-8">
            <button
              onClick={
                onNavigateToOrchestrations || (() => window.history.back())
              }
              className="px-6 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-700 transition-colors"
            >
              Back to Orchestrations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiveOrchestrationPage;
