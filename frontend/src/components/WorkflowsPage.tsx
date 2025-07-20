import React, { useState, memo, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { hyattDiagramConfig } from "./orchestrations/diagrams";
import { diagramToReactFlow } from "../utils/diagramMapper";
import DocumentationViewer from "./orchestrations/DocumentationViewer";
import OrchestrationEditor from "./orchestrations/OrchestrationEditor";

// Removed unused variables: outlinedStyle and agentColors

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

const { nodes: hyattNodes, edges: hyattEdges } =
  diagramToReactFlow(hyattDiagramConfig);

interface TabNavigationProps {
  activeTab: "workflow" | "details" | "edit";
  onTabChange: (tab: "workflow" | "details" | "edit") => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => (
  <div className="flex space-x-1 mb-4">
    <button
      onClick={() => onTabChange("workflow")}
      className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
        activeTab === "workflow"
          ? "bg-white text-primary border-b-2 border-primary"
          : "bg-secondary text-text-secondary hover:bg-primary-light"
      }`}
    >
      Workflow
    </button>
    <button
      onClick={() => onTabChange("details")}
      className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
        activeTab === "details"
          ? "bg-white text-primary border-b-2 border-primary"
          : "bg-secondary text-text-secondary hover:bg-primary-light"
      }`}
    >
      Details
    </button>
    <button
      onClick={() => onTabChange("edit")}
      className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
        activeTab === "edit"
          ? "bg-white text-primary border-b-2 border-primary"
          : "bg-secondary text-text-secondary hover:bg-primary-light"
      }`}
    >
      Edit
    </button>
  </div>
);

const WorkflowsPage: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(
    "hyatt"
  );
  const [activeTab, setActiveTab] = useState<"workflow" | "details" | "edit">(
    "workflow"
  );
  const [lastActiveTab, setLastActiveTab] = useState<Record<string, string>>({});

  const handleTabChange = (tab: "workflow" | "details" | "edit") => {
    setActiveTab(tab);
    if (selectedWorkflow) {
      setLastActiveTab((prev) => ({ ...prev, [selectedWorkflow]: tab }));
    }
  };

  // State for orchestrations and diagrams
  const [orchestrations, setOrchestrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingDiagram, setGeneratingDiagram] = useState<string | null>(
    null
  );

  // Load orchestrations on component mount
  useEffect(() => {
    const loadOrchestrations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/orchestrations");
        if (response.ok) {
          const data = await response.json();
          setOrchestrations(Object.values(data.orchestrators || {}));
        } else {
          // Fallback to demo data if API fails
          setOrchestrations([
            { id: "hyatt", name: "Hyatt Orchestrator", hasDiagram: true },
            { id: "hive", name: "Hive Orchestrator", hasDiagram: false },
          ]);
        }
      } catch (error) {
        console.error("Failed to load orchestrations:", error);
        // Fallback to demo data
        setOrchestrations([
          { id: "hyatt", name: "Hyatt Orchestrator", hasDiagram: true },
          { id: "hive", name: "Hive Orchestrator", hasDiagram: false },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadOrchestrations();
  }, []);

  useEffect(() => {
    if (selectedWorkflow && lastActiveTab[selectedWorkflow]) {
      setActiveTab(lastActiveTab[selectedWorkflow] as any);
    } else {
      setActiveTab("workflow");
    }
  }, [selectedWorkflow, lastActiveTab]);

  // Handle diagram generation
  const handleGenerateDiagram = async (orchestrationId: string) => {
    setGeneratingDiagram(orchestrationId);
    try {
      const res = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orchestrationId }),
      });
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      if (data.diagram) {
        const { nodes, edges } = diagramToReactFlow(data.diagram);
        console.log("Generated diagram nodes:", nodes);
        console.log("Generated diagram edges:", edges);
      }

      setOrchestrations((prev) =>
        prev.map((orch) =>
          orch.id === orchestrationId ? { ...orch, hasDiagram: true } : orch
        )
      );
    } catch (error) {
      console.error("Failed to generate diagram:", error);
      alert("Failed to generate diagram. Please try again.");
    } finally {
      setGeneratingDiagram(null);
    }
  };

  // Check if a diagram exists for display
  const hasDiagramForDisplay = (orchestrationId: string): boolean => {
    // Hyatt has a hardcoded diagram
    if (orchestrationId === "hyatt") return true;

    // Check if orchestration has diagram flag
    const orchestration = orchestrations.find((o) => o.id === orchestrationId);
    return orchestration?.hasDiagram || false;
  };

  // Debug logging
  console.log("Nodes:", hyattNodes);
  console.log("Edges:", hyattEdges);

  return (
    <div className="flex h-[90vh] bg-secondary rounded-lg shadow p-4">
      {/* Left sidebar */}
      <div className="w-64 pr-6 border-r border-border bg-white rounded-l-lg flex flex-col">
        <h2 className="text-xl font-bold mb-4 mt-2">Workflows</h2>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ul className="flex-1">
            {orchestrations.map((orchestration) => (
              <li key={orchestration.id} className="mb-2">
                <div className="flex items-center justify-between">
                  <button
                    className={`flex-1 text-left py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                      selectedWorkflow === orchestration.id
                        ? "bg-primary text-white"
                        : "bg-secondary text-text-primary hover:bg-primary-light"
                    }`}
                    onClick={() => setSelectedWorkflow(orchestration.id)}
                  >
                    {orchestration.name}
                  </button>
                  {!hasDiagramForDisplay(orchestration.id) && (
                    <button
                      onClick={() => handleGenerateDiagram(orchestration.id)}
                      disabled={generatingDiagram === orchestration.id}
                      className="ml-2 px-3 py-1 text-xs bg-success text-white rounded hover:bg-success-hover disabled:bg-secondary disabled:cursor-not-allowed transition-colors"
                    >
                      {generatingDiagram === orchestration.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      ) : (
                        "Generate WFD"
                      )}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Right content pane */}
      <div className="flex-1 pl-6 flex flex-col">
        {selectedWorkflow ? (
          <>
            <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            {activeTab === "workflow" && (
              hasDiagramForDisplay(selectedWorkflow) ? (
                <div className="border rounded-lg p-6 bg-white shadow flex-1">
                  <h3 className="text-xl font-semibold mb-4">
                    {orchestrations.find((o) => o.id === selectedWorkflow)?.name ||
                      selectedWorkflow}{" "}
                    Workflow Diagram
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
              ) : (
                <div className="border rounded-lg p-6 bg-white shadow flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      {orchestrations.find((o) => o.id === selectedWorkflow)?.name ||
                        selectedWorkflow}
                    </h3>
                    <p className="text-text-muted mb-4">
                      No workflow diagram available for this orchestration.
                    </p>
                    <button
                      onClick={() => handleGenerateDiagram(selectedWorkflow)}
                      disabled={generatingDiagram === selectedWorkflow}
                      className="px-4 py-2 bg-success text-white rounded hover:bg-success-hover disabled:bg-secondary disabled:cursor-not-allowed transition-colors"
                    >
                      {generatingDiagram === selectedWorkflow ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating Diagram...</span>
                        </div>
                      ) : (
                        "Generate Workflow Diagram"
                      )}
                    </button>
                  </div>
                </div>
              )
            )}
            {activeTab === "details" && (
              <div className="border rounded-lg p-6 bg-white shadow flex-1 overflow-y-auto">
                <DocumentationViewer
                  orchestrationId={
                    (
                      orchestrations.find((o) => o.id === selectedWorkflow)
                        ?.documentationPath || selectedWorkflow
                    )
                      .replace(/.*\/(.*)\.md$/, "$1")
                  }
                />
              </div>
            )}
            {activeTab === "edit" && (
              <div className="border rounded-lg p-6 bg-white shadow flex-1 overflow-y-auto">
                <OrchestrationEditor
                  orchestrationId={selectedWorkflow}
                  orchestration={
                    orchestrations.find((o) => o.id === selectedWorkflow) || {}
                  }
                />
              </div>
            )}
          </>
        ) : (
          <div className="border rounded-lg p-6 bg-white shadow flex-1 flex items-center justify-center">
            <p className="text-text-muted">
              Select an orchestration to view its workflow diagram.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowsPage;
