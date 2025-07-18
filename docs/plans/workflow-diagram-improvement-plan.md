# Workflow Diagram Improvement Plan

## Overview

Extend the existing workflow diagram system to automatically generate diagrams for new orchestrations created through the Orchestration Builder.

## Goals

- [ ] Auto-generate diagrams when new orchestrations are created
- [ ] Display diagrams for all orchestrations, not just Hyatt
- [ ] Integrate diagrams into orchestration pages
- [ ] Maintain visual consistency across all diagrams

## Timeline

- **Start Date**: 2024-12-19
- **Target Completion**: 2024-12-26
- **Priority**: High

## Implementation Steps

### 1. Create Diagram Generation Utility

**File**: `frontend/src/utils/diagramGenerator.ts`

```typescript
export const generateDiagramFromOrchestration = (
  orchestration: OrchestrationSpec
): DiagramConfig => {
  const nodes = [];
  const edges = [];

  // Generate nodes based on agents
  orchestration.agents.forEach((agent, index) => {
    nodes.push({
      id: agent,
      label: getAgentDisplayName(agent),
      position: calculateNodePosition(index, orchestration.agents.length),
      connectors: generateConnectors(agent),
      style: getAgentStyle(agent),
    });
  });

  // Generate edges based on workflows
  orchestration.workflows.forEach((workflow) => {
    const workflowEdges = generateWorkflowEdges(workflow, orchestration.agents);
    edges.push(...workflowEdges);
  });

  return { nodes, edges };
};
```

### 2. Extend Orchestration Builder

**File**: `frontend/src/components/orchestrations/OrchestrationBuilderPage.tsx`

- Add diagram generation to `handleGenerateOrchestration()`
- Include diagram config in the generated orchestration spec
- Show diagram preview in the generation modal

### 3. Update Save API

**File**: `pages/api/save-orchestration.js`

- Generate diagram configuration when saving orchestration
- Save diagram config alongside orchestration data
- Store diagram in `{orchestration-id}-diagram.json`

### 4. Enhance WorkflowsPage

**File**: `frontend/src/components/WorkflowsPage.tsx`

- Load all orchestrations instead of just Hyatt
- Generate diagrams dynamically from orchestration configs
- Show dropdown to select different orchestration diagrams

### 5. Add Diagram to Orchestration Pages

**Files**: Various orchestration page components

- Add diagram tab/section to orchestration pages
- Show workflow visualization alongside other orchestration features
- Make diagrams interactive and informative

## Dependencies

- Existing diagram mapping system (`diagramMapper.ts`)
- ReactFlow library (already implemented)
- Orchestration Builder API (already implemented)

## Success Criteria

- [ ] New orchestrations automatically get diagrams
- [ ] All orchestrations show in Workflows page
- [ ] Diagrams are visually consistent with existing Hyatt diagram
- [ ] Diagrams accurately represent agent relationships
- [ ] Performance remains good with multiple diagrams

## Notes

- Leverage existing `createEdgeFromString()` utility for edge generation
- Use established color coding for agent types
- Maintain the diamond/compass layout for complex workflows
- Consider caching generated diagrams for performance
