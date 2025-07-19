import { DiagramConfig } from '../../../types/diagram';

const outlinedStyle = {
  background: '#fff',
  border: '2px solid #64748b',
  color: '#222',
};

const agentColors = {
  research: '#2563eb',
  strategy: '#ec4899',
  trending: '#22c55e',
  story: '#7c3aed',
};

const centerX = 600;
const centerY = 300;
const offsetX = 220;
const offsetY = 160;

export const hyattDiagramConfig: DiagramConfig = {
  nodes: [
    {
      id: 'brief',
      type: undefined as any,
      label: 'Campaign Brief',
      position: { x: centerX - 2 * offsetX, y: centerY },
      connectors: [
        { id: 'brief-R', position: 'R' },
      ],
      style: outlinedStyle,
    },
    {
      id: 'pr',
      type: undefined as any,
      label: 'PR Manager',
      position: { x: centerX, y: centerY },
      connectors: [
        { id: 'pr-T', position: 'T' },
        { id: 'pr-B', position: 'B' },
        { id: 'pr-L', position: 'L' },
        { id: 'pr-R', position: 'R' },
      ],
      style: outlinedStyle,
    },
    {
      id: 'research',
      type: undefined as any,
      label: '1. Research',
      position: { x: centerX - offsetX, y: centerY - offsetY },
      connectors: [
        { id: 'research-T', position: 'T' },
        { id: 'research-B', position: 'B' },
        { id: 'research-L', position: 'L' },
        { id: 'research-R', position: 'R' },
      ],
      style: outlinedStyle,
    },
    {
      id: 'strategy',
      type: undefined as any,
      label: '2 Stratgy',
      position: { x: centerX - offsetX, y: centerY + offsetY },
      connectors: [
        { id: 'strategy-T', position: 'T' },
        { id: 'strategy-B', position: 'B' },
        { id: 'strategy-L', position: 'L' },
        { id: 'strategy-R', position: 'R' },
      ],
      style: outlinedStyle,
    },
    {
      id: 'trending',
      type: undefined as any,
      label: '3. Trending News',
      position: { x: centerX + offsetX, y: centerY - offsetY },
      connectors: [
        { id: 'trending-T', position: 'T' },
        { id: 'trending-B', position: 'B' },
        { id: 'trending-L', position: 'L' },
        { id: 'trending-R', position: 'R' },
      ],
      style: outlinedStyle,
    },
    {
      id: 'story',
      type: undefined as any,
      label: '4. Story Angles',
      position: { x: centerX + offsetX, y: centerY + offsetY },
      connectors: [
        { id: 'story-T', position: 'T' },
        { id: 'story-B', position: 'B' },
        { id: 'story-L', position: 'L' },
        { id: 'story-R', position: 'R' },
      ],
      style: outlinedStyle,
    },
    {
      id: 'final',
      type: undefined as any,
      label: 'Final Campaign Strategy',
      position: { x: centerX + 2 * offsetX, y: centerY },
      connectors: [
        { id: 'final-L', position: 'L' },
      ],
      style: outlinedStyle,
    },
  ],
  edges: [
    // Black dashed line for brief to PR Manager (horizontal, straight)
    {
      id: 'brief-pr',
      from: { nodeId: 'brief', connector: 'R' },
      to: { nodeId: 'pr', connector: 'L' },
      style: { strokeWidth: 2, color: '#222', dashed: true, animated: true },
      type: 'straight',
    },
    {
      id: 'pr-final',
      from: { nodeId: 'pr', connector: 'R' },
      to: { nodeId: 'final', connector: 'L' },
      style: { strokeWidth: 2, color: '#222', dashed: true, animated: true },
      type: 'straight',
    },
    // Research (blue)
    {
      id: 'pr-research',
      from: { nodeId: 'pr', connector: 'T' },
      to: { nodeId: 'research', connector: 'B' },
      style: { strokeWidth: 2, color: agentColors.research, dashed: true, animated: true },
    },
    {
      id: 'research-pr',
      from: { nodeId: 'research', connector: 'B' },
      to: { nodeId: 'pr', connector: 'L' },
      style: { strokeWidth: 2, color: agentColors.research, dashed: true, animated: true },
    },
    // Strategy (pink)
    {
      id: 'pr-strategy',
      from: { nodeId: 'pr', connector: 'B' },
      to: { nodeId: 'strategy', connector: 'R' },
      style: { strokeWidth: 2, color: agentColors.strategy, dashed: true, animated: true },
    },
    {
      id: 'strategy-pr',
      from: { nodeId: 'strategy', connector: 'T' },
      to: { nodeId: 'pr', connector: 'L' },
      style: { strokeWidth: 2, color: agentColors.strategy, dashed: true, animated: true },
    },
    // Trending (green)
    {
      id: 'pr-trending',
      from: { nodeId: 'pr', connector: 'T' },
      to: { nodeId: 'trending', connector: 'B' },
      style: { strokeWidth: 2, color: agentColors.trending, dashed: true, animated: true },
    },
    {
      id: 'trending-pr',
      from: { nodeId: 'trending', connector: 'B' },
      to: { nodeId: 'pr', connector: 'R' },
      style: { strokeWidth: 2, color: agentColors.trending, dashed: true, animated: true },
    },
    // Story Angles (purple)
    {
      id: 'pr-story',
      from: { nodeId: 'pr', connector: 'B' },
      to: { nodeId: 'story', connector: 'L' },
      style: { strokeWidth: 2, color: agentColors.story, dashed: true, animated: true },
    },
    {
      id: 'story-pr',
      from: { nodeId: 'story', connector: 'T' },
      to: { nodeId: 'pr', connector: 'R' },
      style: { strokeWidth: 2, color: agentColors.story, dashed: true, animated: true },
    },
  ],
};

export default hyattDiagramConfig;
