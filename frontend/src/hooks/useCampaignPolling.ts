import { useEffect, useRef } from 'react';
import { Campaign, Deliverable } from '../types';
import { apiFetch } from '../utils/api';
import { extractDeliverables } from '../utils/campaignUtils';

export function useCampaignPolling(
  campaign: Campaign | null,
  update: (data: Campaign, deliverables: { [k: string]: Deliverable }) => void,
  onError: (msg: string) => void
) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (campaign && campaign.id && campaign.status !== 'completed' && campaign.status !== 'failed') {
      intervalRef.current = window.setInterval(async () => {
        try {
          const data = await apiFetch(`/api/campaigns/${campaign.id}`);
          update(data, extractDeliverables(data));
          if (data.status === 'completed' || data.status === 'failed') {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
          }
        } catch (e: any) {
          onError(e.message || 'Connection lost');
          if (intervalRef.current) window.clearInterval(intervalRef.current);
        }
      }, 3000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [campaign?.id, campaign?.status]);
}
