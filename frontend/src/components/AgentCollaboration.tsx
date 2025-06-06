import React from "react";
import { ConversationMessage } from "../types";
import { MessageSquare, User } from "lucide-react";

interface AgentCollaborationProps {
  messages: ConversationMessage[];
}

const AgentCollaboration: React.FC<AgentCollaborationProps> = ({
  messages,
}) => {
  const getSpeakerIcon = (speaker: string) => {
    if (speaker === "Campaign Brief") {
      return <User size={20} className="text-slate-600" />;
    }
    return <MessageSquare size={20} className="text-slate-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">
          Agent Collaboration
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-6 max-h-[40rem] overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-slate-100 rounded-full p-3 mr-4">
                {getSpeakerIcon(msg.speaker)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{msg.speaker}</p>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {msg.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-slate-500 text-center py-4">
              No conversation messages yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCollaboration;
