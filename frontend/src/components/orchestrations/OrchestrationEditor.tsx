interface OrchestrationEditorProps {
  orchestrationId: string;
  orchestration: any;
}

const OrchestrationEditor: React.FC<OrchestrationEditorProps> = ({ orchestration }) => {
  return (
    <div className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Edit Orchestration</h3>
        <p className="text-text-secondary mb-6">
          Orchestration editing functionality is coming soon. You'll be able to modify agents, workflows, and configuration.
        </p>
        <div className="bg-secondary rounded-lg p-4 text-left">
          <h4 className="font-medium text-text-primary mb-2">Current Configuration:</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Name: {orchestration.name}</li>
            <li>• Agents: {orchestration.agents?.length || 0}</li>
            <li>• Workflows: {orchestration.workflows?.length || 0}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationEditor;
