import { useState } from 'react';
import { apiFetch } from '../utils/api';
import { HiveWorkflowState } from '../types';

export function useHiveWorkflowState() {
  const [workflow, setWorkflow] = useState<HiveWorkflowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollId, setPollId] = useState<NodeJS.Timeout | null>(null);

  const fetchWorkflow = async (id: string) => {
    try {
      const data = await apiFetch(`/api/hive/workflows/${id}`);
      setWorkflow(data);
      return data as HiveWorkflowState;
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const startPolling = (id: string) => {
    const int = setInterval(async () => {
      const wf = await fetchWorkflow(id);
      if (wf.status !== 'running') {
        clearInterval(int);
        setPollId(null);
      }
    }, 2000);
    setPollId(int);
  };

  const startOrchestration = async (context: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiFetch('/api/hive-orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });
      await fetchWorkflow(data.id);
      startPolling(data.id);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const resetWorkflow = () => {
    if (pollId) clearInterval(pollId);
    setPollId(null);
    setWorkflow(null);
  };

  const loadWorkflow = async (id: string) => {
    const wf = await fetchWorkflow(id);
    if (wf.status === 'running') startPolling(id);
    return wf;
  };

  return { workflow, isLoading, error, startOrchestration, resetWorkflow, loadWorkflow };
}
