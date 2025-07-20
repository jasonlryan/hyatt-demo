import { useState } from 'react';
import { apiFetch } from '../utils/api';
import { HiveWorkflowState, Deliverable } from '../types';

export function useHiveWorkflowState() {
  const [workflow, setWorkflow] = useState<HiveWorkflowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOrchestration = async (context: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiFetch('/api/hive-orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      const deliverables: { [k: string]: Deliverable } = {
        trend_analysis: {
          id: 'trend_analysis',
          title: 'Trend Insights',
          status: 'ready',
          agent: 'Trend Cultural Analyzer',
          timestamp: new Date().toISOString(),
          content: data.trendInsights,
        },
        visual_prompt: {
          id: 'visual_prompt',
          title: 'Visual Prompt',
          status: 'ready',
          agent: 'Visual Prompt Generator',
          timestamp: new Date().toISOString(),
          content: { promptText: data.promptText, imageUrl: data.imageUrl },
        },
        modular_elements: {
          id: 'modular_elements',
          title: 'Modular Elements',
          status: 'ready',
          agent: 'Modular Elements Recommender',
          timestamp: new Date().toISOString(),
          content: { elements: data.modulars },
        },
        qa_review: {
          id: 'qa_review',
          title: 'QA Review',
          status: 'ready',
          agent: 'Brand QA',
          timestamp: new Date().toISOString(),
          content: data.qaResult,
        },
      };

      const wf: HiveWorkflowState = {
        id: Date.now().toString(),
        status: 'completed',
        deliverables,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      setWorkflow(wf);
      return wf;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const resetWorkflow = () => setWorkflow(null);

  return { workflow, isLoading, error, startOrchestration, resetWorkflow };
}
