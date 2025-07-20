module.exports = function(app, { orchestrationManager, existingCampaigns, getOrchestrationForCampaign }) {
  // Create a new campaign
  app.post('/api/campaigns', async (req, res) => {
    try {
      const { campaignBrief, orchestrationId = 'hyatt' } = req.body;
      if (!campaignBrief || campaignBrief.trim().length === 0) {
        return res.status(400).json({ error: 'Campaign brief is required' });
      }
      console.log(
        `Creating new campaign with ${orchestrationId} orchestration, brief:`,
        campaignBrief.substring(0, 100) + '...'
      );
      const orchestration = await orchestrationManager.getOrchestration(orchestrationId);
      const campaign = await orchestration.startCampaign(campaignBrief);
      res.status(201).json(campaign);
    } catch (error) {
      console.error('Campaign creation error:', error);
      res.status(500).json({ error: 'Failed to create campaign', details: error.message });
    }
  });

  // Get campaign status
  app.get('/api/campaigns/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let campaign = existingCampaigns.find((c) => c.id === id);
      if (!campaign) {
        for (const orchestrationId of orchestrationManager.getAvailableOrchestrations()) {
          const orchestration = orchestrationManager.getLoadedOrchestration(orchestrationId);
          if (orchestration) {
            campaign = orchestration.getCampaign(id);
            if (campaign) break;
          }
        }
      }
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
      res.json(campaign);
    } catch (error) {
      console.error('Get campaign error:', error);
      res.status(500).json({ error: 'Failed to retrieve campaign', details: error.message });
    }
  });

  // Helper to fetch campaign from orchestrator
  async function loadCampaign(id) {
    const orchestrator = await getOrchestrationForCampaign(id);
    return orchestrator.getCampaign(id);
  }

  app.get('/api/campaigns/:id/research', async (req, res) => {
    try {
      const campaign = await loadCampaign(req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
      if (!campaign.phases.research) {
        return res.status(202).json({ message: 'Research phase not yet completed', status: campaign.status });
      }
      res.json(campaign.phases.research);
    } catch (error) {
      console.error('Get research error:', error);
      res.status(500).json({ error: 'Failed to retrieve research results', details: error.message });
    }
  });

  app.get('/api/campaigns/:id/trending', async (req, res) => {
    try {
      const campaign = await loadCampaign(req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
      if (!campaign.phases.trending) {
        return res.status(202).json({ message: 'Trending phase not yet completed', status: campaign.status });
      }
      res.json(campaign.phases.trending);
    } catch (error) {
      console.error('Get trending error:', error);
      res.status(500).json({ error: 'Failed to retrieve trending results', details: error.message });
    }
  });

  app.get('/api/campaigns/:id/story', async (req, res) => {
    try {
      const campaign = await loadCampaign(req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
      if (!campaign.phases.story) {
        return res.status(202).json({ message: 'Story phase not yet completed', status: campaign.status });
      }
      res.json(campaign.phases.story);
    } catch (error) {
      console.error('Get story error:', error);
      res.status(500).json({ error: 'Failed to retrieve story results', details: error.message });
    }
  });

  app.get('/api/campaigns/:id/final', async (req, res) => {
    try {
      const campaign = await loadCampaign(req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
      if (campaign.status !== 'completed') {
        return res.status(202).json({ message: 'Campaign not yet completed', status: campaign.status });
      }
      res.json({ campaignId: campaign.id, status: campaign.status, campaignPlan: campaign.phases.collaborative.finalStrategy });
    } catch (error) {
      console.error('Get final campaign error:', error);
      res.status(500).json({ error: 'Failed to retrieve final campaign', details: error.message });
    }
  });

  app.get('/api/campaigns', async (req, res) => {
    try {
      let allCampaigns = [...existingCampaigns];
      for (const orchestrationId of orchestrationManager.getAvailableOrchestrations()) {
        const orchestration = orchestrationManager.getLoadedOrchestration(orchestrationId);
        if (orchestration) {
          const active = orchestration.getAllCampaigns();
          allCampaigns = allCampaigns.concat(active);
        }
      }
      const unique = allCampaigns.filter((c, i, self) => i === self.findIndex((o) => o.id === c.id));
      res.json(unique);
    } catch (error) {
      console.error('List campaigns error:', error);
      res.status(500).json({ error: 'Failed to list campaigns', details: error.message });
    }
  });

  app.delete('/api/campaigns/:id', async (req, res) => {
    try {
      const { id } = req.params;
      for (const orchestrationId of orchestrationManager.getAvailableOrchestrations()) {
        const orchestration = orchestrationManager.getLoadedOrchestration(orchestrationId);
        if (orchestration) {
          const cancelled = orchestration.cancelCampaign(id);
          if (cancelled) return res.json({ status: 'cancelled', campaignId: id });
        }
      }
      return res.status(404).json({ error: 'Campaign not found' });
    } catch (error) {
      console.error('Cancel campaign error:', error);
      res.status(500).json({ error: 'Failed to cancel campaign', details: error.message });
    }
  });

  app.post('/api/campaigns/:id/resume', async (req, res) => {
    try {
      const { id } = req.params;
      for (const orchestrationId of orchestrationManager.getAvailableOrchestrations()) {
        const orchestration = orchestrationManager.getLoadedOrchestration(orchestrationId);
        if (orchestration) {
          const resumed = orchestration.resumeCampaign(id);
          if (resumed) return res.json({ status: 'resumed', campaignId: id });
        }
      }
      return res.status(400).json({ error: 'Unable to resume campaign' });
    } catch (error) {
      console.error('Resume campaign error:', error);
      res.status(500).json({ error: 'Failed to resume campaign', details: error.message });
    }
  });

  app.post('/api/campaigns/:id/refine', async (req, res) => {
    try {
      const { id } = req.params;
      const { instructions } = req.body;
      for (const orchestrationId of orchestrationManager.getAvailableOrchestrations()) {
        const orchestration = orchestrationManager.getLoadedOrchestration(orchestrationId);
        if (orchestration) {
          const refined = orchestration.refineCampaign(id, instructions || '');
          if (refined) return res.json({ status: 'refining', campaignId: id });
        }
      }
      return res.status(400).json({ error: 'Unable to refine campaign' });
    } catch (error) {
      console.error('Refine campaign error:', error);
      res.status(500).json({ error: 'Failed to refine campaign', details: error.message });
    }
  });
};
