/**
 * Test script for PeakMetrics integration
 * Run with: node utils/peakMetricsTest.js
 */

require("dotenv").config();
const PeakMetricsClient = require("./peakMetricsClient");
const {
  extractKeyInsights,
  calculateRiskScore,
} = require("./metricsTransform");

async function testPeakMetricsIntegration() {
  console.log("🧪 Testing PeakMetrics Integration...\n");

  try {
    // Initialize client
    const client = new PeakMetricsClient();
    console.log("✅ PeakMetrics client initialized");

    // Test 1: Get workspaces
    console.log("\n📋 Test 1: Fetching workspaces...");
    const workspaces = await client.getWorkspaces();
    console.log(`Found ${workspaces.length} workspaces`);

    if (workspaces.length > 0) {
      const sampleWorkspace = workspaces[0];
      console.log(
        `Sample workspace: "${sampleWorkspace.title}" (ID: ${sampleWorkspace.id})`
      );

      // Test 2: Get narratives for first workspace
      console.log("\n📊 Test 2: Fetching narratives...");
      const narratives = await client.getNarratives(sampleWorkspace.id, {
        limit: 10,
        sort: "relevancy",
      });

      console.log(`Retrieved ${narratives.length} narratives`);

      if (narratives.length > 0) {
        const sampleNarrative = narratives[0];
        console.log(`Sample narrative: "${sampleNarrative.title}"`);
        console.log(
          `- Mentions: ${sampleNarrative.aggregations?.mentionCount || "N/A"}`
        );
        console.log(
          `- Sentiment: ${sampleNarrative.aggregations?.avgSentiment || "N/A"}`
        );
        console.log(
          `- Relevancy: ${
            sampleNarrative.aggregations?.relevancyScore || "N/A"
          }`
        );

        // Test 3: Transform data
        console.log("\n🔄 Test 3: Testing data transformation...");
        const insights = extractKeyInsights(narratives);
        console.log("Key insights:", insights);

        // Test 4: Calculate risk score
        console.log("\n⚠️ Test 4: Testing risk calculation...");
        const riskScore = calculateRiskScore(sampleNarrative);
        console.log(`Risk score for sample narrative: ${riskScore}/100`);

        // Test 5: Get mentions
        console.log("\n📝 Test 5: Fetching mentions...");
        const mentions = await client.getMentions(sampleWorkspace.id, {
          limit: 5,
          sort: "published",
        });

        console.log(`Retrieved ${mentions.length} mentions`);
        if (mentions.length > 0) {
          console.log(`Sample mention: "${mentions[0].title}"`);
        }
      }
    }

    // Test 6: Search for specific workspace
    console.log("\n🔍 Test 6: Testing workspace search...");
    const searchResults = await client.findWorkspaceByQuery("test");
    if (searchResults) {
      console.log(`Found workspace matching "test": "${searchResults.title}"`);
    } else {
      console.log('No workspace found matching "test"');
    }

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPeakMetricsIntegration();
}

module.exports = { testPeakMetricsIntegration };
