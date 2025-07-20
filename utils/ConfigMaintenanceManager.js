const fs = require("fs/promises");
const path = require("path");

class ConfigMaintenanceManager {
  static async maintainAllConfigs(generatedOrchestration) {
    const maintenanceTasks = [
      this.updateServerAllowedFiles,
      this.updateAgentConfigs,
      this.updateOrchestrationConfigs,
      this.updateAPIEndpoints,
      this.updatePromptEndpoints,
    ];

    const results = {
      success: true,
      updatedFiles: [],
      errors: [],
      warnings: [],
    };

    for (const task of maintenanceTasks) {
      try {
        const result = await task.call(this, generatedOrchestration);
        results.updatedFiles.push(...(result.updatedFiles || []));
        if (result.warnings) results.warnings.push(...result.warnings);
      } catch (error) {
        results.errors.push(`Task ${task.name} failed: ${error.message}`);
        results.success = false;
      }
    }

    return results;
  }

  static async updateServerAllowedFiles(generatedOrchestration) {
    const serverPath = path.join(process.cwd(), "hive", "server.js");
    const serverContent = await fs.readFile(serverPath, "utf8");

    const allowedFilesMatch = serverContent.match(
      /const allowedFiles = \[([\s\S]*?)\];/
    );

    if (!allowedFilesMatch) {
      throw new Error("Could not find allowedFiles array in server.js");
    }

    const currentAllowedFiles = allowedFilesMatch[1]
      .split(",")
      .map((file) => file.trim().replace(/"/g, ""))
      .filter((file) => file.length > 0);

    const newPromptFiles = [];
    for (const agent of generatedOrchestration.agents || []) {
      if (agent.promptFile && !currentAllowedFiles.includes(agent.promptFile)) {
        newPromptFiles.push(agent.promptFile);
      }
    }

    if (newPromptFiles.length > 0) {
      const updatedAllowedFiles = [...currentAllowedFiles, ...newPromptFiles];
      const updatedArray = `const allowedFiles = [\n      ${updatedAllowedFiles
        .map((file) => `"${file}"`)
        .join(",\n      ")}\n    ];`;

      const updatedServerContent = serverContent.replace(
        /const allowedFiles = \[[\s\S]*?\];/,
        updatedArray
      );

      await fs.writeFile(serverPath, updatedServerContent);

      return {
        updatedFiles: [serverPath],
        warnings: [
          `Added ${newPromptFiles.length} new prompt files to server allowedFiles`,
        ],
      };
    }

    return { updatedFiles: [], warnings: [] };
  }

  static async updateAgentConfigs(generatedOrchestration) {
    const configPath = path.join(
      process.cwd(),
      "hive",
      "agents",
      "agents.config.json"
    );
    const config = JSON.parse(await fs.readFile(configPath, "utf8"));

    const newAgents = [];
    for (const agent of generatedOrchestration.agents || []) {
      if (!config.agents[agent.id]) {
        config.agents[agent.id] = {
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
        newAgents.push(agent.id);
      }
    }

    if (newAgents.length > 0) {
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      return {
        updatedFiles: [configPath],
        warnings: [`Added ${newAgents.length} new agents to config`],
      };
    }

    return { updatedFiles: [], warnings: [] };
  }

  static async updateOrchestrationConfigs(generatedOrchestration) {
    const configPath = path.join(
      process.cwd(),
      "hive",
      "orchestrations",
      "configs",
      "orchestrations.config.json"
    );

    let config;
    try {
      config = JSON.parse(await fs.readFile(configPath, "utf8"));
    } catch (error) {
      config = { orchestrations: {} };
    }

    if (!config.orchestrations[generatedOrchestration.id]) {
      config.orchestrations[generatedOrchestration.id] = {
        id: generatedOrchestration.id,
        name: generatedOrchestration.name,
        description: generatedOrchestration.description,
        enabled: true,
        config: {
          maxConcurrentWorkflows: 5,
          timeout: 300000,
          retryAttempts: 3,
          enableLogging: true,
        },
        workflows: generatedOrchestration.workflows || [],
        agents: generatedOrchestration.agents || [],
        hasDiagram: generatedOrchestration.hasDiagram || false,
        hasDocumentation: generatedOrchestration.hasDocumentation || false,
        documentationPath: generatedOrchestration.documentationPath,
      };

      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      return {
        updatedFiles: [configPath],
        warnings: [
          `Added new orchestration ${generatedOrchestration.id} to config`,
        ],
      };
    }

    return { updatedFiles: [], warnings: [] };
  }

  static async updateAPIEndpoints() {
    return { updatedFiles: [], warnings: [] };
  }

  static async updatePromptEndpoints() {
    return { updatedFiles: [], warnings: [] };
  }
}

module.exports = ConfigMaintenanceManager;
