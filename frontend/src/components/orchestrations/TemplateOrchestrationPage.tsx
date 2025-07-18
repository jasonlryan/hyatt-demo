import HyattStyleOrchestrationTemplate from "./HyattStyleOrchestrationTemplate";

interface TemplateOrchestrationPageProps {
  orchestrationId: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
}

const TemplateOrchestrationPage: React.FC<TemplateOrchestrationPageProps> = ({
  orchestrationId,
  hitlReview,
  onToggleHitl,
}) => {
  return (
    <HyattStyleOrchestrationTemplate
      orchestrationId={orchestrationId}
      orchestrationName="Template Orchestrator"
      hitlReview={hitlReview}
      onToggleHitl={onToggleHitl}
    />
  );
};

export default TemplateOrchestrationPage;
