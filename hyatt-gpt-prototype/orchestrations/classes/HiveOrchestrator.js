const BaseOrchestrator = require("./BaseOrchestrator");
const VisualPromptGeneratorAgent = require("../../agents/classes/VisualPromptGeneratorAgent");
const ModularElementsRecommenderAgent = require("../../agents/classes/ModularElementsRecommenderAgent");
const TrendCulturalAnalyzerAgent = require("../../agents/classes/TrendCulturalAnalyzerAgent");
const BrandQAAgent = require("../../agents/classes/BrandQAAgent");
const BrandLensAgent = require("../../agents/classes/BrandLensAgent");

class HiveOrchestrator extends BaseOrchestrator {
  constructor(config = {}) {
    super({
      name: "HiveOrchestrator",
      version: "2.0.0",
      ...config,
    });

    this.visualAgent = new VisualPromptGeneratorAgent();
    this.modularAgent = new ModularElementsRecommenderAgent();
    this.trendAgent = new TrendCulturalAnalyzerAgent();
    this.qaAgent = new BrandQAAgent();
    this.brandLensAgent = new BrandLensAgent();
  }

  async loadAgents() {
    try {
      await this.visualAgent.loadSystemPrompt();
      await this.modularAgent.loadSystemPrompt();
      await this.trendAgent.loadSystemPrompt();
      await this.qaAgent.loadSystemPrompt();
      await this.brandLensAgent.loadSystemPrompt();

      this.agents.set("visual", this.visualAgent);
      this.agents.set("modular", this.modularAgent);
      this.agents.set("trend", this.trendAgent);
      this.agents.set("qa", this.qaAgent);
      this.agents.set("brand_lens", this.brandLensAgent);

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

      // Step 1: Trend Analysis
      this.log("Step 1: Analyzing cultural trends...");
      const trendInsights = await this.trendAgent.analyzeTrends(testContext);

      // Step 2: Brand Lens
      this.log("Step 2: Applying brand lens...");
      const brandLens = await this.brandLensAgent.analyzeBrandPerspective(
        trendInsights,
        testContext
      );

      // Step 3: Visual Prompt Generation
      this.log("Step 3: Generating visual prompts...");
      const basePrompt = await this.visualAgent.generatePrompt(testContext);

      // Step 4: Modular Elements
      this.log("Step 4: Creating modular elements...");
      const modulars = await this.modularAgent.recommendElements(
        testContext,
        basePrompt,
        trendInsights,
        brandLens
      );

      // Step 5: QA Review
      this.log("Step 5: Quality assurance review...");
      const qaResult = await this.qaAgent.reviewPrompt(
        basePrompt,
        modulars,
        trendInsights,
        brandLens
      );

      const result = {
        trendInsights,
        brandLens,
        basePrompt,
        modularElements: modulars,
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
