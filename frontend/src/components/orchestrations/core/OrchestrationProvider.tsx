import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  OrchestrationContextValue,
  OrchestrationState,
  OrchestrationActions,
  OrchestrationConfig,
  ThemeConfig,
} from './types';

const OrchestrationContext = createContext<OrchestrationContextValue | undefined>(
  undefined
);

interface OrchestrationProviderProps {
  orchestrationId: string;
  config: OrchestrationConfig;
  theme?: ThemeConfig;
  children: ReactNode;
}

export const OrchestrationProvider: React.FC<OrchestrationProviderProps> = ({
  orchestrationId,
  config,
  theme = { name: 'default' },
  children,
}) => {
  const [state, setState] = useState<OrchestrationState>({ status: 'idle' });

  const actions: OrchestrationActions = {
    start: async () => {
      setState({ status: 'running' });
    },
    stop: () => {
      setState({ status: 'idle' });
    },
    reset: () => {
      setState({ status: 'idle' });
    },
  };

  const value: OrchestrationContextValue = {
    orchestrationId,
    config,
    state,
    actions,
    theme,
  };

  return (
    <OrchestrationContext.Provider value={value}>
      {children}
    </OrchestrationContext.Provider>
  );
};

export const useOrchestration = (): OrchestrationContextValue => {
  const ctx = useContext(OrchestrationContext);
  if (!ctx) throw new Error('useOrchestration must be used within provider');
  return ctx;
};

