const { WorkspaceAlertSetup } = require("./setupWorkspaceAlert");
require("dotenv").config();

/**
 * Example: Set up alerts for OpenAI workspace
 *
 * Prerequisites:
 * 1. You need to have created an "OpenAI test" workspace manually in PeakMetrics
 * 2. You need to know the workspace ID (you can get this by listing workspaces)
 * 3. Your .env file should have PEAKMETRICS_UN, PEAKMETRICS_PW, PEAKMETRICS_CLIENT_ID
 */

async function setupOpenAIAlerts() {
  const alertSetup = new WorkspaceAlertSetup();

  try {
    console.log("🚀 Setting up OpenAI workspace alerts...\n");

    // 1. Authenticate
    await alertSetup.authenticate();

    // 2. List all workspaces to find OpenAI workspace
    console.log("📋 Searching for OpenAI workspace...");
    const workspaces = await alertSetup.listWorkspaces();

    // 3. Find OpenAI workspace (you can modify this search)
    const openAIWorkspace = workspaces.find(
      (w) =>
        w.title.toLowerCase().includes("openai") ||
        w.query.toLowerCase().includes("openai")
    );

    if (!openAIWorkspace) {
      console.log("\n❌ OpenAI workspace not found!");
      console.log("💡 You need to:");
      console.log(
        '   1. Create an "OpenAI test" workspace manually in PeakMetrics'
      );
      console.log("   2. Run this script again");
      console.log("\n📋 Available workspaces:");
      workspaces.forEach((w) => {
        console.log(`   - ${w.title} (ID: ${w.id})`);
      });
      return;
    }

    console.log(
      `\n✅ Found OpenAI workspace: ${openAIWorkspace.title} (ID: ${openAIWorkspace.id})`
    );

    // 4. Set up comprehensive alerts for OpenAI
    console.log("\n🎯 Setting up comprehensive alerts for OpenAI...");
    const alerts = await alertSetup.setupComprehensiveAlerts(
      openAIWorkspace.id,
      openAIWorkspace.title
    );

    // 5. Show summary
    console.log("\n📊 Alert Setup Summary:");
    console.log(`   Workspace: ${openAIWorkspace.title}`);
    console.log(`   Workspace ID: ${openAIWorkspace.id}`);
    console.log(`   Total Alerts Created: ${alerts.length}`);

    alerts.forEach((alert, index) => {
      console.log(
        `   ${index + 1}. ${alert.type} alert - ${alert.alert.title}`
      );
    });

    // 6. List all alerts for verification
    console.log("\n📋 Verifying all alerts...");
    await alertSetup.listAlerts(process.env.PEAKMETRICS_UN);

    console.log("\n🎉 OpenAI alert setup completed successfully!");
    console.log("\n📧 You will now receive email alerts when:");
    console.log("   • Velocity spikes above 50");
    console.log("   • Negative sentiment is detected");
    console.log("   • Mention volume exceeds 10");
    console.log("   • Crisis keywords appear (crisis, scandal, recall)");
    console.log(
      "   • Positive PR opportunities arise (award, recognition, etc.)"
    );
  } catch (error) {
    console.error("\n💥 OpenAI alert setup failed:", error.message);
    throw error;
  }
}

// Run the setup
if (require.main === module) {
  setupOpenAIAlerts()
    .then(() => {
      console.log("\n✅ OpenAI alert setup completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 OpenAI alert setup failed:", error);
      process.exit(1);
    });
}

module.exports = { setupOpenAIAlerts };
