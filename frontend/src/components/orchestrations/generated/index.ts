import { GeneratedOrchestrationPageProps } from "../../../types/orchestrations";

// Static import map for orchestration pages
const orchestrationPages: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  hyatt: () => import("../HyattOrchestrationPage"),
  hive: () => import("../HiveOrchestrationPage"),
};

export const loadOrchestrationPage = async (orchestrationId: string) => {
  if (orchestrationPages[orchestrationId]) {
    const module = await orchestrationPages[orchestrationId]();
    return module.default;
  }
  // Fallback to generic orchestration page if specific page doesn't exist
  const { default: GenericOrchestrationPage } = await import("../GenericOrchestrationPage");
  return GenericOrchestrationPage;
};

export type { GeneratedOrchestrationPageProps };
