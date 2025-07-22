import React from 'react';
import { AudienceResearch } from '../types';
import { X } from 'lucide-react';
import './deliverableStyles.css';

interface AudienceResearchModalProps {
  research: AudienceResearch;
  isOpen: boolean;
  onClose: () => void;
}

const AudienceResearchModal: React.FC<AudienceResearchModalProps> = ({ research, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="deliverable-modal" onClick={onClose}>
      <div
        className="deliverable-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deliverable-modal-header">
          <h2 className="deliverable-modal-title">Audience Research & Insights</h2>
          <button
            onClick={onClose}
            className="deliverable-modal-close"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="deliverable-modal-body space-y-6">
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Primary Demographics:</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Age:</span>
                <span>{research.demographics.age}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Income:</span>
                <span>{research.demographics.income}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Geography:</span>
                <span>{research.demographics.geography}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Lifestyle:</span>
                <span>{research.demographics.lifestyle}</span>
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Psychographics:</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Values:</span>
                <span>{research.psychographics.values}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Motivations:</span>
                <span>{research.psychographics.motivations}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Travel Behaviors:</span>
                <span>{research.psychographics.travelBehaviors}</span>
              </li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Segment Prioritization:</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Primary Targets:</span>
                <span>{research.segmentation.primary}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Secondary Targets:</span>
                <span>{research.segmentation.secondary}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block mr-2">•</span>
                <span className="font-medium mr-2">Tertiary Targets:</span>
                <span>{research.segmentation.tertiary}</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="deliverable-modal-footer">
          <button
            className="deliverable-btn deliverable-btn-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudienceResearchModal;