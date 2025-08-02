require("dotenv").config({ path: "./.env" });
const { getInstance } = require("../services/PeakMetricsDataService");

async function testSimple() {
  console.log("🧪 Simple PeakMetricsDataService Test...\n");

  const service = getInstance();

  if (!service.isAvailable()) {
    console.log("❌ Service not available");
    return;
  }

  console.log("✅ Service available\n");

  try {
    // Test narratives directly
    console.log("📝 Testing getNarratives...");
    const result = await service.getNarratives(86171, {
      since: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
      limit: 10,
    });

    console.log("Result type:", typeof result);
    console.log("Result keys:", Object.keys(result));
    console.log("Success:", result.success);
    console.log("Data:", result.data);
    console.log("Error:", result.error);
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testSimple();
