export interface OrchestrationConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: {
    maxConcurrentWorkflows: number;
    timeout: number;
    retryAttempts: number;
    enableLogging: boolean;
    reactiveFramework?: boolean;
    parallelExecution?: boolean;
  };
  workflows: string[];
  agents: string[];
  hasDiagram?: boolean;
  hasDocumentation?: boolean;
  documentationPath?: string;
}

export interface OrchestrationResponse {
  orchestrators: { [key: string]: OrchestrationConfig };
}

export interface AgentConfig {
  class: string;
  model?: string;
  config?: Record<string, any>;
}

export interface BackendOrchestrationConfig {
  name: string;
  description?: string;
  enabled?: boolean;
  orchestrator: string;
  config?: {
    maxConcurrentWorkflows?: number;
    timeout?: number;
    retryAttempts?: number;
    enableLogging?: boolean;
    reactiveFramework?: boolean;
    parallelExecution?: boolean;
  };
  workflows?: string[];
  agents: { [key: string]: AgentConfig };
  hasDiagram?: boolean;
  hasDocumentation?: boolean;
  documentationPath?: string;
}
