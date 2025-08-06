import React, { useState } from 'react';
import HiveOrchestrationPage from '../orchestrations/HiveOrchestrationPage';
import TestConfigurableHive from '../orchestrations/TestConfigurableHive';
import HyattOrchestrationPage from '../orchestrations/HyattOrchestrationPage';
import TestConfigurableHyatt from '../orchestrations/TestConfigurableHyatt';

/**
 * Side-by-Side Integration Validation Test
 * 
 * This component displays original and generic implementations side by side
 * to validate identical functionality and behavior.
 * 
 * Phase 5.2 of Orchestration Unification Plan - Validation Testing
 */
export default function IntegrationValidationTest() {
  const [activeTest, setActiveTest] = useState<'hive' | 'hyatt'>('hive');
  const [hitlEnabled, setHitlEnabled] = useState(true);
  const [selectedOrchestration] = useState('hyatt'); // For Hyatt test

  const handleNavigateBack = () => {
    console.log('Navigate back clicked');
  };

  const handleToggleHitl = () => {
    setHitlEnabled(!hitlEnabled);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Integration Validation Test - Phase 5
          </h1>
          <p className="text-gray-600 mb-4">
            Side-by-side comparison of original orchestrations vs generic implementations
          </p>
          
          <div className="flex gap-4 items-center">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTest('hive')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTest === 'hive'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hive Orchestration
              </button>
              <button
                onClick={() => setActiveTest('hyatt')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTest === 'hyatt'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hyatt Orchestration
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">HITL Enabled:</label>
              <button
                onClick={handleToggleHitl}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  hitlEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hitlEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">
                {hitlEnabled ? 'On' : 'Off'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
          
          {/* Original Implementation */}
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-3">
              <h2 className="text-lg font-semibold text-gray-900">
                📊 Original {activeTest === 'hive' ? 'Hive' : 'Hyatt'} Implementation
              </h2>
              <p className="text-sm text-gray-600">Current production version</p>
            </div>
            
            <div className="h-full">
              {activeTest === 'hive' ? (
                <HiveOrchestrationPage
                  hitlReview={hitlEnabled}
                  onToggleHitl={handleToggleHitl}
                  onNavigateToOrchestrations={handleNavigateBack}
                />
              ) : (
                <HyattOrchestrationPage
                  selectedOrchestration={selectedOrchestration}
                  hitlReview={hitlEnabled}
                  onToggleHitl={handleToggleHitl}
                  onNavigateToOrchestrations={handleNavigateBack}
                />
              )}
            </div>
          </div>

          {/* Generic Implementation */}
          <div className="bg-white rounded-lg border border-green-300 overflow-hidden">
            <div className="bg-green-50 border-b border-green-200 p-3">
              <h2 className="text-lg font-semibold text-gray-900">
                🧪 Generic {activeTest === 'hive' ? 'Hive' : 'Hyatt'} Implementation
              </h2>
              <p className="text-sm text-gray-600">Using unified generic system</p>
            </div>
            
            <div className="h-full">
              {activeTest === 'hive' ? (
                <TestConfigurableHive
                  hitlReview={hitlEnabled}
                  onToggleHitl={handleToggleHitl}
                  onNavigateToOrchestrations={handleNavigateBack}
                />
              ) : (
                <TestConfigurableHyatt
                  selectedOrchestration={selectedOrchestration}
                  hitlReview={hitlEnabled}
                  onToggleHitl={handleToggleHitl}
                  onNavigateToOrchestrations={handleNavigateBack}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Validation Checklist - Compare Both Sides
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">🎯 Functionality</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Start orchestration works identically</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>HITL controls work the same</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Resume/pause behavior identical</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Refine functionality matches</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Reset/clear behavior same</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">🎨 UI Consistency</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Phase display looks identical</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Progress indicators match</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Deliverable panels identical</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Error states display same</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Loading states behave same</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">⚡ Performance</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Polling intervals identical</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>API call patterns same</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>State updates synchronized</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Memory usage comparable</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Response time similar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}