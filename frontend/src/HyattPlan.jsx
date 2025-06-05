import React, { useState } from "react";
import { Layers, Database, Code } from "lucide-react";

const HyattImplementationPlan = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Header */}
      <div className="bg-teal-600 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">
          Hyatt GPT Agents Implementation Plan
        </h1>
        <p className="text-sm">
          Interactive system of specialized GPT agents for PR campaign
          development
        </p>
      </div>

      {/* Navigation */}
      <div className="flex bg-teal-700 text-white overflow-x-auto">
        <button
          className={`px-4 py-2 ${
            activeTab === "overview" ? "bg-teal-500" : "hover:bg-teal-600"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "agents" ? "bg-teal-500" : "hover:bg-teal-600"
          }`}
          onClick={() => setActiveTab("agents")}
        >
          Agent System
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "tech" ? "bg-teal-500" : "hover:bg-teal-600"
          }`}
          onClick={() => setActiveTab("tech")}
        >
          Technical Stack
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "timeline" ? "bg-teal-500" : "hover:bg-teal-600"
          }`}
          onClick={() => setActiveTab("timeline")}
        >
          Timeline
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-teal-700 mb-2">
                System Architecture
              </h2>
              <p className="mb-3">
                A multi-agent system that collaborates to create PR campaigns
                for Hyatt eco-resorts.
              </p>
              <div className="border border-gray-200 p-3 rounded bg-gray-50">
                <img
                  src="/api/placeholder/800/400"
                  alt="System architecture diagram showing User/PR Manager connecting to API Gateway, which connects to Orchestrator Service, which manages the three GPT agents"
                  className="w-full"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-teal-700 mb-2">Workflow</h2>
              <p className="mb-3">
                The sequential workflow process from campaign brief to final
                deliverable.
              </p>
              <div className="border border-gray-200 p-3 rounded bg-gray-50">
                <img
                  src="/api/placeholder/800/400"
                  alt="Workflow diagram showing sequence from brief submission through research, trend analysis, story development, and collaboration phases"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-teal-700 mb-2">
                Agent Definitions
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 text-left">Agent</th>
                      <th className="py-2 px-3 text-left">Function</th>
                      <th className="py-2 px-3 text-left">Temperature</th>
                      <th className="py-2 px-3 text-left">Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 border-t">
                        Research & Audience GPT
                      </td>
                      <td className="py-2 px-3 border-t">Audience analysis</td>
                      <td className="py-2 px-3 border-t">0.2</td>
                      <td className="py-2 px-3 border-t">
                        audience_database, industry_reports
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-3 border-t">Trending News GPT</td>
                      <td className="py-2 px-3 border-t">
                        News trend analysis
                      </td>
                      <td className="py-2 px-3 border-t">0.3</td>
                      <td className="py-2 px-3 border-t">
                        news_api, trend_analyzer
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-t">Story Angles GPT</td>
                      <td className="py-2 px-3 border-t">Content creation</td>
                      <td className="py-2 px-3 border-t">0.7</td>
                      <td className="py-2 px-3 border-t">
                        media_database, headline_predictor
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-teal-700 mb-2">
                Agent Collaboration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 p-3 rounded">
                  <div className="flex items-center mb-2">
                    <div className="bg-teal-100 p-2 rounded-full mr-3">
                      <Layers className="h-5 w-5 text-teal-600" />
                    </div>
                    <h3 className="font-semibold">Orchestrator Service</h3>
                  </div>
                  <p className="text-sm">
                    Coordinates workflow between agents and manages multi-phase
                    campaign development
                  </p>
                </div>

                <div className="border border-gray-200 p-3 rounded">
                  <div className="flex items-center mb-2">
                    <div className="bg-teal-100 p-2 rounded-full mr-3">
                      <Database className="h-5 w-5 text-teal-600" />
                    </div>
                    <h3 className="font-semibold">Campaign Database</h3>
                  </div>
                  <p className="text-sm">
                    Stores campaign data, agent outputs, and tracks status of
                    each development phase
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tech" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-teal-700 mb-2">
                Technical Implementation
              </h2>

              <div className="mb-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Code className="h-4 w-4 mr-2 text-teal-600" />
                  Server Implementation
                </h3>
                <div className="bg-gray-800 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                  {`const express = require("express");
const axios = require("axios");
const app = express();

