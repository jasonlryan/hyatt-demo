import React from "react";
import { Deliverable } from "../types";
import { X, Download, Check, Edit } from "lucide-react";
import DeliverableContent from "./DeliverableContent";
import "./deliverableStyles.css";

interface DeliverableModalProps {
  deliverable: Deliverable | null;
  isOpen: boolean;
  onClose: () => void;
  onResume?: () => void;
  onRefine?: () => void;
}

const DeliverableModal: React.FC<DeliverableModalProps> = ({
  deliverable,
  isOpen,
  onClose,
  onResume,
  onRefine,
}) => {
  if (!isOpen || !deliverable) return null;

  const handleDownload = () => {
    const imageUrl =
      deliverable.type === "image" &&
      typeof deliverable.content === "object" &&
      (deliverable.content as any).imageUrl
        ? (deliverable.content as any).imageUrl
        : null;

    if (imageUrl) {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `${deliverable.title.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const content =
      typeof deliverable.content === "string"
        ? deliverable.content
        : JSON.stringify(deliverable.content, null, 2);

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deliverable.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="deliverable-modal" onClick={onClose}>
      <div
        className="deliverable-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deliverable-modal-header">
          <h2 className="deliverable-modal-title">{deliverable.title}</h2>
          <button
            onClick={onClose}
            className="deliverable-modal-close"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="deliverable-modal-body space-y-4">
          {deliverable.type === 'image' &&
          typeof deliverable.content === 'object' &&
          (deliverable.content as any).imageUrl ? (
            <img
              src={(deliverable.content as any).imageUrl}
              alt={deliverable.title}
              className="w-full h-auto object-contain rounded-md border border-border"
            />
          ) : null}
          <DeliverableContent content={deliverable.content} />
        </div>

        <div className="deliverable-modal-footer">
          <button
            className="deliverable-icon-btn"
            onClick={handleDownload}
            title="Download"
            aria-label="Download Deliverable"
          >
            <Download size={18} />
          </button>
          {onResume && (
            <button
              className="deliverable-btn deliverable-btn-primary"
              onClick={onResume}
            >
              <Check size={16} /> Resume Campaign
            </button>
          )}
          {onRefine && (
            <button
              className="deliverable-btn deliverable-btn-secondary"
              onClick={onRefine}
            >
              <Edit size={16} /> Refine & Retry
            </button>
          )}
          {!onResume && !onRefine && (
            <button
              className="deliverable-btn deliverable-btn-primary"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliverableModal;
