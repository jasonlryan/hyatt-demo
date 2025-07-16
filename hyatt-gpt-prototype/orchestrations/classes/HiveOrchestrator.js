const BaseOrchestrator = require("./BaseOrchestrator");
const VisualPromptGeneratorAgent = require("../../agents/classes/VisualPromptGeneratorAgent");
const ModularElementsRecommenderAgent = require("../../agents/classes/ModularElementsRecommenderAgent");
const TrendCulturalAnalyzerAgent = require("../../agents/classes/TrendCulturalAnalyzerAgent");
const BrandQAAgent = require("../../agents/classes/BrandQAAgent");

class HiveOrchestrator extends BaseOrchestrator {
  constructor(config = {}) {
    super({
      name: "HiveOrchestrator",
      version: "1.0.0",
      ...config,
    });

    this.visualAgent = new VisualPromptGeneratorAgent();
    this.modularAgent = new ModularElementsRecommenderAgent();
    this.trendAgent = new TrendCulturalAnalyzerAgent();
    this.qaAgent = new BrandQAAgent();
  }

  async loadAgents() {
    try {
      await this.visualAgent.loadSystemPrompt();
      await this.modularAgent.loadSystemPrompt();
      await this.trendAgent.loadSystemPrompt();
      await this.qaAgent.loadSystemPrompt();

      this.agents.set("visual", this.visualAgent);
      this.agents.set("modular", this.modularAgent);
      this.agents.set("trend", this.trendAgent);
      this.agents.set("qa", this.qaAgent);

      this.log("Hive agents loaded successfully");
    } catch (error) {
      this.log(`Failed to load hive agents: ${error.message}`, "error");
      throw error;
    }
  }

  async executeWorkflow(workflow, execution) {
    this.log(`Executing hive workflow: ${workflow.id}`);

    try {
      const testContext = execution.input;

      const basePrompt = await this.visualAgent.generatePrompt(testContext);
      const modulars = await this.modularAgent.recommendElements(
        testContext,
        basePrompt
      );
      const trendInsights = await this.trendAgent.analyzeTrends(testContext);
      const qaResult = await this.qaAgent.reviewPrompt(
        basePrompt,
        modulars,
        trendInsights
      );

      const result = {
        basePrompt,
        modularElements: modulars,
        trendInsights,
        qaResult,
        timestamp: new Date().toISOString(),
      };

      this.log(`Hive workflow completed successfully`);
      return result;
    } catch (error) {
      this.log(`Hive workflow failed: ${error.message}`, "error");
      throw error;
    }
  }

  // Legacy function for backward compatibility
  async runHiveOrchestration(testContext) {
    return await this.startWorkflow("hive_orchestration", testContext);
  }
}

module.exports = HiveOrchestrator;
