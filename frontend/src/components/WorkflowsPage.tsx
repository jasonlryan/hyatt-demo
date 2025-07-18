import React, { useState, memo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

const workflows = [{ id: "hyatt", name: "Hyatt" }];

const outlinedStyle = {
  background: "#fff",
  border: "2px solid #64748b",
  color: "#222",
};

const agentColors = {
  research: "#2563eb", // blue
  strategy: "#ec4899", // pink
  trending: "#22c55e", // green
  story: "#7c3aed", // purple
};

const CustomNode = memo(({ data, id }: NodeProps) => {
  // Special case for brief and final nodes
  if (id === "brief") {
    return (
      <div
        style={{
          ...(data.style || {}),
          borderRadius: 8,
          padding: 8,
          minWidth: 220,
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        <div>{data.label}</div>
        <Handle
          type="source"
          position={Position.Right}
          id="source-right"
          style={{ background: "#222" }}
        />
      </div>
    );
  }
  if (id === "final") {
    return (
      <div
        style={{
          ...(data.style || {}),
          borderRadius: 8,
          padding: 8,
          minWidth: 220,
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          id="target-left"
          style={{ background: "#222" }}
        />
        <div>{data.label}</div>
      </div>
    );
  }
  // Special case for PR Manager node: specific handles for each connection
  if (id === "pr") {
    return (
      <div
        style={{
          ...(data.style || {}),
          borderRadius: 8,
          padding: 8,
          minWidth: 160,
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          id="target-left"
          style={{ background: "#64748b" }}
        />
        <Handle
          type="target"
          position={Position.Top}
          id="target-top"
          style={{ background: "#64748b" }}
        />
        <Handle
          type="target"
          position={Position.Right}
          id="target-right"
          style={{ background: "#64748b" }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id="target-bottom"
          style={{ background: "#64748b" }}
        />
        <div>{data.label}</div>
        <Handle
          type="source"
          position={Position.Top}
          id="source-top"
          style={{ background: "#64748b" }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="source-left"
          style={{ background: "#64748b" }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="source-right"
          style={{ background: "#64748b" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="source-bottom"
          style={{ background: "#64748b" }}
        />
      </div>
    );
  }
  // Default for all other nodes
  return (
    <div
      style={{
        ...(data.style || {}),
        borderRadius: 8,
        padding: 8,
        minWidth: 160,
        textAlign: "center",
        fontWeight: 500,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        style={{ background: "#64748b" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        style={{ background: "#64748b" }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        style={{ background: "#64748b" }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        style={{ background: "#64748b" }}
      />
      <div>{data.label}</div>
      <Handle
        type="source"
        position={Position.Top}
        id="source-top"
        style={{ background: "#64748b" }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        style={{ background: "#64748b" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        style={{ background: "#64748b" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        style={{ background: "#64748b" }}
      />
    </div>
  );
});

const nodeTypes = {
  custom: CustomNode,
};

// Node positions for diamond/compass layout (PR Manager at center, agents at NE, NW, SE, SW)
const centerX = 600;
const centerY = 300;
const offsetX = 220;
const offsetY = 160;
const hyattNodes = [
  {
    id: "brief",
    type: "custom", // changed from 'input' to 'custom'
    data: { label: "Campaign Brief", style: outlinedStyle },
    position: { x: centerX - 2 * offsetX, y: centerY },
  },
  {
    id: "pr",
    type: "custom",
    data: { label: "PR Manager", style: outlinedStyle },
    position: { x: centerX, y: centerY },
  },
  {
    id: "research",
    type: "custom",
    data: { label: "1. Research", style: outlinedStyle },
    position: { x: centerX - offsetX, y: centerY - offsetY },
  },
  {
    id: "strategy",
    type: "custom",
    data: { label: "2 Stratgy", style: outlinedStyle },
    position: { x: centerX - offsetX, y: centerY + offsetY },
  },
  {
    id: "trending",
    type: "custom",
    data: { label: "3. Trending News", style: outlinedStyle },
    position: { x: centerX + offsetX, y: centerY - offsetY },
  },
  {
    id: "story",
    type: "custom",
    data: { label: "4. Story Angles", style: outlinedStyle },
    position: { x: centerX + offsetX, y: centerY + offsetY },
  },
  {
    id: "final",
    type: "custom", // changed from 'output' to 'custom'
    data: { label: "Final Campaign Strategy", style: outlinedStyle },
    position: { x: centerX + 2 * offsetX, y: centerY },
  },
];

const hyattEdges = [
  // Black dashed line for brief to PR Manager (horizontal, straight, with arrow)
  {
    id: "brief-pr",
    source: "brief",
    target: "pr",
    style: { stroke: "#222", strokeWidth: 2, strokeDasharray: "6 4" },
    animated: true, // Add animation
    type: "straight",
    sourceHandle: "source-right",
    targetHandle: "target-left",
  },
  {
    id: "pr-final",
    source: "pr",
    target: "final",
    style: { stroke: "#222", strokeWidth: 2, strokeDasharray: "6 4" },
    animated: true, // Add animation
    type: "straight",
    sourceHandle: "source-right",
    targetHandle: "target-left",
  },
  // Research (blue, NW)
  {
    id: "pr-research",
    source: "pr",
    target: "research",
    style: {
      stroke: agentColors.research,
      strokeWidth: 2,
      strokeDasharray: "6 4",
    },
    animated: true,
    type: "default",
  },
  {
    id: "research-pr",
    source: "research",
    target: "pr",
    style: {
      stroke: agentColors.research,
      strokeWidth: 2,
      strokeDasharray: "6 4", // Make it dashed
    },
    animated: true, // Add animation
    type: "default",
    sourceHandle: "source-bottom", // From bottom of Research
    targetHandle: "target-left", // To left side of PR Manager
  },
  // Strategy (pink, SW)
  {
    id: "pr-strategy",
    source: "pr",
    target: "strategy",
    style: {
      stroke: agentColors.strategy,
      strokeWidth: 2,
      strokeDasharray: "6 4",
    },
    animated: true,
    type: "default",
    sourceHandle: "source-bottom", // From bottom of PR Manager
    targetHandle: "target-right", // To right side of Strategy
  },
  {
    id: "strategy-pr",
    source: "strategy",
    target: "pr",
    style: {
      stroke: agentColors.strategy,
      strokeWidth: 2,
      strokeDasharray: "6 4", // Make it dashed
    },
    animated: true, // Add animation
    type: "default",
  },
  // Trending (green, NE)
  {
    id: "pr-trending",
    source: "pr",
    target: "trending",
    style: {
      stroke: agentColors.trending,
      strokeWidth: 2,
      strokeDasharray: "6 4",
    },
    animated: true,
    type: "default",
  },
  {
    id: "trending-pr",
    source: "trending",
    target: "pr",
    style: {
      stroke: agentColors.trending,
      strokeWidth: 2,
      strokeDasharray: "6 4", // Make it dashed
    },
    animated: true, // Add animation
    type: "default",
    sourceHandle: "source-bottom", // From bottom of Trending News
    targetHandle: "target-right", // To right side of PR Manager
  },
  // Story Angles (purple, SE)
  {
    id: "pr-story",
    source: "pr",
    target: "story",
    style: {
      stroke: agentColors.story,
      strokeWidth: 2,
      strokeDasharray: "6 4",
    },
    animated: true,
    type: "default",
    sourceHandle: "source-bottom", // From bottom of PR Manager
    targetHandle: "target-left", // To left side of Story Angles
  },
  {
    id: "story-pr",
    source: "story",
    target: "pr",
    style: {
      stroke: agentColors.story,
      strokeWidth: 2,
      strokeDasharray: "6 4", // Make it dashed
    },
    animated: true, // Add animation
    type: "default",
    sourceHandle: "source-top", // From top of Story Angles
    targetHandle: "target-right", // To right side of PR Manager
  },
];

const WorkflowsPage: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(
    "hyatt"
  );

  // Debug logging
  console.log("Nodes:", hyattNodes);
  console.log("Edges:", hyattEdges);

  return (
    <div className="flex h-[90vh] bg-slate-50 rounded-lg shadow p-4">
      {/* Left sidebar */}
      <div className="w-64 pr-6 border-r border-slate-200 bg-white rounded-l-lg flex flex-col">
        <h2 className="text-xl font-bold mb-4 mt-2">Workflows</h2>
        <ul className="flex-1">
          {workflows.map((wf) => (
            <li key={wf.id}>
              <button
                className={`w-full text-left py-2 px-4 rounded-md font-medium transition-colors duration-200 mb-2 ${
                  selectedWorkflow === wf.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-800 hover:bg-blue-100"
                }`}
                onClick={() => setSelectedWorkflow(wf.id)}
              >
                {wf.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Right content pane */}
      <div className="flex-1 pl-6 flex flex-col">
        {selectedWorkflow === "hyatt" && (
          <div className="border rounded-lg p-6 bg-white shadow flex-1">
            <h3 className="text-xl font-semibold mb-4">
              Hyatt Workflow Diagram
            </h3>
            <div style={{ width: "100%", height: "800px", minWidth: "1400px" }}>
              <ReactFlow
                nodes={hyattNodes}
                edges={hyattEdges}
                nodeTypes={nodeTypes}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={true}
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
                panOnScroll={true}
              >
                <Background />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowsPage;
