# Orchestration Consolidation Plan

## **🎯 OBJECTIVE**

Consolidate 5 separate orchestration definitions into a single source of truth to eliminate inconsistencies, missing orchestrations, and synchronization issues.

## **📋 CURRENT STATE ANALYSIS**

### **❌ THE PROBLEM: 5 SEPARATE ORCHESTRATION DEFINITIONS**

#### **1. `pages/api/orchestrations.js` (Frontend API)**

- **Purpose**: Frontend orchestration discovery and UI rendering
- **Problem**: Hardcoded definitions, doesn't sync with backend
- **Impact**: Frontend doesn't know about backend orchestrations

#### **2. `hive/orchestrations/configs/hyatt.json` (Backend Config)**

- **Purpose**: On-demand agent loading for Hyatt orchestration
- **Problem**: Only used by backend, frontend unaware
- **Impact**: Hyatt orchestration works but not visible in UI

#### **3. `hive/orchestrations/configs/generic.json` (Backend Config)**

- **Purpose**: On-demand agent loading for Generic orchestration
- **Problem**: Missing from frontend API entirely
- **Impact**: Generic orchestration exists but invisible to users

#### **4. `hive/orchestrations/configs/orchestrations.config.json` (Legacy System)**

- **Purpose**: Legacy orchestration system configuration
- **Problem**: Not used by new on-demand system
- **Impact**: Dead code, confusion

#### **5. `frontend/src/components/orchestrations/generated/types.ts` (TypeScript Interfaces)**

- **Purpose**: Type safety for orchestration configurations
- **Problem**: Not connected to actual data sources
- **Impact**: Type definitions don't match reality

### **🔍 SPECIFIC ISSUES IDENTIFIED**

#### **Missing Orchestrations**

- **Generic orchestration** exists in backend but not frontend
- **Hive orchestration** has 10 agents in config but only 5 in implementation

#### **Inconsistent Agent Counts**

- **Hive Config**: Claims 10 agents
- **Hive Implementation**: Only has 5 agents
- **Generic Config**: Has 10 agents
- **Hyatt Config**: Has 5 agents

#### **Duplicate Definitions**

- **Hyatt** appears as both "hyatt" and "agent" orchestrations
- **Hive** has mismatched config vs implementation

#### **System Prompt Errors**

- **OpenAI API errors**: "Invalid type for 'input[0].content': expected one of an array of objects or string, but got null instead"
- **Root cause**: System prompts not loaded before API calls

## **✅ SOLUTION: Backend-Driven Frontend Architecture**

### **PHASE 1: Make Backend the Single Source of Truth**

#### **Step 1.1: Update Frontend API to Read from Backend**

```javascript
// pages/api/orchestrations.js
// Replace hardcoded definitions with dynamic loading from backend configs

const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Load orchestration configs from backend
    const configDir = path.join(
      process.cwd(),
      "hive",
      "orchestrations",
      "configs"
    );
    const orchestrations = {};

    if (fs.existsSync(configDir)) {
      const configFiles = fs
        .readdirSync(configDir)
        .filter(
          (file) =>
            file.endsWith(".json") && file !== "orchestrations.config.json"
        );

      for (const file of configFiles) {
        try {
          const configPath = path.join(configDir, file);
          const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
          const orchestrationId = path.basename(file, ".json");

          // Transform backend config to frontend format
          orchestrations[orchestrationId] = {
            id: orchestrationId,
            name: config.name,
            description:
              config.description || `Orchestration for ${config.name}`,
            enabled: config.enabled !== false,
            config: {
              maxConcurrentWorkflows:
                config.config?.maxConcurrentWorkflows || 5,
              timeout: config.config?.timeout || 300000,
              retryAttempts: config.config?.retryAttempts || 3,
              enableLogging: config.config?.enableLogging !== false,
              reactiveFramework: config.config?.reactiveFramework || false,
              parallelExecution: config.config?.parallelExecution || false,
            },
            workflows: config.workflows || [],
            agents: Object.keys(config.agents || {}),
            hasDiagram: config.hasDiagram || false,
            hasDocumentation: config.hasDocumentation || false,
            documentationPath: config.documentationPath,
          };
        } catch (error) {
          console.warn(
            `Failed to load orchestration config ${file}:`,
            error.message
          );
        }
      }
    }

    res.status(200).json({
      orchestrators: orchestrations,
    });
  } catch (error) {
    console.error("Error loading orchestrations:", error);
    res.status(500).json({
      message: "Failed to load orchestrations",
      error: error.message,
    });
  }
}
```

#### **Step 1.2: Remove Hardcoded Definitions**

- Delete hardcoded orchestration objects from `pages/api/orchestrations.js`
- Keep only the API logic, not the data
- Ensure all orchestrations come from backend JSON files

