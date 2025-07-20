const fs = require("fs");
const path = require("path");

class OrchestrationManager {
  constructor() {
    this.orchestrations = new Map();
    this.loadedAgents = new Map(); // Cache for loaded agents
    this.orchestrationConfigs = this.loadOrchestrationConfigs();
  }

  // Load orchestration configurations from config files
  loadOrchestrationConfigs() {
    const configs = {};
    const configDir = path.join(__dirname, "configs");

    if (fs.existsSync(configDir)) {
      const configFiles = fs
        .readdirSync(configDir)
        .filter((file) => file.endsWith(".json"));

      for (const file of configFiles) {
        try {
          const configPath = path.join(configDir, file);
          const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
          const orchestrationId = path.basename(file, ".json");
          configs[orchestrationId] = config;
        } catch (error) {
          console.warn(
            `Failed to load orchestration config ${file}:`,
            error.message
          );
        }
      }
    }

    return configs;
  }

  // Get available orchestrations
  getAvailableOrchestrations() {
    return Object.keys(this.orchestrationConfigs);
  }

  // Load agents for a specific orchestration on-demand
  async loadOrchestration(orchestrationId) {
    const config = this.orchestrationConfigs[orchestrationId];

    if (!config) {
      throw new Error(`Orchestration '${orchestrationId}' not found`);
    }

    console.log(`🎯 Loading ${orchestrationId} orchestration...`);

    // Load agents for this orchestration
    const agents = await this.loadAgentsForOrchestration(config.agents);

    // Create orchestration instance
    const OrchestratorClass = await this.getOrchestratorClass(
      config.orchestrator
    );
    const orchestration = new OrchestratorClass({
      ...config,
      agents,
      orchestrationId,
    });

    this.orchestrations.set(orchestrationId, orchestration);

    console.log(
      `✅ ${orchestrationId} orchestration ready with ${agents.size} agents`
    );
    return orchestration;
  }

  // Load agents for a specific orchestration
  async loadAgentsForOrchestration(agentConfigs) {
    const agents = new Map();

    console.log(
      `🤖 Initializing ${Object.keys(agentConfigs).length} agents...`
    );

    for (const [name, config] of Object.entries(agentConfigs)) {
      try {
        // Check if agent is already loaded
        const cacheKey = `${config.class}_${config.model || "default"}`;
        let agent = this.loadedAgents.get(cacheKey);

        if (!agent) {
          // Load agent class dynamically - use original constructor (no config)
          const AgentClass = await this.loadAgentClass(config.class);
          agent = new AgentClass(); // Use original constructor
          await agent.loadSystemPrompt(); // Load prompt only when needed
          this.loadedAgents.set(cacheKey, agent);
        }

        agents.set(name, agent);
        console.log(`  ✅ ${name}: ${config.class} (${agent.model})`);
      } catch (error) {
        console.error(`  ❌ Failed to load agent ${name}:`, error.message);
        throw new Error(
          `Agent ${name} initialization failed: ${error.message}`
        );
      }
    }

    return agents;
  }

  // Dynamically load agent class
  async loadAgentClass(className) {
    const agentPath = path.join(
      __dirname,
      "..",
      "agents",
      "classes",
      `${className}.js`
    );

    if (!fs.existsSync(agentPath)) {
      throw new Error(`Agent class ${className} not found at ${agentPath}`);
    }

    try {
      const AgentClass = require(agentPath);
      return AgentClass.default || AgentClass;
    } catch (error) {
      throw new Error(
        `Failed to load agent class ${className}: ${error.message}`
      );
    }
  }

  // Dynamically load orchestrator class
  async getOrchestratorClass(orchestratorType) {
    const orchestratorPath = path.join(
      __dirname,
      "classes",
      `${orchestratorType}.js`
    );

    if (!fs.existsSync(orchestratorPath)) {
      throw new Error(
        `Orchestrator class ${orchestratorType} not found at ${orchestratorPath}`
      );
    }

    try {
      const OrchestratorClass = require(orchestratorPath);
      return OrchestratorClass.default || OrchestratorClass;
    } catch (error) {
      throw new Error(
        `Failed to load orchestrator class ${orchestratorType}: ${error.message}`
      );
    }
  }

  // Get orchestration (load if not already loaded)
  async getOrchestration(orchestrationId) {
    let orchestration = this.orchestrations.get(orchestrationId);

    if (!orchestration) {
      orchestration = await this.loadOrchestration(orchestrationId);
    }

    return orchestration;
  }

  // Get loaded orchestration without loading
  getLoadedOrchestration(orchestrationId) {
    return this.orchestrations.get(orchestrationId);
  }

  // Unload orchestration to free memory
  unloadOrchestration(orchestrationId) {
    const orchestration = this.orchestrations.get(orchestrationId);
    if (orchestration) {
      // Clean up any resources
      if (orchestration.cleanup) {
        orchestration.cleanup();
      }
      this.orchestrations.delete(orchestrationId);
      console.log(`🗑️ Unloaded ${orchestrationId} orchestration`);
    }
  }

  // Get system status
  getStatus() {
    return {
      loadedOrchestrations: Array.from(this.orchestrations.keys()),
      availableOrchestrations: this.getAvailableOrchestrations(),
      loadedAgents: Array.from(this.loadedAgents.keys()),
      totalAgents: this.loadedAgents.size,
    };
  }
}

module.exports = OrchestrationManager;
