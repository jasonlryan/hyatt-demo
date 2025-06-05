import { useEffect, useRef, useState } from 'react';
import { Building } from 'lucide-react';
import CampaignForm from './components/CampaignForm.jsx';
import ProgressPanel from './components/ProgressPanel.jsx';
import DeliverablesPanel from './components/DeliverablesPanel.jsx';
import DeliverableModal from './components/DeliverableModal.jsx';
import SidePanel from './components/SidePanel.jsx';

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
      <header className="bg-slate-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center">
            <div className="text-amber-400 mr-3">
              <Building size={36} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
                Hyatt GPT Agents System
              </h1>
              <p className="text-slate-300 text-sm">
                Collaborative AI agents for PR campaign development
              </p>
            </div>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <button 
              className="bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 py-2 px-4 rounded-lg text-white font-medium"
              onClick={handleNewCampaign}
            >
              New Campaign
            </button>
            
            <div className="flex items-center">
              <span className="mr-2 text-slate-300">HITL Review</span>
              <div 
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${isHitlEnabled ? 'bg-green-500' : 'bg-slate-500'}`}
                onClick={() => setIsHitlEnabled(!isHitlEnabled)}
              >
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${isHitlEnabled ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Side Panel */}
      <SidePanel 
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        campaignId={campaignId}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!campaignId ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <CampaignForm onCreate={startCampaign} />
              </div>
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
            <DeliverablesPanel
              deliverables={deliverables}
              onOpen={openModal}
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

export default App;
