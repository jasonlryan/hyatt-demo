import { useEffect, useRef, useState } from 'react';
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
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!campaignId) return;
    intervalRef.current = setInterval(() => {
      const currentId = campaignId;
      fetch(`/api/campaigns/${currentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (currentId !== campaignId) return;
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
          if (data.status === 'completed' && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        })
        .catch(() => {});
    }, 3000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
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
      {!campaignId && <CampaignForm onCreate={startCampaign} />}
      {campaignId && (
        <div className="mb-4 font-mono">Campaign ID: {campaignId}</div>
      )}
      <div className="flex">
        <ProgressPanel messages={conversation} />
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
