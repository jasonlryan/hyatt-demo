/**
 * Generic workspace analysis script
 * Run with: node utils/analyzeWorkspace.js [workspace-name]
 * Example: node utils/analyzeWorkspace.js sharpie
 */

require("dotenv").config();

async function analyzeWorkspace(workspaceName) {
  if (!workspaceName) {
    console.log("❌ Please provide a workspace name");
    console.log("Usage: node utils/analyzeWorkspace.js [workspace-name]");
    console.log("Example: node utils/analyzeWorkspace.js sharpie");
    return;
  }

  console.log(`🖊️ Analyzing ${workspaceName} Workspace...\n`);

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

    // First, find the workspace
    const workspacesResponse = await axios.get(
      "https://api.peakmetrics.com/workspaces",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const workspace = workspacesResponse.data.find((w) =>
      w.title.toLowerCase().includes(workspaceName.toLowerCase())
    );

    if (!workspace) {
      console.log(`❌ ${workspaceName} workspace not found`);
      console.log("Available workspaces:");
      workspacesResponse.data.forEach((w) => console.log(`- ${w.title}`));
      return;
    }

    console.log(
      `📋 Found workspace: "${workspace.title}" (ID: ${workspace.id})`
    );
    console.log(`Query: ${workspace.query}`);
    console.log(`Channels: ${workspace.channels?.join(", ")}`);
    console.log("");

    // Get recent narratives (last 48 hours)
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const to = new Date().toISOString();

    console.log("📊 Fetching recent narratives...");
    const narrativesResponse = await axios.get(
      `https://api.peakmetrics.com/workspaces/${workspace.id}/narratives`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          since: since,
          to: to,
          sort: "relevancy",
          limit: 10,
        },
      }
    );

    const narratives = narrativesResponse.data;
    console.log(`Found ${narratives.length} narratives in the last 48 hours\n`);

    if (narratives.length > 0) {
      console.log("🔥 TOP NARRATIVES:");
      narratives.forEach((narrative, index) => {
        console.log(`\n${index + 1}. ${narrative.title}`);
        console.log(
          `   Mentions: ${narrative.aggregations?.mentionCount || 0}`
        );
        console.log(
          `   Sentiment: ${narrative.aggregations?.avgSentiment || 0}`
        );
        console.log(
          `   Relevancy: ${narrative.aggregations?.relevancyScore || 0}%`
        );
        console.log(`   Summary: ${narrative.summary || "No summary"}`);
      });

      // Calculate insights
      const totalMentions = narratives.reduce(
        (sum, n) => sum + (n.aggregations?.mentionCount || 0),
        0
      );
      const avgSentiment =
        narratives.reduce(
          (sum, n) => sum + (n.aggregations?.avgSentiment || 0),
          0
        ) / narratives.length;

      console.log("\n📈 KEY INSIGHTS:");
      console.log(`Total mentions in 48h: ${totalMentions}`);
      console.log(`Average sentiment: ${avgSentiment.toFixed(1)}`);
      console.log(`Narrative velocity: ${narratives.length} narratives in 48h`);

      // Sentiment breakdown
      const positive = narratives.filter(
        (n) => (n.aggregations?.avgSentiment || 0) > 10
      ).length;
      const negative = narratives.filter(
        (n) => (n.aggregations?.avgSentiment || 0) < -10
      ).length;
      const neutral = narratives.length - positive - negative;

      console.log(
        `Sentiment breakdown: ${positive} positive, ${neutral} neutral, ${negative} negative`
      );
    }

    // Get some recent mentions
    console.log("\n📝 Fetching recent mentions...");
    const mentionsResponse = await axios.get(
      `https://api.peakmetrics.com/workspaces/${workspace.id}/mentions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          since: since,
          to: to,
          sort: "published",
          limit: 5,
        },
      }
    );

    const mentions = mentionsResponse.data;
    console.log(`Found ${mentions.length} recent mentions\n`);

    if (mentions.length > 0) {
      console.log("💬 SAMPLE MENTIONS:");
      mentions.forEach((mention, index) => {
        console.log(`\n${index + 1}. ${mention.title || "No title"}`);
        console.log(`   Channel: ${mention.channels?.join(", ")}`);
        console.log(
          `   Sentiment: ${mention.enrichments?.sentiment?.polarity || "N/A"}`
        );
        console.log(`   Published: ${mention.published}`);
        console.log(`   URL: ${mention.url}`);
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

// Get workspace name from command line arguments
const workspaceName = process.argv[2];
analyzeWorkspace(workspaceName);
