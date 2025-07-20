import React from 'react';
import { Deliverable } from '../../types';
import { Eye } from 'lucide-react';

interface ImageDeliverableCardProps {
  deliverable: Deliverable;
  onViewDetails: (id: string) => void;
}

const ImageDeliverableCard: React.FC<ImageDeliverableCardProps> = ({ deliverable, onViewDetails }) => {
  const hasImage = typeof deliverable.content === 'object' && (deliverable.content as any).imageUrl;
  const imageUrl = hasImage ? (deliverable.content as any).imageUrl : null;

  return (
    <div
      className="deliverable-card flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onViewDetails(deliverable.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="deliverable-icon text-2xl">🖼️</span>
            <h3 className="deliverable-title-text text-lg font-semibold truncate" title={deliverable.title}>
              {deliverable.title}
            </h3>
          </div>
          <div className="text-sm text-gray-500 truncate" title={deliverable.agent}>
            {deliverable.agent}
          </div>
        </div>
        <button
          className="deliverable-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(deliverable.id);
          }}
          title="View Details"
          aria-label="View Details"
        >
          <Eye size={18} />
        </button>
      </div>
      {imageUrl && (
        <img src={imageUrl} alt={deliverable.title} className="w-full h-32 object-cover rounded-lg border border-border" />
      )}
    </div>
  );
};

export default ImageDeliverableCard;
