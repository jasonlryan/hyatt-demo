import React, { useState, useEffect } from "react";

interface Orchestration {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  lastUpdated: string;
}

interface OrchestrationsPageProps {
  // Add any props as needed
}

const OrchestrationsPage: React.FC<OrchestrationsPageProps> = () => {
  const [orchestrations, setOrchestrations] = useState<Orchestration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load orchestrations data
    loadOrchestrations();
  }, []);

  const loadOrchestrations = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend endpoint is ready
      const mockOrchestrations: Orchestration[] = [
        {
          id: "agent-orchestrator",
          name: "Agent Orchestrator",
          type: "agent",
          status: "active",
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "hive-orchestrator",
          name: "Hive Orchestrator",
          type: "hive",
          status: "active",
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
      ];

      setOrchestrations(mockOrchestrations);
    } catch (err) {
      setError("Failed to load orchestrations");
      console.error("Error loading orchestrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100";
      case "inactive":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "agent":
        return "🤖";
      case "hive":
        return "🐝";
      default:
        return "⚙️";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">⚠️ {error}</div>
        <button
          onClick={loadOrchestrations}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Orchestrations
        </h1>
        <p className="text-gray-600">
          Manage and monitor AI agent orchestration workflows
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orchestrations.map((orchestration) => (
          <div
            key={orchestration.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getTypeIcon(orchestration.type)}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {orchestration.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {orchestration.type} Orchestrator
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  orchestration.status
                )}`}
              >
                {orchestration.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>
                  {new Date(orchestration.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Updated:</span>
                <span>
                  {new Date(orchestration.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                View Details
              </button>
              <button className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {orchestrations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⚙️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Orchestrations Found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first orchestration workflow.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create Orchestration
          </button>
        </div>
      )}
    </div>
  );
};

export default OrchestrationsPage;
