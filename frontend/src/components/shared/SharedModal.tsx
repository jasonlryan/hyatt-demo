import React, { ReactNode } from 'react';

/**
 * Basic modal wrapper used to standardize overlays.
 *
 * Tailwind/custom classes:
 * - overlay: `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`
 * - content: `bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`
 */
export interface SharedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string; // allow overriding width
}

const SharedModal: React.FC<SharedModalProps> = ({ isOpen, onClose, children, maxWidthClass = 'max-w-2xl' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default SharedModal;
