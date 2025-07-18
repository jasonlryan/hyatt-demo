import React from 'react';

/**
 * Standard breadcrumbs used across orchestrations.
 *
 * Tailwind classes:
 * - `flex items-center space-x-2 text-sm text-gray-600` – breadcrumb list
 * - `text-green-600 hover:text-green-700` – back link
 * - `text-gray-800 font-medium` – current page name
 */
export interface SharedBreadcrumbsProps {
  onBack: () => void;
  current: string;
}

const SharedBreadcrumbs: React.FC<SharedBreadcrumbsProps> = ({ onBack, current }) => (
  <nav className="flex items-center space-x-2 text-sm text-gray-600">
    <button onClick={onBack} className="text-green-600 hover:text-green-700 transition-colors">
      Orchestrations
    </button>
    <span>›</span>
    <span className="text-gray-800 font-medium">{current}</span>
  </nav>
);

export default SharedBreadcrumbs;
