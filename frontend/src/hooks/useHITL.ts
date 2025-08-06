import { useState, useCallback, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export interface HITLState {
  workflowId: string;
  isPaused: boolean;
  pausedAt?: string;
  pausedTime?: string;
  status?: string;
}

export function useHITL(workflowId: string | null) {
  const [hitlState, setHitlState] = useState<HITLState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll HITL status
  useEffect(() => {
    if (!workflowId) {
      setHitlState(null);
      return;
    }

    let intervalId: number | null = null;

    const pollStatus = async () => {
      try {
        const response = await apiFetch(`/api/hitl/${workflowId}`);
        setHitlState(response);
      } catch (err: any) {
        console.error('HITL status polling error:', err);
        // Don't set error for polling failures to avoid UI noise
      }
    };

    // Initial poll
    pollStatus();

    // Set up interval polling
    intervalId = window.setInterval(pollStatus, 2000); // Poll every 2 seconds

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [workflowId]);

  const resumeWorkflow = useCallback(async () => {
    if (!workflowId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch(`/api/hitl/${workflowId}/resume`, {
        method: 'POST',
      });
      
      // Update local state immediately
      setHitlState(prev => prev ? { ...prev, isPaused: false } : null);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to resume workflow');
      console.error('Resume workflow error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workflowId]);

  const refineWorkflow = useCallback(async (instructions: string) => {
    if (!workflowId || !instructions) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch(`/api/hitl/${workflowId}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions }),
      });
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to refine workflow');
      console.error('Refine workflow error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workflowId]);

  const cleanupWorkflow = useCallback(async () => {
    if (!workflowId) return;
    
    try {
      await apiFetch(`/api/hitl/${workflowId}`, {
        method: 'DELETE',
      });
      
      setHitlState(null);
    } catch (err: any) {
      console.error('Cleanup workflow error:', err);
      // Don't throw error for cleanup failures
    }
  }, [workflowId]);

  return {
    hitlState,
    isLoading,
    error,
    resumeWorkflow,
    refineWorkflow,
    cleanupWorkflow,
    setError,
  };
}

// Hook for getting all paused workflows (admin/monitoring view)
export function usePausedWorkflows() {
  const [pausedWorkflows, setPausedWorkflows] = useState<HITLState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPausedWorkflows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch('/api/hitl/paused');
      setPausedWorkflows(response.pausedWorkflows || []);
    } catch (err: any) {
      setError(err.message || 'Failed to get paused workflows');
      console.error('Get paused workflows error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh paused workflows
  useEffect(() => {
    refreshPausedWorkflows();
    
    const intervalId = window.setInterval(refreshPausedWorkflows, 5000); // Refresh every 5 seconds
    
    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshPausedWorkflows]);

  return {
    pausedWorkflows,
    isLoading,
    error,
    refreshPausedWorkflows,
  };
}