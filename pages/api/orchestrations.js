const OrchestrationManager = require("../../hive/orchestrations/OrchestrationManager");

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Use OrchestrationManager to get orchestration data from actual classes
    const orchestrationManager = new OrchestrationManager();
    const orchestrations = orchestrationManager.getFrontendOrchestrations();

    res.status(200).json({
      orchestrators: orchestrations,
    });
  } catch (error) {
    console.error("Error loading orchestrations:", error);
    res.status(500).json({
      message: "Failed to load orchestrations",
      error: error.message,
    });
  }
}
