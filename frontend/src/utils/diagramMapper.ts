import { Node, Edge } from 'reactflow';
import { DiagramConfig, DiagramNode, DiagramEdge, ConnectorPosition } from '../types/diagram';

// Map connector positions to React Flow handle IDs
const getHandleId = (position: ConnectorPosition, type: 'source' | 'target'): string => {
  const positionMap = {
    'T': 'top',
    'B': 'bottom', 
    'L': 'left',
    'R': 'right'
  };
  return `${type}-${positionMap[position]}`;
};

// Convert DiagramNode to React Flow Node
export const toReactFlowNode = (node: DiagramNode): Node => {
  return {
    id: node.id,
    type: 'custom',
    data: { 
      label: node.label,
      style: node.style || {},
      connectors: node.connectors // Pass connectors info if needed for custom rendering
    },
    position: node.position
  };
};

// Convert DiagramEdge to React Flow Edge
export const toReactFlowEdge = (edge: DiagramEdge): Edge => {
  const reactFlowEdge: Edge = {
    id: edge.id,
    source: edge.from.nodeId,
    target: edge.to.nodeId,
    sourceHandle: getHandleId(edge.from.connector, 'source'),
    targetHandle: getHandleId(edge.to.connector, 'target'),
    type: edge.type || 'default',
    animated: edge.style?.animated || false,
  };

  // Apply styling
  if (edge.style) {
    reactFlowEdge.style = {
      stroke: edge.style.color || '#222',
      strokeWidth: edge.style.strokeWidth || 2,
      ...(edge.style.dashed && { strokeDasharray: '6 4' })
    };
  }

  return reactFlowEdge;
};

// Convert full diagram config to React Flow format
export const diagramToReactFlow = (config: DiagramConfig) => {
  return {
    nodes: config.nodes.map(toReactFlowNode),
    edges: config.edges.map(toReactFlowEdge)
  };
};

// Parse connection string format: "nodeId:connector"
export const parseConnection = (conn: string): { nodeId: string; connector: ConnectorPosition } => {
  const [nodeId, connector] = conn.split(':');
  return { nodeId, connector: connector as ConnectorPosition };
};

// Create edge from connection string
// Example: "brief:R -> pr:L" with optional style
export const createEdgeFromString = (
  connectionStr: string, 
  style?: DiagramEdge['style'],
  type?: DiagramEdge['type']
): DiagramEdge => {
  const [from, to] = connectionStr.split('->').map(s => s.trim());
  const fromConn = parseConnection(from);
  const toConn = parseConnection(to);
  
  return {
    id: `${from}-${to}`,
    from: fromConn,
    to: toConn,
    style,
    type
  };
}; 