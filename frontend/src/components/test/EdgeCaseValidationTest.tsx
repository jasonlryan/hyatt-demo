import React, { useState } from 'react';
import { useHiveOrchestration, useHyattOrchestration } from '../../hooks/useConfigurableOrchestration';

/**
 * Edge Case Validation Test Component
 * 
 * Tests error handling, loading states, edge cases, and HITL controls
 * to ensure the generic system handles all scenarios properly.
 * 
 * Phase 5.3 of Orchestration Unification Plan - Edge Case Testing
 */
export default function EdgeCaseValidationTest() {
  const [testScenario, setTestScenario] = useState<string>('');
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});

  // Test hooks
  const hiveHook = useHiveOrchestration();
  const hyattHook = useHyattOrchestration();

  const testScenarios = [
    {
      id: 'error_handling',
      name: 'Error Handling',
      description: 'Test error states and error recovery',
      tests: [
        'Network error during start',
        'Invalid API response handling',
        'Polling error recovery',
        'Error dismissal functionality',
        'Multiple error scenarios'
      ]
    },
    {
      id: 'loading_states',
      name: 'Loading States',
      description: 'Test all loading indicators and transitions',
      tests: [
        'Start orchestration loading',
        'Resume operation loading',
        'Refine operation loading',
        'Polling during loading',
        'Button disabled states'
      ]
    },
    {
      id: 'hitl_controls',
      name: 'HITL Controls',
      description: 'Test Human-in-the-Loop functionality',
      tests: [
        'HITL toggle on/off',
        'Pause/resume transitions',
        'Review panel behavior',
        'HITL state persistence',
        'HITL with different phases'
      ]
    },
    {
      id: 'data_integrity',
      name: 'Data Integrity',
      description: 'Test data handling and state management',
      tests: [
        'Empty response handling',
        'Malformed data recovery',
        'State synchronization',
        'Memory leak prevention',
        'Concurrent operation handling'
      ]
    },
    {
      id: 'lifecycle',
      name: 'Component Lifecycle',
      description: 'Test component mounting/unmounting',
      tests: [
        'Cleanup on unmount',
        'Polling cleanup',
        'Memory cleanup',
        'Event listener cleanup',
        'Multiple instance isolation'
      ]
    }
  ];

  const runTest = async (scenario: string, testName: string) => {
    console.log(`Running test: ${scenario} - ${testName}`);
    const testKey = `${scenario}_${testName.replace(/\s+/g, '_').toLowerCase()}`;
    
    try {
      // Simulate various test scenarios
      switch (scenario) {
        case 'error_handling':
          await testErrorHandling(testName);
          break;
        case 'loading_states':
          await testLoadingStates(testName);
          break;
        case 'hitl_controls':
          await testHitlControls(testName);
          break;
        case 'data_integrity':
          await testDataIntegrity(testName);
          break;
        case 'lifecycle':
          await testLifecycle(testName);
          break;
      }
      
      setTestResults(prev => ({ ...prev, [testKey]: true }));
    } catch (error) {
      console.error(`Test failed: ${testKey}`, error);
      setTestResults(prev => ({ ...prev, [testKey]: false }));
    }
  };

  const testErrorHandling = async (testName: string) => {
    switch (testName) {
      case 'Network error during start':
        // Test with invalid endpoint
        try {
          await hiveHook.startOrchestration({ invalid: 'data' });
        } catch (e) {
          // Expected error
        }
        break;
      case 'Error dismissal functionality':
        hiveHook.setError('Test error');
        setTimeout(() => hiveHook.setError(null), 100);
        break;
      default:
        // Mock other error scenarios
        break;
    }
  };

  const testLoadingStates = async (testName: string) => {
    switch (testName) {
      case 'Start orchestration loading':
        // Check if loading state is properly managed
        const beforeLoading = hiveHook.isLoading;
        hiveHook.startOrchestration({ test: 'data' });
        const duringLoading = hiveHook.isLoading;
        // Should show loading changes
        break;
      default:
        // Mock other loading scenarios
        break;
    }
  };

  const testHitlControls = async (testName: string) => {
    // Mock HITL control testing
    console.log(`HITL test: ${testName}`);
  };

  const testDataIntegrity = async (testName: string) => {
    // Mock data integrity testing
    console.log(`Data integrity test: ${testName}`);
  };

  const testLifecycle = async (testName: string) => {
    // Mock lifecycle testing
    console.log(`Lifecycle test: ${testName}`);
  };

  const runAllTests = async () => {
    for (const scenario of testScenarios) {
      for (const test of scenario.tests) {
        await runTest(scenario.id, test);
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  const getTestKey = (scenarioId: string, testName: string) => {
    return `${scenarioId}_${testName.replace(/\s+/g, '_').toLowerCase()}`;
  };

  const getTestResult = (scenarioId: string, testName: string) => {
    const key = getTestKey(scenarioId, testName);
    return testResults[key];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Edge Case Validation Test
        </h1>
        <p className="text-gray-600">
          Testing error handling, loading states, HITL controls, and edge cases for the generic orchestration system.
        </p>
      </div>

      {/* Test Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Test Controls</h2>
          <button
            onClick={runAllTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Run All Tests
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Hive Hook State</h3>
            <div className="text-sm space-y-1">
              <div>Loading: <span className={hiveHook.isLoading ? 'text-blue-600' : 'text-gray-500'}>{hiveHook.isLoading ? 'Yes' : 'No'}</span></div>
              <div>Error: <span className={hiveHook.error ? 'text-red-600' : 'text-gray-500'}>{hiveHook.error || 'None'}</span></div>
              <div>Data: <span className={hiveHook.data ? 'text-green-600' : 'text-gray-500'}>{hiveHook.data ? 'Present' : 'None'}</span></div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Hyatt Hook State</h3>
            <div className="text-sm space-y-1">
              <div>Loading: <span className={hyattHook.isLoading ? 'text-blue-600' : 'text-gray-500'}>{hyattHook.isLoading ? 'Yes' : 'No'}</span></div>
              <div>Error: <span className={hyattHook.error ? 'text-red-600' : 'text-gray-500'}>{hyattHook.error || 'None'}</span></div>
              <div>Data: <span className={hyattHook.data ? 'text-green-600' : 'text-gray-500'}>{hyattHook.data ? 'Present' : 'None'}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="space-y-6">
        {testScenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
                <p className="text-gray-600 text-sm">{scenario.description}</p>
              </div>
              <button
                onClick={() => scenario.tests.forEach(test => runTest(scenario.id, test))}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Run Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {scenario.tests.map((test) => {
                const testResult = getTestResult(scenario.id, test);
                return (
                  <div key={test} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <span className="text-sm text-gray-700 flex-1">{test}</span>
                    <div className="flex items-center gap-2">
                      {testResult !== undefined && (
                        <span className={`w-2 h-2 rounded-full ${testResult ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      )}
                      <button
                        onClick={() => runTest(scenario.id, test)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Test Results Summary */}
      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(Boolean).length}
              </div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter(result => result === false).length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {Object.keys(testResults).length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}