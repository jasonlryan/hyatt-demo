import { useState, useCallback, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api';
import { HiveWorkflowState } from '../types';

export function useHiveWorkflowState() {
  const [workflow, setWorkflow] = useState<HiveWorkflowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Start polling when workflow is running
  useEffect(() => {
    if (workflow && workflow.id && workflow.status === 'running') {
      intervalRef.current = window.setInterval(async () => {
        try {
          const updatedWorkflow = await apiFetch(`/api/hive-orchestrate/${workflow.id}`);
          setWorkflow(updatedWorkflow);
          
          // Stop polling when workflow completes or fails
          if (updatedWorkflow.status === 'completed' || updatedWorkflow.status === 'failed') {
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        } catch (err: any) {
          console.error('Polling error:', err);
          setError(err.message || 'Failed to update workflow status');
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 2000); // Poll every 2 seconds
    }

    // Cleanup on unmount or when workflow changes
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [workflow?.id, workflow?.status]);

  const startOrchestration = useCallback(async (context: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch('/api/hive-orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });
      
      // Set initial workflow state
      setWorkflow({
        id: response.id,
        status: 'running',
        currentPhase: 'pr_manager',
        phases: {
          pr_manager: { status: 'running' },
          trending: { status: 'pending' },
          strategic: { status: 'pending' },
          story: { status: 'pending' },
          brand_lens: { status: 'pending' },
          visual_prompt_generator: { status: 'pending' },
          brand_qa: { status: 'pending' },
        },
        deliverables: {},
        conversation: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to start orchestration');
      console.error('Start orchestration error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetWorkflow = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setWorkflow(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const refineWorkflow = useCallback(async (instructions: string) => {
    if (!workflow?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch(`/api/hive-orchestrate/${workflow.id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions }),
      });
      
      setWorkflow(response);
    } catch (err: any) {
      setError(err.message || 'Failed to refine workflow');
      console.error('Refine workflow error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workflow?.id]);

  const resumeWorkflow = useCallback(async () => {
    if (!workflow?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch(`/api/hive-orchestrate/${workflow.id}/resume`, {
        method: 'POST',
      });
      
      setWorkflow(response);
    } catch (err: any) {
      setError(err.message || 'Failed to resume workflow');
      console.error('Resume workflow error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workflow?.id]);

  return {
    workflow,
    isLoading,
    error,
    startOrchestration,
    resetWorkflow,
    refineWorkflow,
    resumeWorkflow,
    setError,
  };
}
