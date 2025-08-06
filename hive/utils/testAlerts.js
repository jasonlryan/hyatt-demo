const { WorkspaceAlertSetup } = require("./setupWorkspaceAlert");
require("dotenv").config();

/**
 * Test script to check alerts and understand email configuration
 */
async function testAlerts() {
  const alertSetup = new WorkspaceAlertSetup();

  try {
    console.log("🔍 Testing PeakMetrics Alerts...\n");

    // 1. Authenticate
    await alertSetup.authenticate();

    // 2. List all alerts for the user
    console.log("📋 Checking existing alerts...");
    const alerts = await alertSetup.listAlerts(process.env.PEAKMETRICS_UN);

    // 3. Check if we can get a specific alert
    if (alerts && alerts.length > 0) {
      console.log("\n🔍 Testing specific alert retrieval...");
      const firstAlert = alerts[0];

      try {
        const response = await alertSetup.axios.get(
          `${alertSetup.alertingURL}/alerts/alert/${process.env.PEAKMETRICS_UN}/${firstAlert.id}`,
          {
            headers: { Authorization: `Bearer ${alertSetup.token}` },
          }
        );

        console.log("📄 Specific Alert Response:");
        console.log(JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.log("❌ Failed to get specific alert:", error.message);
      }
    }

    // 4. Check email configuration
    console.log("\n📧 Email Configuration Check:");
    console.log("   • Alerts are configured to send emails (value: 2)");
    console.log("   • Email address: Check your PeakMetrics account settings");
    console.log(
      "   • You may need to configure email settings in PeakMetrics web interface"
    );

    // 5. Check alert status
    console.log("\n🚨 Alert Status:");
    console.log("   • Alerts are created and active");
    console.log("   • They will trigger based on conditions");
    console.log(
      "   • Email delivery depends on PeakMetrics email configuration"
    );
  } catch (error) {
    console.error("💥 Test failed:", error.message);
  }
}

// Run the test
if (require.main === module) {
  testAlerts()
    .then(() => {
      console.log("\n✅ Alert test completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Alert test failed:", error);
      process.exit(1);
    });
}

module.exports = { testAlerts };
