export interface OrchestrationConfig {
  maxConcurrentWorkflows: number;
  timeout: number;
  retryAttempts: number;
  enableLogging: boolean;
  reactiveFramework?: boolean;
  parallelExecution?: boolean;
}

export interface OrchestrationState {
  status: 'idle' | 'running' | 'success' | 'error';
  error?: string;
}

export interface OrchestrationActions {
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export interface ThemeConfig {
  name: 'default' | 'dark' | 'custom';
}

export interface Action {
  id: string;
  label: string;
  onClick: () => void;
}

export interface OrchestrationContextValue {
  orchestrationId: string;
  config: OrchestrationConfig;
  state: OrchestrationState;
  actions: OrchestrationActions;
  theme: ThemeConfig;
}

