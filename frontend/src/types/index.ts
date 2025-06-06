export interface CampaignEvent {
  id: string;
  timestamp: string;
  type: 'init' | 'process' | 'create' | 'agent' | 'estimate' | 'brief' | 'research' | 'transition' | 'analyze' | 'deliver';
  description: string;
  icon: string;
  completed?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ConversationMessage {
  id?: string;
  speaker: string;
  agentId?: string;
  message: string;
  timestamp: string;
  deliverable?: Deliverable;
  isBrief?: boolean;
}

export interface Deliverable {
  id: string;
  title: string;
  status: 'pending' | 'ready' | 'reviewed';
  agent: string;
  timestamp: string;
  content: string | Record<string, any>;
}

export interface Campaign {
  id: string;
  brief: string;
  status: 'initializing' | 'active' | 'completed' | 'failed' | 'paused';
  conversation: ConversationMessage[];
  deliverables: { [agentName: string]: Deliverable };
  createdAt: string;
  lastUpdated: string;
  error?: string;
}

export interface AudienceResearch {
  demographics: {
    age: string;
    income: string;
    geography: string;
    lifestyle: string;
  };
  psychographics: {
    values: string;
    motivations: string;
    travelBehaviors: string;
  };
  segmentation: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}