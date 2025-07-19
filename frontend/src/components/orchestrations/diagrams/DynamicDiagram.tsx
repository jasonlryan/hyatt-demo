import {
  DiagramConfig,
  DiagramNode,
  DiagramEdge,
} from "../../../types/diagram";
import { createEdgeFromString } from "../../../utils/diagramMapper";

const agentColors: Record<string, string> = {
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

export const calculateNodePosition = (index: number, total: number) => {
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

export const generateNodes = (agents: string[]): DiagramNode[] => {
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

export const generateSequentialConnections = (agents: string[]): string[] => {
  const connections: string[] = [];
  for (let i = 0; i < agents.length - 1; i++) {
    connections.push(`${agents[i]}:R -> ${agents[i + 1]}:L`);
  }
  return connections;
};

export const generateDiagramFromOrchestration = (
  orch: {
    agents?: string[] | string;
  } | null
): DiagramConfig => {
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
  const edges: DiagramEdge[] = generateSequentialConnections(orch.agents).map(
    (conn) =>
      createEdgeFromString(conn, {
        color: "#2563eb",
        dashed: true,
        animated: true,
      })
  );
  return { nodes, edges };
};
