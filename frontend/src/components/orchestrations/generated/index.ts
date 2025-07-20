import { GeneratedOrchestrationPageProps } from "../../../types/orchestrations";

// Dynamic orchestration page loader
export const loadOrchestrationPage = async (orchestrationId: string) => {
  try {
    /* @vite-ignore */
    const module = await import(`./${orchestrationId}.tsx`);
    return module.default;
  } catch {
    // Fallback to generic orchestration page if specific page doesn't exist
    const { default: GenericOrchestrationPage } = await import("../GenericOrchestrationPage");
    return GenericOrchestrationPage;
  }
};

export type { GeneratedOrchestrationPageProps };
