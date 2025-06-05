function ProgressPanel({ messages, error }) {
  // Map speaker names to agent info for consistent styling
  const getAgentInfo = (speaker) => {
    const agentMap = {
      'Research & Audience GPT': { 
        avatar: '🔍', 
        role: 'research',
        colorClass: 'bg-purple-50 border-l-4 border-purple-400'
      },
      'Trending News GPT': { 
        avatar: '📈', 
        role: 'trending',
        colorClass: 'bg-blue-50 border-l-4 border-blue-400'
      },
      'Story Angles & Headlines GPT': { 
        avatar: '✍️', 
        role: 'story',
        colorClass: 'bg-indigo-50 border-l-4 border-indigo-400'
      },
      'Strategic Insight & Human Truth GPT': { 
        avatar: '🧠', 
        role: 'insight',
        colorClass: 'bg-emerald-50 border-l-4 border-emerald-400'
      },
      'PR Manager Agent': { 
        avatar: '👨‍💼', 
        role: 'manager',
        colorClass: 'bg-amber-50 border-l-4 border-amber-400'
      }
    };
    
    return agentMap[speaker] || { 
      avatar: '🤖', 
      role: 'agent',
      colorClass: 'bg-gray-50 border-l-4 border-gray-400'
    };
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    // If it's already a formatted time, return as is
    if (typeof timestamp === 'string' && timestamp.includes(':')) {
      return timestamp;
    }
    // Otherwise format as time
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Agent Collaboration</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {messages.length === 0 && !error ? (
        <div className="bg-slate-50 rounded-lg p-8 text-center">
          <div className="text-slate-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <p className="text-slate-500">Conversation will appear here once the campaign starts.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message, idx) => {
            const agentInfo = getAgentInfo(message.speaker);
            
            return (
              <div 
                key={idx}
                className={`p-4 rounded-lg ${agentInfo.colorClass}`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{agentInfo.avatar}</span>
                  <span className="font-medium text-slate-800">{message.speaker}</span>
                  {message.timestamp && (
                    <span className="text-xs text-slate-500 ml-2">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{message.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProgressPanel;
