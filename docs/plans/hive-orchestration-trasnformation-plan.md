# Hive Orchestration UI Pattern Adaptation Plan

## Overview

This plan outlines how to adapt the Hive Orchestrator to use the same UI components and patterns as the Hyatt orchestration, while maintaining its **moment-based** workflow (not campaign-based). The goal is to create visual consistency and better user experience by using SharedAgentCollaboration, SharedDeliverablePanel, and other shared components to show the 5-agent sequential workflow and image deliverables.

## Current State Analysis

### Hive Orchestration Backend

- ✅ **Well-structured 5-step workflow**: Trend Analysis → Brand Lens → Visual Prompt → Modular Elements → QA Review
- ✅ **Produces image deliverables**: Base64 encoded images from AI generation
- ✅ **Proper agent coordination**: Error handling and workflow management
- ✅ **Moment-based input**: Takes context/moment input (not campaign brief)
- ❌ **No UI integration**: Doesn't use shared UI components like Hyatt

### Hive Landing Page

- ❌ **Uses OrchestrationPageTemplate**: With custom `renderExtraCenter` component
- ❌ **Doesn't follow Hyatt pattern**: Missing `SharedAgentCollaboration` integration
- ❌ **No proper deliverable handling**: No proper image deliverable display
- ❌ **No agent handoff visualization**: Can't see the 5-agent sequential workflow

### Hyatt Pattern (Target UI Components)

- ✅ **SharedOrchestrationLayout**: With side panels for conversation and deliverables
- ✅ **SharedAgentCollaboration**: Phase-based workflow visualization
- ✅ **SharedDeliverablePanel**: Consistent deliverable display
- ✅ **Agent handoff visualization**: Clear progression through phases
- ✅ **HITL review integration**: Full human-in-the-loop capabilities

## Transformation Strategy

### Phase 1: Adapt Hive Backend for UI Integration

#### 1.1 Update HiveOrchestrator for UI State Management

**File**: `hive/orchestrations/classes/HiveOrchestrator.js`

**Changes**: Add state management for UI components without changing the moment-based workflow

