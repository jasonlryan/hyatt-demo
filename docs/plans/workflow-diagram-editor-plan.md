# Workflow Diagram Editor Implementation Plan

## 🎯 **Overview**

Implement a comprehensive workflow diagram editor that allows users to visually edit orchestration workflows by moving nodes and managing connectors. This will transform the current read-only diagram view into an interactive editing experience.

## 🎯 **Goals**

1. **Interactive Node Movement**: Drag and drop nodes to reposition them
2. **Dynamic Connector Management**: Add, remove, and modify connections between nodes
3. **Real-time Validation**: Validate workflow integrity during editing
4. **Visual Feedback**: Clear visual indicators for valid/invalid connections
5. **Undo/Redo Support**: Full editing history with undo/redo capabilities
6. **Save/Export**: Persist changes and export updated workflows

## 🏗️ **Current State Analysis**

### **Existing Infrastructure**

- **ReactFlow**: Current diagram rendering system
- **WorkflowsPage.tsx**: Main component with diagram display
- **Diagram Data**: JSON-based workflow definitions
- **API Endpoints**: `/api/orchestrations`, `/api/generate-diagram`

### **Current Limitations**

- **Read-only diagrams**: No editing capabilities
- **Static layouts**: Fixed node positions
- **No connection management**: Can't modify workflow logic
- **Limited interactivity**: View-only experience

## 📋 **Implementation Phases**

### **Phase 1: Interactive Node Movement (Foundation)**

**Goal**: Enable drag-and-drop node repositioning

#### **1.1 Update ReactFlow Configuration**

**File**: `frontend/src/components/WorkflowsPage.tsx`

**Changes**:

```typescript
// Enable node dragging
const nodeTypes = {
  agent: AgentNode,
  workflow: WorkflowNode,
  decision: DecisionNode,
};

const defaultEdgeOptions = {
  type: "smoothstep",
  animated: true,
  style: { stroke: "#6366f1", strokeWidth: 2 },
};

// Add drag handlers
const onNodeDragStart = (event: React.MouseEvent, node: Node) => {
  console.log("Node drag started:", node);
};

const onNodeDrag = (event: React.MouseEvent, node: Node) => {
  // Update node position in real-time
  setNodes((nds) =>
    nds.map((n) => {
      if (n.id === node.id) {
        return { ...n, position: node.position };
      }
      return n;
    })
  );
};

const onNodeDragStop = (event: React.MouseEvent, node: Node) => {
  console.log("Node drag stopped:", node);
  // Save new position to state
  updateNodePosition(node.id, node.position);
};
```

#### **1.2 Node Position State Management**

**File**: `frontend/src/hooks/useWorkflowEditor.ts`

**Implementation**:

```typescript
import { useState, useCallback } from "react";
import { Node, Edge, Position } from "reactflow";

interface WorkflowEditorState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  isEditing: boolean;
}

export const useWorkflowEditor = (initialWorkflow: any) => {
  const [state, setState] = useState<WorkflowEditorState>({
    nodes: initialWorkflow.nodes || [],
    edges: initialWorkflow.edges || [],
    selectedNode: null,
    isEditing: false,
  });

  const updateNodePosition = useCallback(
    (nodeId: string, position: Position) => {
      setState((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === nodeId ? { ...node, position } : node
        ),
      }));
    },
    []
  );

  const selectNode = useCallback((nodeId: string | null) => {
    setState((prev) => ({ ...prev, selectedNode: nodeId }));
  }, []);

  const toggleEditing = useCallback(() => {
    setState((prev) => ({ ...prev, isEditing: !prev.isEditing }));
  }, []);

  return {
    ...state,
    updateNodePosition,
    selectNode,
    toggleEditing,
  };
};
```

#### **1.3 Visual Feedback for Dragging**

**File**: `frontend/src/components/nodes/EditableAgentNode.tsx`

**Implementation**:

