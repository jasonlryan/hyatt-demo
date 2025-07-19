import { Campaign, Agent, AudienceResearch } from '../types';

export const mockAudienceResearch: AudienceResearch = {
  demographics: {
    age: '35-60',
    income: '$150,000+',
    geography: 'Primarily Europe and North America',
    lifestyle: 'High-paced, frequent international travel, tech-savvy'
  },
  psychographics: {
    values: 'Efficiency, reliability, status',
    motivations: 'Maintaining business continuity, minimizing disruptions',
    travelBehaviors: 'Preference for seamless experiences, loyalty to brands that offer convenience and reliability'
  },
  segmentation: {
    primary: 'C-suite executives',
    secondary: 'International business travelers',
    tertiary: 'Conference attendees'
  }
};

export const mockCampaign: Campaign = {
  id: '397d2a3c-acde-42a0-9ebc-2ebf06dc0489',
  brief: 'Major airline strikes across Europe and North America',
  status: 'active',
  conversation: [
    {
      speaker: 'Research & Audience GPT',
      agentId: 'agent2',
      message: "Our analysis identifies C-suite executives as the primary targets for this crisis campaign, with international business travelers and conference attendees as secondary and tertiary targets. Key insights include the need for reliable accommodation near airports and business continuity services. Strategic implications suggest emphasizing Hyatt's role as a dependable partner during disruptions, with messaging focused on our airport properties and extended stay options. Tactical recommendations include direct email campaigns and LinkedIn ads targeting executives, along with partnerships with travel management companies to ensure seamless engagement and support for stranded travelers.",
      timestamp: '21:03:26'
    },
    {
      speaker: 'PR Manager',
      agentId: 'agent1',
      message: "Campaign is paused for manual review after the research phase. Choose \"Resume\" to continue to strategic_insight or \"Refine\" to adjust instructions.",
      timestamp: '21:03:26'
    },
    {
      speaker: 'Agent Collaboration',
      agentId: 'agent3',
      message: "travelers—focusing on their immediate needs and pain points during this crisis. This insight will be essential for us to craft compelling narratives that resonate with their urgency for solutions. Our unique positioning will emphasize Hyatt's commitment to ensuring business continuity and convenience, reinforcing our role as a trusted partner during travel disruptions. The goal is to create a campaign that not only addresses immediate accommodation needs but also fosters a sense of security and reliability that aligns with our brand values. Let's move swiftly and effectively to deliver a campaign that meets the urgent needs of our audience while reinforcing Hyatt's reputation as a leader in hospitality solutions during challenging times.",
      timestamp: '21:03:08'
          }
    ],
  deliverables: {
    'Research & Audience GPT': {
      id: 'd1',
      title: 'Audience Research & Insights',
      status: 'ready',
      agent: 'Research & Audience GPT',
      timestamp: '21:03:38',
      content: mockAudienceResearch
    }
  },
  createdAt: '2024-01-15T21:03:02Z',
  lastUpdated: '2024-01-15T21:03:38Z'
};

export const mockAgents: Agent[] = [
  {
    id: 'agent1',
    name: 'PR Manager',
    role: 'manager',
    avatar: '👨‍💼'
  },
  {
    id: 'agent2',
    name: 'Research & Audience GPT',
    role: 'research',
    avatar: '🔍'
  },
  {
    id: 'agent3',
    name: 'Agent Collaboration',
    role: 'collaboration',
    avatar: '👥'
  }
];