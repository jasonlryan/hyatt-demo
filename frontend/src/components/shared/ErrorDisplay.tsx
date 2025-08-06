import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss: () => void;
  className?: string;
}

/**
 * Reusable error display component with dismiss functionality
 * Extracted from common code in orchestration pages
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  className = "mb-6",
}) => {
  if (!error) return null;

  return (
    <div className={`${className} p-4 bg-error-light border border-error rounded-lg`}>
      <p className="text-error font-medium">Error: {error}</p>
      <button
        onClick={onDismiss}
        className="mt-2 text-sm text-error hover:text-error-hover underline"
      >
        Dismiss
      </button>
    </div>
  );
};

export default ErrorDisplay;