```javascript
class HiveOrchestrator extends BaseOrchestrator {
  constructor(config = {}) {
    super({
      name: "HiveOrchestrator",
      version: "2.0.0",
      ...config,
    });

    this.visualAgent = new VisualPromptGeneratorAgent();
    this.modularAgent = new ModularElementsRecommenderAgent();
    this.trendAgent = new TrendCulturalAnalyzerAgent();
    this.qaAgent = new BrandQAAgent();
    this.brandLensAgent = new BrandLensAgent();

    // Add state tracking for UI
    this.activeWorkflows = new Map();
  }

  // Keep the moment-based workflow but add UI state tracking
  async runHiveOrchestration(momentContext) {
    const workflowId = this.generateWorkflowId();

    // Initialize UI state
    const uiState = {
      id: workflowId,
      status: "initializing",
      currentPhase: null,
      phases: {
        trend_analysis: { status: "pending", startTime: null, endTime: null },
        brand_lens: { status: "pending", startTime: null, endTime: null },
        visual_prompt: { status: "pending", startTime: null, endTime: null },
        modular_elements: { status: "pending", startTime: null, endTime: null },
        qa_review: { status: "pending", startTime: null, endTime: null },
      },
      deliverables: {},
      conversation: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.activeWorkflows.set(workflowId, uiState);

    try {
      // Step 1: Trend Analysis
      uiState.status = "trend_analysis";
      uiState.currentPhase = "trend_analysis";
      uiState.phases.trend_analysis.status = "active";
      uiState.phases.trend_analysis.startTime = new Date().toISOString();
      uiState.lastUpdated = new Date().toISOString();

      const trendInsights = await this.trendAgent.analyzeTrends(momentContext);

      // Create deliverable for UI
      const trendDeliverable = {
        id: `trend_analysis_${workflowId}`,
        title: "Cultural Trend Analysis",
        status: "ready",
        agent: "Trend Cultural Analyzer",
        timestamp: new Date().toISOString(),
        content: trendInsights,
        type: "text",
      };
      uiState.deliverables.trend_analysis = trendDeliverable;
      uiState.phases.trend_analysis.status = "completed";
      uiState.phases.trend_analysis.endTime = new Date().toISOString();

      // Step 2: Brand Lens
      uiState.status = "brand_lens";
      uiState.currentPhase = "brand_lens";
      uiState.phases.brand_lens.status = "active";
      uiState.phases.brand_lens.startTime = new Date().toISOString();
      uiState.lastUpdated = new Date().toISOString();

      const brandLens = await this.brandLensAgent.analyzeBrandPerspective(
        trendInsights,
        momentContext
      );

      const brandDeliverable = {
        id: `brand_lens_${workflowId}`,
        title: "Brand Lens Analysis",
        status: "ready",
        agent: "Brand Lens",
        timestamp: new Date().toISOString(),
        content: brandLens,
        type: "text",
      };
      uiState.deliverables.brand_lens = brandDeliverable;
      uiState.phases.brand_lens.status = "completed";
      uiState.phases.brand_lens.endTime = new Date().toISOString();

      // Step 3: Visual Prompt Generation
      uiState.status = "visual_prompt";
      uiState.currentPhase = "visual_prompt";
      uiState.phases.visual_prompt.status = "active";
      uiState.phases.visual_prompt.startTime = new Date().toISOString();
      uiState.lastUpdated = new Date().toISOString();

      const basePrompt = await this.visualAgent.generatePrompt(momentContext);

      const visualDeliverable = {
        id: `visual_prompt_${workflowId}`,
        title: "Visual Prompt Generation",
        status: "ready",
        agent: "Visual Prompt Generator",
        timestamp: new Date().toISOString(),
        content: {
          promptText: basePrompt.promptText,
          imageUrl: basePrompt.imageUrl,
          type: "image",
        },
        type: "image",
      };
      uiState.deliverables.visual_prompt = visualDeliverable;
      uiState.phases.visual_prompt.status = "completed";
      uiState.phases.visual_prompt.endTime = new Date().toISOString();

      // Step 4: Modular Elements
      uiState.status = "modular_elements";
      uiState.currentPhase = "modular_elements";
      uiState.phases.modular_elements.status = "active";
      uiState.phases.modular_elements.startTime = new Date().toISOString();
      uiState.lastUpdated = new Date().toISOString();

      const modulars = await this.modularAgent.recommendElements(
        momentContext,
        basePrompt,
        trendInsights,
        brandLens
      );

      const modularDeliverable = {
        id: `modular_elements_${workflowId}`,
        title: "Modular Visual Elements",
        status: "ready",
        agent: "Modular Elements Recommender",
        timestamp: new Date().toISOString(),
        content: {
          elements: modulars,
          type: "mixed",
        },
        type: "mixed",
      };
      uiState.deliverables.modular_elements = modularDeliverable;
      uiState.phases.modular_elements.status = "completed";
      uiState.phases.modular_elements.endTime = new Date().toISOString();

      // Step 5: QA Review
      uiState.status = "qa_review";
      uiState.currentPhase = "qa_review";
      uiState.phases.qa_review.status = "active";
      uiState.phases.qa_review.startTime = new Date().toISOString();
      uiState.lastUpdated = new Date().toISOString();

      const qaResult = await this.qaAgent.reviewPrompt(
        basePrompt,
        modulars,
        trendInsights,
        brandLens
      );

      const qaDeliverable = {
        id: `qa_review_${workflowId}`,
        title: "Quality Assurance Review",
        status: "ready",
        agent: "Brand QA",
        timestamp: new Date().toISOString(),
        content: qaResult,
        type: "text",
      };
      uiState.deliverables.qa_review = qaDeliverable;
      uiState.phases.qa_review.status = "completed";
      uiState.phases.qa_review.endTime = new Date().toISOString();

      // Complete
      uiState.status = "completed";
      uiState.currentPhase = null;
      uiState.lastUpdated = new Date().toISOString();

      const result = {
        trendInsights,
        brandLens,
        basePrompt,
        modularElements: modulars,
        qaResult,
        timestamp: new Date().toISOString(),
      };

      return result;
    } catch (error) {
      uiState.status = "failed";
      uiState.error = error.message;
      uiState.lastUpdated = new Date().toISOString();
      throw error;
    }
  }

  // Add methods for UI state management
  getWorkflowState(workflowId) {
    return this.activeWorkflows.get(workflowId);
  }

  getAllWorkflows() {
    return Array.from(this.activeWorkflows.values());
  }
}
```

