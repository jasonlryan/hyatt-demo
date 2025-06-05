import React from 'react';
import { X } from 'lucide-react';

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  if (typeof timestamp === 'string' && timestamp.includes(':')) return timestamp;
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function SidePanel({ messages, isOpen, onClose }) {
  return (
    <div className={`fixed left-0 top-0 w-full md:w-80 h-full bg-slate-800 text-white shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">Campaign Progress</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-64px)] pb-8">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-4 border-l-4 border-indigo-500 bg-slate-700 bg-opacity-30 hover:bg-opacity-50 transition-colors m-4 rounded-r">
            <div className="text-xs text-slate-400 mb-1">{formatTimestamp(msg.timestamp)}</div>
            <div className="text-sm"><span className="font-medium">{msg.speaker}:</span> {msg.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SidePanel;
