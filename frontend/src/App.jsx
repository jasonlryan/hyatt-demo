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
  const [isHitlEnabled, setIsHitlEnabled] = useState(true);

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
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-hyatt-blue">Hyatt GPT Agents System</h1>
          <p className="text-sm text-gray-600">Collaborative AI agents for PR campaign development</p>
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-sm font-medium">HITL Review</label>
          <div 
            onClick={() => setIsHitlEnabled(!isHitlEnabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${isHitlEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isHitlEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex space-x-4 h-[calc(100vh-120px)]">
        
        {/* Left Panel: Progress */}
        <div className="w-1/4 bg-white rounded shadow p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Campaign Status</h2>
            <p className="text-sm text-gray-500">High-level progress updates will appear here.</p>
        </div>

        {/* Center Panel: Form or Conversation */}
        <div className="w-1/2 bg-white rounded shadow p-4">
          {!campaignId ? (
            <CampaignForm onCreate={startCampaign} />
          ) : (
            <ProgressPanel messages={conversation} error={error} />
          )}
        </div>

        {/* Right Panel: Deliverables */}
        <div className="w-1/4">
          <DeliverablesPanel
            deliverables={deliverables}
            onOpen={openModal}
          />
        </div>

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
