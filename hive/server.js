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
async function getOrchestrationForCampaign() { return orchestrationManager.getOrchestration('hyatt'); }

require('./routes/campaigns')(app, { orchestrationManager, existingCampaigns, getOrchestrationForCampaign });
require('./routes/generation')(app, { orchestrationManager });
require('./routes/visual')(app);
require('./routes/files')(app);

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
