import React, { useState } from 'react';

export interface SharedRefineInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (instructions: string) => void;
}

const SharedRefineInputModal: React.FC<SharedRefineInputModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(instructions);
    setInstructions('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Enter refinement instructions:</h2>
          
          <textarea
            className="w-full h-32 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Provide specific instructions for refining the research..."
          ></textarea>
        </div>
        
        <div className="flex justify-center space-x-4 p-4">
          <button 
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition-colors"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button 
            className="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-md transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedRefineInputModal;