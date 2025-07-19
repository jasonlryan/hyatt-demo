import { describe, it, expect, beforeEach } from "vitest";

// Mock the handler function
const mockHandler = (req, res) => {
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

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ message: "Missing id" });
      return;
    }

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
          "pr_manager",
          "research_audience",
          "strategic_insight",
          "trending_news",
          "story_angles",
        ],
      },
      template: {
        agents: [
          "pr_manager",
          "research_audience",
          "strategic_insight",
          "trending_news",
        ],
      },
    };

    const orchestration = orchestrations[id];
    if (!orchestration) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    const diagram = generateDiagramFromOrchestration(orchestration);
    res.status(200).json({ diagram });
  } catch (err) {
    console.error("Diagram generation failed:", err);
    res.status(500).json({ message: "Failed to generate diagram" });
  }
};

describe("generate-diagram API", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      method: "POST",
      body: {},
    };
    mockRes = {
      status: (code) => ({
        json: (data) => ({ statusCode: code, data }),
      }),
    };
  });

  it("should return 405 for non-POST requests", () => {
    mockReq.method = "GET";
    const result = mockHandler(mockReq, mockRes);
    expect(result.statusCode).toBe(405);
    expect(result.data.message).toBe("Method not allowed");
  });

  it("should return 400 when id is missing", () => {
    mockReq.body = {};
    const result = mockHandler(mockReq, mockRes);
    expect(result.statusCode).toBe(400);
    expect(result.data.message).toBe("Missing id");
  });

  it("should return 404 for unknown orchestration id", () => {
    mockReq.body = { id: "unknown" };
    const result = mockHandler(mockReq, mockRes);
    expect(result.statusCode).toBe(404);
    expect(result.data.message).toBe("Not found");
  });

  it("should generate diagram for hyatt orchestration", () => {
    mockReq.body = { id: "hyatt" };
    const result = mockHandler(mockReq, mockRes);

    expect(result.statusCode).toBe(200);
    expect(result.data).toHaveProperty("diagram");
    expect(result.data.diagram).toHaveProperty("nodes");
    expect(result.data.diagram).toHaveProperty("edges");
    expect(result.data.diagram.nodes).toHaveLength(5);
    expect(result.data.diagram.edges).toHaveLength(4);
  });

  it("should generate diagram for hive orchestration", () => {
    mockReq.body = { id: "hive" };
    const result = mockHandler(mockReq, mockRes);

    expect(result.statusCode).toBe(200);
    expect(result.data.diagram.nodes).toHaveLength(5);
    expect(result.data.diagram.edges).toHaveLength(4);
  });

  it("should generate diagram for template orchestration", () => {
    mockReq.body = { id: "template" };
    const result = mockHandler(mockReq, mockRes);

    expect(result.statusCode).toBe(200);
    expect(result.data.diagram.nodes).toHaveLength(4);
    expect(result.data.diagram.edges).toHaveLength(3);
  });

  it("should include correct agent nodes in hyatt diagram", () => {
    mockReq.body = { id: "hyatt" };
    const result = mockHandler(mockReq, mockRes);

    const nodeIds = result.data.diagram.nodes.map((node) => node.id);
    expect(nodeIds).toContain("pr_manager");
    expect(nodeIds).toContain("research_audience");
    expect(nodeIds).toContain("strategic_insight");
    expect(nodeIds).toContain("trending_news");
    expect(nodeIds).toContain("story_angles");
  });

  it("should include correct agent nodes in template diagram", () => {
    mockReq.body = { id: "template" };
    const result = mockHandler(mockReq, mockRes);

    const nodeIds = result.data.diagram.nodes.map((node) => node.id);
    expect(nodeIds).toContain("pr_manager");
    expect(nodeIds).toContain("research_audience");
    expect(nodeIds).toContain("strategic_insight");
    expect(nodeIds).toContain("trending_news");
    expect(nodeIds).not.toContain("story_angles");
  });

  it("should generate sequential connections between agents", () => {
    mockReq.body = { id: "template" };
    const result = mockHandler(mockReq, mockRes);

    const edges = result.data.diagram.edges;
    expect(edges).toHaveLength(3);

    // Check that edges connect agents sequentially
    expect(edges[0].from.nodeId).toBe("pr_manager");
    expect(edges[0].to.nodeId).toBe("research_audience");
    expect(edges[1].from.nodeId).toBe("research_audience");
    expect(edges[1].to.nodeId).toBe("strategic_insight");
    expect(edges[2].from.nodeId).toBe("strategic_insight");
    expect(edges[2].to.nodeId).toBe("trending_news");
  });

  it("should apply correct styling to edges", () => {
    mockReq.body = { id: "hyatt" };
    const result = mockHandler(mockReq, mockRes);

    const edges = result.data.diagram.edges;
    edges.forEach((edge) => {
      expect(edge.style).toEqual({
        color: "#2563eb",
        dashed: true,
        animated: true,
        strokeWidth: 2,
      });
    });
  });

  it("should apply correct styling to nodes", () => {
    mockReq.body = { id: "hyatt" };
    const result = mockHandler(mockReq, mockRes);

    const nodes = result.data.diagram.nodes;
    nodes.forEach((node) => {
      expect(node).toHaveProperty("style");
      expect(node.style).toHaveProperty("border");
      expect(node.style.border).toMatch(/2px solid #[0-9a-f]{6}/);
    });
  });

  it("should include connectors for each node", () => {
    mockReq.body = { id: "hyatt" };
    const result = mockHandler(mockReq, mockRes);

    const nodes = result.data.diagram.nodes;
    nodes.forEach((node) => {
      expect(node).toHaveProperty("connectors");
      expect(node.connectors).toHaveLength(4);
      expect(node.connectors.map((c) => c.position)).toEqual([
        "T",
        "B",
        "L",
        "R",
      ]);
    });
  });
});
