import React from "react";
import { ConversationMessage } from "../types";
import { X, MessageSquare, User } from "lucide-react";

interface SidePanelProps {
  messages: ConversationMessage[];
  isOpen: boolean;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ messages, isOpen, onClose }) => {
  const getIcon = (speaker: string) => {
    if (speaker === "Campaign Brief") {
      return <User size={16} className="text-blue-400" />;
    }
    return <MessageSquare size={16} className="text-teal-400" />;
  };

  return (
    <div
      className={`fixed left-0 top-0 w-full md:w-96 h-full bg-slate-800 text-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">Detailed Log</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-64px)] pb-8">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-4 border-l-4 border-indigo-500 bg-slate-700 bg-opacity-30 hover:bg-opacity-50 transition-colors m-4 rounded-r"
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">{getIcon(msg.speaker)}</div>
              <div className="flex-1">
                <p className="font-semibold text-slate-300">{msg.speaker}</p>
                <div className="text-xs text-slate-400 mb-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
                <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-slate-500 text-center py-8">No log entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