#### 1.2 Add API Endpoints for UI State

**File**: `hive/routes/campaigns.js`

**Changes**: Add endpoints for Hive workflow state (not campaigns)

```javascript
// Get Hive workflow state for UI
app.get("/api/hive/workflows/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const hiveOrchestrator =
      orchestrationManager.getLoadedOrchestration("hive");

    if (!hiveOrchestrator) {
      return res.status(404).json({ error: "Hive orchestrator not found" });
    }

    const workflowState = hiveOrchestrator.getWorkflowState(id);
    if (!workflowState) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    res.json(workflowState);
  } catch (error) {
    console.error("Get workflow state error:", error);
    res
      .status(500)
      .json({ error: "Failed to get workflow state", details: error.message });
  }
});

// Get all Hive workflows for UI
app.get("/api/hive/workflows", async (req, res) => {
  try {
    const hiveOrchestrator =
      orchestrationManager.getLoadedOrchestration("hive");

    if (!hiveOrchestrator) {
      return res.status(404).json({ error: "Hive orchestrator not found" });
    }

    const workflows = hiveOrchestrator.getAllWorkflows();
    res.json(workflows);
  } catch (error) {
    console.error("Get workflows error:", error);
    res
      .status(500)
      .json({ error: "Failed to get workflows", details: error.message });
  }
});

// Start Hive orchestration (moment-based)
app.post("/api/hive/orchestrate", async (req, res) => {
  try {
    const { momentContext } = req.body;

    if (!momentContext) {
      return res.status(400).json({ error: "Moment context is required" });
    }

    const hiveOrchestrator = await orchestrationManager.getOrchestration(
      "hive"
    );
    const result = await hiveOrchestrator.runHiveOrchestration(momentContext);

    res.status(201).json(result);
  } catch (error) {
    console.error("Hive orchestration error:", error);
    res
      .status(500)
      .json({ error: "Failed to start orchestration", details: error.message });
  }
});
```

### Phase 2: Create Hive-Specific UI Components

#### 2.1 Create HiveMomentForm Component

**File**: `frontend/src/components/shared/HiveMomentForm.tsx`

**New Component**: Form for Hive moment input (not campaign)

```typescript
import React, { useState } from "react";

export interface HiveMomentFormProps {
  onSubmit: (momentContext: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const HiveMomentForm: React.FC<HiveMomentFormProps> = ({
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [momentContext, setMomentContext] = useState({
    campaign: "",
    momentType: "campaign",
    visualObjective: "",
    heroVisualDescription: "",
    promptSnippet: "",
    modularElements: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (momentContext.campaign.trim()) {
      onSubmit(momentContext);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-4">
        Start Hive Orchestration
      </h2>
      <p className="text-text-secondary mb-6">
        Describe your moment or context to generate visual creative content
        through our 5-agent workflow.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="campaign"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Campaign/Moment Context
          </label>
          <textarea
            id="campaign"
            value={momentContext.campaign}
            onChange={(e) =>
              setMomentContext((prev) => ({
                ...prev,
                campaign: e.target.value,
              }))
            }
            className="w-full h-32 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Describe your campaign, moment, or context for visual content generation..."
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="momentType"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Moment Type
          </label>
          <select
            id="momentType"
            value={momentContext.momentType}
            onChange={(e) =>
              setMomentContext((prev) => ({
                ...prev,
                momentType: e.target.value,
              }))
            }
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
            disabled={isLoading}
          >
            <option value="campaign">Campaign</option>
            <option value="launch">Launch</option>
            <option value="event">Event</option>
            <option value="promotion">Promotion</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="visualObjective"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Visual Objective
          </label>
          <textarea
            id="visualObjective"
            value={momentContext.visualObjective}
            onChange={(e) =>
              setMomentContext((prev) => ({
                ...prev,
                visualObjective: e.target.value,
              }))
            }
            className="w-full h-24 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="What are the visual goals and objectives?"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="heroVisualDescription"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Hero Visual Description
          </label>
          <textarea
            id="heroVisualDescription"
            value={momentContext.heroVisualDescription}
            onChange={(e) =>
              setMomentContext((prev) => ({
                ...prev,
                heroVisualDescription: e.target.value,
              }))
            }
            className="w-full h-24 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Describe the main hero visual you want to create..."
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-secondary text-text-primary font-medium rounded hover:bg-secondary-hover transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !momentContext.campaign.trim()}
            className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary-hover disabled:bg-secondary disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Starting Orchestration..." : "Start Orchestration"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HiveMomentForm;
```

