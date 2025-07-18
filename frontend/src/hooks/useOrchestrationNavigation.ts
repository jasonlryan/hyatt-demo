import { useState, useEffect } from 'react';

export type View = 'orchestrations' | 'agents' | 'workflows';

export function useOrchestrationNavigation() {
  const [currentView, setCurrentView] = useState<View>('orchestrations');
  const [selectedOrchestration, setSelectedOrchestration] = useState<string | null>(null);

  // Initialize from URL on component mount
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const orchestration = searchParams.get('orchestration');
    
    // Parse the path to determine current view
    if (path.includes('/agents')) {
      setCurrentView('agents');
      setSelectedOrchestration(null);
    } else if (path.includes('/workflows')) {
      setCurrentView('workflows');
      setSelectedOrchestration(null);
    } else if (path.includes('/orchestrations') || path === '/') {
      setCurrentView('orchestrations');
      setSelectedOrchestration(orchestration);
    }

    // Set initial history state if not already set
    if (!window.history.state) {
      const initialView = path.includes('/agents') ? 'agents' : 
                         path.includes('/workflows') ? 'workflows' : 'orchestrations';
      window.history.replaceState({ view: initialView, orchestration }, '', window.location.href);
    }
  }, []);

  // Listen for browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const orchestration = searchParams.get('orchestration');
      
      if (path.includes('/agents')) {
        setCurrentView('agents');
        setSelectedOrchestration(null);
      } else if (path.includes('/workflows')) {
        setCurrentView('workflows');
        setSelectedOrchestration(null);
      } else if (path.includes('/orchestrations') || path === '/') {
        setCurrentView('orchestrations');
        setSelectedOrchestration(orchestration);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateHistory = (view: View, orchestration?: string | null) => {
    let path = '/';
    let search = '';
    
    if (view === 'agents') {
      path = '/agents';
    } else if (view === 'workflows') {
      path = '/workflows';
    } else if (view === 'orchestrations') {
      path = '/orchestrations';
      if (orchestration) {
        search = `?orchestration=${orchestration}`;
      }
    }

    const url = path + search;
    window.history.pushState({ view, orchestration }, '', url);
  };

  const navigateToAgents = () => {
    setCurrentView('agents');
    setSelectedOrchestration(null);
    updateHistory('agents');
  };

  const navigateToWorkflows = () => {
    setCurrentView('workflows');
    setSelectedOrchestration(null);
    updateHistory('workflows');
  };

  const navigateToOrchestrations = () => {
    setCurrentView('orchestrations');
    setSelectedOrchestration(null);
    updateHistory('orchestrations');
  };

  const selectOrchestration = (id: string) => {
    setSelectedOrchestration(id);
    updateHistory('orchestrations', id);
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
