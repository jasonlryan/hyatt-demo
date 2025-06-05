function ProgressPanel({ messages, error }) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Agent Conversation</h2>
      <div className="flex-grow overflow-y-auto">
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {messages.length === 0 && !error && (
            <p className="text-sm text-gray-500">Conversation will appear here once the campaign starts.</p>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className="mb-2 text-sm">
            <span className="font-semibold mr-1">{m.speaker}:</span>
            {m.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressPanel;
