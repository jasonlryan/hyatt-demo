require("dotenv").config({ path: "./.env" });
const PeakMetricsClient = require("./peakMetricsClient");

async function debugPeakMetrics() {
  console.log("🔍 Debugging PeakMetrics API...\n");

  try {
    const client = new PeakMetricsClient();
    console.log("✅ Client initialized");

    // Test 1: Get workspaces
    console.log("\n📋 Test 1: Getting workspaces...");
    const workspaces = await client.getWorkspaces();
    console.log(`✅ Found ${workspaces.length} workspaces`);
    console.log("Sample workspace:", workspaces[0]);

    // Test 2: Get narratives for Sharpie (ID: 86171)
    console.log("\n📝 Test 2: Getting narratives for Sharpie...");
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const to = new Date().toISOString();

    console.log(`Using date range: ${since} to ${to}`);

    try {
      const narratives = await client.getNarratives(86171, {
        since: since,
        to: to,
        limit: 10,
      });
      console.log("✅ Narratives response:", typeof narratives);
      console.log("Response structure:", Object.keys(narratives || {}));
      console.log("Is array?", Array.isArray(narratives));
      if (Array.isArray(narratives)) {
        console.log(`Found ${narratives.length} narratives`);
      } else {
        console.log("Full response:", JSON.stringify(narratives, null, 2));
      }
    } catch (error) {
      console.log("❌ Narratives error:", error.message);
      console.log("Error details:", error.response?.data);
    }

    // Test 3: Get mentions for Sharpie
    console.log("\n💬 Test 3: Getting mentions for Sharpie...");
    try {
      const mentions = await client.getMentions(86171, {
        since: since,
        to: to,
        limit: 5,
      });
      console.log("✅ Mentions response:", typeof mentions);
      console.log("Response structure:", Object.keys(mentions || {}));
      console.log("Is array?", Array.isArray(mentions));
      if (Array.isArray(mentions)) {
        console.log(`Found ${mentions.length} mentions`);
      } else {
        console.log("Full response:", JSON.stringify(mentions, null, 2));
      }
    } catch (error) {
      console.log("❌ Mentions error:", error.message);
      console.log("Error details:", error.response?.data);
    }
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

debugPeakMetrics();
