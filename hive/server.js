require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const OrchestrationManager = require('./orchestrations/OrchestrationManager');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) app.use(express.static(frontendDist));
app.use(express.static('public'));

const orchestrationManager = new OrchestrationManager();

function loadCampaignsFromFiles() {
  const campaigns = [];
  const campaignsDir = path.join(__dirname, 'data');
  if (fs.existsSync(campaignsDir)) {
    const files = fs.readdirSync(campaignsDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      try {
        campaigns.push(JSON.parse(fs.readFileSync(path.join(campaignsDir, file), 'utf8')));
      } catch (e) {
        console.warn(`Failed to load campaign from ${file}:`, e.message);
      }
    }
  }
  return campaigns;
}
const existingCampaigns = loadCampaignsFromFiles();
async function getOrchestrationForWorkflow(workflowId, requestContext = {}) { 
  // Try to determine orchestration type from workflow context
  if (!workflowId) {
    return orchestrationManager.getOrchestration('hyatt'); // default
  }
  
  // Check if request context indicates specific orchestration
  if (requestContext.orchestrationType) {
    return orchestrationManager.getOrchestration(requestContext.orchestrationType);
  }
  
  // Check if the workflow file has orchestration type stored
  try {
    const fs = require('fs');
    const path = require('path');
    // Try different naming conventions: campaign_id.json or spark_id.json
    const possiblePaths = [
      path.join(__dirname, 'workflows', `${workflowId}.json`),
      path.join(__dirname, 'campaigns', `campaign_${workflowId}.json`), // legacy campaigns
      path.join(__dirname, 'sparks', `spark_${workflowId}.json`), // hive sparks
    ];
    
    for (const workflowPath of possiblePaths) {
      if (fs.existsSync(workflowPath)) {
        const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
        if (workflowData.orchestrationType) {
          return orchestrationManager.getOrchestration(workflowData.orchestrationType);
        }
      }
    }
  } catch (error) {
    console.warn('Could not determine orchestration type from workflow file:', error.message);
  }
  
  // Default to hyatt for existing workflows
  return orchestrationManager.getOrchestration('hyatt');
}

// Keep backward compatibility
async function getOrchestrationForCampaign(campaignId, requestContext = {}) {
  return getOrchestrationForWorkflow(campaignId, requestContext);
}

require('./routes/campaigns')(app, { orchestrationManager, existingCampaigns, getOrchestrationForCampaign });
require('./routes/generation')(app, { orchestrationManager });
require('./routes/visual')(app);
require('./routes/files')(app);
require('./routes/hitl')(app, { orchestrationManager });

// PeakMetrics API routes
const peakMetricsRouter = require('./routes/peakmetrics');
app.use('/api/peakmetrics', peakMetricsRouter);

app.get('/api/manual-review', (req, res) => res.json({ enabled: true }));
app.post('/api/manual-review', (req, res) => res.json({ enabled: !!req.body.enabled }));
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'Hive Agents System', orchestrations: orchestrationManager.getStatus() });
});

app.get('/', (req, res) => {
  const distIndex = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
  if (fs.existsSync(distIndex)) return res.sendFile(distIndex);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found', path: req.path }));

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`🚀 Hive Agent system running on port ${port}`));
}

module.exports = app;