#### 2.2 Create HiveWorkflowState Hook

**File**: `frontend/src/hooks/useHiveWorkflowState.ts`

**New Hook**: Manage Hive workflow state (not campaign state)

```typescript
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export interface HiveWorkflowState {
  id: string;
  status:
    | "initializing"
    | "trend_analysis"
    | "brand_lens"
    | "visual_prompt"
    | "modular_elements"
    | "qa_review"
    | "completed"
    | "failed";
  currentPhase: string | null;
  phases: {
    [key: string]: {
      status: "pending" | "active" | "completed" | "error";
      startTime: string | null;
      endTime: string | null;
    };
  };
  deliverables: { [key: string]: any };
  conversation: any[];
  createdAt: string;
  lastUpdated: string;
  error?: string;
}

export function useHiveWorkflowState() {
  const [workflows, setWorkflows] = useState<HiveWorkflowState[]>([]);
  const [currentWorkflow, setCurrentWorkflow] =
    useState<HiveWorkflowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkflows = async () => {
    try {
      const data = await apiFetch("/api/hive/workflows");
      setWorkflows(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const loadWorkflow = async (workflowId: string) => {
    try {
      setIsLoading(true);
      const data = await apiFetch(`/api/hive/workflows/${workflowId}`);
      setCurrentWorkflow(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startOrchestration = async (momentContext: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiFetch("/api/hive/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ momentContext }),
      });

      // Start polling for the new workflow
      const workflowId = data.id || "new";
      await loadWorkflow(workflowId);

      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentWorkflow(null);
    setError(null);
  };

  // Poll for workflow updates
  useEffect(() => {
    if (
      !currentWorkflow ||
      currentWorkflow.status === "completed" ||
      currentWorkflow.status === "failed"
    ) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const data = await apiFetch(
          `/api/hive/workflows/${currentWorkflow.id}`
        );
        setCurrentWorkflow(data);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Failed to poll workflow:", e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentWorkflow?.id, currentWorkflow?.status]);

  return {
    workflows,
    currentWorkflow,
    isLoading,
    error,
    loadWorkflows,
    loadWorkflow,
    startOrchestration,
    resetWorkflow,
  };
}
```

### Phase 3: Update HiveOrchestrationPage to Use Hyatt Pattern

#### 3.1 Replace HiveOrchestrationPage

**File**: `frontend/src/components/orchestrations/HiveOrchestrationPage.tsx`

**New Structure**: Use Hyatt pattern with Hive-specific components

