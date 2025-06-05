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

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: string;
}

export interface Deliverable {
  id: string;
  title: string;
  status: 'pending' | 'ready' | 'reviewed';
  agent: string;
  timestamp: string;
  content?: Record<string, any>;
}

export interface Campaign {
  id: string;
  status: 'active' | 'paused' | 'completed';
  events: CampaignEvent[];
  messages: Message[];
  deliverables: Deliverable[];
  progress: number;
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