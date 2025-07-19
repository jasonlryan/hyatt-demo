import { describe, it, expect } from "vitest";
import { hyattDiagramConfig } from "../diagrams/HyattDiagram";

describe("HyattDiagram", () => {
  it("should have correct diagram structure", () => {
    expect(hyattDiagramConfig).toHaveProperty("nodes");
    expect(hyattDiagramConfig).toHaveProperty("edges");
    expect(Array.isArray(hyattDiagramConfig.nodes)).toBe(true);
    expect(Array.isArray(hyattDiagramConfig.edges)).toBe(true);
  });

  it("should have the correct number of nodes", () => {
    expect(hyattDiagramConfig.nodes).toHaveLength(7);
  });

  it("should include all required nodes", () => {
    const nodeIds = hyattDiagramConfig.nodes.map((node) => node.id);
    expect(nodeIds).toContain("brief");
    expect(nodeIds).toContain("pr");
    expect(nodeIds).toContain("research");
    expect(nodeIds).toContain("strategy");
    expect(nodeIds).toContain("trending");
    expect(nodeIds).toContain("story");
    expect(nodeIds).toContain("final");
  });

  it("should have the correct number of edges", () => {
    expect(hyattDiagramConfig.edges).toHaveLength(10);
  });

  it("should have nodes with correct structure", () => {
    hyattDiagramConfig.nodes.forEach((node) => {
      expect(node).toHaveProperty("id");
      expect(node).toHaveProperty("label");
      expect(node).toHaveProperty("position");
      expect(node).toHaveProperty("connectors");
      expect(node).toHaveProperty("style");
      expect(node.position).toHaveProperty("x");
      expect(node.position).toHaveProperty("y");
    });
  });

  it("should have edges with correct structure", () => {
    hyattDiagramConfig.edges.forEach((edge) => {
      expect(edge).toHaveProperty("id");
      expect(edge).toHaveProperty("from");
      expect(edge).toHaveProperty("to");
      expect(edge).toHaveProperty("style");
      expect(edge.from).toHaveProperty("nodeId");
      expect(edge.from).toHaveProperty("connector");
      expect(edge.to).toHaveProperty("nodeId");
      expect(edge.to).toHaveProperty("connector");
    });
  });

  it("should have correct node positions", () => {
    const briefNode = hyattDiagramConfig.nodes.find(
      (node) => node.id === "brief"
    );
    const prNode = hyattDiagramConfig.nodes.find((node) => node.id === "pr");
    const finalNode = hyattDiagramConfig.nodes.find(
      (node) => node.id === "final"
    );

    expect(briefNode?.position.x).toBe(160);
    expect(briefNode?.position.y).toBe(300);
    expect(prNode?.position.x).toBe(600);
    expect(prNode?.position.y).toBe(300);
    expect(finalNode?.position.x).toBe(1040);
    expect(finalNode?.position.y).toBe(300);
  });

  it("should have correct edge connections", () => {
    const briefToPr = hyattDiagramConfig.edges.find(
      (edge) => edge.id === "brief-pr"
    );
    const prToFinal = hyattDiagramConfig.edges.find(
      (edge) => edge.id === "pr-final"
    );

    expect(briefToPr?.from.nodeId).toBe("brief");
    expect(briefToPr?.from.connector).toBe("R");
    expect(briefToPr?.to.nodeId).toBe("pr");
    expect(briefToPr?.to.connector).toBe("L");

    expect(prToFinal?.from.nodeId).toBe("pr");
    expect(prToFinal?.from.connector).toBe("R");
    expect(prToFinal?.to.nodeId).toBe("final");
    expect(prToFinal?.to.connector).toBe("L");
  });

  it("should have correct styling for nodes", () => {
    hyattDiagramConfig.nodes.forEach((node) => {
      expect(node.style).toHaveProperty("background", "#fff");
      expect(node.style).toHaveProperty("border", "2px solid #64748b");
      expect(node.style).toHaveProperty("color", "#222");
    });
  });

  it("should have correct styling for edges", () => {
    hyattDiagramConfig.edges.forEach((edge) => {
      expect(edge.style).toHaveProperty("strokeWidth", 2);
      expect(edge.style).toHaveProperty("dashed", true);
      expect(edge.style).toHaveProperty("animated", true);
    });
  });
});
