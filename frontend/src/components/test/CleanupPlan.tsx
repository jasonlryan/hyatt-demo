import React, { useState } from 'react';

/**
 * Cleanup Plan Component
 * 
 * Interactive guide for safely removing duplicate code after successful 
 * generic system rollout.
 * 
 * Phase 6.3 of Orchestration Unification Plan - Cleanup & Code Reduction
 */
export default function CleanupPlan() {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const cleanupSteps = [
    {
      id: 'backup',
      category: 'Safety',
      title: 'Create Git Backup Branch',
      description: 'Create a backup branch before any deletions',
      risk: 'CRITICAL',
      commands: [
        'git checkout -b backup-before-cleanup',
        'git push -u origin backup-before-cleanup'
      ],
      estimatedTime: '2 min'
    },
    {
      id: 'validate_rollout',
      category: 'Validation',
      title: 'Validate Full Rollout Success',
      description: 'Ensure both orchestrations are using generic system successfully',
      risk: 'HIGH',
      files: [],
      estimatedTime: '10 min',
      validation: [
        'Both Hive and Hyatt using generic implementations',
        'No errors in production for 24+ hours',
        'Performance metrics comparable to originals',
        'All functionality verified working'
      ]
    },
    {
      id: 'remove_original_hooks',
      category: 'Hooks',
      title: 'Remove Original Hook Files',
      description: 'Delete the original state management hooks',
      risk: 'MEDIUM',
      files: [
        'src/hooks/useHiveWorkflowState.ts',
        'src/hooks/useCampaignState.ts',
        'src/hooks/useCampaignPolling.ts'
      ],
      estimatedTime: '5 min',
      codeReduction: '~250 lines'
    },
    {
      id: 'remove_original_pages',
      category: 'Components',
      title: 'Remove Original Orchestration Pages',
      description: 'Delete the original orchestration page components',
      risk: 'MEDIUM',
      files: [
        'src/components/orchestrations/HiveOrchestrationPage.tsx',
        'src/components/orchestrations/HyattOrchestrationPage.tsx'
      ],
      estimatedTime: '5 min',
      codeReduction: '~200 lines'
    },
    {
      id: 'remove_agent_collaboration',
      category: 'Components',
      title: 'Remove Original Agent Collaboration Components',
      description: 'Delete the original agent collaboration components',
      risk: 'MEDIUM',
      files: [
        'src/components/shared/HiveAgentCollaboration.tsx',
        'src/components/shared/SharedAgentCollaboration.tsx'
      ],
      estimatedTime: '5 min',
      codeReduction: '~300 lines'
    },
    {
      id: 'rename_test_components',
      category: 'Refactoring',
      title: 'Rename Test Components to Production',
      description: 'Rename TestConfigurable* components to remove "Test" prefix',
      risk: 'LOW',
      files: [
        'TestConfigurableHive.tsx → HiveOrchestrationPage.tsx',
        'TestConfigurableHyatt.tsx → HyattOrchestrationPage.tsx'
      ],
      estimatedTime: '10 min',
      codeReduction: '0 lines (rename only)'
    },
    {
      id: 'update_imports',
      category: 'Refactoring',
      title: 'Update Import Statements',
      description: 'Update all import statements to use new component names',
      risk: 'MEDIUM',
      files: [
        'src/App.tsx',
        'Various test files'
      ],
      estimatedTime: '10 min',
      codeReduction: '0 lines (update only)'
    },
    {
      id: 'remove_test_files',
      category: 'Cleanup',
      title: 'Remove Development Test Files',
      description: 'Remove test files that are no longer needed',
      risk: 'LOW',
      files: [
        'src/components/test/ConfigurableHookTest.tsx',
        'src/components/test/GenericComponentTest.tsx',
        'src/components/test/PhaseConfigurationTest.tsx',
        'src/components/test/IntegrationValidationTest.tsx',
        'src/components/test/EdgeCaseValidationTest.tsx',
        'src/components/test/AB-TestMonitor.tsx'
      ],
      estimatedTime: '5 min',
      codeReduction: '~500 lines'
    },
    {
      id: 'cleanup_feature_flags',
      category: 'Cleanup',
      title: 'Simplify Feature Flag System',
      description: 'Remove or simplify feature flags after successful rollout',
      risk: 'LOW',
      files: [
        'src/config/feature-flags.ts (simplify)',
        'src/App.tsx (remove conditional logic)'
      ],
      estimatedTime: '15 min',
      codeReduction: '~100 lines'
    },
    {
      id: 'update_documentation',
      category: 'Documentation',
      title: 'Update Plan Documentation',
      description: 'Mark orchestration unification plan as completed',
      risk: 'LOW',
      files: [
        'docs/plans/orchestration-unification-plan.md'
      ],
      estimatedTime: '5 min',
      codeReduction: '0 lines'
    },
    {
      id: 'final_validation',
      category: 'Validation',
      title: 'Final System Validation',
      description: 'Complete validation of cleaned up system',
      risk: 'CRITICAL',
      files: [],
      estimatedTime: '15 min',
      validation: [
        'All orchestrations working correctly',
        'No import errors or missing components',
        'Build succeeds without warnings',
        'Tests pass (if any)',
        'No console errors'
      ]
    }
  ];

  const handleCheckItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTotalCodeReduction = () => {
    return cleanupSteps.reduce((total, step) => {
      const match = step.codeReduction?.match(/(\d+)/);
      return total + (match ? parseInt(match[1]) : 0);
    }, 0);
  };

  const getCompletedSteps = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Orchestration Cleanup Plan
        </h1>
        <p className="text-gray-600">
          Safe removal of duplicate code after successful generic system rollout.
          Expected code reduction: ~{getTotalCodeReduction()} lines.
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cleanup Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {getCompletedSteps()}/{cleanupSteps.length}
            </div>
            <div className="text-sm text-gray-600">Steps Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ~{getTotalCodeReduction()}
            </div>
            <div className="text-sm text-gray-600">Lines to Remove</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              65%
            </div>
            <div className="text-sm text-gray-600">Expected Reduction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ~{cleanupSteps.reduce((total, step) => {
                const match = step.estimatedTime?.match(/(\d+)/);
                return total + (match ? parseInt(match[1]) : 0);
              }, 0)} min
            </div>
            <div className="text-sm text-gray-600">Est. Time</div>
          </div>
        </div>
      </div>

      {/* Cleanup Steps */}
      <div className="space-y-6">
        {cleanupSteps.map((step) => (
          <div key={step.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={checkedItems[step.id] || false}
                onChange={() => handleCheckItem(step.id)}
                className="mt-1 h-5 w-5 text-blue-600 rounded"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(step.risk)}`}>
                    {step.risk}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {step.category}
                  </span>
                  {step.estimatedTime && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {step.estimatedTime}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                {step.files && step.files.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Files to modify/remove:</h4>
                    <ul className="space-y-1">
                      {step.files.map((file, idx) => (
                        <li key={idx} className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {step.commands && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Commands:</h4>
                    <div className="space-y-1">
                      {step.commands.map((cmd, idx) => (
                        <div key={idx} className="text-sm font-mono bg-gray-900 text-green-400 px-3 py-2 rounded">
                          {cmd}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {step.validation && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Validation checklist:</h4>
                    <ul className="space-y-1">
                      {step.validation.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {step.codeReduction && (
                  <div className="text-sm font-medium text-green-600">
                    Code reduction: {step.codeReduction}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Summary */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-3">
          🎉 Expected Results After Cleanup
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <ul className="space-y-2">
            <li>• ~{getTotalCodeReduction()} lines of code removed</li>
            <li>• 65% reduction in orchestration code</li>
            <li>• Single source of truth for all orchestrations</li>
            <li>• Simplified maintenance and debugging</li>
          </ul>
          <ul className="space-y-2">
            <li>• Faster development of new orchestrations</li>
            <li>• Guaranteed UI consistency</li>
            <li>• Automatic bug fixes across all orchestrations</li>
            <li>• Clean, maintainable codebase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}