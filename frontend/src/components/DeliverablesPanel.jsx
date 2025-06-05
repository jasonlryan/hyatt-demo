function DeliverablesPanel({ deliverables, onOpen }) {
  const names = Object.keys(deliverables);
  return (
    <div className="w-1/2 ml-2 bg-white rounded shadow p-4 h-[500px] overflow-y-auto">
      <h2 className="font-semibold mb-2">Deliverables</h2>
      {names.length === 0 && <p className="text-sm">No deliverables.</p>}
      {names.map((agent) => (
        <div key={agent} className="mb-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">{deliverables[agent].title}</span>
            <button
              className="text-blue-600 text-xs underline"
              onClick={() => onOpen(agent)}
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DeliverablesPanel;
