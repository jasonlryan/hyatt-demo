const { getNativeAlertingInstance } = require("./peakMetricsNativeAlerts");

async function testNativeAlerts() {
  console.log("🚀 Testing PeakMetrics Native Alerting System\n");

  const alerting = getNativeAlertingInstance();

  try {
    // Test authentication
    console.log("1️⃣ Testing authentication...");
    const authSuccess = await alerting.authenticate();
    if (!authSuccess) {
      console.log(
        "❌ Authentication failed. Check your environment variables."
      );
      return;
    }
    console.log("✅ Authentication successful!\n");

    // Test creating different types of alerts
    console.log("2️⃣ Testing alert creation...\n");

    // Velocity alert
    console.log("📈 Creating velocity spike alert...");
    try {
      const velocityAlert = await alerting.createVelocityAlert(85779, 50, 60);
      console.log("✅ Velocity alert created:", velocityAlert);
    } catch (error) {
      console.log("❌ Velocity alert failed:", error.message);
    }

    // Sentiment alert
    console.log("\n😡 Creating negative sentiment alert...");
    try {
      const sentimentAlert = await alerting.createSentimentAlert(
        85779,
        "negative",
        120
      );
      console.log("✅ Sentiment alert created:", sentimentAlert);
    } catch (error) {
      console.log("❌ Sentiment alert failed:", error.message);
    }

    // Mention volume alert
    console.log("\n📊 Creating mention volume alert...");
    try {
      const volumeAlert = await alerting.createMentionVolumeAlert(
        85779,
        10,
        180
      );
      console.log("✅ Mention volume alert created:", volumeAlert);
    } catch (error) {
      console.log("❌ Mention volume alert failed:", error.message);
    }

    // Keyword alert
    console.log("\n🔍 Creating keyword alert...");
    try {
      const keywordAlert = await alerting.createKeywordAlert(
        85779,
        ["crisis", "scandal", "recall"],
        60
      );
      console.log("✅ Keyword alert created:", keywordAlert);
    } catch (error) {
      console.log("❌ Keyword alert failed:", error.message);
    }

    // Test listing alerts
    console.log("\n3️⃣ Testing alert listing...");
    try {
      const alerts = await alerting.listAlerts();
      console.log("✅ Alerts listed:", alerts);
    } catch (error) {
      console.log("❌ Listing alerts failed:", error.message);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testNativeAlerts()
  .then(() => {
    console.log("\n🏁 Test completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test crashed:", error);
    process.exit(1);
  });
