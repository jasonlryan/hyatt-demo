const BaseOrchestrator = require("./BaseOrchestrator");
const PRManagerAgent = require("../../agents/classes/PRManagerAgent");
const TrendingNewsAgent = require("../../agents/classes/TrendingNewsAgent");
const StrategicInsightAgent = require("../../agents/classes/StrategicInsightAgent");
const StoryAnglesAgent = require("../../agents/classes/StoryAnglesAgent");
const BrandLensAgent = require("../../agents/classes/BrandLensAgent");
const VisualPromptGeneratorAgent = require("../../agents/classes/VisualPromptGeneratorAgent");
const BrandQAAgent = require("../../agents/classes/BrandQAAgent");

class HiveOrchestrator extends BaseOrchestrator {
  constructor(config = {}) {
    super({
      name: "HiveOrchestrator",
      version: "2.0.0",
      ...config,
    });

    this.prManager = new PRManagerAgent();
    this.trendingAgent = new TrendingNewsAgent();
    this.strategicAgent = new StrategicInsightAgent();
    this.storyAgent = new StoryAnglesAgent();
    this.brandLensAgent = new BrandLensAgent();
    this.visualAgent = new VisualPromptGeneratorAgent();
    this.qaAgent = new BrandQAAgent();
  }

  async loadAgents() {
    try {
      await this.prManager.loadSystemPrompt();
      await this.trendingAgent.loadSystemPrompt();
      await this.strategicAgent.loadSystemPrompt();
      await this.storyAgent.loadSystemPrompt();
      await this.brandLensAgent.loadSystemPrompt();
      await this.visualAgent.loadSystemPrompt();
      await this.qaAgent.loadSystemPrompt();

      this.agents.set("pr-manager", this.prManager);
      this.agents.set("trending", this.trendingAgent);
      this.agents.set("strategic", this.strategicAgent);
      this.agents.set("story", this.storyAgent);
      this.agents.set("brand_lens", this.brandLensAgent);
      this.agents.set("visual_prompt_generator", this.visualAgent);
      this.agents.set("brand_qa", this.qaAgent);

      this.log("Hive agents loaded successfully");
    } catch (error) {
      this.log(`Failed to load hive agents: ${error.message}`, "error");
      throw error;
    }
  }

  async executeWorkflow(workflow, execution) {
    this.log(`Executing hive workflow: ${workflow.id}`);

    try {
      const context = execution.input;

      // Step 1: PR Manager introduction
      this.log("Step 1: Establishing strategy...");
      const prIntro = await this.prManager.generateCampaignIntroduction(
        context.moment || context.campaign,
        context
      );

      // Step 2: Moment analysis
      this.log("Step 2: Analyzing moment...");
      const trendInsights = await this.trendingAgent.analyzeTrends(
        context.moment || context.campaign,
        null,
        null
      );

      // Step 3: Strategic insight
      this.log("Step 3: Discovering opportunities...");
      const strategicInsights = await this.strategicAgent.discoverHumanTruth(
        trendInsights,
        context
      );

      // Step 4: Story angle generation
      this.log("Step 4: Generating story angles...");
      const storyAngles = await this.storyAgent.generateStoryAngles(
        context.moment || context.campaign,
        strategicInsights,
        trendInsights
      );

      // Step 5: Brand lens
      this.log("Step 5: Applying brand lens...");
      const brandLens = await this.brandLensAgent.analyzeBrandPerspective(
        storyAngles,
        context
      );

      // Step 6: Key visual creation
      this.log("Step 6: Creating key visual...");
      const visual = await this.visualAgent.generatePrompt({
        campaign: context.moment || context.campaign,
        momentType: context.momentType,
        visualObjective: brandLens.brandPositioning,
        heroVisualDescription: brandLens.brandVoice,
      });

      // Step 7: Brand QA
      this.log("Step 7: Brand QA review...");
      const qaResult = await this.qaAgent.reviewPrompt(
        visual,
        null,
        trendInsights,
        brandLens
      );

      const result = {
        prIntro,
        trendInsights,
        strategicInsights,
        storyAngles,
        brandLens,
        visual,
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
