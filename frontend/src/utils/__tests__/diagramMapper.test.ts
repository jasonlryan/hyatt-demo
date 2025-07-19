import { describe, it, expect } from 'vitest';
import { createEdgeFromString, diagramToReactFlow } from '../diagramMapper';
import { DiagramConfig } from '../../types/diagram';

describe('diagramMapper', () => {
  describe('createEdgeFromString', () => {
    it('should create edge from valid connection string', () => {
      const connectionString = 'node1:R -> node2:L';
      const style = { color: '#2563eb', dashed: true };
      
      const edge = createEdgeFromString(connectionString, style);
      
      expect(edge).toEqual({
        id: 'node1:R-node2:L',
        from: { nodeId: 'node1', connector: 'R' },
        to: { nodeId: 'node2', connector: 'L' },
        style: { color: '#2563eb', dashed: true },
        type: undefined,
      });
    });

    it('should handle different connector positions', () => {
      const connectionString = 'node1:T -> node2:B';
      const style = { color: '#ff0000' };
      
      const edge = createEdgeFromString(connectionString, style);
      
      expect(edge.from).toEqual({ nodeId: 'node1', connector: 'T' });
      expect(edge.to).toEqual({ nodeId: 'node2', connector: 'B' });
    });

    it('should generate correct edge ID', () => {
      const connectionString = 'source_node:R -> target_node:L';
      const edge = createEdgeFromString(connectionString, {});
      
      expect(edge.id).toBe('source_node:R-target_node:L');
    });

    it('should apply custom style', () => {
      const connectionString = 'node1:R -> node2:L';
      const customStyle = { 
        color: '#00ff00', 
        strokeWidth: 3, 
        animated: true 
      };
      
      const edge = createEdgeFromString(connectionString, customStyle);
      
      expect(edge.style).toEqual(customStyle);
    });
  });

  describe('diagramToReactFlow', () => {
    it('should convert diagram config to ReactFlow format', () => {
      const diagramConfig: DiagramConfig = {
        nodes: [
          {
            id: 'node1',
            label: 'Node 1',
            position: { x: 100, y: 100 },
            connectors: [
              { id: 'node1-R', position: 'R' },
              { id: 'node1-L', position: 'L' },
            ],
            style: { border: '2px solid #000' },
          },
          {
            id: 'node2',
            label: 'Node 2',
            position: { x: 300, y: 100 },
            connectors: [
              { id: 'node2-R', position: 'R' },
              { id: 'node2-L', position: 'L' },
            ],
            style: { border: '2px solid #fff' },
          },
        ],
        edges: [
          {
            id: 'edge1',
            from: { nodeId: 'node1', connector: 'R' },
            to: { nodeId: 'node2', connector: 'L' },
            style: { color: '#2563eb' },
            type: undefined,
          },
        ],
      };

      const { nodes, edges } = diagramToReactFlow(diagramConfig);

      expect(nodes).toHaveLength(2);
      expect(edges).toHaveLength(1);

      // Check node conversion
      expect(nodes[0]).toEqual({
        id: 'node1',
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          label: 'Node 1',
          style: { border: '2px solid #000' },
          connectors: [
            { id: 'node1-R', position: 'R' },
            { id: 'node1-L', position: 'L' },
          ],
        },
      });

      // Check edge conversion
      expect(edges[0]).toEqual({
        id: 'edge1',
        source: 'node1',
        target: 'node2',
        sourceHandle: 'source-right',
        targetHandle: 'target-left',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        type: 'default',
        animated: false,
      });
    });

    it('should handle empty diagram config', () => {
      const diagramConfig: DiagramConfig = {
        nodes: [],
        edges: [],
      };

      const { nodes, edges } = diagramToReactFlow(diagramConfig);

      expect(nodes).toHaveLength(0);
      expect(edges).toHaveLength(0);
    });

    it('should handle nodes without edges', () => {
      const diagramConfig: DiagramConfig = {
        nodes: [
          {
            id: 'node1',
            label: 'Node 1',
            position: { x: 100, y: 100 },
            connectors: [],
            style: {},
          },
        ],
        edges: [],
      };

      const { nodes, edges } = diagramToReactFlow(diagramConfig);

      expect(nodes).toHaveLength(1);
      expect(edges).toHaveLength(0);
    });

    it('should handle edges without nodes', () => {
      const diagramConfig: DiagramConfig = {
        nodes: [],
        edges: [
          {
            id: 'edge1',
            from: { nodeId: 'node1', connector: 'R' },
            to: { nodeId: 'node2', connector: 'L' },
            style: {},
            type: undefined,
          },
        ],
      };

      const { nodes, edges } = diagramToReactFlow(diagramConfig);

      expect(nodes).toHaveLength(0);
      expect(edges).toHaveLength(1);
    });

    it('should map connector positions correctly', () => {
      const diagramConfig: DiagramConfig = {
        nodes: [
          {
            id: 'node1',
            label: 'Node 1',
            position: { x: 100, y: 100 },
            connectors: [
              { id: 'node1-T', position: 'T' },
              { id: 'node1-B', position: 'B' },
              { id: 'node1-L', position: 'L' },
              { id: 'node1-R', position: 'R' },
            ],
            style: {},
          },
        ],
        edges: [
          {
            id: 'edge1',
            from: { nodeId: 'node1', connector: 'T' },
            to: { nodeId: 'node1', connector: 'B' },
            style: {},
            type: undefined,
          },
        ],
      };

      const { edges } = diagramToReactFlow(diagramConfig);

      expect(edges[0].sourceHandle).toBe('source-top');
      expect(edges[0].targetHandle).toBe('target-bottom');
    });
  });
}); 