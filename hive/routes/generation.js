module.exports = function(app, { orchestrationManager }) {
  app.get('/api/orchestrations', (req, res) => {
    try {
      const orchestrations = orchestrationManager.getFrontendOrchestrations();
      res.status(200).json({ orchestrators: orchestrations });
    } catch (error) {
      console.error('Error loading orchestrations:', error);
      res.status(500).json({ message: 'Failed to load orchestrations', error: error.message });
    }
  });

  app.get('/api/orchestration-documentation', (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: 'Missing orchestration id' });
      const fs = require('fs');
      const path = require('path');
      const documentationPaths = {
        hyatt: 'docs/orchestrations/HyattOrchestrator.md',
        builder: 'docs/orchestrations/OrchestrationBuilder.md',
        hive: 'docs/orchestrations/HiveOrchestrator.md',
      };
      const docPath = path.join(__dirname, '..', documentationPaths[id] || `docs/orchestrations/${id}.md`);
      if (!fs.existsSync(docPath)) return res.status(404).json({ message: 'Documentation not found' });
      const markdown = fs.readFileSync(docPath, 'utf8');
      res.status(200).json({ markdown, metadata: { orchestrationId: id, lastModified: fs.statSync(docPath).mtime.toISOString() } });
    } catch (error) {
      console.error('Documentation loading failed:', error);
      res.status(500).json({ message: 'Failed to load documentation' });
    }
  });

  app.post('/api/generate-orchestration', async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const { description } = req.body;
      if (!description) return res.status(400).json({ error: 'Description is required' });
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const systemPrompt = `You are an AI orchestration architect. Based on a description, generate a complete orchestration specification including agents, workflows, configuration, and comprehensive documentation.`;
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-2024-08-06',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create an orchestration for: ${description}` },
        ],
        temperature: 0.3,
      });
      const generated = JSON.parse(response.output_text);
      if (!generated.name || !generated.agents || !generated.workflows) throw new Error('Invalid orchestration structure generated');
      generated.metadata = { generatedAt: new Date().toISOString(), sourceDescription: description, model: process.env.OPENAI_MODEL || 'gpt-4o-2024-08-06' };
      res.status(200).json(generated);
    } catch (error) {
      console.error('Error generating orchestration:', error);
      res.status(500).json({ error: 'Failed to generate orchestration', details: error.message });
    }
  });

  app.post('/api/generate-diagram', (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: 'Missing id' });
      const orchestrations = {
        hyatt: { agents: ['pr_manager', 'research_audience', 'strategic_insight', 'trending_news', 'story_angles'] },
        hive: { agents: ['trend_cultural_analyzer', 'brand_lens', 'visual_prompt_generator', 'modular_elements_recommender', 'brand_qa'] },
      };
      const agentColors = { research: '#2563eb', strategy: '#ec4899', trending: '#22c55e', story: '#7c3aed', 'pr-manager': '#64748b', visual_prompt_generator: '#f59e0b', modular_elements_recommender: '#06b6d4', trend_cultural_analyzer: '#8b5cf6', brand_qa: '#ef4444', brand_lens: '#10b981' };
      const calculateNodePosition = (index, total) => { const centerX = 600; const centerY = 300; const radius = 200; if (total === 1) return { x: centerX, y: centerY }; const angle = (index / total) * Math.PI * 2; return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) }; };
      const generateNodes = (agents) => agents.map((a, i) => ({ id: a, label: a, position: calculateNodePosition(i, agents.length), connectors: [{ id: `${a}-T`, position: 'T' }, { id: `${a}-B`, position: 'B' }, { id: `${a}-L`, position: 'L' }, { id: `${a}-R`, position: 'R' }], style: { border: `2px solid ${agentColors[a] || '#64748b'}` } }));
      const generateSequentialConnections = (agents) => { const connections = []; for (let i = 0; i < agents.length - 1; i++) connections.push(`${agents[i]}:R -> ${agents[i + 1]}:L`); return connections; };
      const parseConnection = (c) => { const [nodeId, connector] = c.split(':'); return { nodeId, connector }; };
      const createEdgeFromString = (str) => { const [from, to] = str.split('->').map((s) => s.trim()); const fromConn = parseConnection(from); const toConn = parseConnection(to); return { id: `${from}-${to}`, from: fromConn, to: toConn, style: { color: '#2563eb', dashed: true, animated: true, strokeWidth: 2 }, type: 'default' }; };
      const generateDiagramFromOrchestration = (orch) => { if (!orch || !Array.isArray(orch.agents) || orch.agents.length === 0) { return { nodes: [{ id: 'empty', label: 'No Agents', position: { x: 600, y: 300 }, connectors: [] }], edges: [] }; } const nodes = generateNodes(orch.agents); const edges = generateSequentialConnections(orch.agents).map(createEdgeFromString); return { nodes, edges }; };
      const orchestration = orchestrations[id];
      if (!orchestration) return res.status(404).json({ message: 'Not found' });
      const diagram = generateDiagramFromOrchestration(orchestration);
      res.status(200).json({ diagram });
    } catch (err) {
      console.error('Diagram generation failed:', err);
      res.status(500).json({ message: 'Failed to generate diagram' });
    }
  });

  app.post('/api/generate-page', async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const { pageType, requirements, features } = req.body;
      const { OpenAI } = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const systemPrompt = `You are a React page generator for the Hive application.
CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing pages
- Ensure accessibility and brand consistency
DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary
PAGE PATTERNS:
- Page container: bg-secondary min-h-screen
- Main content: max-w-7xl mx-auto px-4 py-8
- Page header: text-2xl font-bold text-text-primary mb-6
- Content cards: bg-white rounded-lg shadow-md p-6 border border-border
- Action buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium
Generate a complete React page that:
1. Uses ONLY design tokens for styling
2. Follows established page patterns from the Hive application
3. Includes proper TypeScript interfaces
4. Has proper accessibility features
5. Is responsive and well-structured
6. Integrates with existing shared components when appropriate
Return the page as a complete, ready-to-use React TypeScript file.`;
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-2024-08-06',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a ${pageType} page with features: ${features}. Requirements: ${requirements}` },
        ],
        temperature: 0.3,
      });
      const generatedPage = response.output_text;
      res.status(200).json({ page: generatedPage, metadata: { generatedAt: new Date().toISOString(), pageType, requirements, features } });
    } catch (error) {
      console.error('Error generating page:', error);
      res.status(500).json({ error: 'Failed to generate page', details: error.message });
    }
  });

  app.post('/api/generate-component', async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const { componentType, requirements, orchestrationContext } = req.body;
      const { OpenAI } = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const systemPrompt = `You are a React component generator for the Hive application.
CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing components
- Ensure accessibility and brand consistency
DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary
COMPONENT PATTERNS:
- Buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors
- Cards: bg-white rounded-lg shadow-md p-6 border border-border
- Forms: w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition
- Status indicators: inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success
Generate a complete React component that:
1. Uses ONLY design tokens for styling
2. Follows established patterns from the Hive application
3. Includes proper TypeScript interfaces
4. Has proper accessibility features
5. Includes hover and focus states
6. Is responsive and well-structured
Return the component as a complete, ready-to-use React TypeScript file.`;
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-2024-08-06',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a ${componentType} component for: ${requirements}` },
        ],
        temperature: 0.3,
      });
      const generatedComponent = response.output_text;
      res.status(200).json({ component: generatedComponent, metadata: { generatedAt: new Date().toISOString(), componentType, requirements, orchestrationContext } });
    } catch (error) {
      console.error('Error generating component:', error);
      res.status(500).json({ error: 'Failed to generate component', details: error.message });
    }
  });
};