```typescript
import React, { memo } from "react";
import { Handle, Position } from "reactflow";

interface EditableAgentNodeProps {
  data: {
    label: string;
    agentType: string;
    isSelected: boolean;
    isDragging: boolean;
  };
}

const EditableAgentNode: React.FC<EditableAgentNodeProps> = memo(({ data }) => {
  return (
    <div
      className={`
        relative bg-white border-2 rounded-lg p-4 shadow-md transition-all
        ${
          data.isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border"
        }
        ${data.isDragging ? "shadow-lg scale-105" : ""}
        hover:shadow-md cursor-move
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-white"
      />

      <div className="text-center">
        <div className="font-medium text-text-primary">{data.label}</div>
        <div className="text-sm text-text-muted">{data.agentType}</div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
    </div>
  );
});

export default EditableAgentNode;
```

### **Phase 2: Connector Management (Core Feature)**

**Goal**: Enable adding, removing, and modifying connections

#### **2.1 Connection Validation System**

**File**: `frontend/src/utils/connectionValidator.ts`

**Implementation**:

```typescript
interface ConnectionRule {
  sourceType: string;
  targetType: string;
  allowed: boolean;
  validationMessage?: string;
}

const CONNECTION_RULES: ConnectionRule[] = [
  {
    sourceType: "agent",
    targetType: "agent",
    allowed: true,
  },
  {
    sourceType: "workflow",
    targetType: "agent",
    allowed: true,
  },
  {
    sourceType: "decision",
    targetType: "agent",
    allowed: true,
  },
  {
    sourceType: "agent",
    targetType: "decision",
    allowed: true,
  },
  {
    sourceType: "decision",
    targetType: "decision",
    allowed: false,
    validationMessage: "Decisions cannot connect to other decisions",
  },
];

export class ConnectionValidator {
  static validateConnection(
    sourceNode: Node,
    targetNode: Node,
    existingEdges: Edge[]
  ): { isValid: boolean; message?: string } {
    // Check connection rules
    const rule = CONNECTION_RULES.find(
      (r) =>
        r.sourceType === sourceNode.type && r.targetType === targetNode.type
    );

    if (!rule || !rule.allowed) {
      return {
        isValid: false,
        message: rule?.validationMessage || "Invalid connection type",
      };
    }

    // Check for duplicate connections
    const existingConnection = existingEdges.find(
      (edge) => edge.source === sourceNode.id && edge.target === targetNode.id
    );

    if (existingConnection) {
      return {
        isValid: false,
        message: "Connection already exists",
      };
    }

    // Check for circular connections
    if (this.wouldCreateCycle(sourceNode.id, targetNode.id, existingEdges)) {
      return {
        isValid: false,
        message: "Connection would create a cycle",
      };
    }

    return { isValid: true };
  }

  private static wouldCreateCycle(
    sourceId: string,
    targetId: string,
    edges: Edge[]
  ): boolean {
    // Simple cycle detection - can be enhanced with more sophisticated algorithms
    const visited = new Set<string>();
    const stack = [targetId];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (current === sourceId) {
        return true; // Cycle detected
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      // Find all nodes that current connects to
      const connectedNodes = edges
        .filter((edge) => edge.source === current)
        .map((edge) => edge.target);

      stack.push(...connectedNodes);
    }

    return false;
  }
}
```

#### **2.2 Connection Event Handlers**

**File**: `frontend/src/components/WorkflowsPage.tsx`

**Implementation**:

```typescript
const onConnectStart = (event: React.MouseEvent, params: any) => {
  console.log("Connection start:", params);
  setConnectionStart(params);
};

const onConnectEnd = (event: React.MouseEvent) => {
  console.log("Connection end");
  setConnectionStart(null);
};

