import React, { useState } from 'react';

export interface HiveMomentFormProps {
  onSubmit: (context: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const HiveMomentForm: React.FC<HiveMomentFormProps> = ({ onSubmit, isLoading, onCancel }) => {
  const [context, setContext] = useState({
    campaign: '',
    momentType: 'campaign',
    visualObjective: '',
    heroVisualDescription: '',
    promptSnippet: '',
    modularElements: [] as string[],
  });

  const handleChange = (field: string, value: any) => {
    setContext((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (context.campaign.trim()) {
      onSubmit(context);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Start Hive Orchestration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="campaign" className="block text-sm font-medium text-text-secondary mb-1">
            Campaign / Moment Context
          </label>
          <textarea
            id="campaign"
            value={context.campaign}
            onChange={(e) => handleChange('campaign', e.target.value)}
            className="w-full h-24 p-3 border border-border rounded-md"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="momentType" className="block text-sm font-medium text-text-secondary mb-1">
            Moment Type
          </label>
          <select
            id="momentType"
            value={context.momentType}
            onChange={(e) => handleChange('momentType', e.target.value)}
            className="w-full p-3 border border-border rounded-md"
            disabled={isLoading}
          >
            <option value="campaign">Campaign</option>
            <option value="launch">Launch</option>
            <option value="event">Event</option>
            <option value="promotion">Promotion</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>
        <div>
          <label htmlFor="visualObjective" className="block text-sm font-medium text-text-secondary mb-1">
            Visual Objective
          </label>
          <textarea
            id="visualObjective"
            value={context.visualObjective}
            onChange={(e) => handleChange('visualObjective', e.target.value)}
            className="w-full h-24 p-3 border border-border rounded-md"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="heroVisualDescription" className="block text-sm font-medium text-text-secondary mb-1">
            Hero Visual Description
          </label>
          <textarea
            id="heroVisualDescription"
            value={context.heroVisualDescription}
            onChange={(e) => handleChange('heroVisualDescription', e.target.value)}
            className="w-full h-24 p-3 border border-border rounded-md"
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-secondary text-text-primary rounded-md"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md"
            disabled={isLoading || !context.campaign.trim()}
          >
            {isLoading ? 'Starting...' : 'Start Orchestration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HiveMomentForm;
