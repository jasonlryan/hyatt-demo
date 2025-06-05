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
    <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow">
      <label className="block mb-2 font-semibold">Campaign Brief</label>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows="4"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Campaign
      </button>
    </form>
  );
}

export default CampaignForm;
