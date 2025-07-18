// Diagram Mapping System Types

export type ConnectorPosition = 'T' | 'B' | 'L' | 'R'; // Top, Bottom, Left, Right

export interface NodeConnector {
  id: string;
  position: ConnectorPosition;
  label?: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  position: { x: number; y: number };
  connectors: NodeConnector[];
  style?: Record<string, any>;
}

export interface DiagramEdge {
  id: string;
  from: {
    nodeId: string;
    connector: ConnectorPosition;
  };
  to: {
    nodeId: string;
    connector: ConnectorPosition;
  };
  style?: {
    color?: string;
    dashed?: boolean;
    animated?: boolean;
    strokeWidth?: number;
  };
  type?: 'straight' | 'curved' | 'default';
}

export interface DiagramConfig {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// Helper function to create a connection string
export const connectionString = (fromNode: string, fromConnector: ConnectorPosition, toNode: string, toConnector: ConnectorPosition) => 
  `${fromNode}:${fromConnector} -> ${toNode}:${toConnector}`;

// Example prompt format:
// "Connect brief:R -> pr:L (black, dashed, animated)"
// "Connect pr:B -> strategy:R (pink, dashed, animated)" 