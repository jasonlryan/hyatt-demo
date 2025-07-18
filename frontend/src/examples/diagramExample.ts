import { DiagramConfig } from '../types/diagram';
import { createEdgeFromString } from '../utils/diagramMapper';

// Example: Define your Hyatt workflow using the new system
export const hyattWorkflowConfig: DiagramConfig = {
  nodes: [
    {
      id: 'brief',
      label: 'Campaign Brief',
      position: { x: 160, y: 300 },
      connectors: [
        { id: 'brief-R', position: 'R' } // Only right connector
      ]
    },
    {
      id: 'pr',
      label: 'PR Manager',
      position: { x: 600, y: 300 },
      connectors: [
        { id: 'pr-T', position: 'T' },
        { id: 'pr-B', position: 'B' },
        { id: 'pr-L', position: 'L' },
        { id: 'pr-R', position: 'R' }
      ]
    },
    {
      id: 'research',
      label: '1. Research',
      position: { x: 380, y: 140 },
      connectors: [
        { id: 'research-T', position: 'T' },
        { id: 'research-B', position: 'B' },
        { id: 'research-L', position: 'L' },
        { id: 'research-R', position: 'R' }
      ]
    },
    {
      id: 'strategy',
      label: '2. Strategy',
      position: { x: 380, y: 460 },
      connectors: [
        { id: 'strategy-T', position: 'T' },
        { id: 'strategy-B', position: 'B' },
        { id: 'strategy-L', position: 'L' },
        { id: 'strategy-R', position: 'R' }
      ]
    },
    {
      id: 'trending',
      label: '3. Trending News',
      position: { x: 820, y: 140 },
      connectors: [
        { id: 'trending-T', position: 'T' },
        { id: 'trending-B', position: 'B' },
        { id: 'trending-L', position: 'L' },
        { id: 'trending-R', position: 'R' }
      ]
    },
    {
      id: 'story',
      label: '4. Story Angles',
      position: { x: 820, y: 460 },
      connectors: [
        { id: 'story-T', position: 'T' },
        { id: 'story-B', position: 'B' },
        { id: 'story-L', position: 'L' },
        { id: 'story-R', position: 'R' }
      ]
    },
    {
      id: 'final',
      label: 'Final Campaign Strategy',
      position: { x: 1040, y: 300 },
      connectors: [
        { id: 'final-L', position: 'L' } // Only left connector
      ]
    }
  ],
  edges: []
};

// Now you can create edges using simple connection strings:
const edgeDefinitions = [
  // Horizontal connections
  { conn: "brief:R -> pr:L", style: { color: '#222', dashed: true, animated: true }, type: 'straight' },
  { conn: "pr:R -> final:L", style: { color: '#222', dashed: true, animated: true }, type: 'straight' },
  
  // Research connections (blue)
  { conn: "pr:T -> research:B", style: { color: '#2563eb', dashed: true, animated: true }, type: 'default' },
  { conn: "research:B -> pr:L", style: { color: '#2563eb', dashed: true, animated: true }, type: 'default' },
  
  // Strategy connections (pink) 
  { conn: "pr:B -> strategy:R", style: { color: '#ec4899', dashed: true, animated: true }, type: 'default' },
  { conn: "strategy:T -> pr:L", style: { color: '#ec4899', dashed: true, animated: true }, type: 'default' },
  
  // Trending connections (green)
  { conn: "pr:T -> trending:B", style: { color: '#22c55e', dashed: true, animated: true }, type: 'default' },
  { conn: "trending:B -> pr:R", style: { color: '#22c55e', dashed: true, animated: true }, type: 'default' },
  
  // Story connections (purple)
  { conn: "pr:B -> story:L", style: { color: '#7c3aed', dashed: true, animated: true }, type: 'default' },
  { conn: "story:T -> pr:R", style: { color: '#7c3aed', dashed: true, animated: true }, type: 'default' }
];

// Convert connection strings to edges
hyattWorkflowConfig.edges = edgeDefinitions.map(def => 
  createEdgeFromString(def.conn, def.style, def.type as any)
);

// Usage in a component:
// import { diagramToReactFlow } from '../utils/diagramMapper';
// const { nodes, edges } = diagramToReactFlow(hyattWorkflowConfig); 