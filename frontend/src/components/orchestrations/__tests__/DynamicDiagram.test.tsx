import { describe, it, expect } from "vitest";
import {
  generateDiagramFromOrchestration,
  generateNodes,
  generateSequentialConnections,
  calculateNodePosition,
} from "../diagrams/DynamicDiagram";

describe("DynamicDiagram", () => {
  describe("calculateNodePosition", () => {
    it("should position single node at center", () => {
      const position = calculateNodePosition(0, 1);
      expect(position).toEqual({ x: 600, y: 300 });
    });

    it("should position multiple nodes in a circle", () => {
      const position1 = calculateNodePosition(0, 4);
      const position2 = calculateNodePosition(1, 4);
      const position3 = calculateNodePosition(2, 4);
      const position4 = calculateNodePosition(3, 4);

      // Check that positions are different
      expect(position1).not.toEqual(position2);
      expect(position2).not.toEqual(position3);
      expect(position3).not.toEqual(position4);

      // Check that positions are within expected bounds
      expect(position1.x).toBeGreaterThan(400);
      expect(position1.x).toBeLessThanOrEqual(800);
      expect(position1.y).toBeGreaterThan(100);
      expect(position1.y).toBeLessThan(500);
    });

    it("should handle edge cases", () => {
      const position = calculateNodePosition(0, 0);
      expect(position).toEqual({ x: 600, y: 300 });
    });
  });

  describe("generateNodes", () => {
    it("should generate nodes with correct structure", () => {
      const agents = ["pr_manager", "research_audience", "strategic_insight"];
      const nodes = generateNodes(agents);

      expect(nodes).toHaveLength(3);
      nodes.forEach((node: any, index: number) => {
        expect(node).toHaveProperty("id", agents[index]);
        expect(node).toHaveProperty("label", agents[index]);
        expect(node).toHaveProperty("position");
        expect(node).toHaveProperty("connectors");
        expect(node).toHaveProperty("style");
        expect(node.connectors).toHaveLength(4);
        expect(node.style).toHaveProperty("border");
      });
    });

    it("should generate connectors with correct structure", () => {
      const agents = ["test_agent"];
      const nodes = generateNodes(agents);
      const node = nodes[0];

      expect(node.connectors).toEqual([
        { id: "test_agent-T", position: "T" },
        { id: "test_agent-B", position: "B" },
        { id: "test_agent-L", position: "L" },
        { id: "test_agent-R", position: "R" },
      ]);
    });

    it("should apply correct colors to nodes", () => {
      const agents = ["pr_manager", "research_audience"];
      const nodes = generateNodes(agents);

      expect(nodes[0]?.style?.border).toContain("#64748b"); // pr_manager color
      expect(nodes[1]?.style?.border).toContain("#2563eb"); // research color
    });
  });

  describe("generateSequentialConnections", () => {
    it("should generate connections for multiple agents", () => {
      const agents = ["agent1", "agent2", "agent3"];
      const connections = generateSequentialConnections(agents);

      expect(connections).toEqual([
        "agent1:R -> agent2:L",
        "agent2:R -> agent3:L",
      ]);
    });

    it("should return empty array for single agent", () => {
      const agents = ["agent1"];
      const connections = generateSequentialConnections(agents);

      expect(connections).toEqual([]);
    });

    it("should return empty array for empty agents", () => {
      const agents: string[] = [];
      const connections = generateSequentialConnections(agents);

      expect(connections).toEqual([]);
    });
  });

  describe("generateDiagramFromOrchestration", () => {
    it("should generate complete diagram for valid orchestration", () => {
      const orchestration = {
        agents: ["pr_manager", "research_audience", "strategic_insight"],
      };

      const diagram = generateDiagramFromOrchestration(orchestration);

      expect(diagram).toHaveProperty("nodes");
      expect(diagram).toHaveProperty("edges");
      expect(diagram.nodes).toHaveLength(3);
      expect(diagram.edges).toHaveLength(2);
    });

    it("should handle empty orchestration", () => {
      const orchestration = { agents: [] };
      const diagram = generateDiagramFromOrchestration(orchestration);

      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes[0].id).toBe("empty");
      expect(diagram.nodes[0].label).toBe("No Agents");
      expect(diagram.edges).toHaveLength(0);
    });

    it("should handle null orchestration", () => {
      const diagram = generateDiagramFromOrchestration(null);

      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes[0].id).toBe("empty");
      expect(diagram.edges).toHaveLength(0);
    });

    it("should handle orchestration without agents", () => {
      const orchestration = {};
      const diagram = generateDiagramFromOrchestration(orchestration);

      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes[0].id).toBe("empty");
      expect(diagram.edges).toHaveLength(0);
    });

    it("should handle orchestration with non-array agents", () => {
      const orchestration = { agents: "not-an-array" };
      const diagram = generateDiagramFromOrchestration(orchestration);

      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes[0].id).toBe("empty");
      expect(diagram.edges).toHaveLength(0);
    });
  });
});
