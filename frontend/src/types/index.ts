// Re-export PeakMetrics types
export * from './peakMetrics';

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
  type?: 'text' | 'image' | 'mixed';
  status: 'pending' | 'ready' | 'reviewed' | 'completed';
  agent: string;
  timestamp: string;
  content: string | Record<string, any>;
  lastUpdated?: string;
}

export interface HiveWorkflowPhase {
  status: 'pending' | 'running' | 'completed' | 'failed';
  start?: string;
  end?: string;
}

export interface Campaign {
  id: string;
  campaignId?: string; // Backend sometimes returns this instead of id
  brief: string;
  status: 'initializing' | 'active' | 'completed' | 'failed' | 'paused' | 'research' | 'strategic_insight' | 'trending' | 'story' | 'collaborative';
  conversation: ConversationMessage[];
  deliverables: { [agentName: string]: Deliverable };
  createdAt: string;
  lastUpdated: string;
  error?: string;
  awaitingReview?: string;
  pendingPhase?: string;
  phases?: {
    research?: {
      insights?: {
        analysis: string;
        lastUpdated: string;
      };
    };
    strategic_insight?: {
      insights?: any;
      timestamp?: string;
    };
    trending?: {
      trends?: any;
      timestamp?: string;
    };
    story?: {
      storyAngles?: any;
      timestamp?: string;
    };
    collaborative?: {
      phase?: string;
      contributions?: any[];
      synthesisQuality?: any;
      finalStrategy?: any;
    };
  };
  agentModels?: {
    research?: string;
    strategic_insight?: string;
    trending?: string;
    story?: string;
    pr_manager?: string;
  };
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

export interface HiveWorkflowState {
  id: string;
  status: 'running' | 'completed' | 'failed';
  currentPhase?: string;
  phases: { [key: string]: HiveWorkflowPhase };
  deliverables: { [key: string]: Deliverable };
  conversation?: ConversationMessage[];
  createdAt?: string;
  lastUpdated?: string;
  error?: string;
}