#### **Step 1.3: Add Generic Orchestration to Frontend**

- Frontend API will automatically pick up `generic.json`
- No more missing orchestrations
- All backend orchestrations become visible in UI

### **PHASE 2: Consolidate Type Definitions**

#### **Step 2.1: Create Single TypeScript Interface**

```typescript
// frontend/src/types/orchestrations.ts

export interface OrchestrationConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: {
    maxConcurrentWorkflows: number;
    timeout: number;
    retryAttempts: number;
    enableLogging: boolean;
    reactiveFramework?: boolean;
    parallelExecution?: boolean;
  };
  workflows: string[];
  agents: string[];
  hasDiagram?: boolean;
  hasDocumentation?: boolean;
  documentationPath?: string;
}

export interface OrchestrationResponse {
  orchestrators: { [key: string]: OrchestrationConfig };
}

export interface AgentConfig {
  class: string;
  model?: string;
  config?: Record<string, any>;
}

export interface BackendOrchestrationConfig {
  name: string;
  description?: string;
  enabled?: boolean;
  orchestrator: string;
  config?: {
    maxConcurrentWorkflows?: number;
    timeout?: number;
    retryAttempts?: number;
    enableLogging?: boolean;
    reactiveFramework?: boolean;
    parallelExecution?: boolean;
  };
  workflows?: string[];
  agents: { [key: string]: AgentConfig };
  hasDiagram?: boolean;
  hasDocumentation?: boolean;
  documentationPath?: string;
}
```

#### **Step 2.2: Update All Components**

- Import types from `frontend/src/types/orchestrations.ts`
- Remove duplicate type definitions from:
  - `frontend/src/components/orchestrations/generated/types.ts`
  - `frontend/src/components/AgentsPage.tsx`
  - Any other components with duplicate interfaces

#### **Step 2.3: Delete Duplicate Type Files**

- Remove `frontend/src/components/orchestrations/generated/types.ts`
- Keep only the dynamic loader functionality

### **PHASE 3: Clean Up Legacy and Fix Inconsistencies**

#### **Step 3.1: Remove Unused Legacy Config**

```bash
# Delete legacy config file
rm hive/orchestrations/configs/orchestrations.config.json
```

#### **Step 3.2: Fix Hive Orchestration Agent Mismatch**

**Option A: Update Hive Config to Match Implementation**

```json
// hive/orchestrations/configs/hive.json
{
  "name": "Hive Orchestrator",
  "description": "Reactive framework orchestration with parallel agent collaboration",
  "orchestrator": "HiveOrchestrator",
  "enabled": true,
  "config": {
    "maxConcurrentWorkflows": 10,
    "timeout": 600000,
    "retryAttempts": 2,
    "enableLogging": true,
    "reactiveFramework": true,
    "parallelExecution": true
  },
  "workflows": [
    "hive_pr_campaign",
    "hive_content_creation",
    "hive_research_collaboration"
  ],
  "agents": {
    "visual_prompt_generator": {
      "class": "VisualPromptGeneratorAgent"
    },
    "modular_elements_recommender": {
      "class": "ModularElementsRecommenderAgent"
    },
    "trend_cultural_analyzer": {
      "class": "TrendCulturalAnalyzerAgent"
    },
    "brand_qa": {
      "class": "BrandQAAgent"
    },
    "brand_lens": {
      "class": "BrandLensAgent"
    }
  }
}
```

**Option B: Implement Missing Agents in HiveOrchestrator.js**

```javascript
// hive/orchestrations/classes/HiveOrchestrator.js
// Add missing agent implementations to match config
```

#### **Step 3.3: Fix System Prompt Loading Issues**

```javascript
// Ensure all agent classes load system prompts before API calls
// This is already implemented but verify it's working

// Example fix in agent classes:
async loadSystemPrompt() {
  if (!this.systemPrompt) {
    const promptPath = path.join(__dirname, "..", "prompts", `${this.promptFile}`);
    this.systemPrompt = fs.readFileSync(promptPath, "utf8");
  }
  return this.systemPrompt;
}

async makeApiCall() {
  // Ensure system prompt is loaded before API call
  if (!this.systemPrompt) {
    await this.loadSystemPrompt();
  }
  // Proceed with API call
}
```

### **PHASE 4: Update Backend Orchestration Manager**

#### **Step 4.1: Ensure OrchestrationManager Reads All Configs**

```javascript
// hive/orchestrations/OrchestrationManager.js
// Verify it loads all JSON configs except orchestrations.config.json

loadOrchestrationConfigs() {
  const configs = {};
  const configDir = path.join(__dirname, "configs");

  if (fs.existsSync(configDir)) {
    const configFiles = fs
      .readdirSync(configDir)
      .filter((file) => file.endsWith(".json") && file !== "orchestrations.config.json");

    for (const file of configFiles) {
      try {
        const configPath = path.join(configDir, file);
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        const orchestrationId = path.basename(file, ".json");
        configs[orchestrationId] = config;
      } catch (error) {
        console.warn(`Failed to load orchestration config ${file}:`, error.message);
      }
    }
  }

  return configs;
}
```

