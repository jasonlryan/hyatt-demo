export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Load generated orchestrations
    const fs = require("fs");
    const path = require("path");

    let generatedOrchestrations = [];
    const generatedOrchestrationsPath = path.join(
      process.cwd(),
      "data",
      "generated-orchestrations.json"
    );

    if (fs.existsSync(generatedOrchestrationsPath)) {
      const generatedData = JSON.parse(
        fs.readFileSync(generatedOrchestrationsPath, "utf8")
      );
      generatedOrchestrations = Object.values(
        generatedData.orchestrations || {}
      );
    }

    // Base orchestrations
    const baseOrchestrations = {
      hyatt: {
        id: "hyatt",
        name: "Hyatt Orchestrator",
        description:
          "Specialized orchestration for Hyatt PR campaigns with sequential workflow execution. Perfect for hotel and hospitality marketing campaigns.",
        enabled: true,
        config: {
          maxConcurrentWorkflows: 5,
          timeout: 300000,
          retryAttempts: 3,
          enableLogging: true,
        },
        workflows: [
          "pr_campaign_workflow",
          "content_creation_workflow",
          "research_workflow",
        ],
        agents: [
          "pr_manager",
          "research_audience",
          "strategic_insight",
          "trending_news",
          "story_angles",
        ],
        hasDiagram: true,
        hasDocumentation: true,
        documentationPath: "docs/orchestrations/HyattOrchestrator.md",
      },
      template: {
        id: "template",
        name: "Template Orchestrator",
        description: "Example orchestration built from the Hyatt template.",
        enabled: true,
        config: {
          maxConcurrentWorkflows: 5,
          timeout: 300000,
          retryAttempts: 3,
          enableLogging: true,
        },
        workflows: ["pr_campaign_workflow"],
        agents: [
          "pr_manager",
          "research_audience",
          "strategic_insight",
          "trending_news",
        ],
        hasDiagram: false,
        hasDocumentation: false,
      },
      builder: {
        id: "builder",
        name: "Orchestration Builder",
        description:
          "AI-powered orchestration generator. Describe what you want, and it creates a custom orchestration for you.",
        enabled: true,
        config: {
          maxConcurrentWorkflows: 3,
          timeout: 300000,
          retryAttempts: 2,
          enableLogging: true,
        },
        workflows: ["orchestration_generation_workflow"],
        agents: [
          "orchestration_analyzer",
          "agent_generator",
          "workflow_designer",
        ],
        hasDiagram: false,
        hasDocumentation: true,
        documentationPath: "docs/orchestrations/OrchestrationBuilder.md",
      },
      hive: {
        id: "hive",
        name: "Hive Orchestrator",
        description:
          "Reactive framework orchestration with parallel agent collaboration. Perfect for complex PR campaigns with multiple stakeholders.",
        enabled: true,
        config: {
          maxConcurrentWorkflows: 10,
          timeout: 600000,
          retryAttempts: 2,
          enableLogging: true,
          reactiveFramework: true,
          parallelExecution: true,
        },
        workflows: [
          "hive_pr_campaign",
          "hive_content_creation",
          "hive_research_collaboration",
        ],
        agents: [
          "pr_manager",
          "research_audience",
          "strategic_insight",
          "trending_news",
          "story_angles",
          "visual_prompt_generator",
          "brand_qa",
          "modular_elements_recommender",
        ],
        hasDiagram: false,
        hasDocumentation: false,
      },
    };

    // Combine base and generated orchestrations
    const allOrchestrations = {
      ...baseOrchestrations,
      ...generatedOrchestrations.reduce((acc, orchestration) => {
        acc[orchestration.id] = orchestration;
        return acc;
      }, {}),
    };

    res.status(200).json({
      orchestrators: allOrchestrations,
    });
  } catch (error) {
    console.error("Error loading orchestrations:", error);
    res.status(500).json({
      message: "Failed to load orchestrations",
      error: error.message,
    });
  }
}
