import React from 'react';

/**
 * Resume/Refine action buttons shown during manual review.
 *
 * Tailwind classes:
 * - Buttons use `px-6 py-2` with green and blue background colors
 * - Wrapped in `flex justify-center space-x-4`
 */
export interface SharedActionButtonsProps {
  onResume: () => void;
  onRefine: () => void;
}

const SharedActionButtons: React.FC<SharedActionButtonsProps> = ({ onResume, onRefine }) => (
  <div className="flex justify-center space-x-4">
    <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors font-medium" onClick={onResume}>
      ✅ Resume Campaign
    </button>
    <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium" onClick={onRefine}>
      ✏️ Refine & Retry
    </button>
  </div>
);

export default SharedActionButtons;
