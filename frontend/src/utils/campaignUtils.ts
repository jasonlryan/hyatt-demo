import { Deliverable } from '../types';

export function extractDeliverables(data: any): { [key: string]: Deliverable } {
  const extracted: { [key: string]: Deliverable } = {};

  if (data.phases?.research?.insights) {
    extracted['research'] = {
      id: 'research',
      title: 'Audience Research',
      status: 'completed',
      agent: 'Research & Audience GPT',
      timestamp: data.phases.research.insights.lastUpdated || new Date().toISOString(),
      content: data.phases.research.insights.analysis,
      lastUpdated: data.phases.research.insights.lastUpdated,
    };
  }

  if (data.conversation) {
    data.conversation.forEach((msg: any) => {
      if (msg.deliverable) {
        const agentName = msg.agent || msg.speaker || 'AI Agent';
        const key = agentName.toLowerCase().replace(/\s+/g, '-');
        extracted[key] = {
          id: key,
          title: `${agentName} Analysis`,
          status: 'completed',
          agent: agentName,
          timestamp: msg.timestamp || new Date().toISOString(),
          content: msg.deliverable.analysis || msg.deliverable,
          lastUpdated: msg.timestamp,
        };
      }
    });
  }

  return extracted;
}
