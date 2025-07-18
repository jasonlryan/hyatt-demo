export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Return Hyatt and Hive orchestrations
  res.status(200).json({
    orchestrators: {
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
      },
    },
  });
}
