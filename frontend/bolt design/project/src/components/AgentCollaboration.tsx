import React from 'react';
import { Message, Agent } from '../types';

interface AgentCollaborationProps {
  messages: Message[];
  agents: Agent[];
}

const AgentCollaboration: React.FC<AgentCollaborationProps> = ({ messages, agents }) => {
  const getAgentById = (id: string) => {
    return agents.find(agent => agent.id === id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Agent Collaboration</h2>
      
      <div className="space-y-4">
        {messages.map((message) => {
          const agent = getAgentById(message.agentId);
          
          return (
            <div 
              key={message.id}
              className={`p-4 rounded-lg ${
                agent?.role === 'research' ? 'bg-purple-50 border-l-4 border-purple-400' : 
                agent?.role === 'manager' ? 'bg-blue-50 border-l-4 border-blue-400' : 
                'bg-indigo-50 border-l-4 border-indigo-400'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{agent?.avatar || '👤'}</span>
                <span className="font-medium text-slate-800">{agent?.name || 'Unknown Agent'}</span>
                <span className="text-xs text-slate-500 ml-2">{message.timestamp}</span>
              </div>
              <p className="text-slate-700 text-sm">{message.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentCollaboration;