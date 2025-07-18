import { useState } from 'react';

export type View = 'orchestrations' | 'agents' | 'workflows';

export function useOrchestrationNavigation() {
  const [currentView, setCurrentView] = useState<View>('orchestrations');
  const [selectedOrchestration, setSelectedOrchestration] = useState<string | null>(null);

  const navigateToAgents = () => {
    setCurrentView('agents');
    setSelectedOrchestration(null);
  };

  const navigateToWorkflows = () => {
    setCurrentView('workflows');
    setSelectedOrchestration(null);
  };

  const navigateToOrchestrations = () => {
    setCurrentView('orchestrations');
    setSelectedOrchestration(null);
  };

  const selectOrchestration = (id: string) => {
    setSelectedOrchestration(id);
  };

  return {
    currentView,
    selectedOrchestration,
    navigateToAgents,
    navigateToWorkflows,
    navigateToOrchestrations,
    selectOrchestration,
  };
}