// AI client setup
const aiClient = axios.create({
  baseURL: "https://api.example.com/v1",
  headers: {
    "Authorization": \`Bearer \${process.env.AI_API_KEY}\`,
    "Content-Type": "application/json"
  }
});

const orchestrator = new AgentOrchestrator(aiClient);

// Create campaign endpoint
app.post("/api/campaigns", async (req, res) => {
  try {
    const { campaignBrief } = req.body;
    const campaignId = generateUniqueId();
    
    const campaign = await orchestrator.startCampaignSession(
      campaignId, 
      campaignBrief
    );
    
    res.status(201).json({ 
      campaignId: campaign.id,
      status: campaign.status 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

app.listen(3000, () => {
  console.log("Hyatt GPT Agent system running on port 3000");
});`}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Database className="h-4 w-4 mr-2 text-teal-600" />
                  Database Schema
                </h3>
                <div className="bg-gray-800 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                  {`{
  _id: ObjectId("..."),
  campaignId: "camp_12345",
  status: "in_progress", 
  brief: "Create a PR campaign for Hyatt's eco-resort...",
  created_at: ISODate("2023-05-15T10:30:00Z"),
  updated_at: ISODate("2023-05-15T11:45:00Z"),

  // Thread IDs
  threads: {
    researchThread: "thread_abc123",
    trendingThread: "thread_def456",
    storyThread: "thread_ghi789",
    collaborativeThread: "thread_jkl012"
  },

  // Outputs from each phase
  outputs: {
    research: { /* Research output */ },
    trending: { /* Trending News output */ },
    storyAngles: { /* Story Angles output */ },
    final: { /* Final collaborative output */ }
  }
}`}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-teal-700 mb-2">
                API Endpoints
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 text-left">Endpoint</th>
                      <th className="py-2 px-3 text-left">Method</th>
                      <th className="py-2 px-3 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 border-t font-mono text-sm">
                        /api/campaigns
                      </td>
                      <td className="py-2 px-3 border-t">
                        <span className="bg-green-100 text-green-800 px-2 rounded-full text-xs">
                          POST
                        </span>
                      </td>
                      <td className="py-2 px-3 border-t">
                        Create a new campaign
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-3 border-t font-mono text-sm">
                        /api/campaigns/{"{id}"}
                      </td>
                      <td className="py-2 px-3 border-t">
                        <span className="bg-blue-100 text-blue-800 px-2 rounded-full text-xs">
                          GET
                        </span>
                      </td>
                      <td className="py-2 px-3 border-t">
                        Get campaign status
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-t font-mono text-sm">
                        /api/campaigns/{"{id}"}/final
                      </td>
                      <td className="py-2 px-3 border-t">
                        <span className="bg-blue-100 text-blue-800 px-2 rounded-full text-xs">
                          GET
                        </span>
                      </td>
                      <td className="py-2 px-3 border-t">
                        Get final campaign plan
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-teal-700 mb-2">
                Implementation Timeline
              </h2>
              <p className="mb-3">Estimated 76-day implementation schedule</p>

              <div className="border border-gray-200 p-3 rounded bg-gray-50 mb-4">
                <img
                  src="/api/placeholder/800/200"
                  alt="Gantt chart showing implementation timeline"
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex border-l-4 border-teal-500 pl-3">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Setup Phase</h3>
                    <p className="text-sm text-gray-600">
                      Environment configuration (10 days)
                    </p>
                  </div>
                </div>

                <div className="flex border-l-4 border-blue-500 pl-3">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Agent Development</h3>
                    <p className="text-sm text-gray-600">
                      Creating specialized agents (21 days)
                    </p>
                  </div>
                </div>

                <div className="flex border-l-4 border-purple-500 pl-3">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Orchestration Layer</h3>
                    <p className="text-sm text-gray-600">
                      Building coordination system (23 days)
                    </p>
                  </div>
                </div>

                <div className="flex border-l-4 border-amber-500 pl-3">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Testing & Deployment</h3>
                    <p className="text-sm text-gray-600">
                      Quality assurance and launch (15 days)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-teal-700 mb-2">
                Next Steps
              </h2>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Set up development environment with dependencies</li>
                <li>Create agent system prompts and configurations</li>
                <li>Implement orchestrator service with phase management</li>
                <li>Build API endpoints for campaign management</li>
                <li>Develop error handling and monitoring</li>
                <li>Test the system with sample campaign briefs</li>
                <li>Deploy to production</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-3 border-t border-gray-200 text-center text-sm text-gray-600">
        Hyatt GPT Agents Implementation Plan • 2023
      </div>
    </div>
  );
};

export default HyattImplementationPlan;
