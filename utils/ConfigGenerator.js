const fs = require("fs/promises");
const path = require("path");

class ConfigGenerator {
  static async generateOrchestrationConfig(orchestration) {
    const config = {
      id: orchestration.id,
      name: orchestration.name,
      description: orchestration.description,
      enabled: true,
      config: {
        maxConcurrentWorkflows: 5,
        timeout: 300000,
        retryAttempts: 3,
        enableLogging: true,
      },
      workflows: orchestration.workflows || [],
      agents: orchestration.agents || [],
      hasDiagram: orchestration.hasDiagram || false,
      hasDocumentation: orchestration.hasDocumentation || false,
      documentationPath: orchestration.documentationPath,
    };
    return config;
  }

  static async generateAgentConfig(agent) {
    const config = {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      enabled: true,
      model: agent.model || "gpt-4o-2024-08-06",
      temperature: agent.temperature || 0.7,
      maxTokens: agent.maxTokens || 2000,
      timeout: agent.timeout || 45000,
      delay: agent.delay || 4000,
      promptFile: agent.promptFile,
      role: agent.role,
      priority: agent.priority || 1,
    };
    return config;
  }

  static async saveOrchestrationConfig(orchestrationConfig) {
    const configPath = path.join(
      process.cwd(),
      "hive",
      "orchestrations",
      "configs",
      "orchestrations.config.json"
    );
    const existingConfig = await this.loadExistingConfig(configPath);
    existingConfig.orchestrations[orchestrationConfig.id] = orchestrationConfig;
    await fs.writeFile(configPath, JSON.stringify(existingConfig, null, 2));
  }

  static async saveAgentConfig(agentConfig) {
    const configPath = path.join(
      process.cwd(),
      "hive",
      "agents",
      "agents.config.json"
    );
    const existingConfig = await this.loadExistingConfig(configPath);
    existingConfig.agents[agentConfig.id] = agentConfig;
    await fs.writeFile(configPath, JSON.stringify(existingConfig, null, 2));
  }

  static async loadExistingConfig(configPath) {
    try {
      const configData = await fs.readFile(configPath, "utf8");
      return JSON.parse(configData);
    } catch (error) {
      return {
        orchestrations: {},
        agents: {},
      };
    }
  }
}

module.exports = ConfigGenerator;
