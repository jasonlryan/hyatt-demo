import { HiveWorkflowState, Campaign } from "../types";
import { GenericWorkflowData } from "../components/shared/ConfigurableAgentCollaboration";

/**
 * Data Adapter Utilities
 * 
 * These adapters convert different workflow data shapes to a common GenericWorkflowData interface
 * This allows the ConfigurableAgentCollaboration component to work with any orchestration type
 * 
 * Phase 2.2 of Orchestration Unification Plan
 */

/**
 * Adapter for Hive workflow data
 */
export const adaptHiveWorkflow = (workflow: HiveWorkflowState): GenericWorkflowData => {
  return {
    id: workflow.id,
    status: workflow.status,
    currentPhase: workflow.currentPhase,
    phases: workflow.phases || {},
    isPaused: workflow.isPaused,
    pausedAt: workflow.pausedAt,
    deliverables: workflow.deliverables || {},
  };
};

/**
 * Adapter for Hyatt campaign data  
 */
export const adaptHyattCampaign = (campaign: Campaign): GenericWorkflowData => {
  // For Hyatt, we need to construct phase status from campaign.status and awaitingReview
  const phases: Record<string, { status: string }> = {};
  
  // Map campaign status to phase status
  const phaseKeys = ['research', 'strategic_insight', 'trending', 'story', 'collaborative'];
  
  phaseKeys.forEach(phaseKey => {
    if (campaign.status === phaseKey) {
      // Currently active phase
      phases[phaseKey] = { status: 'active' };
    } else if (campaign.phases?.[phaseKey as keyof typeof campaign.phases]) {
      // Phase has data, so it's completed
      phases[phaseKey] = { status: 'completed' };
    } else {
      // Phase not started yet
      phases[phaseKey] = { status: 'pending' };
    }
  });

  return {
    id: campaign.id,
    status: campaign.status,
    currentPhase: campaign.status,
    phases,
    isPaused: campaign.status === 'paused',
    awaitingReview: campaign.awaitingReview,
    deliverables: campaign.deliverables || {},
  };
};

/**
 * Generic adapter registry
 * Use this to get the appropriate adapter for an orchestration type
 */
export const workflowAdapters = {
  hive: adaptHiveWorkflow,
  hyatt: adaptHyattCampaign,
};

/**
 * Helper function to adapt any workflow data based on orchestration type
 */
export const adaptWorkflowData = (
  orchestrationType: 'hive' | 'hyatt',
  workflowData: HiveWorkflowState | Campaign
): GenericWorkflowData => {
  const adapter = workflowAdapters[orchestrationType];
  if (!adapter) {
    throw new Error(`Unknown orchestration type: ${orchestrationType}`);
  }
  
  if (orchestrationType === 'hive') {
    return adapter(workflowData as HiveWorkflowState);
  } else {
    return adapter(workflowData as Campaign);
  }
};