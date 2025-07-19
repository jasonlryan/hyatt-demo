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
  <nav className="flex items-center space-x-2 text-sm text-text-secondary">
    <button onClick={onBack} className="text-success hover:text-success-hover transition-colors">
      Orchestrations
    </button>
    <span>›</span>
    <span className="text-text-primary font-medium">{current}</span>
  </nav>
);

export default SharedBreadcrumbs;
