import React from "react";
import { ConversationMessage } from "../types";
import { X } from "lucide-react";
import { getAgentStyleSmall } from "./orchestrations/agentStyles";

interface SidePanelProps {
  messages: ConversationMessage[];
  isOpen: boolean;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ messages, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-slate-800 text-white shadow-xl border-r border-slate-700 rounded-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
        <h2 className="text-xl font-semibold">Detailed Log</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {messages.map((msg, index) => {
            const { icon, accent } = getAgentStyleSmall(msg.speaker);
            return (
              <div
                key={index}
                className={`p-3 ${accent} bg-slate-700 bg-opacity-30 hover:bg-opacity-50 transition-colors rounded-r`}
                style={{ fontSize: "0.92rem" }}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">{icon}</div>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-300">
                        {msg.speaker}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="text-slate-300 whitespace-pre-wrap mt-2"
                      style={{ fontSize: "0.95em" }}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <p
              className="text-slate-500 text-center py-8"
              style={{ fontSize: "0.95em" }}
            >
              No log entries yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
