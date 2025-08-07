/**
 * Feature Flag Configuration System
 * 
 * Safe switching mechanism between original and generic orchestration implementations.
 * Enables controlled rollout with immediate rollback capability.
 * 
 * Phase 6.1 of Orchestration Unification Plan - Feature Flag Integration
 */

export interface FeatureFlags {
  // Orchestration Implementation Switching
  useGenericHiveImplementation: boolean;
  useGenericHyattImplementation: boolean;
  
  // Debug and Testing
  showImplementationIndicator: boolean;
  enableDebugLogging: boolean;
  
  // Rollout Controls
  enableGenericSystem: boolean;
}

// Default feature flags - CONSERVATIVE DEFAULTS
const defaultFlags: FeatureFlags = {
  // Start with original implementations (safe)
  useGenericHiveImplementation: false,
  useGenericHyattImplementation: false,
  
  // Show indicators in dev/test
  showImplementationIndicator: true,
  enableDebugLogging: false,
  
  // Master switch (emergency disable)
  enableGenericSystem: false,
};

// Environment-specific overrides
const getEnvironmentFlags = (): Partial<FeatureFlags> => {
  // Check for development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check for test environment flag
  const isTestMode = window.location.search.includes('test=generic') || 
                     localStorage.getItem('orchestration-test-mode') === 'true';
  
  if (isDevelopment || isTestMode) {
    return {
      enableDebugLogging: true,
      showImplementationIndicator: true,
    };
  }
  
  return {};
};

// Runtime feature flag state
let currentFlags: FeatureFlags = {
  ...defaultFlags,
  ...getEnvironmentFlags(),
};

/**
 * Get current feature flag values
 */
export function getFeatureFlags(): FeatureFlags {
  return { ...currentFlags };
}

/**
 * Update specific feature flags (for runtime control)
 */
export function updateFeatureFlags(updates: Partial<FeatureFlags>): void {
  currentFlags = {
    ...currentFlags,
    ...updates,
  };
  
  // Log flag changes for debugging
  if (currentFlags.enableDebugLogging) {
    console.log('🚀 Feature flags updated:', updates);
    console.log('🚀 Current flags:', currentFlags);
  }
  
  // Persist test mode to localStorage
  if ('useGenericHiveImplementation' in updates || 'useGenericHyattImplementation' in updates) {
    localStorage.setItem('orchestration-test-mode', String(
      currentFlags.useGenericHiveImplementation || currentFlags.useGenericHyattImplementation
    ));
  }
}

/**
 * Check if generic implementation should be used for a specific orchestration
 */
export function useGenericImplementation(orchestrationType: 'hive' | 'hyatt'): boolean {
  const flags = getFeatureFlags();
  
  // Master switch check
  if (!flags.enableGenericSystem) {
    return false;
  }
  
  switch (orchestrationType) {
    case 'hive':
      return flags.useGenericHiveImplementation;
    case 'hyatt':
      return flags.useGenericHyattImplementation;
    default:
      return false;
  }
}

/**
 * Emergency rollback - disable all generic implementations
 */
export function emergencyRollback(): void {
  console.warn('🚨 EMERGENCY ROLLBACK: Disabling all generic implementations');
  
  updateFeatureFlags({
    enableGenericSystem: false,
    useGenericHiveImplementation: false,
    useGenericHyattImplementation: false,
  });
  
  // Force page reload to ensure clean state
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

/**
 * Enable A/B testing for single orchestration
 */
export function enableABTest(orchestrationType: 'hive' | 'hyatt'): void {
  console.log(`🧪 Enabling A/B test for ${orchestrationType} orchestration`);
  
  updateFeatureFlags({
    enableGenericSystem: true,
    [`useGeneric${orchestrationType.charAt(0).toUpperCase() + orchestrationType.slice(1)}Implementation`]: true,
    showImplementationIndicator: true,
    enableDebugLogging: true,
  });
}

/**
 * Enable full rollout (both orchestrations)
 */
export function enableFullRollout(): void {
  console.log('🚀 Enabling full rollout - all orchestrations using generic system');
  
  updateFeatureFlags({
    enableGenericSystem: true,
    useGenericHiveImplementation: true,
    useGenericHyattImplementation: true,
  });
}

/**
 * Development/Testing helpers
 */
export const developmentHelpers = {
  // Quick test functions for browser console
  testHive: () => enableABTest('hive'),
  testHyatt: () => enableABTest('hyatt'),
  testBoth: () => enableFullRollout(),
  rollback: () => emergencyRollback(),
  
  // Current state inspector
  status: () => {
    const flags = getFeatureFlags();
    console.table({
      'Generic System Enabled': flags.enableGenericSystem,
      'Hive Generic': flags.useGenericHiveImplementation,
      'Hyatt Generic': flags.useGenericHyattImplementation,
      'Show Indicators': flags.showImplementationIndicator,
      'Debug Logging': flags.enableDebugLogging,
    });
  }
};

// Expose helpers to window in development
if (process.env.NODE_ENV === 'development') {
  (window as any).orchestrationFlags = developmentHelpers;
  console.log('🛠️ Development helpers available at window.orchestrationFlags');
  console.log('   Try: orchestrationFlags.testHive(), orchestrationFlags.status()');
}

// URL parameter parsing for easy testing
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('generic') === 'hive') {
  enableABTest('hive');
}
if (urlParams.get('generic') === 'hyatt') {
  enableABTest('hyatt');
}
if (urlParams.get('generic') === 'both') {
  enableFullRollout();
}