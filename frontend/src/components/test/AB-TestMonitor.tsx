import React, { useState, useEffect } from 'react';
import { getFeatureFlags, enableABTest, enableFullRollout, emergencyRollback } from '../../config/feature-flags';

/**
 * A/B Test Monitoring Dashboard
 * 
 * Real-time monitoring of the generic system rollout with controls
 * for safe testing and immediate rollback capability.
 * 
 * Phase 6.2 of Orchestration Unification Plan - A/B Testing & Monitoring
 */
export default function ABTestMonitor() {
  const [flags, setFlags] = useState(getFeatureFlags());
  const [performanceMetrics, setPerformanceMetrics] = useState({
    hive: { startTime: 0, errors: 0, successes: 0 },
    hyatt: { startTime: 0, errors: 0, successes: 0 }
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Update flags when they change
    const interval = setInterval(() => {
      setFlags(getFeatureFlags());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startHiveABTest = () => {
    console.log('🧪 Starting Hive A/B Test');
    enableABTest('hive');
    setIsMonitoring(true);
    setPerformanceMetrics(prev => ({
      ...prev,
      hive: { startTime: Date.now(), errors: 0, successes: 0 }
    }));
  };

  const startHyattABTest = () => {
    console.log('🧪 Starting Hyatt A/B Test');
    enableABTest('hyatt');
    setIsMonitoring(true);
    setPerformanceMetrics(prev => ({
      ...prev,
      hyatt: { startTime: Date.now(), errors: 0, successes: 0 }
    }));
  };

  const handleFullRollout = () => {
    if (window.confirm('⚠️ Are you sure you want to enable the generic system for both orchestrations? This affects production behavior.')) {
      console.log('🚀 Starting Full Rollout');
      enableFullRollout();
    }
  };

  const handleEmergencyRollback = () => {
    if (window.confirm('🚨 EMERGENCY ROLLBACK: This will immediately disable all generic implementations and reload the page. Continue?')) {
      emergencyRollback();
    }
  };

  const getStatusColor = (isEnabled: boolean) => {
    return isEnabled ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50';
  };

  const getStatusText = (isEnabled: boolean) => {
    return isEnabled ? 'ACTIVE' : 'INACTIVE';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          A/B Test Monitor & Control Panel
        </h1>
        <p className="text-gray-600">
          Monitor the rollout of generic orchestration implementations with safety controls.
        </p>
      </div>

      {/* Emergency Controls */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-red-800 mb-3">🚨 Emergency Controls</h2>
        <button
          onClick={handleEmergencyRollback}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
        >
          EMERGENCY ROLLBACK
        </button>
        <p className="text-sm text-red-700 mt-2">
          Immediately disables all generic implementations and reverts to originals
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Generic System</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(flags.enableGenericSystem)}`}>
                {getStatusText(flags.enableGenericSystem)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Debug Logging</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(flags.enableDebugLogging)}`}>
                {getStatusText(flags.enableDebugLogging)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Indicators</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(flags.showImplementationIndicator)}`}>
                {getStatusText(flags.showImplementationIndicator)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hive Orchestration</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Implementation</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(flags.useGenericHiveImplementation)}`}>
                {flags.useGenericHiveImplementation ? 'GENERIC' : 'ORIGINAL'}
              </span>
            </div>
            <button
              onClick={startHiveABTest}
              disabled={flags.useGenericHiveImplementation}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
            >
              {flags.useGenericHiveImplementation ? 'Test Active' : 'Start A/B Test'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hyatt Orchestration</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Implementation</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(flags.useGenericHyattImplementation)}`}>
                {flags.useGenericHyattImplementation ? 'GENERIC' : 'ORIGINAL'}
              </span>
            </div>
            <button
              onClick={startHyattABTest}
              disabled={flags.useGenericHyattImplementation}
              className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:bg-gray-400"
            >
              {flags.useGenericHyattImplementation ? 'Test Active' : 'Start A/B Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Rollout Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rollout Controls</h3>
        <div className="flex gap-4">
          <button
            onClick={handleFullRollout}
            disabled={flags.useGenericHiveImplementation && flags.useGenericHyattImplementation}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            Full Rollout (Both)
          </button>
          <div className="text-sm text-gray-600 flex items-center">
            Enable generic system for both orchestrations
          </div>
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">🧪 Testing Instructions</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p><strong>Phase 1:</strong> Start with Hive A/B test - use original and generic side by side</p>
          <p><strong>Phase 2:</strong> If Hive test passes, start Hyatt A/B test</p>
          <p><strong>Phase 3:</strong> If both pass, proceed to full rollout</p>
          <p><strong>Rollback:</strong> Use emergency rollback if any issues detected</p>
        </div>
      </div>

      {/* Quick Access URLs */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🔗 Quick Test URLs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-2">Test URLs (append to current URL):</p>
            <ul className="space-y-1 font-mono text-xs">
              <li><code>?generic=hive</code> - Test Hive generic</li>
              <li><code>?generic=hyatt</code> - Test Hyatt generic</li>
              <li><code>?generic=both</code> - Test both generic</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-2">Console Commands:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li><code>orchestrationFlags.testHive()</code></li>
              <li><code>orchestrationFlags.testHyatt()</code></li>
              <li><code>orchestrationFlags.status()</code></li>
              <li><code>orchestrationFlags.rollback()</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}