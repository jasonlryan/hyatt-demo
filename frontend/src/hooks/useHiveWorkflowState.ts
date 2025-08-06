import { useState, useCallback, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api';
import { HiveWorkflowState } from '../types';

export function useHiveWorkflowState() {
  const [workflow, setWorkflow] = useState<HiveWorkflowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Start polling when workflow is running or paused
  useEffect(() => {
    if (workflow && workflow.id && (workflow.status === 'running' || workflow.status === 'paused')) {
      intervalRef.current = window.setInterval(async () => {
        try {
          const updatedWorkflow = await apiFetch(`/api/hive-orchestrate/${workflow.id}`);
          // Ensure deliverables and conversation are always defined
          setWorkflow({
            ...updatedWorkflow,
            deliverables: updatedWorkflow.deliverables || {},
            conversation: updatedWorkflow.conversation || [],
          });
          
          // Stop polling when workflow completes or fails (but keep polling if paused)
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

  const startOrchestration = useCallback(async (context: any, hitlEnabled = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch('/api/hive-orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...context, hitlEnabled }),
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
      await apiFetch(`/api/hive-orchestrate/${workflow.id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions }),
      });
      
      console.log('Refine API call successful - polling will update UI');
      // Don't update workflow state here - let polling handle it gradually
      // This prevents the UI from flashing/emptying and repopulating
      
    } catch (err: any) {
      setError(err.message || 'Failed to refine workflow');
      console.error('Refine workflow error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workflow?.id]);

  const resumeWorkflow = useCallback(async () => {
    if (!workflow?.id) return;
    
    console.log('Resuming workflow:', workflow.id);
    setIsLoading(true);
    setError(null);
    
    try {
      await apiFetch(`/api/hive-orchestrate/${workflow.id}/resume`, {
        method: 'POST',
      });
      
      console.log('Resume API call successful - polling will update UI');
      // Don't update workflow state here - let polling handle it gradually
      // This prevents the UI from flashing/emptying and repopulating
      
    } catch (err: any) {
      console.error('Resume workflow error:', err);
      setError(err.message || 'Failed to resume workflow');
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