#### **Step 4.2: Update Server Endpoints**

```javascript
// hive/server.js
// Ensure server uses OrchestrationManager for all orchestration operations

// Update /api/orchestrations endpoint to use OrchestrationManager
app.get("/api/orchestrations", async (req, res) => {
  try {
    const orchestrationManager = new OrchestrationManager();
    const availableOrchestrations =
      orchestrationManager.getAvailableOrchestrations();

    // Transform to frontend format
    const orchestrations = {};
    for (const id of availableOrchestrations) {
      const config = orchestrationManager.orchestrationConfigs[id];
      orchestrations[id] = {
        id,
        name: config.name,
        description: config.description || `Orchestration for ${config.name}`,
        enabled: config.enabled !== false,
        config: {
          maxConcurrentWorkflows: config.config?.maxConcurrentWorkflows || 5,
          timeout: config.config?.timeout || 300000,
          retryAttempts: config.config?.retryAttempts || 3,
          enableLogging: config.config?.enableLogging !== false,
          reactiveFramework: config.config?.reactiveFramework || false,
          parallelExecution: config.config?.parallelExecution || false,
        },
        workflows: config.workflows || [],
        agents: Object.keys(config.agents || {}),
        hasDiagram: config.hasDiagram || false,
        hasDocumentation: config.hasDocumentation || false,
        documentationPath: config.documentationPath,
      };
    }

    res.status(200).json({
      orchestrators: orchestrations,
    });
  } catch (error) {
    console.error("Error loading orchestrations:", error);
    res.status(500).json({
      message: "Failed to load orchestrations",
      error: error.message,
    });
  }
});
```

## **🎯 FINAL ARCHITECTURE**

```
Backend JSON Configs (Single Source of Truth)
├── hive/orchestrations/configs/hyatt.json
├── hive/orchestrations/configs/generic.json
└── hive/orchestrations/configs/hive.json

Backend OrchestrationManager (Loads & Manages)
└── hive/orchestrations/OrchestrationManager.js

Backend API Endpoints (Serve to Frontend)
├── hive/server.js → /api/orchestrations
└── pages/api/orchestrations.js → Frontend API

Frontend Types (Single Definition)
└── frontend/src/types/orchestrations.ts

Frontend Components (Use API + Types)
└── All components read from API, use single type definition
```

## **✅ EXPECTED RESULTS**

### **Immediate Benefits**

- **1 source of truth** (backend JSON files)
- **Frontend automatically syncs** with backend
- **No more missing orchestrations** (Generic will appear)
- **Consistent agent counts** across all systems
- **Single type definition** for all orchestration data

### **Long-term Benefits**

- **Scalable architecture** - adding new orchestrations only requires JSON config
- **Type safety** - TypeScript interfaces match actual data
- **Maintainable code** - no duplicate definitions to keep in sync
- **Better developer experience** - clear data flow and structure

## **🚀 IMPLEMENTATION ORDER**

1. **Phase 1**: Update frontend API to read from backend
2. **Phase 2**: Consolidate type definitions
3. **Phase 3**: Clean up legacy and fix inconsistencies
4. **Phase 4**: Update backend orchestration manager
5. **Testing**: Verify all orchestrations appear in frontend
6. **Validation**: Ensure no system prompt errors

## **⚠️ RISKS AND MITIGATION**

### **Risk: Breaking Changes**

- **Mitigation**: Implement incrementally, test each phase
- **Rollback**: Keep backups of current working files

### **Risk: Type Mismatches**

- **Mitigation**: Update TypeScript interfaces to match actual JSON structure
- **Validation**: Use TypeScript strict mode to catch issues

### **Risk: Missing Orchestrations**

- **Mitigation**: Verify all JSON configs are loaded correctly
- **Testing**: Check that Generic orchestration appears in frontend

## **📝 SUCCESS CRITERIA**

- [ ] All orchestrations (Hyatt, Generic, Hive) appear in frontend UI
- [ ] No duplicate type definitions exist
- [ ] System prompt errors are resolved
- [ ] Agent counts match between config and implementation
- [ ] Adding new orchestration only requires JSON config file
- [ ] TypeScript compilation passes without errors
- [ ] All existing functionality continues to work

## **🔧 IMPLEMENTATION NOTES**

- **Backward compatibility**: Ensure existing campaigns continue to work
- **Error handling**: Graceful fallbacks for missing configs
- **Logging**: Add detailed logging for debugging orchestration loading
- **Documentation**: Update documentation to reflect new architecture