const onConnect = (params: Connection) => {
  const sourceNode = nodes.find((n) => n.id === params.source);
  const targetNode = nodes.find((n) => n.id === params.target);

  if (!sourceNode || !targetNode) {
    console.error("Source or target node not found");
    return;
  }

  const validation = ConnectionValidator.validateConnection(
    sourceNode,
    targetNode,
    edges
  );

  if (!validation.isValid) {
    // Show error message
    setConnectionError(validation.message);
    return;
  }

  // Add new connection
  const newEdge: Edge = {
    id: `e${sourceNode.id}-${targetNode.id}`,
    source: params.source!,
    target: params.target!,
    type: "smoothstep",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 2 },
  };

  setEdges((prev) => [...prev, newEdge]);
  setConnectionError(null);
};
```

#### **2.3 Connection UI Components**

**File**: `frontend/src/components/ConnectionPanel.tsx`

**Implementation**:

```typescript
interface ConnectionPanelProps {
  selectedEdge: Edge | null;
  onDeleteConnection: (edgeId: string) => void;
  onUpdateConnection: (edgeId: string, updates: Partial<Edge>) => void;
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  selectedEdge,
  onDeleteConnection,
  onUpdateConnection,
}) => {
  if (!selectedEdge) {
    return (
      <div className="p-4 text-center text-text-muted">
        Select a connection to edit
      </div>
    );
  }

  return (
    <div className="p-4 border-l border-border">
      <h3 className="font-medium text-text-primary mb-4">
        Connection Properties
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Connection Type
          </label>
          <select
            value={selectedEdge.type || "smoothstep"}
            onChange={(e) =>
              onUpdateConnection(selectedEdge.id, { type: e.target.value })
            }
            className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="smoothstep">Smooth Step</option>
            <option value="straight">Straight</option>
            <option value="step">Step</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Animation
          </label>
          <input
            type="checkbox"
            checked={selectedEdge.animated || false}
            onChange={(e) =>
              onUpdateConnection(selectedEdge.id, {
                animated: e.target.checked,
              })
            }
            className="mr-2"
          />
          <span className="text-sm text-text-secondary">Animated</span>
        </div>

        <button
          onClick={() => onDeleteConnection(selectedEdge.id)}
          className="w-full px-4 py-2 bg-error hover:bg-error-hover text-white rounded-md transition-colors"
        >
          Delete Connection
        </button>
      </div>
    </div>
  );
};
```

### **Phase 3: Undo/Redo System (User Experience)**

**Goal**: Implement full editing history with undo/redo

#### **3.1 History Management**

**File**: `frontend/src/hooks/useWorkflowHistory.ts`

**Implementation**:

```typescript
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

export const useWorkflowHistory = () => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  const addToHistory = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      if (isUndoRedo) {
        setIsUndoRedo(false);
        return;
      }

      const newState: HistoryState = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        // Remove any states after current index
        const newHistory = prev.slice(0, currentIndex + 1);
        return [...newHistory, newState];
      });

      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, isUndoRedo]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setIsUndoRedo(true);
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setIsUndoRedo(true);
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
```

#### **3.2 Undo/Redo UI**

**File**: `frontend/src/components/EditToolbar.tsx`

**Implementation**:

```typescript
interface EditToolbarProps {
  isEditing: boolean;
  onToggleEditing: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onReset: () => void;
}

const EditToolbar: React.FC<EditToolbarProps> = ({
  isEditing,
  onToggleEditing,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onReset,
}) => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-white border-b border-border">
      <button
        onClick={onToggleEditing}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          isEditing
            ? "bg-primary text-white"
            : "bg-secondary text-text-secondary hover:bg-primary-light"
        }`}
      >
        {isEditing ? "Exit Edit Mode" : "Edit Workflow"}
      </button>

      {isEditing && (
        <>
          <div className="flex items-center space-x-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <UndoIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <RedoIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={onReset}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-success hover:bg-success-hover text-white rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};
```

### **Phase 4: Save/Export Functionality (Persistence)**

**Goal**: Persist workflow changes and export updated diagrams

#### **4.1 Save API Endpoint**

**File**: `pages/api/save-workflow.js`

**Implementation**:

```javascript
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { workflowId, nodes, edges, metadata } = req.body;

    // Validate workflow data
    if (!workflowId || !nodes || !edges) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save to database or file system
    const workflowData = {
      id: workflowId,
      nodes,
      edges,
      metadata: {
        ...metadata,
        lastModified: new Date().toISOString(),
        version: (metadata.version || 0) + 1,
      },
    };

    // Save workflow (implementation depends on your storage solution)
    await saveWorkflow(workflowData);

    res.status(200).json({
      message: "Workflow saved successfully",
      workflow: workflowData,
    });
  } catch (error) {
    console.error("Save workflow failed:", error);
    res.status(500).json({ message: "Failed to save workflow" });
  }
}
```

