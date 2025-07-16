const VisualPromptGeneratorAgent = require("./agents/classes/VisualPromptGeneratorAgent");
const ModularElementsRecommenderAgent = require("./agents/classes/ModularElementsRecommenderAgent");
const TrendCulturalAnalyzerAgent = require("./agents/classes/TrendCulturalAnalyzerAgent");
const BrandQAAgent = require("./agents/classes/BrandQAAgent");

async function runHiveOrchestration(testContext) {
  const visualAgent = new VisualPromptGeneratorAgent();
  const modularAgent = new ModularElementsRecommenderAgent();
  const trendAgent = new TrendCulturalAnalyzerAgent();
  const qaAgent = new BrandQAAgent();

  await visualAgent.loadSystemPrompt();
  await modularAgent.loadSystemPrompt();
  await trendAgent.loadSystemPrompt();
  await qaAgent.loadSystemPrompt();

  const basePrompt = await visualAgent.generatePrompt(testContext);
  const modulars = await modularAgent.recommendElements(
    testContext,
    basePrompt
  );
  const trendInsights = await trendAgent.analyzeTrends(testContext);
  const qaResult = await qaAgent.reviewPrompt(
    basePrompt,
    modulars,
    trendInsights
  );

  console.log("Base Prompt:\n", basePrompt);
  console.log("\nModular Elements:\n", modulars);
  console.log("\nTrend Insights:\n", trendInsights);
  console.log("\nBrand QA Result:\n", qaResult);
}

// Capri Sun Pouch Pallet example from CSV
const testContext = {
  campaign: "Capri Sun Pouch Pallet",
  momentType: "Brand Rumor Response / Nostalgia Reassurance",
  visualObjective: "Reinforce pouch nostalgia while introducing new bottle",
  heroVisualDescription:
    "Classic Capri Sun pouch in foreground, bottle behind, pop-art style on blue background",
  promptSnippet:
    "Bright pop-art style shot of Capri Sun foil pouch with straw and a plastic bottle behind. Blue gradient background, dramatic lighting, text overlay: 'The pouch is here to stay.'",
  modularElements: [
    "Product juxtaposition",
    "vibrant colors",
    "dramatic side lighting",
    "reassurance overlay",
  ],
};

runHiveOrchestration(testContext);
