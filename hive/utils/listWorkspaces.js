/**
 * List all PeakMetrics workspaces
 * Run with: node utils/listWorkspaces.js
 */

require("dotenv").config();

async function listWorkspaces() {
  console.log("📋 Listing PeakMetrics Workspaces...\n");

  try {
    const axios = require("axios");

    // Get auth token
    const authResponse = await axios.post(
      "https://api.peakmetrics.com/access/token",
      {
        username: process.env.PEAKMETRICS_UN,
        password: process.env.PEAKMETRICS_PW,
        client_id: "hive-test",
      }
    );

    const token = authResponse.data.Token;

    // Get workspaces
    const workspacesResponse = await axios.get(
      "https://api.peakmetrics.com/workspaces",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const workspaces = workspacesResponse.data;

    console.log(`Found ${workspaces.length} workspaces:\n`);

    workspaces.forEach((workspace, index) => {
      console.log(`${index + 1}. ${workspace.title}`);
      console.log(`   ID: ${workspace.id}`);
      console.log(`   Query: ${workspace.query}`);
      console.log(`   Channels: ${workspace.channels?.join(", ") || "None"}`);
      console.log(
        `   Narrative Detection: ${
          workspace.narrativeDetection?.status || "Unknown"
        }`
      );
      console.log(`   Created: ${workspace.created}`);
      console.log(`   Summary: ${workspace.summary || "No summary"}`);
      console.log("");
    });

    // Show workspace IDs for easy reference
    console.log("📝 Workspace IDs for reference:");
    workspaces.forEach((w) => {
      console.log(`   "${w.title}" → ID: ${w.id}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

listWorkspaces();
