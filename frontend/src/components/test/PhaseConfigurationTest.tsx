import React from 'react';
import { 
  getOrchestrationPhases, 
  getPhaseConfig, 
  validatePhaseConfiguration,
  ORCHESTRATION_PHASES 
} from '../../config/phase-definitions';

const PhaseConfigurationTest: React.FC = () => {
  const hivePhases = getOrchestrationPhases('hive');
  const hyattPhases = getOrchestrationPhases('hyatt');
  
  const hivePhaseKeys = ['pr_manager', 'trending', 'strategic', 'story', 'brand_lens', 'visual_prompt_generator', 'brand_qa'];
  const hyattPhaseKeys = ['research', 'strategic_insight', 'trending', 'story', 'collaborative'];
  
  const hiveValidation = validatePhaseConfiguration('hive', hivePhaseKeys);
  const hyattValidation = validatePhaseConfiguration('hyatt', hyattPhaseKeys);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Phase Configuration Test
        </h1>
        
        <div className="space-y-8">
          {/* Configuration Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Configuration Overview</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-text-primary mb-2">Available Orchestration Types:</h3>
                <ul className="list-disc list-inside text-text-secondary">
                  {Object.keys(ORCHESTRATION_PHASES).map(type => (
                    <li key={type} className="capitalize">{type}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-2">Validation Status:</h3>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-2 ${hiveValidation ? 'text-success' : 'text-error'}`}>
                    {hiveValidation ? '✅' : '❌'} Hive phases valid
                  </li>
                  <li className={`flex items-center gap-2 ${hyattValidation ? 'text-success' : 'text-error'}`}>
                    {hyattValidation ? '✅' : '❌'} Hyatt phases valid
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hive Phases */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Hive Phases ({hivePhases.length} phases)
            </h2>
            <div className="grid gap-4">
              {hivePhases.map((phase, index) => (
                <div key={phase.key} className="flex items-center gap-4 p-3 bg-background rounded-lg">
                  <span className="text-2xl">{phase.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">{phase.label}</span>
                      <span className="text-sm text-text-secondary">({phase.key})</span>
                    </div>
                    {phase.description && (
                      <p className="text-sm text-text-secondary mt-1">{phase.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-text-secondary bg-secondary px-2 py-1 rounded">
                    Step {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hyatt Phases */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Hyatt Phases ({hyattPhases.length} phases)
            </h2>
            <div className="grid gap-4">
              {hyattPhases.map((phase, index) => (
                <div key={phase.key} className="flex items-center gap-4 p-3 bg-background rounded-lg">
                  <span className="text-2xl">{phase.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">{phase.label}</span>
                      <span className="text-sm text-text-secondary">({phase.key})</span>
                    </div>
                    {phase.description && (
                      <p className="text-sm text-text-secondary mt-1">{phase.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-text-secondary bg-secondary px-2 py-1 rounded">
                    Step {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Function Testing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Function Testing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-text-primary mb-2">getPhaseConfig() Tests:</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-background rounded">
                    <strong>getPhaseConfig('hive', 'pr_manager'):</strong>
                    <pre className="mt-1 text-text-secondary">
                      {JSON.stringify(getPhaseConfig('hive', 'pr_manager'), null, 2)}
                    </pre>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <strong>getPhaseConfig('hyatt', 'research'):</strong>
                    <pre className="mt-1 text-text-secondary">
                      {JSON.stringify(getPhaseConfig('hyatt', 'research'), null, 2)}
                    </pre>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <strong>getPhaseConfig('unknown', 'test'):</strong>
                    <pre className="mt-1 text-text-secondary">
                      {JSON.stringify(getPhaseConfig('unknown', 'test'), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-text-primary mb-2">Validation Results:</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-background rounded">
                    <strong>validatePhaseConfiguration('hive', expected keys):</strong>
                    <span className={`ml-2 ${hiveValidation ? 'text-success' : 'text-error'}`}>
                      {hiveValidation ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <strong>validatePhaseConfiguration('hyatt', expected keys):</strong>
                    <span className={`ml-2 ${hyattValidation ? 'text-success' : 'text-error'}`}>
                      {hyattValidation ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseConfigurationTest;