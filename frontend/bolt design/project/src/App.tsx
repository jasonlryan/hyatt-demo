import React, { useState } from 'react';
import Header from './components/Header';
import SidePanel from './components/SidePanel';
import CampaignProgress from './components/CampaignProgress';
import AgentCollaboration from './components/AgentCollaboration';
import CampaignDeliverables from './components/CampaignDeliverables';
import AudienceResearchModal from './components/AudienceResearchModal';
import RefineInputModal from './components/RefineInputModal';
import ReviewPanel from './components/ReviewPanel';
import HitlReviewModal from './components/HitlReviewModal';
import { mockCampaign, mockAgents, mockAudienceResearch } from './data/mockData';

function App() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [hitlReview, setHitlReview] = useState(true);
  const [showReviewPanel, setShowReviewPanel] = useState(true);

  const handleViewDetails = (id: string) => {
    setIsResearchModalOpen(true);
  };

  const handleNewCampaign = () => {
    alert('Starting a new campaign...');
  };

  const handleResume = () => {
    setShowReviewPanel(false);
    alert('Campaign resumed. Moving to the next phase.');
  };

  const handleRefine = () => {
    setIsRefineModalOpen(true);
  };

  const handleSubmitRefinement = (instructions: string) => {
    console.log('Refinement instructions:', instructions);
    setShowReviewPanel(false);
    alert('Refinement instructions submitted. Adjusting research phase...');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header 
        onNewCampaign={handleNewCampaign} 
        hitlReview={hitlReview} 
        onToggleHitl={() => {
          setHitlReview(!hitlReview);
          if (!hitlReview) {
            setIsHitlModalOpen(true);
          }
        }} 
      />
      
      <SidePanel 
        events={mockCampaign.events}
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CampaignProgress 
              campaign={mockCampaign}
              onViewProgress={() => setIsSidePanelOpen(true)}
            />
            
            <AgentCollaboration 
              messages={mockCampaign.messages}
              agents={mockAgents}
            />
            
            <ReviewPanel 
              isVisible={showReviewPanel}
              onResume={handleResume}
              onRefine={handleRefine}
            />
          </div>
          
          <div className="lg:col-span-1">
            <CampaignDeliverables 
              deliverables={mockCampaign.deliverables}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>
      
      <AudienceResearchModal 
        research={mockAudienceResearch}
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />
      
      <RefineInputModal 
        isOpen={isRefineModalOpen}
        onClose={() => setIsRefineModalOpen(false)}
        onSubmit={handleSubmitRefinement}
      />
      
      <HitlReviewModal 
        isOpen={isHitlModalOpen}
        onClose={() => setIsHitlModalOpen(false)}
      />
    </div>
  );
}

export default App;