# Orchestration Consolidation Plan

## **🎯 OBJECTIVE**

Consolidate orchestration definitions into a single source of truth and rename `AgentOrchestrator.js` to `HyattOrchestrator.js` for clarity and consistency.

## **📋 CURRENT STATE ANALYSIS**

### **✅ RECENT CHANGES (POST-SERVER REFACTORING)**

#### **1. Express Server Consolidation Completed**

- **`pages/api/orchestrations.js`**: ❌ **DELETED** (moved to Express server)
- **`hive/routes/generation.js`**: ✅ **NEW** - Contains `/api/orchestrations` endpoint
- **OrchestrationManager**: ✅ **UPDATED** - Now generates configs from orchestration classes

#### **2. Current Architecture**

- **Backend**: `hive/routes/generation.js` serves `/api/orchestrations` using `OrchestrationManager`
- **Frontend**: Components fetch from `/api/orchestrations` endpoint
- **Source of Truth**: Orchestration classes in `hive/orchestrations/classes/`

### **❌ REMAINING ISSUES**

#### **1. File Naming Inconsistency**

- **`AgentOrchestrator.js`**: Should be renamed to `HyattOrchestrator.js` for clarity
- **Current mapping**: `agentorchestrator` → `hyatt` (confusing)
- **Desired mapping**: `hyattorchestrator` → `hyatt` (clear)

#### **2. Type Definitions Scattered**

- **`frontend/src/components/orchestrations/generated/types.ts`**: Contains some orchestration types
- **Missing**: Centralized orchestration type definitions
- **Issue**: Types don't match actual API response structure

#### **3. Legacy Config Files**

- **`hive/orchestrations/configs/orchestrations.config.json`**: Legacy file, not used
- **`hive/orchestrations/configs/hyatt.json`**: Legacy file, not used
- **`hive/orchestrations/configs/generic.json`**: Legacy file, not used

#### **4. System Prompt Errors**

- **OpenAI API errors**: "Invalid type for 'input[0].content': expected one of an array of objects or string, but got null instead"
- **Root cause**: System prompts not loaded before API calls

## **✅ SOLUTION: Complete Consolidation**

### **PHASE 1: Rename AgentOrchestrator to HyattOrchestrator**

#### **Step 1.1: Rename the File**

```bash
# Rename the orchestration class file
mv hive/orchestrations/classes/AgentOrchestrator.js hive/orchestrations/classes/HyattOrchestrator.js
```

#### **Step 1.2: Update OrchestrationManager**

```javascript
// hive/orchestrations/OrchestrationManager.js
// Update the mapping and references

// Update extractAgentsFromClass method
extractAgentsFromClass(instance, className) {
  const agents = {};

  if (className === "HyattOrchestrator") { // Changed from AgentOrchestrator
    // Hyatt orchestration agents
    agents.research = { class: "ResearchAudienceAgent" };
    agents.trending = { class: "TrendingNewsAgent" };
    agents.story = { class: "StoryAnglesAgent" };
    agents.pr_manager = { class: "PRManagerAgent" };
    agents.strategic_insight = { class: "StrategicInsightAgent" };
  } else if (className === "HiveOrchestrator") {
    // Hive orchestration agents
    agents.visual = { class: "VisualPromptGeneratorAgent" };
    agents.modular = { class: "ModularElementsRecommenderAgent" };
    agents.trend = { class: "TrendCulturalAnalyzerAgent" };
    agents.qa = { class: "BrandQAAgent" };
    agents.brand_lens = { class: "BrandLensAgent" };
  }

  return agents;
}

// Update getNameForClass method
getNameForClass(className) {
  const names = {
    HyattOrchestrator: "Hyatt Orchestrator", // Changed from AgentOrchestrator
    HiveOrchestrator: "Hive Orchestrator",
  };
  return names[className] || className;
}

// Update getDescriptionForClass method
getDescriptionForClass(className) {
  const descriptions = {
    HyattOrchestrator: // Changed from AgentOrchestrator
      "Hyatt orchestration with 5 specialized agents for comprehensive campaign development",
    HiveOrchestrator:
      "Reactive framework orchestration with parallel agent collaboration for visual content generation",
  };
  return descriptions[className] || `Orchestration using ${className}`;
}

// Update getWorkflowsForClass method
getWorkflowsForClass(className) {
  const workflows = {
    HyattOrchestrator: [ // Changed from AgentOrchestrator
      "hyatt_campaign_development",
      "hyatt_research_analysis",
      "hyatt_strategic_planning",
    ],
    HiveOrchestrator: [
      "hive_visual_generation",
      "hive_trend_analysis",
      "hive_brand_analysis",
    ],
  };
  return workflows[className] || [];
}

// Update mapToFrontendId method
mapToFrontendId(className) {
  const mappings = {
    hyattorchestrator: "hyatt", // Changed from agentorchestrator
    hiveorchestrator: "hive",
  };
  return mappings[className] || className;
}
```

