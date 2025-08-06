import React, { useState } from 'react';
import { useConfigurableOrchestration, useHiveOrchestration, useHyattOrchestration } from '../../hooks/useConfigurableOrchestration';
import { getOrchestrationConfig } from '../../config/orchestration-configs';

/**
 * Test component for the generic configurable orchestration hook
 * 
 * Tests both direct usage with config and convenience hooks
 * Phase 4 of Orchestration Unification Plan - Validation
 */
export default function ConfigurableHookTest() {
  const [activeTest, setActiveTest] = useState<'hive' | 'hyatt' | null>(null);
  
  // Test direct usage with configs
  const hiveConfig = getOrchestrationConfig('hive');
  const hyattConfig = getOrchestrationConfig('hyatt');
  
  const hiveConfigurable = useConfigurableOrchestration(hiveConfig);
  const hyattConfigurable = useConfigurableOrchestration(hyattConfig);
  
  // Test convenience hooks
  const hiveConvenience = useHiveOrchestration();
  const hyattConvenience = useHyattOrchestration();

  const renderHookState = (hookName: string, hook: any) => (
    <div className="border border-gray-300 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{hookName}</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Status:</p>
          <p className="text-sm text-gray-800">{hook.orchestration?.status || 'Not started'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">ID:</p>
          <p className="text-sm text-gray-800">{hook.orchestration?.id || 'None'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Loading:</p>
          <p className="text-sm text-gray-800">{hook.isLoading ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Error:</p>
          <p className="text-sm text-red-600">{hook.error || 'None'}</p>
        </div>
      </div>

      {hook.orchestration && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Current Phase:</p>
          <p className="text-sm text-gray-800">{hook.orchestration.currentPhase}</p>
          
          <p className="text-sm font-medium text-gray-600 mb-2 mt-3">Phases:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(hook.orchestration.phases || {}).map(([phase, data]: [string, any]) => (
              <div key={phase} className="flex justify-between">
                <span className="text-gray-700">{phase}:</span>
                <span className={data.status === 'running' ? 'text-blue-600' : 
                              data.status === 'completed' ? 'text-green-600' : 
                              'text-gray-500'}>
                  {data.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={() => hook.startOrchestration({ context: 'test' }, false)}
          disabled={hook.isLoading || !!hook.orchestration}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:bg-gray-400"
        >
          Start
        </button>
        <button 
          onClick={() => hook.resumeOrchestration()}
          disabled={hook.isLoading || !hook.orchestration}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:bg-gray-400"
        >
          Resume
        </button>
        <button 
          onClick={() => hook.refineOrchestration('Test refinement')}
          disabled={hook.isLoading || !hook.orchestration}
          className="px-3 py-1 bg-orange-600 text-white rounded text-sm disabled:bg-gray-400"
        >
          Refine
        </button>
        <button 
          onClick={() => hook.resetOrchestration()}
          disabled={hook.isLoading}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm disabled:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Configurable Orchestration Hook Test
        </h1>
        <p className="text-gray-600">
          Testing the generic useConfigurableOrchestration hook with both Hive and Hyatt configurations.
          This validates Phase 4 of the Orchestration Unification Plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hive Orchestration</h2>
          
          {renderHookState('Direct Config Usage', hiveConfigurable)}
          {renderHookState('Convenience Hook', hiveConvenience)}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hyatt Orchestration</h2>
          
          {renderHookState('Direct Config Usage', hyattConfigurable)}
          {renderHookState('Convenience Hook', hyattConvenience)}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Configuration Validation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Hive Config:</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Start: {hiveConfig.endpoints.start}</li>
              <li>• Get: {hiveConfig.endpoints.get}</li>
              <li>• Polling: {hiveConfig.pollingInterval}ms</li>
              <li>• Initial Phase: {hiveConfig.initialPhase}</li>
              <li>• Phase Count: {Object.keys(hiveConfig.initialPhases).length}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Hyatt Config:</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Start: {hyattConfig.endpoints.start}</li>
              <li>• Get: {hyattConfig.endpoints.get}</li>
              <li>• Polling: {hyattConfig.pollingInterval}ms</li>
              <li>• Initial Phase: {hyattConfig.initialPhase}</li>
              <li>• Phase Count: {Object.keys(hyattConfig.initialPhases).length}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}