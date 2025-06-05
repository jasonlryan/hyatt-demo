function ProgressPanel({ messages, error }) {
  return (
    <div className="w-1/2 mr-2 bg-white rounded shadow p-4 h-[500px] overflow-y-auto">
      <h2 className="font-semibold mb-2">Progress</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {messages.length === 0 && <p className="text-sm">No updates yet.</p>}
      {messages.map((m, idx) => (
        <div key={idx} className="mb-2 text-sm">
          <span className="font-semibold mr-1">{m.speaker}:</span>
          {m.message}
        </div>
      ))}
    </div>
  );
}

export default ProgressPanel;