#### **4.2 Export Functionality**

**File**: `frontend/src/utils/workflowExporter.ts`

**Implementation**:

```typescript
export class WorkflowExporter {
  static exportAsJSON(nodes: Node[], edges: Edge[], metadata: any) {
    const workflowData = {
      nodes,
      edges,
      metadata: {
        ...metadata,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      },
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${metadata.name || "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static exportAsImage(containerRef: React.RefObject<HTMLDivElement>) {
    if (!containerRef.current) return;

    html2canvas(containerRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "workflow-diagram.png";
      a.click();
    });
  }

  static exportAsSVG(containerRef: React.RefObject<HTMLDivElement>) {
    if (!containerRef.current) return;

    const svgElement = containerRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow-diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

## 🧪 **Testing Strategy**

### **Unit Tests**

- Node movement validation
- Connection validation rules
- Undo/redo functionality
- Export functionality

### **Integration Tests**

- ReactFlow integration
- API endpoint functionality
- State management
- Error handling

### **E2E Tests**

- Complete editing workflow
- Save and load functionality
- Export operations
- Error scenarios

## 📊 **Success Metrics**

### **User Experience**

- Node movement response time < 100ms
- Connection validation feedback < 50ms
- Undo/redo operation time < 200ms
- Save operation success rate > 95%

### **Technical Performance**

- Diagram rendering performance maintained
- Memory usage optimization
- Smooth animations (60fps)
- Responsive UI interactions

### **Feature Adoption**

- Edit mode usage > 70% of workflow page visits
- Connection management usage > 50%
- Save functionality usage > 80%

## 🚧 **Implementation Risks**

### **Technical Risks**

1. **ReactFlow Performance**: Large diagrams affecting performance
2. **State Management Complexity**: Complex undo/redo state handling
3. **Connection Validation**: Complex workflow validation rules
4. **Data Persistence**: Workflow data integrity and versioning

### **Mitigation Strategies**

1. **Performance Optimization**: Implement virtual scrolling for large diagrams
2. **Incremental Development**: Build features incrementally with thorough testing
3. **Validation Framework**: Comprehensive testing of validation rules
4. **Backup Systems**: Automatic backup and recovery mechanisms

## 📅 **Implementation Timeline**

### **Week 1: Phase 1 (Node Movement)**

- Update ReactFlow configuration
- Implement node position state management
- Add visual feedback for dragging
- Basic testing and validation

### **Week 2: Phase 2 (Connector Management)**

- Implement connection validation system
- Add connection event handlers
- Create connection UI components
- Test connection scenarios

### **Week 3: Phase 3 (Undo/Redo)**

- Implement history management
- Add undo/redo UI components
- Test history functionality
- Performance optimization

### **Week 4: Phase 4 (Save/Export)**

- Create save API endpoint
- Implement export functionality
- Add persistence layer
- Final testing and polish

## 🔄 **Future Enhancements**

### **Phase 5: Advanced Features**

- **Node Templates**: Pre-built node configurations
- **Workflow Templates**: Complete workflow patterns
- **Collaborative Editing**: Real-time multi-user editing
- **Version Control**: Git-like workflow versioning

### **Phase 6: AI Integration**

- **Auto-layout**: AI-powered diagram layout optimization
- **Smart Suggestions**: AI-suggested connections and improvements
- **Workflow Analysis**: AI-powered workflow optimization suggestions

### **Phase 7: Advanced Export**

- **PDF Export**: High-quality PDF documentation
- **Code Generation**: Generate code from workflow diagrams
- **Integration Export**: Export to external workflow engines

---

**Status**: 🚧 Planning Phase  
**Priority**: 🔴 High  
**Estimated Effort**: 4 weeks  
**Dependencies**: ReactFlow, existing workflow infrastructure  
**Risk Level**: Medium (mitigated by phased approach)  
**Success Criteria**: Fully functional workflow diagram editor with node movement and connector management
