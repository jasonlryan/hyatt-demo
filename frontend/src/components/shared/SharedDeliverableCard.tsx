import React from 'react';
import { Deliverable } from '../../types';
import { Eye, Download } from 'lucide-react';
import './sharedStyles.css';

/**
 * Card representation for a single deliverable.
 *
 * Tailwind/custom classes:
 * - `.deliverable-card` – flex card container (see deliverableStyles.css)
 * - `.deliverable-icon-btn` – icon action buttons
 * - `.deliverable-status.{state}` – colored status badge
 */
export interface SharedDeliverableCardProps {
  deliverable: Deliverable;
  onViewDetails: (id: string) => void;
}

const SharedDeliverableCard: React.FC<SharedDeliverableCardProps> = ({ deliverable, onViewDetails }) => {
  const getAgentIcon = (agent: string) => {
    if (agent?.includes('Research')) return '🔍';
    if (agent?.includes('Strategic')) return '🎯';
    if (agent?.includes('Trending')) return '📈';
    if (agent?.includes('Story')) return '📝';
    if (agent?.includes('Visual')) return '🎨';
    if (agent?.includes('PR')) return '📢';
    return '👨‍💼';
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const content = typeof deliverable.content === 'string' ? deliverable.content : JSON.stringify(deliverable.content, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deliverable.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="deliverable-card flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails(deliverable.id)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="deliverable-icon text-2xl">📋</span>
            <h3 className="deliverable-title-text text-lg font-semibold truncate" title={deliverable.title}>
              {deliverable.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="deliverable-agent-icon">{getAgentIcon(deliverable.agent)}</span>
            <span className="truncate" title={deliverable.agent}>
              {deliverable.agent || 'AI Agent'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-2">
          <span className={`deliverable-status ${deliverable.status} text-xs mb-1`}>
            {deliverable.status === 'ready' ? 'Ready' : deliverable.status === 'reviewed' ? 'Reviewed' : 'Pending'}
          </span>
          <div className="flex gap-2 mt-1">
            <button className="deliverable-icon-btn" onClick={handleDownload} title="Download" tabIndex={0} aria-label="Download Deliverable">
              <Download size={18} />
            </button>
            <button
              className="deliverable-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(deliverable.id);
              }}
              title="View Details"
              tabIndex={0}
              aria-label="View Details"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedDeliverableCard;
