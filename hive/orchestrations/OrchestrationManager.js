const fs = require("fs");
const path = require("path");

class OrchestrationManager {
  constructor() {
    this.orchestrations = new Map();
    this.loadedAgents = new Map(); // Cache for loaded agents
    this.agentsConfig = this.loadAgentsConfig();
    this.orchestrationConfigs = this.generateConfigsFromClasses();
  }

  // Load agents configuration as the single source of truth
  loadAgentsConfig() {
    try {
      const configPath = path.join(__dirname, "..", "agents", "agents.config.json");
      const raw = fs.readFileSync(configPath, "utf8");
      const parsed = JSON.parse(raw);
      return parsed.agents || {};
    } catch (err) {
      console.error("Failed to load agents config:", err.message);
      return {};
    }
  }

  // Reload agents config and regenerate orchestration configs
  reloadAgentsConfig() {
    this.agentsConfig = this.loadAgentsConfig();
    this.orchestrationConfigs = this.generateConfigsFromClasses();
  }

  // Generate configurations from actual orchestration classes
  generateConfigsFromClasses() {
    const configs = {};
    const classesDir = path.join(__dirname, "classes");

    if (fs.existsSync(classesDir)) {
      const classFiles = fs
        .readdirSync(classesDir)
        .filter(
          (file) => file.endsWith(".js") && file !== "BaseOrchestrator.js"
        );

      for (const file of classFiles) {
        try {
          const className = path.basename(file, ".js");
          const config = this.generateConfigFromClass(className);
          if (config) {
            configs[className.toLowerCase()] = config;
          }
        } catch (error) {
          console.warn(`Failed to generate config for ${file}:`, error.message);
        }
      }
    }

    return configs;
  }

  // Generate config from orchestration class
  generateConfigFromClass(className) {
    try {
      const classPath = path.join(__dirname, "classes", `${className}.js`);
      const OrchestratorClass = require(classPath);

      // Extract configuration from the class without instantiating (to avoid API key issues)
      const config = {
        name: this.getNameForClass(className),
        description: this.getDescriptionForClass(className),
        orchestrator: className,
        enabled: true,
        config: {
          maxConcurrentWorkflows: 5,
          timeout: 300000,
          retryAttempts: 3,
          enableLogging: true,
          reactiveFramework: className === "HiveOrchestrator",
          parallelExecution: className === "HiveOrchestrator",
        },
        workflows: this.getWorkflowsForClass(className),
        agents: this.extractAgentsFromClass(null, className),
        hasDiagram: className === "HiveOrchestrator",
        hasDocumentation: true,
        documentationPath: `docs/orchestrations/${className}.md`,
      };

      return config;
    } catch (error) {
      console.error(
        `Failed to generate config for ${className}:`,
        error.message
      );
      return null;
    }
  }

  // Extract agents from orchestration class
  extractAgentsFromClass(instance, className) {
    const agents = {};
    const defaultIds = {
      HyattOrchestrator: [
        "research",
        "trending",
        "story",
        "pr-manager",
        "strategic",
      ],
      HiveOrchestrator: [
        "visual_prompt_generator",
        "modular_elements_recommender",
        "trend_cultural_analyzer",
        "brand_qa",
        "brand_lens",
      ],
    };

    let agentIds = defaultIds[className] ? [...defaultIds[className]] : [];

    // Include additional agents assigned to this orchestration via config
    const orchestrationId = this.mapToFrontendId(className.toLowerCase());
    for (const [id, cfg] of Object.entries(this.agentsConfig || {})) {
      if (cfg.orchestration && cfg.orchestration.toLowerCase() === orchestrationId) {
        if (!agentIds.includes(id)) agentIds.push(id);
      }
    }

    agentIds.forEach((agentId) => {
      if (this.agentsConfig[agentId]) {
        agents[agentId] = {
          class: this.getAgentClassName(agentId),
          model: this.agentsConfig[agentId].model,
          config: this.agentsConfig[agentId],
        };
      } else {
        console.warn(
          `Agent ${agentId} not found in agents config for ${className}`
        );
      }
    });

    return agents;
  }

  // Map agent id to class name
  getAgentClassName(agentId) {
    const mapping = {
      research: "ResearchAudienceAgent",
      trending: "TrendingNewsAgent",
      story: "StoryAnglesAgent",
      "pr-manager": "PRManagerAgent",
      strategic: "StrategicInsightAgent",
      visual_prompt_generator: "VisualPromptGeneratorAgent",
      modular_elements_recommender: "ModularElementsRecommenderAgent",
      trend_cultural_analyzer: "TrendCulturalAnalyzerAgent",
      brand_qa: "BrandQAAgent",
      brand_lens: "BrandLensAgent",
    };
    if (mapping[agentId]) return mapping[agentId];
    return `${this.toPascalCase(agentId)}Agent`;
  }

  toPascalCase(str) {
    return str
      .replace(/[-_]+/g, " ")
      .replace(/(?:^|\s)(\w)/g, (_, c) => c.toUpperCase())
      .replace(/\s+/g, "");
  }

  // Get name for orchestration class
  getNameForClass(className) {
    const names = {
      HyattOrchestrator: "Hyatt Orchestrator",
      HiveOrchestrator: "Hive Orchestrator",
    };
    return names[className] || className;
  }

  // Get description for orchestration class
  getDescriptionForClass(className) {
    const descriptions = {
      HyattOrchestrator:
        "Hyatt orchestration with 5 specialized agents for comprehensive campaign development",
      HiveOrchestrator:
        "Reactive framework orchestration with parallel agent collaboration for visual content generation",
    };
    return descriptions[className] || `Orchestration using ${className}`;
  }

  // Get workflows for orchestration class
  getWorkflowsForClass(className) {
    const workflows = {
      HyattOrchestrator: [
        "hyatt_campaign_development",
        "hyatt_research_analysis",
        "hyatt_strategic_planning",
      ],
      HiveOrchestrator: [
        "hive_visual_generation",
        "hive_trend_analysis",
        "hive_brand_analysis",
      ],
    };
    return workflows[className] || [];
  }

  // Load orchestration configurations from config files (legacy method)
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

  // Generate frontend-compatible orchestration data
  getFrontendOrchestrations() {
    const orchestrations = {};

    for (const [id, config] of Object.entries(this.orchestrationConfigs)) {
      // Map orchestration IDs to frontend-expected names
      const frontendId = this.mapToFrontendId(id);

      orchestrations[frontendId] = {
        id: frontendId,
        name: config.name,
        description: config.description,
        enabled: config.enabled,
        config: config.config,
        workflows: config.workflows,
        agents: Object.keys(config.agents),
        hasDiagram: config.hasDiagram,
        hasDocumentation: config.hasDocumentation,
        documentationPath: config.documentationPath,
      };
    }

    return orchestrations;
  }

  // Map orchestration class names to frontend-expected IDs
  mapToFrontendId(className) {
    const mappings = {
      hyattorchestrator: "hyatt",
      hiveorchestrator: "hive",
    };
    return mappings[className] || className;
  }
}

module.exports = OrchestrationManager;
