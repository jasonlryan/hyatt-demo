import { X, RefreshCw, Rocket, FileText, CheckCircle2, Users, Clock, Search, Layers, MessageSquare } from 'lucide-react';

function SidePanel({ events, isOpen, onClose }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Rocket': return <Rocket size={16} className="text-orange-500" />;
      case 'FileText': return <FileText size={16} className="text-yellow-500" />;
      case 'CheckCircle2': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'Users': return <Users size={16} className="text-blue-500" />;
      case 'Clock': return <Clock size={16} className="text-slate-500" />;
      case 'Search': return <Search size={16} className="text-purple-500" />;
      case 'Layers': return <Layers size={16} className="text-indigo-500" />;
      case 'MessageSquare': return <MessageSquare size={16} className="text-teal-500" />;
      default: return <RefreshCw size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className={`fixed left-0 top-0 w-full md:w-80 h-full bg-slate-800 text-white shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>\
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center">
          <RefreshCw size={20} className="mr-2 animate-spin text-indigo-400" />
          <h2 className="text-xl font-semibold">Campaign Progress</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-64px)] pb-8">
        {events.map((event) => (
          <div key={event.id} className="p-4 border-l-4 border-indigo-500 bg-slate-700 bg-opacity-30 hover:bg-opacity-50 transition-colors m-4 rounded-r">
            <div className="flex items-start">
              <div className="mr-3 mt-1">{getIcon(event.icon)}</div>
              <div className="flex-1">
                <div className="text-xs text-slate-400 mb-1">{event.timestamp}</div>
                <div className="text-sm">{event.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SidePanel;
