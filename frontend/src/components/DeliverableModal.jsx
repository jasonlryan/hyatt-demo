function DeliverableModal({ show, deliverable, onClose }) {
  if (!show || !deliverable) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-2xl max-h-[80vh] overflow-y-auto">
        <button className="mb-4 text-sm text-red-600" onClick={onClose}>
          Close
        </button>
        <h3 className="font-semibold mb-2">{deliverable.title}</h3>
        <pre className="whitespace-pre-wrap text-sm">
{deliverable.content}
        </pre>
      </div>
    </div>
  );
}

export default DeliverableModal;
