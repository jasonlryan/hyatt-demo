const agentColors = {
  research: "#2563eb",
  strategy: "#ec4899",
  trending: "#22c55e",
  story: "#7c3aed",
  "pr-manager": "#64748b",
  visual_prompt_generator: "#f59e0b",
  modular_elements_recommender: "#06b6d4",
  trend_cultural_analyzer: "#8b5cf6",
  brand_qa: "#ef4444",
  brand_lens: "#10b981",
};

const calculateNodePosition = (index, total) => {
  const centerX = 600;
  const centerY = 300;
  const radius = 200;
  if (total === 1) return { x: centerX, y: centerY };
  const angle = (index / total) * Math.PI * 2;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
};

const generateNodes = (agents) => {
  return agents.map((agent, index) => ({
    id: agent,
    label: agent,
    position: calculateNodePosition(index, agents.length),
    connectors: [
      { id: `${agent}-T`, position: "T" },
      { id: `${agent}-B`, position: "B" },
      { id: `${agent}-L`, position: "L" },
      { id: `${agent}-R`, position: "R" },
    ],
    style: { border: `2px solid ${agentColors[agent] || "#64748b"}` },
  }));
};

const generateSequentialConnections = (agents) => {
  const connections = [];
  for (let i = 0; i < agents.length - 1; i++) {
    connections.push(`${agents[i]}:R -> ${agents[i + 1]}:L`);
  }
  return connections;
};

const parseConnection = (conn) => {
  const [nodeId, connector] = conn.split(":");
  return { nodeId, connector };
};

const createEdgeFromString = (str) => {
  const [from, to] = str.split("->").map((s) => s.trim());
  const fromConn = parseConnection(from);
  const toConn = parseConnection(to);
  return {
    id: `${from}-${to}`,
    from: fromConn,
    to: toConn,
    style: { color: "#2563eb", dashed: true, animated: true, strokeWidth: 2 },
    type: "default",
  };
};

const generateDiagramFromOrchestration = (orch) => {
  if (!orch || !Array.isArray(orch.agents) || orch.agents.length === 0) {
    return {
      nodes: [
        {
          id: "empty",
          label: "No Agents",
          position: { x: 600, y: 300 },
          connectors: [],
        },
      ],
      edges: [],
    };
  }
  const nodes = generateNodes(orch.agents);
  const edges = generateSequentialConnections(orch.agents).map(
    createEdgeFromString
  );
  return { nodes, edges };
};

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Missing id" });
    const orchestrations = {
      hyatt: {
        agents: [
          "pr_manager",
          "research_audience",
          "strategic_insight",
          "trending_news",
          "story_angles",
        ],
      },
      hive: {
        agents: [
          "trend_cultural_analyzer",
          "brand_lens",
          "visual_prompt_generator",
          "modular_elements_recommender",
          "brand_qa",
        ],
      },
    };
    const orchestration = orchestrations[id];
    if (!orchestration) return res.status(404).json({ message: "Not found" });
    const diagram = generateDiagramFromOrchestration(orchestration);
    res.status(200).json({ diagram });
  } catch (err) {
    console.error("Diagram generation failed:", err);
    res.status(500).json({ message: "Failed to generate diagram" });
  }
}
