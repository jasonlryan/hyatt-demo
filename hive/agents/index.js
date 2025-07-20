const fs = require('fs').promises;
const path = require('path');

class AgentRegistry {
  static async loadAllAgents() {
    const agentsDir = path.join(__dirname, 'classes');
    const agentFiles = await fs.readdir(agentsDir);
    const agents = {};
    for (const file of agentFiles) {
      if (file.endsWith('.js') && file !== 'BaseAgent.js') {
        const agentId = file.replace('.js', '').toLowerCase();
        try {
          const AgentClass = require(`./classes/${file}`);
          agents[agentId] = AgentClass;
        } catch (error) {
          console.warn(`Failed to load agent ${agentId}:`, error.message);
        }
      }
    }
    return agents;
  }

  static async registerNewAgent(agentId, agentClass) {
    const OrchestrationManager = require('../orchestrations/OrchestrationManager');
    const manager = new OrchestrationManager();
    await manager.reloadAgentsConfig();
    return {
      registered: true,
      agentId,
      className: agentClass.className,
    };
  }

  static async getExistingAgentIds() {
    const configPath = path.join(__dirname, 'agents.config.json');
    if (!require('fs').existsSync(configPath)) {
      return [];
    }
    const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
    return Object.keys(config.agents || {});
  }
}

module.exports = AgentRegistry;
