import React from "react";
import { X } from "lucide-react";

interface HitlReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HitlReviewModal: React.FC<HitlReviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="modal bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold modal-heading">
            HITL Review Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-slate-700">
            When HITL Review is enabled, each deliverable pauses the workflow.
            Reply <span className="font-medium">"Resume"</span> or{" "}
            <span className="font-medium">"Refine"</span> to continue after
            intermediate deliverables. For the final deliverable, choose{" "}
            <span className="font-medium">"Finalize"</span> or{" "}
            <span className="font-medium">"Refine"</span>.
          </p>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Review Options:</h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-2">
              <li>
                <span className="font-medium">Resume</span> - Continue to the
                next step without changes
              </li>
              <li>
                <span className="font-medium">Refine</span> - Provide feedback
                to adjust the current deliverable
              </li>
              <li>
                <span className="font-medium">Finalize</span> - Accept the final
                campaign deliverables
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-slate-200">
          <button
            className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-md transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HitlReviewModal;
