import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CampaignForm from './components/CampaignForm.jsx';
import ProgressPanel from './components/ProgressPanel.jsx';
import DeliverablesPanel from './components/DeliverablesPanel.jsx';
import DeliverableModal from './components/DeliverableModal.jsx';

function App() {
  const [campaignId, setCampaignId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [deliverables, setDeliverables] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!campaignId) return;
    let failureCount = 0;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        failureCount = 0;
        setError(null);
        if (data.conversation) {
          setConversation(data.conversation);
          const delivs = {};
          data.conversation.forEach((msg) => {
            if (msg.deliverable) {
              const title = guessDeliverableTitle(msg.deliverable, msg.speaker);
              const content = formatDeliverable(msg.deliverable);
              delivs[msg.speaker] = { title, content };
            }
          });
          setDeliverables(delivs);
        }
        if (data.status === 'completed') {
          clearInterval(interval);
        }
      } catch {
        failureCount += 1;
        setError('Connection lost');
        if (failureCount >= 3) {
          clearInterval(interval);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [campaignId]);

  const startCampaign = async (brief) => {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignBrief: brief }),
    });
    const data = await res.json();
    if (res.ok) {
      setCampaignId(data.campaignId);
      setConversation([]);
      setDeliverables({});
    } else {
      alert(data.error || 'Failed to create campaign');
    }
  };

  const openModal = (agent) => {
    setModalDeliverable(deliverables[agent]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalDeliverable(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Hyatt GPT Agents System</h1>
      <Link
        to="/plan"
        className="text-teal-700 underline text-sm mb-4 inline-block"
      >
        View Implementation Plan
      </Link>
      {!campaignId && <CampaignForm onCreate={startCampaign} />}
      {campaignId && (
        <div className="mb-4 font-mono">
          Campaign ID: {campaignId}
          {error && (
            <span className="text-red-600 ml-2">{error}</span>
          )}
        </div>
      )}
      <div className="flex">
        <ProgressPanel messages={conversation} error={error} />
        <DeliverablesPanel
          deliverables={deliverables}
          onOpen={openModal}
        />
      </div>
      <DeliverableModal
        show={showModal}
        deliverable={modalDeliverable}
        onClose={closeModal}
      />
    </div>
  );
}

function guessDeliverableTitle(deliv, speaker) {
  if (deliv.analysis) return 'Audience Research';
  if (deliv.trendsAnalysis) return 'Trending News Analysis';
  if (deliv.storyStrategy) return 'Story Angles & Headlines';
  if (deliv.humanTruthAnalysis) return 'Strategic Insight';
  if (deliv.theme || deliv.humanTruth) return 'Integrated Campaign Plan';
  return `${speaker} Deliverable`;
}

function formatDeliverable(deliv) {
  if (typeof deliv === 'string') return deliv;
  return JSON.stringify(deliv, null, 2);
}

export default App;
