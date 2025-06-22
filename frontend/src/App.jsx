import { useEffect, useRef, useState } from 'react';
import CampaignForm from './components/CampaignForm.jsx';
import ProgressPanel from './components/ProgressPanel.jsx';
import DeliverableModal from './components/DeliverableModal.jsx';
import Header from './bolt/Header.jsx';
import SidePanel from './bolt/SidePanel.jsx';
import CampaignDeliverables from './bolt/CampaignDeliverables.jsx';

function App() {
  const [campaignId, setCampaignId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [deliverables, setDeliverables] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState(null);
  const [error, setError] = useState(null);
  const [isHitlEnabled, setIsHitlEnabled] = useState(true);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!campaignId) return;
    
    let failureCount = 0;
    intervalRef.current = setInterval(async () => {
      try {
        const currentId = campaignId;
        const res = await fetch(`/api/campaigns/${currentId}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        
        // Check if campaign ID changed during the request
        if (currentId !== campaignId) return;
        
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
        if (data.status === 'completed' && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } catch {
        failureCount += 1;
        setError('Connection lost');
        if (failureCount >= 3 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
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

  const handleNewCampaign = () => {
    setCampaignId(null);
    setConversation([]);
    setDeliverables({});
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <Header
        onNewCampaign={handleNewCampaign}
        hitlReview={isHitlEnabled}
        onToggleHitl={() => setIsHitlEnabled(!isHitlEnabled)}
      />
      
      {/* Side Panel */}
      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        events={conversation.map((msg, idx) => ({
          id: idx,
          timestamp: formatTimestamp(msg.timestamp),
          description: `${msg.speaker}: ${msg.message}`,
          icon: 'MessageSquare',
        }))}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {!campaignId ? (
              <CampaignForm onCreate={startCampaign} />
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-sm text-slate-600 mb-4">
                    Campaign ID: <span className="font-mono">{campaignId}</span>
                    {error && <span className="text-red-600 ml-2">• {error}</span>}
                  </div>
                </div>
                
                <ProgressPanel
                  messages={conversation}
                  error={error}
                  onViewProgress={() => setIsSidePanelOpen(true)}
                />
              </>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <CampaignDeliverables
              deliverables={Object.entries(deliverables).map(([agent, d]) => ({
                id: agent,
                title: d.title,
                agent,
                status: 'ready',
              }))}
              onViewDetails={(id) => openModal(id)}
            />
          </div>
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

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  if (typeof timestamp === 'string' && timestamp.includes(':')) return timestamp;
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default App;
