import React from 'react';
import { AudienceResearch } from '../types';
import { X } from 'lucide-react';

interface AudienceResearchModalProps {
  research: AudienceResearch;
  isOpen: boolean;
  onClose: () => void;
}

const AudienceResearchModal: React.FC<AudienceResearchModalProps> = ({ research, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Audience Research & Insights</h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
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
        
        <div className="flex justify-center space-x-4 p-6 border-t border-slate-200">
          <button 
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors"
            onClick={() => {
              onClose();
            }}
          >
            Resume
          </button>
          <button 
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition-colors"
            onClick={() => {
              onClose();
            }}
          >
            Refine
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudienceResearchModal;