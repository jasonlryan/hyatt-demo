// Type declarations for generated orchestrations

export interface GeneratedOrchestrationMetadata {
  generatedPagePath: string;
  generatedPageId: string;
  createdBy: string;
  createdAt: string;
  version: string;
}

export interface GeneratedOrchestrationConfig {
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
  documentation?: Record<string, any>;
  metadata: GeneratedOrchestrationMetadata;
}

declare module "*.tsx" {
  import React from "react";
  const Component: React.ComponentType<any>;
  export default Component;
}

export type OrchestrationPageProps = {
  orchestrationId: string;
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
};

export type OrchestrationPageLoader = (
  id: string
) => Promise<React.ComponentType<OrchestrationPageProps>>;

export interface OrchestrationLoadError {
  code: "NOT_FOUND" | "INVALID_FORMAT" | "LOAD_FAILED";
  message: string;
  orchestrationId: string;
  timestamp: string;
}
