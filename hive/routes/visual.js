module.exports = function(app) {
  const { VisualPromptGeneratorAgent } = require('../agents/classes/VisualPromptGeneratorAgent');
  const { ModularElementsRecommenderAgent } = require('../agents/classes/ModularElementsRecommenderAgent');
  const { TrendCulturalAnalyzerAgent } = require('../agents/classes/TrendCulturalAnalyzerAgent');
  const { BrandQAAgent } = require('../agents/classes/BrandQAAgent');

  app.post('/api/hive-orchestrate', async (req, res) => {
    const { campaign, momentType, visualObjective, heroVisualDescription, promptSnippet, modularElements } = req.body;
    if (!campaign || !visualObjective || !heroVisualDescription) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    try {
      const context = { campaign, momentType, visualObjective, heroVisualDescription, promptSnippet, modularElements };
      const visualAgent = new VisualPromptGeneratorAgent();
      const modularAgent = new ModularElementsRecommenderAgent();
      const trendAgent = new TrendCulturalAnalyzerAgent();
      const qaAgent = new BrandQAAgent();
      const baseResult = await visualAgent.generatePrompt(context);
      const modulars = await modularAgent.recommendElements(context, baseResult);
      const trendInsights = await trendAgent.analyzeTrends(context);
      const qaResult = await qaAgent.reviewPrompt(baseResult, modulars, trendInsights);
      res.json({ promptText: baseResult.promptText, imageUrl: baseResult.imageUrl, modulars, trendInsights, qaResult });
    } catch (err) {
      console.error('Hive orchestrate error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/hive-orchestrate-stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const send = (event, payload) => { res.write(`event:${event}\ndata:${JSON.stringify(payload)}\n\n`); };
    const context = {
      campaign: req.query.campaign || 'Capri Sun Pouch Pallet',
      momentType: req.query.momentType || 'Brand Rumor Response / Nostalgia Reassurance',
      visualObjective: req.query.visualObjective || 'Reinforce pouch nostalgia while introducing new bottle',
      heroVisualDescription: req.query.heroVisualDescription || 'Classic Capri Sun pouch in foreground, bottle behind, pop-art style on blue background',
      promptSnippet: req.query.promptSnippet || '',
      modularElements: [],
    };
    try {
      const visualAgent = new VisualPromptGeneratorAgent();
      send('status', { stage: 'loading_prompts' });
      const baseResult = await visualAgent.generatePrompt(context);
      send('progress', { stage: 'base_prompt', baseResult });
      const modularAgent = new ModularElementsRecommenderAgent();
      const modulars = await modularAgent.recommendElements(context, baseResult);
      send('progress', { stage: 'modular_elements', modulars });
      const trendAgent = new TrendCulturalAnalyzerAgent();
      const trendInsights = await trendAgent.analyzeTrends(context);
      send('progress', { stage: 'trend_insights', trendInsights });
      const qaAgent = new BrandQAAgent();
      const qaResult = await qaAgent.reviewPrompt(baseResult, modulars, trendInsights);
      send('progress', { stage: 'brand_qa', qaResult });
      send('complete', { promptText: baseResult.promptText, imageUrl: baseResult.imageUrl, modulars, trendInsights, qaResult });
      res.end();
    } catch (err) {
      send('error', { message: err.message });
      res.end();
    }
  });

  app.post('/api/generate-image', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || prompt.trim().length === 0) return res.status(400).json({ error: 'Prompt is required' });
      const axios = require('axios');
      const response = await axios.post('https://api.openai.com/v1/images/generations', { model: 'gpt-image-1', prompt, n: 1, size: '1024x1024' }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' } });
      const b64 = response.data.data[0].b64_json;
      const imageUrl = `data:image/png;base64,${b64}`;
      res.json({ imageUrl });
    } catch (err) {
      console.error('Image generation error:', err);
      res.status(500).json({ error: err.message });
    }
  });
};
