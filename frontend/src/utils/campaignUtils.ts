import { Deliverable } from '../types';

export function extractDeliverables(data: any): { [key: string]: Deliverable } {
  const extracted: { [key: string]: Deliverable } = {};

  const addDeliverable = (key: string, deliverable: Deliverable) => {
    const content = deliverable.content;
    const isEmpty =
      !content ||
      (typeof content === 'string' && content.trim() === '') ||
      (typeof content === 'object' &&
        Object.values(content).every((v) =>
          typeof v === 'string' ? v.trim() === '' || v.trim() === 'N/A' : false
        ));
    if (isEmpty) return;

    const exists = Object.values(extracted).some(
      (d) => JSON.stringify(d.content) === JSON.stringify(content)
    );
    if (!exists && !extracted[key]) {
      extracted[key] = deliverable;
    }
  };

  if (data.phases?.research?.insights) {
    addDeliverable('research', {
      id: 'research',
      title: 'Audience Research',
      status: 'completed',
      agent: 'Research & Audience GPT',
      timestamp:
        data.phases.research.insights.lastUpdated || new Date().toISOString(),
      content: data.phases.research.insights.analysis,
      lastUpdated: data.phases.research.insights.lastUpdated,
    });
  }

  if (data.conversation) {
    data.conversation.forEach((msg: any) => {
      if (msg.deliverable) {
        const agentName = msg.agent || msg.speaker || 'AI Agent';
        const key = agentName.toLowerCase().replace(/\s+/g, '-');
        addDeliverable(key, {
          id: key,
          title: `${agentName} Analysis`,
          status: 'completed',
          agent: agentName,
          timestamp: msg.timestamp || new Date().toISOString(),
          content: msg.deliverable.analysis || msg.deliverable,
          lastUpdated: msg.timestamp,
        });
      }
    });
  }

  return extracted;
}
