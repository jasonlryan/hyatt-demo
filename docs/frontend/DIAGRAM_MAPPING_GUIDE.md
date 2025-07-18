# Diagram Mapping System Guide

## Overview

This system provides a simplified way to define and connect nodes in diagrams using T/B/L/R connector notation.

## Key Concepts

### 1. Connector Positions

- **T** - Top connector
- **B** - Bottom connector
- **L** - Left connector
- **R** - Right connector

### 2. Connection Syntax

```
nodeId:connector -> nodeId:connector
```

Example: `brief:R -> pr:L` connects the right side of 'brief' to the left side of 'pr'

### 3. Node Definition

```typescript
{
  id: 'nodeId',
  label: 'Display Name',
  position: { x: 100, y: 200 },
  connectors: [
    { id: 'nodeId-T', position: 'T' },
    { id: 'nodeId-B', position: 'B' },
    { id: 'nodeId-L', position: 'L' },
    { id: 'nodeId-R', position: 'R' }
  ]
}
```

### 4. Edge Styling

```typescript
{
  color: '#2563eb',     // Line color
  dashed: true,         // Dashed line
  animated: true,       // Animated dashes
  strokeWidth: 2        // Line thickness
}
```

## Usage Examples

### Simple Connection

```typescript
// Connect right side of A to left side of B
createEdgeFromString("A:R -> B:L");
```

### Styled Connection

```typescript
// Blue dashed animated line
createEdgeFromString(
  "pr:T -> research:B",
  { color: "#2563eb", dashed: true, animated: true },
  "default" // curved line
);
```

### Full Workflow Example

```typescript
const connections = [
  "brief:R -> pr:L", // Brief to PR Manager
  "pr:T -> research:B", // PR to Research
  "research:B -> pr:L", // Research back to PR
  "pr:B -> strategy:R", // PR to Strategy
  "strategy:T -> pr:L", // Strategy back to PR
];
```

## Line Types

- `'straight'` - Direct line (good for horizontal/vertical)
- `'default'` - Curved bezier (good for diagonal connections)
- `'smoothstep'` - Step-like connection with rounded corners

## Best Practices

1. **Horizontal connections**: Use straight lines with L/R connectors
2. **Diagonal connections**: Use default (bezier) curves
3. **Bidirectional flows**: Use consistent colors for both directions
4. **Node placement**: Position nodes to minimize line crossings

## Quick Reference

| From     | To       | Description                |
| -------- | -------- | -------------------------- |
| `node:R` | `node:L` | Horizontal connection      |
| `node:T` | `node:B` | Vertical connection        |
| `node:B` | `node:R` | Bottom to right (diagonal) |
| `node:T` | `node:L` | Top to left (diagonal)     |

## Converting Prompts to Code

When given a prompt like:

> "Connect research bottom to pr left with blue dashed line"

Convert to:

```typescript
createEdgeFromString("research:B -> pr:L", {
  color: "#2563eb",
  dashed: true,
  animated: true,
});
```
