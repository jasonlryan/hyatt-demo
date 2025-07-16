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
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>HITL Review Settings</h2>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-secondary mb-4">
            When HITL Review is enabled, each deliverable pauses the workflow.
            Reply <span className="font-medium">"Resume"</span> or{" "}
            <span className="font-medium">"Refine"</span> to continue after
            intermediate deliverables. For the final deliverable, choose{" "}
            <span className="font-medium">"Finalize"</span> or{" "}
            <span className="font-medium">"Refine"</span>.
          </p>

          <div className="card bg-secondary">
            <h3 className="font-medium text-primary mb-2">Review Options:</h3>
            <ul className="list-disc pl-5 text-secondary space-y-2">
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

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HitlReviewModal;
