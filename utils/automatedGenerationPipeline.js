const fs = require("fs/promises");
const ConfigMaintenanceManager = require("./ConfigMaintenanceManager");
const PostProcessingValidator = require("./postProcessingValidator");
const { FileGenerator } = require("./fileGenerator");

const BASE_URL = process.env.INTERNAL_API_BASE || "http://localhost:3000";

class AutomatedGenerationPipeline {
  static async generateProductionReadyOrchestration(brief) {
    const pipeline = {
      steps: [],
      errors: [],
      warnings: [],
      generatedFiles: [],
    };

    try {
      pipeline.steps.push("Generating orchestration specification...");
      const orchestration = await this.generateOrchestration(brief);

      pipeline.steps.push("Generating missing agents...");
      const agents = await this.generateAgentsWithValidation(orchestration.agents);

      pipeline.steps.push("Generating React page...");
      const page = await this.generatePageWithPostProcessing(orchestration);

      pipeline.steps.push("Generating UI components...");
      const components = await this.generateComponentsWithPostProcessing(orchestration);

      pipeline.steps.push("Validating complete orchestration...");
      const validation = await this.validateCompleteOrchestration({
        orchestration,
        agents,
        page,
        components,
      });

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      pipeline.steps.push("Maintaining system configs...");
      const configMaintenance = await ConfigMaintenanceManager.maintainAllConfigs({
        ...orchestration,
        agents,
        page,
        components,
      });

      if (!configMaintenance.success) {
        throw new Error(`Config maintenance failed: ${configMaintenance.errors.join(", ")}`);
      }

      pipeline.steps.push("Saving orchestration and files...");
      const savedFiles = await this.saveAllFiles({ orchestration, agents, page, components });

      pipeline.generatedFiles = savedFiles;
      pipeline.configMaintenance = configMaintenance;
      pipeline.steps.push("Orchestration generation completed successfully!");

      return {
        success: true,
        pipeline,
        orchestration: { ...orchestration, agents, page, components, files: savedFiles },
      };
    } catch (error) {
      pipeline.errors.push(error.message);
      pipeline.steps.push("Generation failed - rolling back changes...");
      await this.rollbackGeneration(pipeline.generatedFiles);
      return { success: false, pipeline, error: error.message };
    }
  }

  static async generatePageWithPostProcessing(orchestration) {
    const pageResponse = await fetch(`${BASE_URL}/api/generate-page`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageType: "orchestration",
        requirements: orchestration.description,
        features: orchestration.workflows.join(", "),
      }),
    });

    if (!pageResponse.ok) {
      throw new Error(`Page generation failed: ${pageResponse.statusText}`);
    }

    const pageData = await pageResponse.json();
    const postProcessing = await PostProcessingValidator.validateAndFixGeneratedCode(
      pageData.page,
      "page"
    );

    return { ...pageData, page: postProcessing.fixedCode, validation: postProcessing };
  }

  static async validateCompleteOrchestration(generatedOrchestration) {
    const errors = [];
    if (!generatedOrchestration.orchestration.agents || generatedOrchestration.orchestration.agents.length === 0) {
      errors.push("Orchestration must have agents");
    }
    for (const agent of generatedOrchestration.agents) {
      if (!agent.classCode || !agent.promptCode) {
        errors.push(`Agent ${agent.id} missing required code`);
      }
    }
    if (!generatedOrchestration.page.page) {
      errors.push("Generated page is missing");
    }
    return { isValid: errors.length === 0, errors };
  }

  static async rollbackGeneration(generatedFiles) {
    for (const file of generatedFiles) {
      try {
        await fs.unlink(file);
      } catch (error) {
        console.error(`Failed to rollback ${file}:`, error);
      }
    }
  }

  static async generateOrchestration(description) {
    const res = await fetch(`${BASE_URL}/api/generate-orchestration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    if (!res.ok) {
      throw new Error(`Orchestration generation failed: ${res.statusText}`);
    }
    return await res.json();
  }

  static async generateAgentsWithValidation(agentIds = []) {
    if (!agentIds.length) return [];
    const res = await fetch(`${BASE_URL}/api/generate-agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agents: agentIds, orchestrationContext: "pipeline" }),
    });
    if (!res.ok) {
      throw new Error(`Agent generation failed: ${res.statusText}`);
    }
    const data = await res.json();
    return data.generatedAgents || [];
  }

  static async generateComponentsWithPostProcessing(orchestration) {
    const res = await fetch(`${BASE_URL}/api/generate-component`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        componentType: "progress",
        requirements: orchestration.description,
        orchestrationContext: orchestration.name,
      }),
    });
    if (!res.ok) {
      throw new Error(`Component generation failed: ${res.statusText}`);
    }
    const data = await res.json();
    const validation = await PostProcessingValidator.validateAndFixGeneratedCode(
      data.component,
      "component"
    );
    return { ...data, component: validation.fixedCode, validation };
  }

  static async saveAllFiles({ orchestration, page }) {
    const fileGenerator = new FileGenerator();
    const id =
      orchestration.id ||
      orchestration.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const filePath = await fileGenerator.generateOrchestrationPage(
      id,
      orchestration.name,
      page.page
    );
    return [filePath];
  }
}

module.exports = AutomatedGenerationPipeline;
