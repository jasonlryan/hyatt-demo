import React from "react";
import { X } from "lucide-react";

export interface SharedModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const SharedModal: React.FC<SharedModalProps> = ({ isOpen, title, onClose, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button onClick={onClose} className="btn btn-secondary" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default SharedModal;
