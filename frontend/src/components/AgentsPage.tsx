import React, { useState, useEffect } from "react";
import {
  Bot,
  Settings,
  FileText,
  Database,
  Cpu,
  Clock,
  Thermometer,
  Edit2,
  Save,
  X,
  Power,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import GlobalNav from "./GlobalNav";
import "../index.css";

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
  delay?: number;
  promptFile: string;
  role: string;
  priority: number;
  promptContent?: string;
}

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  supportsStructuredOutputs: boolean;
  recommended: boolean;
  costTier: string;
}

interface AgentsConfiguration {
  agents: { [key: string]: AgentConfig };
  global: {
    fallbackModel: string;
    fallbackMaxTokens: number;
    fallbackTimeout: number;
    enableRealDataSources: boolean;
    enableManualReview: boolean;
    enableQualityControl: boolean;
    enableDynamicFlow: boolean;
    enableAgentInteraction: boolean;
    enableAdaptiveRoles: boolean;
  };
  models: {
    available: ModelInfo[];
  };
  qualityThresholds: {
    minTrendRelevance: number;
    minAudienceConfidence: number;
    minStoryAngleStrength: number;
    skipWeakTrendsThreshold: number;
    alternativeStrategyTrigger: number;
    requireDataValidation: boolean;
  };
  dataSource: {
    enableRealDataSources: boolean;
    googleTrendsEnabled: boolean;
    newsApiEnabled: boolean;
    socialMediaEnabled: boolean;
    mockDataFallback: boolean;
  };
  system: {
    maxConcurrentCampaigns: number;
    cacheTtl: number;
    requestTimeout: number;
    healthCheckInterval: number;
    logLevel: string;
    debugMode: boolean;
  };
  metadata: {
    version: string;
    lastUpdated: string;
    updatedBy: string;
  };
}

