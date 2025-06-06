import React from "react";
import { Deliverable } from "../types";
import { X } from "lucide-react";

interface DeliverableModalProps {
  deliverable: Deliverable | null;
  isOpen: boolean;
  onClose: () => void;
}

const DeliverableModal: React.FC<DeliverableModalProps> = ({
  deliverable,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !deliverable) return null;

  const content =
    typeof deliverable.content === "string"
      ? deliverable.content
      : JSON.stringify(deliverable.content, null, 2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            {deliverable.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <pre className="bg-slate-50 p-4 rounded-md text-slate-800 whitespace-pre-wrap font-sans text-sm">
            {content}
          </pre>
        </div>

        <div className="flex justify-end p-4 border-t border-slate-200">
          <button
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliverableModal;
