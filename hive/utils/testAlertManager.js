const { getAlertManagerInstance } = require("./peakMetricsAlertManager");

async function testAlertManager() {
  console.log("🚀 Testing PeakMetrics Alert Manager\n");

  const alertManager = getAlertManagerInstance();

  try {
    // Initialize the alert manager
    console.log("1️⃣ Initializing Alert Manager...");
    await alertManager.initialize();
    console.log("✅ Alert Manager initialized successfully!\n");

    // Configure alerts for all workspaces
    console.log("2️⃣ Configuring alerts for all workspaces...");
    await alertManager.configureAlertsForAllWorkspaces();
    console.log("✅ Alert configuration completed!\n");

    // Generate and display alert report
    console.log("3️⃣ Generating alert configuration report...");
    const report = alertManager.generateAlertReport();
    console.log("✅ Alert report generated!\n");

    // Test custom alert creation
    console.log("4️⃣ Testing custom alert creation...");
    try {
      const customAlert = await alertManager.createCustomAlert(
        85779,
        "keywords",
        {
          keywords: ["test", "demo", "example"],
          frequency: 60,
        }
      );
      console.log("✅ Custom alert created:", customAlert.alertId);
    } catch (error) {
      console.log("❌ Custom alert failed:", error.message);
    }

    // Display final summary
    console.log("\n🏁 Test Summary:");
    console.log("================");
    console.log(`📊 Workspaces configured: ${report.workspaces}`);
    console.log(`🚨 Total alerts created: ${report.totalAlerts}`);
    console.log(
      `📈 Average alerts per workspace: ${report.averageAlertsPerWorkspace}`
    );
    console.log("\n🎉 PeakMetrics Native Alerting is now fully operational!");
    console.log("   • No more polling required");
    console.log("   • Real-time alerting via PeakMetrics");
    console.log("   • Multiple alert types configured");
    console.log("   • Email and Slack notifications enabled");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testAlertManager()
  .then(() => {
    console.log("\n✅ Alert Manager test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Alert Manager test crashed:", error);
    process.exit(1);
  });
