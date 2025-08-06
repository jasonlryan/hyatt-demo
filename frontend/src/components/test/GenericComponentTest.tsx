import React, { useState } from 'react';
import ConfigurableAgentCollaboration from '../shared/ConfigurableAgentCollaboration';
import { getOrchestrationPhases } from '../../config/phase-definitions';
import { adaptHiveWorkflow, adaptHyattCampaign } from '../../utils/workflow-adapters';
import { HiveWorkflowState, Campaign } from '../../types';

const GenericComponentTest: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<'hive' | 'hyatt' | 'both'>('both');

  // Mock Hive workflow data
  const mockHiveWorkflow: HiveWorkflowState = {
    id: 'test-hive-001',
    status: 'paused',
    currentPhase: 'story',
    phases: {
      pr_manager: { status: 'completed' },
      trending: { status: 'completed' },
      strategic: { status: 'completed' },
      story: { status: 'running' },
      brand_lens: { status: 'pending' },
      visual_prompt_generator: { status: 'pending' },
      brand_qa: { status: 'pending' },
    },
    deliverables: {
      pr_manager: { id: '1', title: 'PR Brief', type: 'text', status: 'completed', agent: 'PR Manager', timestamp: '2024-01-01', content: 'Mock PR Brief content' },
      trending: { id: '2', title: 'Trend Analysis', type: 'text', status: 'completed', agent: 'Trending Agent', timestamp: '2024-01-01', content: 'Mock trend analysis' },
      strategic: { id: '3', title: 'Strategic Insights', type: 'text', status: 'completed', agent: 'Strategic Agent', timestamp: '2024-01-01', content: 'Mock strategic insights' },
      story: { id: '4', title: 'Story Angles', type: 'text', status: 'ready', agent: 'Story Agent', timestamp: '2024-01-01', content: 'Mock story angles' },
    },
    conversation: [],
    hitlEnabled: true,
    isPaused: true,
    pausedAt: 'story',
  };

  // Mock Hyatt campaign data
  const mockHyattCampaign: Campaign = {
    id: 'test-hyatt-001',
    brief: 'Test campaign for luxury hotel',
    status: 'paused',
    awaitingReview: 'strategic_insight',
    conversation: [],
    deliverables: {
      research: { id: '1', title: 'Audience Research', type: 'text', status: 'completed', agent: 'Research Agent', timestamp: '2024-01-01', content: 'Mock research data' },
      strategic_insight: { id: '2', title: 'Strategic Insights', type: 'text', status: 'ready', agent: 'Strategy Agent', timestamp: '2024-01-01', content: 'Mock strategic insights' },
    },
    createdAt: '2024-01-01',
    lastUpdated: '2024-01-01',
    phases: {
      research: {
        insights: {
          analysis: 'Mock research analysis',
          lastUpdated: '2024-01-01',
        }
      }
    }
  };

  // Get phase configurations
  const hivePhases = getOrchestrationPhases('hive');
  const hyattPhases = getOrchestrationPhases('hyatt');

  // Adapt data using our adapters
  const adaptedHiveData = adaptHiveWorkflow(mockHiveWorkflow);
  const adaptedHyattData = adaptHyattCampaign(mockHyattCampaign);

  const handleHiveViewDeliverable = (phaseKey: string) => {
    console.log('Hive - View deliverable for phase:', phaseKey);
    alert(`Hive: Viewing deliverable for ${phaseKey} phase`);
  };

  const handleHyattViewDeliverable = (phaseKey: string) => {
    console.log('Hyatt - View deliverable for phase:', phaseKey);
    alert(`Hyatt: Viewing deliverable for ${phaseKey} phase`);
  };

  const handleResume = (type: string) => {
    console.log(`${type} - Resume clicked`);
    alert(`${type}: Resume workflow`);
  };

  const handleRefine = (type: string) => {
    console.log(`${type} - Refine clicked`);
    alert(`${type}: Refine & retry`);
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Generic Agent Collaboration Component Test
        </h1>
        
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Test Configuration</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTest('hive')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedTest === 'hive' 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-text-primary hover:bg-secondary-hover'
              }`}
            >
              Test Hive Only
            </button>
            <button
              onClick={() => setSelectedTest('hyatt')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedTest === 'hyatt' 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-text-primary hover:bg-secondary-hover'
              }`}
            >
              Test Hyatt Only
            </button>
            <button
              onClick={() => setSelectedTest('both')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedTest === 'both' 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-text-primary hover:bg-secondary-hover'
              }`}
            >
              Test Both Side-by-Side
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-8">
          {(selectedTest === 'hive' || selectedTest === 'both') && (
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Hive Generic Component Test
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Adapted Data Structure:</h3>
                <pre className="text-xs text-gray-600 bg-white p-2 rounded overflow-x-auto">
                  {JSON.stringify(adaptedHiveData, null, 2)}
                </pre>
              </div>
              <ConfigurableAgentCollaboration
                workflowData={adaptedHiveData}
                phases={hivePhases}
                workflowTitle="Hive Workflow (Generic)"
                onViewDeliverable={handleHiveViewDeliverable}
                onResume={() => handleResume('Hive')}
                onRefine={() => handleRefine('Hive')}
              />
            </div>
          )}

          {(selectedTest === 'hyatt' || selectedTest === 'both') && (
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Hyatt Generic Component Test
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Adapted Data Structure:</h3>
                <pre className="text-xs text-gray-600 bg-white p-2 rounded overflow-x-auto">
                  {JSON.stringify(adaptedHyattData, null, 2)}
                </pre>
              </div>
              <ConfigurableAgentCollaboration
                workflowData={adaptedHyattData}
                phases={hyattPhases}
                workflowTitle="Hyatt Workflow (Generic)"
                onViewDeliverable={handleHyattViewDeliverable}
                onResume={() => handleResume('Hyatt')}
                onRefine={() => handleRefine('Hyatt')}
              />
            </div>
          )}
        </div>

        {/* Comparison Notes */}
        {selectedTest === 'both' && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Comparison Notes</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>✅ Generic Component:</strong> Single component handles both orchestration types</p>
              <p><strong>✅ Phase Configuration:</strong> Phases loaded from centralized config</p>
              <p><strong>✅ Data Adaptation:</strong> Different data shapes normalized to common interface</p>
              <p><strong>✅ HITL Controls:</strong> Pause/resume/refine functionality works for both</p>
              <p><strong>✅ Visual Consistency:</strong> Identical UI patterns across orchestrations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericComponentTest;