# Workflow Diagram Improvement Plan

## Overview

Extend the existing workflow diagram system to automatically generate diagrams for new orchestrations created through the Orchestration Builder.

## Current State Analysis

### ✅ What We Have (Solid Foundation)

1. **Working Diagram System** (`frontend/src/utils/diagramMapper.ts`)

   - `createEdgeFromString()` - Converts connection strings to edges
   - `diagramToReactFlow()` - Converts diagram configs to ReactFlow format
   - `toReactFlowNode()` and `toReactFlowEdge()` - Conversion utilities

2. **Functional Diagram Display** (`frontend/src/components/WorkflowsPage.tsx`)

   - ReactFlow integration working
   - Custom node rendering with handles
   - Color-coded agent connections (blue, pink, green, purple)
   - Animated dashed lines
   - Interactive controls (zoom, pan)
   - Currently shows only hardcoded Hyatt workflow

3. **Type System** (`frontend/src/types/diagram.ts`)

   - `DiagramConfig`, `DiagramNode`, `DiagramEdge` interfaces
   - `ConnectorPosition` type

4. **Examples** (`frontend/src/examples/diagramExample.ts`)
   - Shows how to use `createEdgeFromString()`
   - Connection string format examples
   - Edge styling examples

### 🎯 What We Need to Achieve

- [ ] Auto-generate diagrams when new orchestrations are created
- [ ] Display diagrams for all orchestrations, not just Hyatt
- [ ] Integrate diagrams into orchestration pages
- [ ] Maintain visual consistency across all diagrams
- [ ] Show all orchestrations in Workflows page regardless of diagram status
- [ ] Provide "Generate Workflow Diagram" button for orchestrations without diagrams

## Implementation Steps (Building on Existing Foundation)

### 1. Create Diagrams Folder Structure

**New Folder**: `frontend/src/components/orchestrations/diagrams/`

**Purpose**: Organize all diagram configurations and generation logic
**Structure**:

```
frontend/src/components/orchestrations/diagrams/
├── HyattDiagram.tsx             # Extract existing hardcoded diagram
├── HiveDiagram.tsx              # Hive workflow diagram
├── TemplateDiagram.tsx          # Template workflow diagram
├── DynamicDiagram.tsx           # Auto-generated diagrams
└── index.ts                     # Export all diagrams
```

### 2. Extract Existing Hyatt Diagram

**File**: `frontend/src/components/orchestrations/diagrams/HyattDiagram.tsx` (NEW)

**Current State**: `hyattNodes` and `hyattEdges` hardcoded in `WorkflowsPage.tsx`
**Goal**: Extract to separate file for reusability

**Changes Needed**:

- Move `hyattNodes` and `hyattEdges` from `WorkflowsPage.tsx`
- Export as `hyattDiagramConfig`
- Keep existing styling and positioning

### 3. Create Diagram Generation Logic

**File**: `frontend/src/components/orchestrations/diagrams/DynamicDiagram.tsx` (NEW)

**Purpose**: Generate diagrams from orchestration configs using existing utilities
**Approach**: Use existing `createEdgeFromString()` from `diagramMapper.ts`

#### 3.1 Node Generation

```typescript
// Agent color mapping
const agentColors: Record<string, string> = {
  research: "#2563eb", // blue
  strategy: "#ec4899", // pink
  trending: "#22c55e", // green
  story: "#7c3aed", // purple
  "pr-manager": "#64748b", // gray
  visual_prompt_generator: "#f59e0b", // amber
  modular_elements_recommender: "#06b6d4", // cyan
  trend_cultural_analyzer: "#8b5cf6", // violet
  brand_qa: "#ef4444", // red
};

// Node positioning algorithms
const calculateNodePosition = (index: number, totalAgents: number) => {
  const centerX = 600;
  const centerY = 300;

  if (totalAgents <= 1) return { x: centerX, y: centerY };
  if (totalAgents === 2) {
    return index === 0
      ? { x: centerX - 200, y: centerY }
      : { x: centerX + 200, y: centerY };
  }
  // ... more positioning logic for 3+ agents
};

// Generate nodes for agents
const generateNodes = (agents: string[]) => {
  return agents.map((agent, index) => ({
    id: agent,
    label: getAgentDisplayName(agent),
    position: calculateNodePosition(index, agents.length),
    connectors: generateConnectors(agent),
    style: { border: `2px solid ${agentColors[agent] || "#64748b"}` },
  }));
};
```

#### 3.2 Edge Generation

```typescript
// Generate connection strings for sequential workflow
const generateSequentialConnections = (agents: string[]): string[] => {
  const connections = [];
  for (let i = 0; i < agents.length - 1; i++) {
    connections.push(`${agents[i]}:R -> ${agents[i + 1]}:L`);
  }
  return connections;
};

// Generate diagram config using existing utilities
export const generateDiagramFromOrchestration = (orchestration: any) => {
  if (!orchestration.agents || orchestration.agents.length === 0) {
    return generateEmptyDiagram();
  }

  const nodes = generateNodes(orchestration.agents);
  const connections = generateSequentialConnections(orchestration.agents);
  const edges = connections.map((conn) =>
    createEdgeFromString(conn, {
      color: "#2563eb",
      dashed: true,
      animated: true,
    })
  );

  return { nodes, edges };
};
```

#### 3.3 Error Handling & Edge Cases

```typescript
// Handle edge cases
const generateEmptyDiagram = () => ({
  nodes: [{ id: "empty", label: "No Agents", position: { x: 600, y: 300 } }],
  edges: [],
});

// Validate orchestration before generating diagram
const validateOrchestration = (orchestration: any) => {
  if (!orchestration) throw new Error("Orchestration is required");
  if (!Array.isArray(orchestration.agents))
    throw new Error("Agents must be an array");
  return true;
};
```

### 4. Update WorkflowsPage to Show All Orchestrations

**File**: `frontend/src/components/WorkflowsPage.tsx`

**Current State**: Hardcoded `hyattNodes` and `hyattEdges`, shows only Hyatt
**Goal**: Show all orchestrations with diagram generation capability

**Changes Needed**:

- **Load all orchestrations** from API instead of hardcoded list
- **Show orchestrations regardless of diagram status** - don't filter out those without diagrams
- **Add "Generate Workflow Diagram" button** for orchestrations without diagrams
- **Import diagram configs** from `./orchestrations/diagrams/` for existing diagrams
- **Generate diagrams on-demand** using the planned generation system
- **Use existing ReactFlow setup** and node types
- **Handle diagram generation state** - loading, success, error states

**UI Changes**:

- Replace hardcoded `workflows` array with dynamic orchestration loading
- Add status indicators: "Has Diagram" vs. "Generate Diagram" button
- Add loading states for diagram generation
- Show error messages if generation fails

### 5. Add "Generate Workflow Diagram" Functionality

**Purpose**: Allow users to generate diagrams for existing orchestrations that don't have diagrams yet

**Files**:

- `frontend/src/components/WorkflowsPage.tsx` - UI for generate button
- `frontend/src/utils/diagramGenerator.ts` - Generation logic
- `pages/api/generate-diagram.js` - API endpoint for generation

**Current State**: No way to generate diagrams for existing orchestrations
**Goal**: Provide "Generate Workflow Diagram" button for orchestrations without diagrams

**Changes Needed**:

- **Add "Generate Workflow Diagram" button** in WorkflowsPage for orchestrations without diagrams
- **Create diagram generation API endpoint** to handle generation requests
- **Load orchestration config** from existing system
- **Generate diagram** using the planned generation system
- **Save diagram config** to diagrams folder
- **Update orchestration metadata** to indicate diagram exists
- **Handle generation states** - loading, success, error
- **Provide user feedback** - success messages, error handling

**User Experience**:

1. User sees orchestration in Workflows page without diagram
2. User clicks "Generate Workflow Diagram" button
3. System loads orchestration config and generates diagram
4. Diagram is saved and displayed immediately
5. User can now view the generated diagram

### 6. Extend Orchestration Builder

**File**: `frontend/src/components/orchestrations/OrchestrationBuilderPage.tsx`

**Current State**: Generates orchestration configs
**Goal**: Also generate diagrams using existing utilities

**Changes Needed**:

- Import `generateDiagramFromOrchestration()` from diagrams folder
- Add diagram config to generated orchestration spec
- Show diagram preview in generation modal

### 7. Update Save API

**File**: `pages/api/save-orchestration.js`

**Current State**: Saves orchestration configs
**Goal**: Also save diagram configs

**Changes Needed**:

- Generate diagram when saving orchestration
- Save diagram config alongside orchestration data
- Store diagram in `{orchestration-id}-diagram.json`

