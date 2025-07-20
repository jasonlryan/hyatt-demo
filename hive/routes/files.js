const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  app.get('/api/config/agents', (req, res) => {
    try {
      const configPath = path.join(__dirname, '../agents/agents.config.json');
      if (!fs.existsSync(configPath)) return res.status(404).json({ error: 'Agents configuration file not found' });
      const configData = fs.readFileSync(configPath, 'utf8');
      res.json(JSON.parse(configData));
    } catch (error) {
      console.error('Get agents config error:', error);
      res.status(500).json({ error: 'Failed to retrieve agents configuration', details: error.message });
    }
  });

  app.put('/api/config/agents', (req, res) => {
    try {
      const configPath = path.join(__dirname, '../agents/agents.config.json');
      const updatedConfig = req.body;
      updatedConfig.metadata = { ...updatedConfig.metadata, lastUpdated: new Date().toISOString(), updatedBy: 'user' };
      fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
      res.json({ success: true, message: 'Agents configuration updated successfully', config: updatedConfig });
    } catch (error) {
      console.error('Update agents config error:', error);
      res.status(500).json({ error: 'Failed to update agents configuration', details: error.message });
    }
  });

  app.get('/api/prompts/:filename', (req, res) => {
    try {
      const { filename } = req.params;
      const allowedFiles = [
        'research_audience_gpt.md',
        'trending_news_gpt.md',
        'story_angles_headlines_gpt.md',
        'strategic_insight_gpt.md',
        'pr_manager_gpt.md',
        'visual_prompt_generator.md',
        'modular_elements_recommender.md',
        'trend_cultural_analyzer.md',
        'brand_qa.md',
        'brand_lens.md',
      ];
      if (!allowedFiles.includes(filename)) return res.status(404).json({ error: 'Prompt file not found' });
      const promptPath = path.join(__dirname, '../agents/prompts', filename);
      if (!fs.existsSync(promptPath)) return res.status(404).json({ error: 'Prompt file not found' });
      const promptContent = fs.readFileSync(promptPath, 'utf8');
      res.set('Content-Type', 'text/plain');
      res.send(promptContent);
    } catch (error) {
      console.error('Get prompt file error:', error);
      res.status(500).json({ error: 'Failed to retrieve prompt file', details: error.message });
    }
  });

  app.post('/api/save-css', (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
    try {
      const { css } = req.body;
      if (!css) return res.status(400).json({ message: 'CSS content is required' });
      const cssPath = path.join(process.cwd(), 'frontend', 'src', 'index.css');
      fs.writeFileSync(cssPath, css, 'utf8');
      res.status(200).json({ message: 'CSS saved successfully' });
    } catch (error) {
      console.error('Error saving CSS:', error);
      res.status(500).json({ message: 'Failed to save CSS' });
    }
  });

  app.post('/api/save-orchestration', async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const orchestration = req.body;
      if (!orchestration.name || !orchestration.agents || !orchestration.workflows) return res.status(400).json({ error: 'Invalid orchestration data' });
      const id = orchestration.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const timestamp = Date.now();
      const uniqueId = `${id}-${timestamp}`;
      const newOrchestration = {
        id: uniqueId,
        name: orchestration.name,
        description: orchestration.description,
        enabled: true,
        config: {
          maxConcurrentWorkflows: orchestration.config.maxConcurrentWorkflows || 5,
          timeout: orchestration.config.timeout || 300000,
          retryAttempts: orchestration.config.retryAttempts || 3,
          enableLogging: orchestration.config.enableLogging !== false,
          reactiveFramework: orchestration.config.reactiveFramework || false,
          parallelExecution: orchestration.config.parallelExecution || false,
        },
        workflows: orchestration.workflows,
        agents: orchestration.agents,
        documentation: orchestration.documentation || {},
        metadata: { ...orchestration.metadata, createdBy: 'orchestration-builder', createdAt: new Date().toISOString() },
      };
      if (orchestration.generatedPage) {
        const { FileGenerator } = require('../utils/fileGenerator');
        const fileGenerator = new FileGenerator();
        await fileGenerator.generateOrchestrationPage(uniqueId, orchestration.name, orchestration.generatedPage);
        newOrchestration.metadata.generatedPagePath = `frontend/src/components/orchestrations/generated/${uniqueId}.tsx`;
        newOrchestration.metadata.generatedPageId = uniqueId;
      }
      const orchestrationsDir = path.join(process.cwd(), 'data', 'orchestrations');
      if (!fs.existsSync(orchestrationsDir)) fs.mkdirSync(orchestrationsDir, { recursive: true });
      const filePath = path.join(orchestrationsDir, `${uniqueId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(newOrchestration, null, 2));
      const masterListPath = path.join(orchestrationsDir, 'generated-orchestrations.json');
      let masterList = [];
      if (fs.existsSync(masterListPath)) masterList = JSON.parse(fs.readFileSync(masterListPath, 'utf8'));
      masterList.push(newOrchestration);
      fs.writeFileSync(masterListPath, JSON.stringify(masterList, null, 2));
      if (orchestration.documentation) {
        const docsDir = path.join(process.cwd(), 'hive', 'orchestrations', 'docs');
        if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
        const generateDocumentationMarkdown = (o) => {
          const { name, description, documentation } = o;
          return `# ${name}\n\n## Overview\n\n${documentation.overview || description}`;
        };
        const docContent = generateDocumentationMarkdown(orchestration);
        const docFilePath = path.join(docsDir, `${uniqueId}.md`);
        fs.writeFileSync(docFilePath, docContent);
      }
      res.status(200).json({ success: true, orchestration: newOrchestration, message: 'Orchestration and documentation saved successfully' });
    } catch (error) {
      console.error('Error saving orchestration:', error);
      res.status(500).json({ error: 'Failed to save orchestration', details: error.message });
    }
  });
};
