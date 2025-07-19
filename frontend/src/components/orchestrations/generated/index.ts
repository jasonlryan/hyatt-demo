// Dynamic orchestration page loader
export const loadOrchestrationPage = async (orchestrationId: string) => {
  try {
    // @vite-ignore
    const module = await import(`./${orchestrationId}.tsx`);
    return module.default;
  } catch (error) {
    const { default: GenericOrchestrationPage } = await import("../GenericOrchestrationPage");
    return GenericOrchestrationPage;
  }
};

export interface GeneratedOrchestrationPageProps {
  orchestrationId: string;
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}
