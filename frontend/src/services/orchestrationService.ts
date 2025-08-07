/**
 * Orchestration Service
 * 
 * Provides access to orchestration metadata and configuration.
 * This is the single source of truth for orchestration data in the frontend.
 */

// Import the canonical orchestration configuration
import orchestrationsConfig from '../../../hive/orchestrations/orchestrations.config.json';

export interface OrchestrationUI {
  displayName: string;
  createNew: string;
  briefLabel: string;
  buttonCreate: string;
  buttonLoad: string;
  workflowNoun: string;
  workflowNounPlural: string;
}

export interface OrchestrationConfig {
  name: string;
  description: string;
  workflowType: string;
  workflowLabel: string;
  ui: OrchestrationUI;
  workflow: Array<{
    agent: string;
    name: string;
    role: string;
  }>;
}

/**
 * Get orchestration configuration by ID
 */
export function getOrchestrationConfig(orchestrationId: string): OrchestrationConfig | null {
  const config = (orchestrationsConfig as any).orchestrations[orchestrationId];
  return config || null;
}

/**
 * Get UI configuration for an orchestration
 */
export function getOrchestrationUI(orchestrationId: string): OrchestrationUI {
  const config = getOrchestrationConfig(orchestrationId);
  
  if (!config?.ui) {
    // Default fallback
    return {
      displayName: 'Default Orchestrator',
      createNew: 'Create New Workflow',
      briefLabel: 'Workflow Brief',
      buttonCreate: 'Create Workflow',
      buttonLoad: 'Load Workflow',
      workflowNoun: 'Workflow',
      workflowNounPlural: 'Workflows'
    };
  }
  
  return config.ui;
}

/**
 * Get all available orchestration IDs
 */
export function getAvailableOrchestrations(): string[] {
  return Object.keys((orchestrationsConfig as any).orchestrations);
}

/**
 * Get orchestration workflow type (e.g., 'spark', 'campaign')
 */
export function getWorkflowType(orchestrationId: string): string {
  const config = getOrchestrationConfig(orchestrationId);
  return config?.workflowType || 'workflow';
}

/**
 * Get orchestration display name
 */
export function getDisplayName(orchestrationId: string): string {
  const ui = getOrchestrationUI(orchestrationId);
  return ui.displayName;
}