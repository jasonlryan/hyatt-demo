import { useState, useCallback, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api';
import { OrchestrationHookConfig, OrchestrationTypes } from '../config/orchestration-configs';

/**
 * Generic Configurable Orchestration Hook
 * 
 * This hook unifies the state management logic from useHiveWorkflowState and useCampaignState.
 * It uses configuration to adapt to different orchestration types while maintaining
 * identical functionality and API.
 * 
 * Phase 4.2 of Orchestration Unification Plan
 */

interface ConfigurableOrchestrationState {
  id: string;
  status: string;
  currentPhase?: string;
  phases: Record<string, { status: string }>;
  deliverables: Record<string, any>;
  conversation: any[];
  createdAt?: string;
  lastUpdated?: string;
  error?: string;
  hitlEnabled?: boolean;
  isPaused?: boolean;
  pausedAt?: string;
  awaitingReview?: string;
}

export function useConfigurableOrchestration(config: OrchestrationHookConfig) {
  const [orchestrationState, setOrchestrationState] = useState<ConfigurableOrchestrationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Helper function to replace {id} in endpoint URLs
  const buildEndpointUrl = (endpoint: string, id?: string): string => {
    if (id && endpoint.includes('{id}')) {
      return endpoint.replace('{id}', id);
    }
    return endpoint;
  };

  // Unified polling logic
  useEffect(() => {
    const shouldPoll = orchestrationState && 
      orchestrationState.id && 
      (orchestrationState.status === 'running' || 
       orchestrationState.status === 'paused' || 
       orchestrationState.status === 'active');

    if (shouldPoll) {
      intervalRef.current = window.setInterval(async () => {
        try {
          const endpoint = buildEndpointUrl(config.endpoints.get, orchestrationState.id);
          const updatedData = await apiFetch(endpoint);
          const processedData = config.dataStructure.processResponse(updatedData);
          
          setOrchestrationState(processedData);
          
          // Stop polling when orchestration completes or fails (but keep polling if paused)
          if (processedData.status === 'completed' || processedData.status === 'failed') {
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        } catch (err: any) {
          console.error('Polling error:', err);
          setError(err.message || 'Failed to update orchestration status');
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, config.pollingInterval);
    }

    // Cleanup on unmount or when orchestration changes
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orchestrationState?.id, orchestrationState?.status, config.endpoints.get, config.pollingInterval, config.dataStructure]);

  // Start orchestration
  const startOrchestration = useCallback(async (context: any, hitlEnabled = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const requestBody = config.dataStructure.startRequestBody(context, hitlEnabled);
      
      const response = await apiFetch(config.endpoints.start, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      const processedResponse = config.dataStructure.processResponse(response);
      const orchestrationId = processedResponse[config.dataStructure.idField];
      
      // Set initial orchestration state
      setOrchestrationState({
        id: orchestrationId,
        status: 'running',
        currentPhase: config.initialPhase,
        phases: { ...config.initialPhases },
        deliverables: {},
        conversation: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        hitlEnabled,
        isPaused: false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to start orchestration');
      console.error('Start orchestration error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config.endpoints.start, config.dataStructure, config.initialPhases, config.initialPhase]);

  // Reset orchestration
  const resetOrchestration = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setOrchestrationState(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Refine orchestration
  const refineOrchestration = useCallback(async (instructions: string) => {
    if (!orchestrationState?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const endpoint = buildEndpointUrl(config.endpoints.refine, orchestrationState.id);
      
      await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions }),
      });
      
      console.log('Refine API call successful - polling will update UI');
      // Don't update state here - let polling handle it gradually
      // This prevents UI flashing/emptying and repopulating
      
    } catch (err: any) {
      setError(err.message || 'Failed to refine orchestration');
      console.error('Refine orchestration error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orchestrationState?.id, config.endpoints.refine]);

  // Resume orchestration
  const resumeOrchestration = useCallback(async () => {
    if (!orchestrationState?.id) return;
    
    console.log('Resuming orchestration:', orchestrationState.id);
    setIsLoading(true);
    setError(null);
    
    try {
      const endpoint = buildEndpointUrl(config.endpoints.resume, orchestrationState.id);
      
      await apiFetch(endpoint, {
        method: 'POST',
      });
      
      console.log('Resume API call successful - polling will update UI');
      // Don't update state here - let polling handle it gradually
      // This prevents UI flashing/emptying and repopulating
      
    } catch (err: any) {
      console.error('Resume orchestration error:', err);
      setError(err.message || 'Failed to resume orchestration');
    } finally {
      setIsLoading(false);
    }
  }, [orchestrationState?.id, config.endpoints.resume]);

  return {
    // State
    orchestration: orchestrationState,
    isLoading,
    error,
    
    // Actions
    startOrchestration,
    resetOrchestration,
    refineOrchestration,
    resumeOrchestration,
    setError,
  };
}

/**
 * Convenience hooks for specific orchestration types
 */
export function useHiveOrchestration() {
  const { getOrchestrationConfig } = require('../config/orchestration-configs');
  return useConfigurableOrchestration(getOrchestrationConfig('hive'));
}

export function useHyattOrchestration() {
  const { getOrchestrationConfig } = require('../config/orchestration-configs');
  return useConfigurableOrchestration(getOrchestrationConfig('hyatt'));
}