#### **Step 1.3: Update Server Routes**

```javascript
// hive/routes/campaigns.js
// Update the getOrchestrationForCampaign function
async function getOrchestrationForCampaign() {
  return orchestrationManager.getOrchestration("hyatt"); // This should still work
}
```

### **PHASE 2: Consolidate Type Definitions**

#### **Step 2.1: Create Centralized Type File**

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

#### **Step 2.2: Update Components to Use Centralized Types**

```typescript
// Update all components to import from centralized location
import {
  OrchestrationConfig,
  OrchestrationResponse,
} from "../types/orchestrations";
```

#### **Step 2.3: Remove Duplicate Type Files**

```bash
# Remove the scattered type definitions
rm frontend/src/components/orchestrations/generated/types.ts
```

### **PHASE 3: Clean Up Legacy Files**

#### **Step 3.1: Remove Unused Config Files**

```bash
# Remove legacy config files that are no longer used
rm hive/orchestrations/configs/orchestrations.config.json
rm hive/orchestrations/configs/hyatt.json
rm hive/orchestrations/configs/generic.json
```

#### **Step 3.2: Update Documentation**

```markdown
# Update documentation to reflect new naming

# docs/orchestrations/HyattOrchestrator.md (rename from AgentOrchestrator.md)
```

### **PHASE 4: Fix System Prompt Loading**

#### **Step 4.1: Ensure Agent Classes Load Prompts Properly**

```javascript
// Verify all agent classes have proper prompt loading
// This should already be implemented but verify it's working

// Example in agent classes:
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

## **🎯 FINAL ARCHITECTURE**

```
Backend Orchestration Classes (Single Source of Truth)
├── hive/orchestrations/classes/HyattOrchestrator.js (renamed from AgentOrchestrator.js)
└── hive/orchestrations/classes/HiveOrchestrator.js

Backend OrchestrationManager (Generates Configs from Classes)
└── hive/orchestrations/OrchestrationManager.js

Backend API Endpoint (Serves to Frontend)
└── hive/routes/generation.js → /api/orchestrations

Frontend Types (Single Definition)
└── frontend/src/types/orchestrations.ts

Frontend Components (Use API + Types)
└── All components read from API, use single type definition
```

## **✅ EXPECTED RESULTS**

### **Immediate Benefits**

- **Clear naming**: `HyattOrchestrator.js` instead of confusing `AgentOrchestrator.js`
- **Single source of truth**: Orchestration classes generate all configs
- **Centralized types**: All TypeScript interfaces in one place
- **No legacy files**: Clean codebase without unused config files

### **Long-term Benefits**

- **Scalable architecture**: Adding new orchestrations only requires new class file
- **Type safety**: TypeScript interfaces match actual data structure
- **Maintainable code**: Clear naming and organization
- **Better developer experience**: Intuitive file structure

## **🚀 IMPLEMENTATION ORDER**

1. **Phase 1**: Rename `AgentOrchestrator.js` to `HyattOrchestrator.js`
2. **Phase 2**: Consolidate type definitions
3. **Phase 3**: Clean up legacy files
4. **Phase 4**: Fix system prompt loading
5. **Testing**: Verify all orchestrations work correctly
6. **Validation**: Ensure no breaking changes

## **⚠️ RISKS AND MITIGATION**

### **Risk: Breaking Changes from Renaming**

- **Mitigation**: Update all references systematically
- **Testing**: Verify each component after renaming

### **Risk: Type Mismatches**

- **Mitigation**: Update TypeScript interfaces to match actual API response
- **Validation**: Use TypeScript strict mode to catch issues

### **Risk: System Prompt Errors**

- **Mitigation**: Verify all agent classes load prompts before API calls
- **Testing**: Test orchestration functionality end-to-end

## **📝 SUCCESS CRITERIA**

- [ ] `AgentOrchestrator.js` renamed to `HyattOrchestrator.js`
- [ ] All references updated in OrchestrationManager
- [ ] Centralized type definitions created
- [ ] Legacy config files removed
- [ ] System prompt errors resolved
- [ ] All orchestrations work correctly
- [ ] TypeScript compilation passes without errors
- [ ] Frontend displays orchestrations correctly

## **🔧 IMPLEMENTATION NOTES**

- **Backward compatibility**: Ensure existing campaigns continue to work
- **Error handling**: Graceful fallbacks for missing files
- **Logging**: Add detailed logging for debugging orchestration loading
- **Documentation**: Update documentation to reflect new naming
- **Testing**: Test both Hyatt and Hive orchestrations thoroughly
