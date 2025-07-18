import { useState, useEffect } from 'react';
import { Campaign, ConversationMessage, Deliverable } from '../types';
import { apiFetch } from '../utils/api';
import { extractDeliverables } from '../utils/campaignUtils';

export function useCampaignState(selectedOrchestration: string | null) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [deliverables, setDeliverables] = useState<{ [k: string]: Deliverable }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch('/api/campaigns');
        setCampaigns(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const updateFromApiData = (data: any) => {
    if (data.campaignId && !data.id) data.id = data.campaignId;
    setCampaign(data);
    setConversation(data.conversation || []);
    setDeliverables(extractDeliverables(data));
    if (data.status === 'paused' && data.awaitingReview) setShowReviewPanel(true);
    else setShowReviewPanel(false);
  };

  const selectCampaign = async (campaignId: string) => {
    try {
      setIsLoading(true);
      const data = await apiFetch(`/api/campaigns/${campaignId}`);
      updateFromApiData(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startCampaign = async (brief: string) => {
    if (!selectedOrchestration) {
      setError('Please select an orchestration first');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiFetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignBrief: brief, orchestration: selectedOrchestration }),
      });
      updateFromApiData(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCampaign = () => {
    setCampaign(null);
    setConversation([]);
    setDeliverables({});
    setError(null);
    setShowReviewPanel(false);
  };

  const resumeCampaign = async () => {
    if (!campaign || !campaign.id) return;
    try {
      setIsLoading(true);
      await apiFetch(`/api/campaigns/${campaign.id}/resume`, { method: 'POST' });
      setShowReviewPanel(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refineCampaign = async (instructions: string) => {
    if (!campaign || !campaign.id) return;
    try {
      setIsLoading(true);
      await apiFetch(`/api/campaigns/${campaign.id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions }),
      });
      setShowReviewPanel(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaign,
    campaigns,
    conversation,
    deliverables,
    error,
    isLoading,
    showReviewPanel,
    setError,
    updateFromApiData,
    selectCampaign,
    startCampaign,
    resetCampaign,
    resumeCampaign,
    refineCampaign,
  };
}
