require("dotenv").config({ path: "./.env" });
const { getInstance } = require("../services/PeakMetricsDataService");

async function testPeakMetricsService() {
  console.log("🧪 Testing PeakMetricsDataService...\n");

  const service = getInstance();

  if (!service.isAvailable()) {
    console.log("❌ PeakMetrics service not available");
    return;
  }

  console.log("✅ PeakMetrics service is available\n");

  try {
    // Test 1: Get all brands overview
    console.log("📋 Test 1: Getting all brands overview...");
    const overviewResult = await service.getAllBrandsOverview();
    if (!overviewResult.error) {
      console.log(`✅ Found ${overviewResult.data.length} brands`);
      console.log("Sample brands:");
      overviewResult.data.slice(0, 3).forEach((brand) => {
        console.log(
          `  - ${brand.title}: ${brand.last48hMentions} mentions, risk: ${brand.riskScore}`
        );
      });
    } else {
      console.log("❌ Failed to get brands overview:", overviewResult.error);
    }
    console.log("");

    // Test 2: Get specific brand detail using ID
    console.log("📊 Test 2: Getting Sharpie brand detail (ID: 86171)...");
    const brandResult = await service.getBrandById(86171);
    if (!brandResult.error) {
      console.log(`✅ Brand: ${brandResult.data.title}`);
      console.log(`   Mentions: ${brandResult.data.last48hMentions}`);
      console.log(`   Risk Score: ${brandResult.data.riskScore}`);
      console.log(
        `   Top Narratives: ${brandResult.data.topNarratives.length}`
      );
    } else {
      console.log("❌ Failed to get brand detail:", brandResult.error);
    }
    console.log("");

    // Test 3: Get narratives using ID
    console.log("📝 Test 3: Getting narratives for Sharpie (ID: 86171)...");
    const narrativesResult = await service.getNarratives(86171);
    if (!narrativesResult.error) {
      console.log(`✅ Found ${narrativesResult.data.length} narratives`);
    } else {
      console.log("❌ Failed to get narratives:", narrativesResult.error);
    }
    console.log("");

    // Test 4: Get mentions using ID
    console.log("💬 Test 4: Getting mentions for Sharpie (ID: 86171)...");
    const mentionsResult = await service.getMentions(86171);
    if (!mentionsResult.error) {
      console.log(`✅ Found ${mentionsResult.data.length} mentions`);
    } else {
      console.log("❌ Failed to get mentions:", mentionsResult.error);
    }
    console.log("");

    // Test 5: Get trend insights using ID
    console.log("📈 Test 5: Getting trend insights for Sharpie (ID: 86171)...");
    const trendsResult = await service.getTrendInsights(86171);
    if (!trendsResult.error) {
      console.log(`✅ Trend insights: ${trendsResult.data.momentum} momentum`);
      console.log(`   Growth rate: ${trendsResult.data.growthRate24h}%`);
      console.log(`   Total mentions: ${trendsResult.data.totalMentions}`);
    } else {
      console.log("❌ Failed to get trend insights:", trendsResult.error);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

testPeakMetricsService();