```typescript
import { useState } from "react";
import { useHiveWorkflowState } from "../../hooks/useHiveWorkflowState";
import SharedOrchestrationLayout from "./SharedOrchestrationLayout";
import SidePanel from "../SidePanel";
import { SharedProgressPanel, SharedDeliverablePanel } from "../shared";
import HiveMomentForm from "../shared/HiveMomentForm";
import HiveAgentCollaboration from "../shared/HiveAgentCollaboration";
import DeliverableModal from "../DeliverableModal";
import { Deliverable } from "../../types";

interface HiveOrchestrationPageProps {
  orchestrationId: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

const HiveOrchestrationPage: React.FC<HiveOrchestrationPageProps> = ({
  orchestrationId,
  hitlReview = true,
  onToggleHitl,
  onNavigateToOrchestrations,
}) => {
  const {
    currentWorkflow,
    isLoading,
    error,
    startOrchestration,
    resetWorkflow,
  } = useHiveWorkflowState();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [modalDeliverable, setModalDeliverable] = useState<Deliverable | null>(
    null
  );
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);

  const handleStartOrchestration = async (momentContext: any) => {
    try {
      await startOrchestration(momentContext);
    } catch (e) {
      console.error("Failed to start orchestration:", e);
    }
  };

  const handleViewDetails = (deliverable: Deliverable) => {
    setModalDeliverable(deliverable);
    setIsDeliverableModalOpen(true);
  };

  const handleViewPhaseDeliverable = (phaseKey: string) => {
    if (currentWorkflow?.deliverables[phaseKey]) {
      setModalDeliverable(currentWorkflow.deliverables[phaseKey]);
      setIsDeliverableModalOpen(true);
    }
  };

  const deliverables = currentWorkflow
    ? Object.values(currentWorkflow.deliverables)
    : [];

  return (
    <div className="min-h-screen">
      <div className="container pt-6 pb-8">
        {/* Breadcrumb and HITL Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-text-secondary">
            <button
              onClick={
                onNavigateToOrchestrations || (() => window.history.back())
              }
              className="text-success hover:text-success-hover transition-colors"
            >
              Orchestrations
            </button>
            <span>›</span>
            <span className="text-text-primary font-medium">
              Hive Orchestrator
            </span>
          </nav>

          {onToggleHitl && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">HITL Review</span>
              <button
                onClick={onToggleHitl}
                className={`relative inline-flex h-6 w-12 items-center rounded-full ${
                  hitlReview ? "bg-success" : "bg-secondary"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                    hitlReview ? "translate-x-7" : "translate-x-1"
                  }`}
                />
                <span
                  className={`absolute text-xs font-medium ${
                    hitlReview
                      ? "text-white left-1"
                      : "text-text-secondary right-1"
                  }`}
                >
                  {hitlReview ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          )}
        </div>

        <SharedOrchestrationLayout
          isSidePanelOpen={isSidePanelOpen}
          sidePanel={
            <SidePanel
              messages={currentWorkflow?.conversation || []}
              isOpen={isSidePanelOpen}
              onClose={() => setIsSidePanelOpen(false)}
            />
          }
          rightPanel={
            <SharedDeliverablePanel
              deliverables={deliverables}
              onViewDetails={(id) => {
                const deliverable = deliverables.find((d) => d.id === id);
                if (deliverable) handleViewDetails(deliverable);
              }}
            />
          }
        >
          {!currentWorkflow ? (
            <HiveMomentForm
              onSubmit={handleStartOrchestration}
              onCancel={resetWorkflow}
              isLoading={isLoading}
            />
          ) : (
            <>
              <SharedProgressPanel
                campaign={currentWorkflow} // Adapt campaign interface for workflow
                onViewProgress={() => setIsSidePanelOpen(true)}
              />

              <HiveAgentCollaboration
                workflow={currentWorkflow}
                onViewDeliverable={handleViewPhaseDeliverable}
              />
            </>
          )}
        </SharedOrchestrationLayout>
      </div>

      <DeliverableModal
        deliverable={modalDeliverable}
        isOpen={isDeliverableModalOpen}
        onClose={() => {
          setIsDeliverableModalOpen(false);
        }}
      />
    </div>
  );
};

export default HiveOrchestrationPage;
```

#### 3.2 Create HiveAgentCollaboration Component

**File**: `frontend/src/components/shared/HiveAgentCollaboration.tsx`

**New Component**: Adapt SharedAgentCollaboration for Hive's 5-agent workflow

