function DeliverablesPanel({ deliverables, onOpen }) {
  return (
    <div className="bg-white rounded shadow p-4 h-full">
      <h2 className="text-lg font-semibold mb-2">Deliverables</h2>
      {Object.keys(deliverables).length === 0 ? (
        <p className="text-sm text-gray-500">Deliverables will appear here.</p>
      ) : (
        <ul className="space-y-2">
          {Object.entries(deliverables).map(([agent, deliv]) => (
            <li
              key={agent}
              onClick={() => onOpen(agent)}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              {deliv.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeliverablesPanel;
