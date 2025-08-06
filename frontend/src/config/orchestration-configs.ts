/**
 * Orchestration Hook Configuration System
 * 
 * This file defines the configuration for different orchestration types,
 * enabling the generic useConfigurableOrchestration hook to work with any orchestration.
 * 
 * Phase 4.3 of Orchestration Unification Plan
 */

export interface OrchestrationHookConfig {
  // API endpoint configuration
  endpoints: {
    start: string;
    get: string;
    resume: string;
    refine: string;
  };
  
  // Polling configuration
  pollingInterval: number;
  
  // Initial phase structure for new orchestrations
  initialPhases: Record<string, { status: string }>;
  
  // Starting phase key
  initialPhase: string;
  
  // Request/response data structure configuration
  dataStructure: {
    // How to extract the ID from API responses
    idField: string;
    // How to structure the start request
    startRequestBody: (context: any, hitlEnabled?: boolean) => Record<string, any>;
    // How to handle response data
    processResponse: (data: any) => any;
  };
}

/**
 * Hive orchestration configuration
 */
export const hiveOrchestrationConfig: OrchestrationHookConfig = {
  endpoints: {
    start: '/api/hive-orchestrate',
    get: '/api/hive-orchestrate/{id}',
    resume: '/api/hive-orchestrate/{id}/resume',
    refine: '/api/hive-orchestrate/{id}/refine',
  },
  
  pollingInterval: 2000, // 2 seconds
  
  initialPhases: {
    pr_manager: { status: 'running' },
    trending: { status: 'pending' },
    strategic: { status: 'pending' },
    story: { status: 'pending' },
    brand_lens: { status: 'pending' },
    visual_prompt_generator: { status: 'pending' },
    brand_qa: { status: 'pending' },
  },
  
  initialPhase: 'pr_manager',
  
  dataStructure: {
    idField: 'id',
    startRequestBody: (context: any, hitlEnabled = false) => ({
      ...context,
      hitlEnabled,
    }),
    processResponse: (data: any) => ({
      ...data,
      deliverables: data.deliverables || {},
      conversation: data.conversation || [],
    }),
  },
};

/**
 * Hyatt orchestration configuration
 */
export const hyattOrchestrationConfig: OrchestrationHookConfig = {
  endpoints: {
    start: '/api/campaigns',
    get: '/api/campaigns/{id}',
    resume: '/api/campaigns/{id}/resume',
    refine: '/api/campaigns/{id}/refine',
  },
  
  pollingInterval: 3000, // 3 seconds (slightly slower than Hive)
  
  initialPhases: {
    research: { status: 'active' },
    strategic_insight: { status: 'pending' },
    trending: { status: 'pending' },
    story: { status: 'pending' },
    collaborative: { status: 'pending' },
  },
  
  initialPhase: 'research',
  
  dataStructure: {
    idField: 'id',
    startRequestBody: (context: any, hitlEnabled = false) => ({
      campaignBrief: context.campaign || context.brief,
      orchestration: 'hyatt',
      hitlEnabled,
    }),
    processResponse: (data: any) => {
      // Handle campaignId -> id normalization
      if (data.campaignId && !data.id) {
        data.id = data.campaignId;
      }
      return {
        ...data,
        deliverables: data.deliverables || {},
        conversation: data.conversation || [],
      };
    },
  },
};

/**
 * Registry of all orchestration configurations
 */
export const orchestrationConfigs = {
  hive: hiveOrchestrationConfig,
  hyatt: hyattOrchestrationConfig,
} as const;

/**
 * Type for valid orchestration types
 */
export type OrchestrationTypes = keyof typeof orchestrationConfigs;

/**
 * Helper function to get configuration for an orchestration type
 */
export function getOrchestrationConfig(type: OrchestrationTypes): OrchestrationHookConfig {
  const config = orchestrationConfigs[type];
  if (!config) {
    throw new Error(`Unknown orchestration type: ${type}`);
  }
  return config;
}