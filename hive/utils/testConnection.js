/**
 * Simple PeakMetrics API connection test
 * Run with: node utils/testConnection.js
 */

require("dotenv").config();

async function testPeakMetricsConnection() {
  console.log("🧪 Testing PeakMetrics API Connection...\n");

  // Check if credentials are available
  const username = process.env.PEAKMETRICS_UN;
  const password = process.env.PEAKMETRICS_PW;

  if (!username || !password) {
    console.error("❌ Missing PeakMetrics credentials in .env file");
    console.log("Please ensure PEAKMETRICS_UN and PEAKMETRICS_PW are set");
    return;
  }

  console.log("✅ Credentials found in environment");
  console.log(`Username: ${username}`);
  console.log(`Password: ${password.substring(0, 3)}...`);

  try {
    // Test basic axios connection
    const axios = require("axios");

    console.log("\n🔐 Testing authentication...");

    const authResponse = await axios.post(
      "https://api.peakmetrics.com/access/token",
      {
        username: username,
        password: password,
        client_id: "hive-test",
      }
    );

    console.log("✅ Authentication successful!");
    console.log(`Token: ${authResponse.data.Token.substring(0, 20)}...`);
    console.log(`Expires in: ${authResponse.data.ExpiresIn} seconds`);

    // Test getting workspaces
    console.log("\n📋 Testing workspaces endpoint...");

    const workspacesResponse = await axios.get(
      "https://api.peakmetrics.com/workspaces",
      {
        headers: {
          Authorization: `Bearer ${authResponse.data.Token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Workspaces endpoint successful!");
    console.log(`Found ${workspacesResponse.data.length} workspaces`);

    if (workspacesResponse.data.length > 0) {
      const sample = workspacesResponse.data[0];
      console.log(`Sample workspace: "${sample.title}" (ID: ${sample.id})`);
    }

    console.log("\n🎉 All basic tests passed! PeakMetrics API is working.");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testPeakMetricsConnection();