### 8. Add Diagram to Orchestration Pages

**Files**: Various orchestration page components

**Current State**: No diagrams in orchestration pages
**Goal**: Show workflow diagrams in orchestration interfaces

**Changes Needed**:

- Import diagram configs from diagrams folder
- Add diagram tab/section to orchestration pages
- Use existing ReactFlow setup from WorkflowsPage

### 9. Performance & Caching Strategy

**Purpose**: Ensure good performance with multiple diagrams
**Approach**: Implement caching and lazy loading

**Changes Needed**:

- **Diagram Caching**: Cache generated diagrams to avoid regeneration
- **Lazy Loading**: Load diagrams only when needed
- **Memory Management**: Clean up unused diagram instances
- **ReactFlow Optimization**: Use React.memo for diagram components

```typescript
// Diagram caching utility
const diagramCache = new Map<string, DiagramConfig>();

const getCachedDiagram = (orchestrationId: string) => {
  if (diagramCache.has(orchestrationId)) {
    return diagramCache.get(orchestrationId);
  }
  return null;
};

const cacheDiagram = (orchestrationId: string, diagram: DiagramConfig) => {
  diagramCache.set(orchestrationId, diagram);
};
```

### 10. Testing Strategy

**Purpose**: Ensure diagram generation and display work correctly
**Approach**: Comprehensive testing at multiple levels

**Changes Needed**:

- **Unit Tests**: Test diagram generation functions
- **Integration Tests**: Test diagram display in components
- **Visual Regression Tests**: Ensure visual consistency
- **Performance Tests**: Test with many diagrams

```typescript
// Example test structure
describe("Diagram Generation", () => {
  test("generates nodes for agents", () => {
    const orchestration = { agents: ["research", "trending"] };
    const diagram = generateDiagramFromOrchestration(orchestration);
    expect(diagram.nodes).toHaveLength(2);
  });

  test("handles empty agents array", () => {
    const orchestration = { agents: [] };
    const diagram = generateDiagramFromOrchestration(orchestration);
    expect(diagram.nodes).toHaveLength(1); // empty node
  });
});
```

### 11. Data Flow & State Management

**Purpose**: Ensure proper data flow between components
**Approach**: Clear data flow specification

**Changes Needed**:

- **Orchestration Loading**: Load orchestrations from API
- **Diagram Generation**: Generate diagrams on-demand
- **State Updates**: Handle orchestration updates
- **Error Handling**: Graceful degradation on failures

```typescript
// Data flow specification
interface DiagramState {
  orchestrations: Orchestration[];
  diagrams: Map<string, DiagramConfig>;
  loading: boolean;
  error: string | null;
}

// State management hooks
const useDiagramState = () => {
  const [state, setState] = useState<DiagramState>({
    orchestrations: [],
    diagrams: new Map(),
    loading: false,
    error: null,
  });

  const loadOrchestrations = async () => {
    // Load orchestrations and generate diagrams
  };

  return { state, loadOrchestrations };
};
```

## Dependencies

- ✅ Existing diagram mapping system (`diagramMapper.ts`)
- ✅ ReactFlow library (already implemented)
- ✅ Orchestration Builder API (already implemented)
- ✅ Working diagram display system

## Success Criteria

- [ ] New orchestrations automatically get diagrams
- [ ] All orchestrations show in Workflows page
- [ ] Diagrams are visually consistent with existing Hyatt diagram
- [ ] Diagrams accurately represent agent relationships
- [ ] Performance remains good with multiple diagrams

## Key Principles

1. **Build on Existing Foundation**: Use existing `createEdgeFromString()` and ReactFlow setup
2. **Reuse Working Components**: Extend `WorkflowsPage.tsx` instead of rebuilding
3. **Maintain Visual Consistency**: Use existing color coding and styling
4. **Leverage Existing Utilities**: Use `diagramMapper.ts` functions for all diagram operations
5. **Backward Compatibility**: Ensure existing Hyatt diagram continues to work
6. **Graceful Degradation**: Handle errors and edge cases gracefully
7. **Performance First**: Optimize for multiple diagrams and large workflows

## Notes

- The existing `createEdgeFromString()` utility is perfect for our needs
- The existing ReactFlow setup in `WorkflowsPage.tsx` is working well
- We should extend rather than replace existing functionality
- Use established color coding for agent types (blue, pink, green, purple)
- Maintain the existing node styling and handle positioning