const AgentsPage: React.FC = () => {
  const [config, setConfig] = useState<AgentsConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editedConfig, setEditedConfig] = useState<AgentsConfiguration | null>(
    null
  );
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [hiveDemoResult, setHiveDemoResult] = useState<any>(null);
  const [hiveDemoLoading, setHiveDemoLoading] = useState(false);
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    loadAgentsConfiguration();
  }, []);

  const loadAgentsConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/config/agents");
      const configData = await response.json();
      setConfig(configData);
      setEditedConfig(configData);

      // Load prompt content for each agent
      const agentsWithPrompts = { ...configData.agents };
      for (const agentId in agentsWithPrompts) {
        const agent = agentsWithPrompts[agentId];
        try {
          const promptResponse = await fetch(
            `/api/prompts/${agent.promptFile}`
          );
          const promptContent = await promptResponse.text();
          agentsWithPrompts[agentId] = { ...agent, promptContent };
        } catch (error) {
          console.warn(`Failed to load prompt for ${agent.name}:`, error);
          agentsWithPrompts[agentId] = {
            ...agent,
            promptContent: "Prompt not available",
          };
        }
      }

      const updatedConfig = { ...configData, agents: agentsWithPrompts };
      setConfig(updatedConfig);
      setEditedConfig(updatedConfig);
    } catch (error) {
      console.error("Failed to load agents configuration:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!editedConfig) return;

    try {
      setSaving(true);
      const response = await fetch("/api/config/agents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedConfig),
      });

      if (response.ok) {
        const result = await response.json();
        setConfig(result.config);
        setEditingAgent(null);
        alert("Configuration saved successfully!");
      } else {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
      alert("Failed to save configuration. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAgentConfigChange = (
    agentId: string,
    field: keyof AgentConfig,
    value: any
  ) => {
    if (!editedConfig) return;

    const updatedConfig = {
      ...editedConfig,
      agents: {
        ...editedConfig.agents,
        [agentId]: {
          ...editedConfig.agents[agentId],
          [field]: value,
        },
      },
    };
    setEditedConfig(updatedConfig);
  };

  const getModelTypeColor = (model: string) => {
    if (model.includes("gpt-4o")) return "bg-blue-100 text-blue-800";
    if (model.includes("gpt-4")) return "bg-green-100 text-green-800";
    if (model.includes("mini")) return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  const getTemperatureColor = (temperature: number) => {
    if (temperature <= 0.3) return "text-blue-600";
    if (temperature <= 0.6) return "text-green-600";
    return "text-orange-600";
  };

  const capriSunContext = {
    campaign: "Capri Sun Pouch Pallet",
    momentType: "Brand Rumor Response / Nostalgia Reassurance",
    visualObjective: "Reinforce pouch nostalgia while introducing new bottle",
    heroVisualDescription:
      "Classic Capri Sun pouch in foreground, bottle behind, pop-art style on blue background",
    promptSnippet:
      "Bright pop-art style shot of Capri Sun foil pouch with straw and a plastic bottle behind. Blue gradient background, dramatic lighting, text overlay: 'The pouch is here to stay.'",
    modularElements: [
      "Product juxtaposition",
      "vibrant colors",
      "dramatic side lighting",
      "reassurance overlay",
    ],
  };

  const runHiveDemo = async () => {
    setHiveDemoLoading(true);
    setHiveDemoResult(null);
    try {
      const res = await fetch("/api/hive-orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capriSunContext),
      });
      const data = await res.json();
      setHiveDemoResult(data);
    } catch (err: any) {
      setHiveDemoResult({ error: err.message });
    } finally {
      setHiveDemoLoading(false);
    }
  };

  const generateTestImage = async () => {
    if (!imgPrompt.trim()) return;
    setImgLoading(true);
    setImgUrl(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imgPrompt }),
      });
      const data = await res.json();
      if (data.imageUrl) setImgUrl(data.imageUrl);
      else alert(data.error || "No image URL returned");
    } catch (err: any) {
      alert(err.message || "Image generation failed");
    } finally {
      setImgLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading agents configuration...</p>
        </div>
      </div>
    );
  }

  if (!config || !editedConfig) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Failed to load configuration</p>
        </div>
      </div>
    );
  }

  const agents = Object.values(editedConfig.agents).sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Quick Image Gen Test */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Quick Image Generation Test
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <input
                type="text"
                value={imgPrompt}
                onChange={(e) => setImgPrompt(e.target.value)}
                placeholder="Enter prompt for gpt-image-1"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={generateTestImage}
                disabled={imgLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
              >
                {imgLoading ? "Generating..." : "Generate Image"}
              </button>
            </div>
            {imgUrl && (
              <div className="mt-4">
                <img
                  src={imgUrl}
                  alt="Generated"
                  className="max-w-full rounded shadow"
                />
              </div>
            )}
          </div>

          {/* Hive Demo button and results */}
          <div className="mb-8">
            <button
              onClick={runHiveDemo}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-colors"
              disabled={hiveDemoLoading}
            >
              {hiveDemoLoading
                ? "Running Hive Visual Demo..."
                : "Run Hive Visual Demo (Capri Sun Example)"}
            </button>
          </div>
          {hiveDemoLoading && (
            <div className="flex items-center space-x-2 text-blue-600 font-medium mb-8">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></span>
              <span>Generating visual prompt...</span>
            </div>
          )}
          {hiveDemoResult && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-16">
              {hiveDemoResult.error ? (
                <div className="text-red-600 font-bold">
                  Error: {hiveDemoResult.error}
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Hive Visual Demo Output
                  </h2>
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-700 mb-1">
                      Visual Prompt
                    </h3>
                    <pre className="bg-slate-50 p-3 rounded text-sm overflow-x-auto border border-slate-200">
                      {hiveDemoResult.promptText}
                    </pre>
                  </div>
                  {hiveDemoResult.imageUrl && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-700 mb-1">
                        Generated Image
                      </h3>
                      <img
                        src={hiveDemoResult.imageUrl}
                        alt="Generated visual"
                        className="w-full rounded shadow-md border border-slate-200"
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-700 mb-1">
                      Modular Elements
                    </h3>
                    <pre className="bg-slate-50 p-3 rounded text-sm overflow-x-auto border border-slate-200">
                      {JSON.stringify(hiveDemoResult.modulars, null, 2)}
                    </pre>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-700 mb-1">
                      Trend Insights
                    </h3>
                    <pre className="bg-slate-50 p-3 rounded text-sm overflow-x-auto border border-slate-200">
                      {JSON.stringify(hiveDemoResult.trendInsights, null, 2)}
                    </pre>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-700 mb-1">
                      Brand QA Result
                    </h3>
                    <pre className="bg-slate-50 p-3 rounded text-sm overflow-x-auto border border-slate-200">
                      {JSON.stringify(hiveDemoResult.qaResult, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          )}
          {/* Main agent cards and content here (unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Agent List */}
            <div className="md:col-span-1">
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`cursor-pointer bg-white rounded-lg shadow-md p-6 transition-all duration-300 border hover:shadow-lg ${
                      selectedAgentId === agent.id
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : agent.enabled
                        ? "border-slate-200"
                        : "border-red-200 opacity-75"
                    }`}
                    onClick={() => setSelectedAgentId(agent.id)}
                  >
                    <div className="flex items-center mb-2">
                      <span
                        className={`text-xl mr-2 ${
                          agent.enabled ? "text-blue-600" : "text-slate-500"
                        }`}
                      >
                        <Bot className="w-6 h-6" />
                      </span>
                      <h3 className="text-lg font-bold !text-gray-900">
                        {agent.name || "Agent Name"}
                      </h3>
                    </div>
                    <p className="text-slate-700 text-sm mb-2 line-clamp-2">
                      {agent.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        Model:{" "}
                        <span className="font-medium text-slate-800">
                          {agent.model}
                        </span>
                      </span>
                      <span
                        className={`p-1 rounded-full ${
                          agent.enabled ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {" "}
                        <Power className="w-4 h-4" />{" "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Agent Details */}
            <div className="md:col-span-2 h-full flex flex-col min-h-0">
              {selectedAgentId ? (
                (() => {
                  const agent = agents.find((a) => a.id === selectedAgentId);
                  if (!agent)
                    return (
                      <div className="text-slate-500">Agent not found.</div>
                    );
                  return (
                    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 h-full flex flex-col min-h-0">
                      {/* Top row: Title + Save */}
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="agent-title">{agent.name}</h2>
                        <button
                          onClick={handleSaveConfiguration}
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center transition-colors font-medium shadow-sm"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                      {/* Description */}
                      <div className="text-slate-600 mb-4">
                        {agent.description}
                      </div>
                      {/* Collapsible Settings Panel */}
                      <div className="mb-4">
                        <button
                          className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-md px-4 py-2 text-lg font-semibold text-slate-800 mb-2 focus:outline-none shadow-sm hover:bg-slate-100 transition-colors"
                          onClick={() => setSettingsOpen((open) => !open)}
                        >
                          <span>Agent Settings</span>
                          {settingsOpen ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        {settingsOpen && (
                          <div className="grid grid-cols-1 gap-4 p-4 bg-white rounded-md border border-slate-200 shadow-sm">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Model
                              </label>
                              <select
                                value={agent.model}
                                onChange={(e) =>
                                  handleAgentConfigChange(
                                    agent.id,
                                    "model",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {config.models.available.map((model) => (
                                  <option key={model.id} value={model.id}>
                                    {model.name}{" "}
                                    {model.recommended ? "(Recommended)" : ""}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Temperature
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={agent.temperature}
                                onChange={(e) =>
                                  handleAgentConfigChange(
                                    agent.id,
                                    "temperature",
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Max Tokens
                              </label>
                              <input
                                type="number"
                                value={agent.maxTokens}
                                onChange={(e) =>
                                  handleAgentConfigChange(
                                    agent.id,
                                    "maxTokens",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Timeout (ms)
                              </label>
                              <input
                                type="number"
                                value={agent.timeout}
                                onChange={(e) =>
                                  handleAgentConfigChange(
                                    agent.id,
                                    "timeout",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Delay (ms)
                              </label>
                              <input
                                type="number"
                                value={agent.delay ?? 0}
                                onChange={(e) =>
                                  handleAgentConfigChange(
                                    agent.id,
                                    "delay",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Prompt Area - fills remaining space, scrolls inside */}
                      <div className="flex-1 min-h-0 flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          Prompt
                        </h3>
                        <div className="flex-1 min-h-0">
                          <textarea
                            value={agent.promptContent || ""}
                            onChange={(e) =>
                              handleAgentConfigChange(
                                agent.id,
                                "promptContent",
                                e.target.value
                              )
                            }
                            className="w-full h-full min-h-0 p-3 border-2 border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-mono text-xs resize-none overflow-auto"
                            style={{ minHeight: 0, maxHeight: "100%" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-lg font-medium">
                  Select an agent to view and edit its settings
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            System Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium text-slate-700 mb-2">
                Global Settings
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fallback Model:</span>
                  <span className="font-mono">
                    {config.global.fallbackModel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Manual Review:</span>
                  <span
                    className={
                      config.global.enableManualReview
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {config.global.enableManualReview ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Control:</span>
                  <span
                    className={
                      config.global.enableQualityControl
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {config.global.enableQualityControl
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium text-slate-700 mb-2">Data Sources</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Real Data Sources:</span>
                  <span
                    className={
                      config.dataSource.enableRealDataSources
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {config.dataSource.enableRealDataSources
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Google Trends:</span>
                  <span
                    className={
                      config.dataSource.googleTrendsEnabled
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {config.dataSource.googleTrendsEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>News API:</span>
                  <span
                    className={
                      config.dataSource.newsApiEnabled
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {config.dataSource.newsApiEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium text-slate-700 mb-2">
                Quality Thresholds
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Trend Relevance:</span>
                  <span className="font-mono">
                    {config.qualityThresholds.minTrendRelevance}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Audience Confidence:</span>
                  <span className="font-mono">
                    {config.qualityThresholds.minAudienceConfidence}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Story Angle Strength:</span>
                  <span className="font-mono">
                    {config.qualityThresholds.minStoryAngleStrength}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