```typescript
import React from "react";
import { HiveWorkflowState } from "../../hooks/useHiveWorkflowState";
import { CheckCircle, Play, AlertCircle, Check, Eye } from "lucide-react";

interface HiveAgentCollaborationProps {
  workflow: HiveWorkflowState;
  onViewDeliverable?: (phaseKey: string) => void;
}

const HiveAgentCollaboration: React.FC<HiveAgentCollaborationProps> = ({
  workflow,
  onViewDeliverable,
}) => {
  const getCurrentPhase = () => {
    if (!workflow) return null;

    if (workflow.status === "failed") {
      return {
        phase: workflow.currentPhase,
        status: "error",
        message: `Workflow failed: ${workflow.error}`,
      };
    }

    if (workflow.status === "completed") {
      return {
        phase: "completed",
        status: "completed",
        message: "Hive orchestration completed successfully",
      };
    }

    const phaseMessages = {
      trend_analysis: "Trend Cultural Analyzer is analyzing cultural trends...",
      brand_lens: "Brand Lens is applying brand perspective...",
      visual_prompt: "Visual Prompt Generator is creating visual prompts...",
      modular_elements:
        "Modular Elements Recommender is creating visual elements...",
      qa_review: "Brand QA is performing quality assurance...",
    };

    return {
      phase: workflow.currentPhase,
      status: "active",
      message:
        phaseMessages[workflow.currentPhase as keyof typeof phaseMessages] ||
        "Processing...",
    };
  };

  const currentPhase = getCurrentPhase();
  const completedPhases = Object.keys(workflow.phases).filter(
    (key) => workflow.phases[key].status === "completed"
  );

  const hivePhases = [
    { key: "trend_analysis", label: "Trend Analysis", icon: "📈" },
    { key: "brand_lens", label: "Brand Lens", icon: "🎯" },
    { key: "visual_prompt", label: "Visual Prompt", icon: "🎨" },
    { key: "modular_elements", label: "Modular Elements", icon: "🧩" },
    { key: "qa_review", label: "Quality Review", icon: "✅" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">
          Hive Workflow Progress
        </h2>
      </div>
      <div className="p-6">
        {/* Current Status */}
        {currentPhase && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              {currentPhase.status === "active" && (
                <div className="flex items-center gap-2 text-primary">
                  <Play size={16} />
                  <span className="font-semibold">Active</span>
                </div>
              )}
              {currentPhase.status === "completed" && (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle size={16} />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
              {currentPhase.status === "error" && (
                <div className="flex items-center gap-2 text-error">
                  <AlertCircle size={16} />
                  <span className="font-semibold">Failed</span>
                </div>
              )}
            </div>
            <p className="text-text-primary">{currentPhase.message}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="space-y-4">
          <h3 className="font-semibold text-text-primary mb-3">
            Agent Workflow
          </h3>

          {hivePhases.map((phase) => {
            const phaseState = workflow.phases[phase.key];
            const isCompleted = phaseState.status === "completed";
            const isCurrent =
              workflow.currentPhase === phase.key &&
              workflow.status !== "completed";
            const hasDeliverable = workflow.deliverables[phase.key];

            return (
              <div
                key={phase.key}
                className={`p-4 rounded-lg border ${
                  isCurrent ? "border-primary bg-primary-light" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-lg">{phase.icon}</div>
                  <div className="flex-1">
                    <span className="font-medium text-text-primary">
                      {phase.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <CheckCircle size={16} className="text-success" />
                    )}
                    {isCurrent && (
                      <div className="flex items-center gap-1 text-primary">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                        <span className="text-xs">Working...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deliverable View Button */}
                {hasDeliverable && onViewDeliverable && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => onViewDeliverable(phase.key)}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-text-primary rounded-md hover:bg-secondary-hover transition-colors text-sm font-medium"
                    >
                      <Eye size={16} /> View Deliverable
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Workflow Info */}
        <div className="mt-6 p-4 bg-secondary rounded-lg">
          <div className="text-sm text-text-secondary">
            <p>
              <strong>Workflow ID:</strong> {workflow.id}
            </p>
            <p>
              <strong>Started:</strong>{" "}
              {new Date(workflow.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(workflow.lastUpdated).toLocaleString()}
            </p>
            <p>
              <strong>Completed Phases:</strong> {completedPhases.length}/5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiveAgentCollaboration;
```

### Phase 4: Image Deliverable Handling

#### 4.1 Create ImageDeliverableCard Component

**File**: `frontend/src/components/shared/ImageDeliverableCard.tsx`

**New Component**: Handle image deliverables from Hive

```typescript
import React from "react";
import { Deliverable } from "../../types";
import { Eye, Download } from "lucide-react";
import "./sharedStyles.css";

export interface ImageDeliverableCardProps {
  deliverable: Deliverable;
  onViewDetails: (id: string) => void;
}

const ImageDeliverableCard: React.FC<ImageDeliverableCardProps> = ({
  deliverable,
  onViewDetails,
}) => {
  const getAgentIcon = (agent: string) => {
    if (agent?.includes("Visual")) return "🎨";
    if (agent?.includes("Modular")) return "🧩";
    if (agent?.includes("Trend")) return "📈";
    if (agent?.includes("Brand")) return "🎯";
    return "👨‍💼";
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deliverable.content?.imageUrl) {
      const link = document.createElement("a");
      link.href = deliverable.content.imageUrl;
      link.download = `${deliverable.title.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImage = deliverable.content?.imageUrl || deliverable.type === "image";
  const isMixed = deliverable.type === "mixed";

  return (
    <div
      className="deliverable-card flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onViewDetails(deliverable.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="deliverable-icon text-2xl">
              {isImage ? "🖼️" : isMixed ? "📋" : "📋"}
            </span>
            <h3
              className="deliverable-title-text text-lg font-semibold truncate"
              title={deliverable.title}
            >
              {deliverable.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="deliverable-agent-icon">
              {getAgentIcon(deliverable.agent)}
            </span>
            <span className="truncate" title={deliverable.agent}>
              {deliverable.agent || "AI Agent"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-2">
          <span
            className={`deliverable-status ${deliverable.status} text-xs mb-1`}
          >
            {deliverable.status === "ready"
              ? "Ready"
              : deliverable.status === "reviewed"
              ? "Reviewed"
              : "Pending"}
          </span>
          <div className="flex gap-2 mt-1">
            {isImage && (
              <button
                className="deliverable-icon-btn"
                onClick={handleDownload}
                title="Download Image"
                tabIndex={0}
                aria-label="Download Image"
              >
                <Download size={18} />
              </button>
            )}
            <button
              className="deliverable-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(deliverable.id);
              }}
              title="View Details"
              tabIndex={0}
              aria-label="View Details"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {isImage && deliverable.content?.imageUrl && (
        <div className="mt-3">
          <img
            src={deliverable.content.imageUrl}
            alt={deliverable.title}
            className="w-full h-32 object-cover rounded-lg border border-border"
          />
        </div>
      )}

      {/* Mixed Content Preview */}
      {isMixed && deliverable.content?.elements && (
        <div className="mt-3">
          <div className="grid grid-cols-2 gap-2">
            {deliverable.content.elements
              .slice(0, 4)
              .map((element: any, index: number) => (
                <div key={index} className="relative">
                  {element.imageUrl && (
                    <img
                      src={element.imageUrl}
                      alt={element.element}
                      className="w-full h-16 object-cover rounded border border-border"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b">
                    {element.targetChannel}
                  </div>
                </div>
              ))}
          </div>
          {deliverable.content.elements.length > 4 && (
            <p className="text-xs text-text-secondary mt-1">
              +{deliverable.content.elements.length - 4} more elements
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDeliverableCard;
```

#### 4.2 Update SharedDeliverablePanel

**File**: `frontend/src/components/shared/SharedDeliverablePanel.tsx`

**Changes**: Add support for image deliverables

```typescript
import React from "react";
import { Deliverable } from "../../types";
import SharedDeliverableCard from "./SharedDeliverableCard";
import ImageDeliverableCard from "./ImageDeliverableCard";
import { FileText } from "lucide-react";
import "./sharedStyles.css";

export interface SharedDeliverablePanelProps {
  deliverables: Deliverable[];
  onViewDetails: (id: string) => void;
}

const SharedDeliverablePanel: React.FC<SharedDeliverablePanelProps> = ({
  deliverables,
  onViewDetails,
}) => {
  const isImageDeliverable = (deliverable: Deliverable) => {
    return (
      deliverable.type === "image" ||
      deliverable.type === "mixed" ||
      deliverable.content?.imageUrl
    );
  };

  return (
    <div className="deliverable-card">
      <div className="deliverable-header">
        <div className="deliverable-title">
          <span className="deliverable-icon">
            <FileText size={20} />
          </span>
          <h2 className="deliverable-title-text">Workflow Deliverables</h2>
        </div>
        <div className="deliverable-status ready">
          {deliverables.length} Available
        </div>
      </div>
      {deliverables.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No deliverables available yet.</p>
          <p className="text-sm">
            Start an orchestration to see deliverables here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliverables.map((d) =>
            isImageDeliverable(d) ? (
              <ImageDeliverableCard
                key={d.id}
                deliverable={d}
                onViewDetails={onViewDetails}
              />
            ) : (
              <SharedDeliverableCard
                key={d.id}
                deliverable={d}
                onViewDetails={onViewDetails}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SharedDeliverablePanel;
```

### Phase 5: Testing and Validation

#### 5.1 Backend Testing

**Test Cases**:

1. **Moment Input**: Verify Hive accepts moment context and processes through 5 agents
2. **Workflow State**: Test UI state tracking throughout the workflow
3. **Image Generation**: Verify images are generated and stored properly
4. **API Endpoints**: Test all new Hive-specific endpoints
5. **Error Handling**: Test error scenarios and recovery

#### 5.2 Frontend Testing

**Test Cases**:

1. **HiveMomentForm**: Test moment input form and validation
2. **HiveAgentCollaboration**: Verify 5-agent workflow visualization
3. **Image Deliverables**: Test image display and download functionality
4. **Workflow Progress**: Test real-time progress updates
5. **Responsive Design**: Test on different screen sizes

#### 5.3 Integration Testing

**Test Cases**:

1. **End-to-End Workflow**: Complete Hive orchestration from moment input to deliverables
2. **Cross-Orchestration**: Switch between Hyatt and Hive orchestrations
3. **Data Persistence**: Verify workflow data persists across sessions
4. **Performance**: Test with multiple concurrent workflows

## Implementation Timeline

### Week 1: Backend UI Integration

- Update HiveOrchestrator for UI state management
- Add API endpoints for workflow state
- Test backend integration

### Week 2: Frontend Components

- Create HiveMomentForm component
- Create HiveWorkflowState hook
- Create HiveAgentCollaboration component

### Week 3: Image Handling

- Create ImageDeliverableCard component
- Update SharedDeliverablePanel
- Test image display and download

### Week 4: Integration & Testing

- Update HiveOrchestrationPage
- Comprehensive testing
- Bug fixes and refinements

## Success Metrics

1. **Visual Consistency**: Hive uses same UI components as Hyatt
2. **Workflow Visualization**: Clear 5-agent sequential workflow display
3. **Image Support**: Proper display and management of visual deliverables
4. **User Experience**: Smooth workflow from moment input to completion
5. **Performance**: No degradation in system performance

## Risk Mitigation

1. **Backward Compatibility**: Maintain existing Hive functionality
2. **Testing Strategy**: Comprehensive testing at each phase
3. **Rollback Plan**: Ability to revert changes if issues arise
4. **User Training**: Documentation for new workflow visualization

## Conclusion

This plan adapts the Hive orchestration to use the same UI components and patterns as Hyatt while maintaining its unique moment-based workflow and image generation capabilities. The result will be a consistent user experience across orchestrations with proper visualization of the 5-agent sequential workflow and support for image deliverables.
