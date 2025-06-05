import { useState } from 'react';

function CampaignForm({ onCreate }) {
  const [brief, setBrief] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (brief.trim()) {
      onCreate(brief.trim());
      setBrief('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">Create New Campaign</h2>
      <label className="block mb-2 text-sm font-medium">Campaign Brief</label>
      <textarea
        className="w-full border rounded p-2 mb-4 flex-grow"
        rows="4"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        placeholder="We're launching a new property next quarter..."
      ></textarea>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded self-start"
      >
        Create Campaign
      </button>
    </form>
  );
}

export default CampaignForm;
