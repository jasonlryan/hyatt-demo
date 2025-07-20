const fs = require("fs/promises");
const ConfigMaintenanceManager = require("./ConfigMaintenanceManager");
const PostProcessingValidator = require("./postProcessingValidator");

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
    const pageResponse = await fetch("/api/generate-page", {
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

  // Placeholder methods expected to be implemented elsewhere
  static async generateOrchestration() {
    throw new Error("generateOrchestration not implemented");
  }
  static async generateAgentsWithValidation() {
    return [];
  }
  static async generateComponentsWithPostProcessing() {
    return [];
  }
  static async saveAllFiles() {
    return [];
  }
}

module.exports = AutomatedGenerationPipeline;
