# Single Source of Truth Architecture

## **🎯 OVERVIEW**

This document defines the **single source of truth** architecture for agents and orchestrations in the Hive system. This ensures consistency, maintainability, and prevents the data synchronization issues we've experienced.

## **📋 ARCHITECTURE**

### **Single Source of Truth: `hive/agents/agents.config.json`**

```
✅ hive/agents/agents.config.json → SINGLE SOURCE OF TRUTH
├── OrchestrationManager reads from agents config
├── Orchestration classes get agent IDs from config
├── Frontend reads from API (which comes from agents config)
└── All agent definitions, IDs, and configurations centralized
```

### **Data Flow**

```
1. agents.config.json (SINGLE SOURCE)
   ↓
2. OrchestrationManager.loadAgentsConfig()
   ↓
3. OrchestrationManager.extractAgentsFromClass()
   ↓
4. Orchestration classes get agents from config
   ↓
5. API endpoints serve orchestration data
   ↓
6. Frontend displays orchestration tags
```

## **🔧 IMPLEMENTATION**

### **1. OrchestrationManager.js**

The OrchestrationManager now reads from the single source of truth:

```javascript
class OrchestrationManager {
  constructor() {
    this.agentsConfig = this.loadAgentsConfig(); // Load agents config as single source of truth
    this.orchestrationConfigs = this.generateConfigsFromClasses();
  }

  // Load agents configuration as single source of truth
  loadAgentsConfig() {
    try {
      const agentsConfigPath = path.join(
        __dirname,
        "..",
        "agents",
        "agents.config.json"
      );
      const config = JSON.parse(fs.readFileSync(agentsConfigPath, "utf8"));
      return config.agents;
    } catch (error) {
      console.error("Failed to load agents config:", error);
      return {};
    }
  }

  // Extract agents from orchestration class using single source of truth
  extractAgentsFromClass(instance, className) {
    const agents = {};

    if (className === "HyattOrchestrator") {
      // Hyatt orchestration agents - using agent IDs from agents.config.json
      const hyattAgentIds = [
        "research",
        "trending",
        "story",
        "pr-manager",
        "strategic",
      ];

      hyattAgentIds.forEach((agentId) => {
        if (this.agentsConfig[agentId]) {
          agents[agentId] = {
            class: this.getAgentClassName(agentId),
            model: this.agentsConfig[agentId].model,
            config: this.agentsConfig[agentId],
          };
        } else {
          console.warn(
            `Agent ${agentId} not found in agents config for Hyatt orchestration`
          );
        }
      });
    }
    // ... similar for HiveOrchestrator
  }
}
```

### **2. Orchestration Classes**

Orchestration classes now dynamically set up agent references:

```javascript
class HyattOrchestrator extends BaseOrchestrator {
  constructor(config = {}) {
    // ... other setup

    // Set up agent references dynamically from config (single source of truth)
    this.setupAgentReferences();
  }

  // Setup agent references dynamically from config (single source of truth)
  setupAgentReferences() {
    const agentMapping = {
      research: "researchAgent",
      trending: "trendingAgent",
      story: "storyAgent",
      "pr-manager": "prManagerAgent",
      strategic: "strategicInsightAgent",
    };

    Object.entries(agentMapping).forEach(([agentId, propertyName]) => {
      const agent = this.agents.get(agentId);
      if (agent) {
        this[propertyName] = agent;
      } else {
        console.warn(
          `Agent ${agentId} not found in config for Hyatt orchestration`
        );
      }
    });
  }
}
```

## **📊 CANONICAL AGENT IDS**

### **Hyatt Orchestration Agents**

| Agent ID     | Agent Name                   | Class Name            |
| ------------ | ---------------------------- | --------------------- |
| `research`   | Research & Audience GPT      | ResearchAudienceAgent |
| `trending`   | Trending News GPT            | TrendingNewsAgent     |
| `story`      | Story Angles & Headlines GPT | StoryAnglesAgent      |
| `pr-manager` | PR Manager GPT               | PRManagerAgent        |
| `strategic`  | Strategic Insight GPT        | StrategicInsightAgent |

### **Hive Orchestration Agents**

| Agent ID                       | Agent Name                   | Class Name                      |
| ------------------------------ | ---------------------------- | ------------------------------- |
| `visual_prompt_generator`      | Visual Prompt Generator      | VisualPromptGeneratorAgent      |
| `modular_elements_recommender` | Modular Elements Recommender | ModularElementsRecommenderAgent |
| `trend_cultural_analyzer`      | Trend & Cultural Analyzer    | TrendCulturalAnalyzerAgent      |
| `brand_qa`                     | Brand QA Agent               | BrandQAAgent                    |
| `brand_lens`                   | Brand Lens Agent             | BrandLensAgent                  |

## **🚀 ADDING NEW AGENTS**

### **Step 1: Add to agents.config.json**

```json
{
  "agents": {
    "new_agent_id": {
      "id": "new_agent_id",
      "name": "New Agent Name",
      "description": "Agent description",
      "enabled": true,
      "model": "gpt-4o-2024-08-06",
      "temperature": 0.3,
      "maxTokens": 2000,
      "timeout": 45000,
      "promptFile": "new_agent_prompt.md",
      "role": "new_role",
      "priority": 11
    }
  }
}
```

### **Step 2: Add Agent Class**

```javascript
// hive/agents/classes/NewAgent.js
class NewAgent extends BaseAgent {
  constructor() {
    super({
      name: "New Agent",
      model: "gpt-4o-2024-08-06",
      promptFile: "new_agent_prompt.md",
    });
  }

  // Agent-specific methods
}

module.exports = NewAgent;
```

### **Step 3: Add to OrchestrationManager**

```javascript
// In OrchestrationManager.getAgentClassName()
getAgentClassName(agentId) {
  const classMapping = {
    // ... existing mappings
    "new_agent_id": "NewAgent"
  };

  return classMapping[agentId] || `${agentId.charAt(0).toUpperCase() + agentId.slice(1)}Agent`;
}
```

### **Step 4: Add to Orchestration (if needed)**

```javascript
// In OrchestrationManager.extractAgentsFromClass()
if (className === "HyattOrchestrator") {
  const hyattAgentIds = [
    "research",
    "trending",
    "story",
    "pr-manager",
    "strategic",
    "new_agent_id",
  ];
  // ... rest of the logic
}
```

## **🚀 ADDING NEW ORCHESTRATIONS**

### **Step 1: Create Orchestration Class**

```javascript
// hive/orchestrations/classes/NewOrchestrator.js
class NewOrchestrator extends BaseOrchestrator {
  constructor(config = {}) {
    super({
      name: "NewOrchestrator",
      version: "1.0.0",
      ...config,
    });

    this.setupAgentReferences();
  }

  setupAgentReferences() {
    const agentMapping = {
      agent1: "agent1Reference",
      agent2: "agent2Reference",
    };

    Object.entries(agentMapping).forEach(([agentId, propertyName]) => {
      const agent = this.agents.get(agentId);
      if (agent) {
        this[propertyName] = agent;
      }
    });
  }
}

module.exports = NewOrchestrator;
```

### **Step 2: Add to OrchestrationManager**

```javascript
// In OrchestrationManager.extractAgentsFromClass()
} else if (className === "NewOrchestrator") {
  const newOrchestrationAgentIds = ["agent1", "agent2"];

  newOrchestrationAgentIds.forEach(agentId => {
    if (this.agentsConfig[agentId]) {
      agents[agentId] = {
        class: this.getAgentClassName(agentId),
        model: this.agentsConfig[agentId].model,
        config: this.agentsConfig[agentId]
      };
    }
  });
}
```

### **Step 3: Add Metadata**

```javascript
// In OrchestrationManager.getNameForClass()
getNameForClass(className) {
  const names = {
    HyattOrchestrator: "Hyatt Orchestrator",
    HiveOrchestrator: "Hive Orchestrator",
    NewOrchestrator: "New Orchestrator"
  };
  return names[className] || className;
}
```

## **✅ BENEFITS**

### **1. Single Source of Truth**

- All agent definitions in one place
- No more ID mismatches
- Consistent data across the system

### **2. Maintainability**

- Add new agents by updating one file
- Add new orchestrations systematically
- Clear documentation of relationships

### **3. Scalability**

- Easy to add new agents and orchestrations
- Consistent patterns for all additions
- Automated validation of agent existence

### **4. Reliability**

- No more hardcoded agent references
- Automatic error detection for missing agents
- Consistent API responses

## **⚠️ RULES & ENFORCEMENT**

### **1. Never Hardcode Agent IDs**

❌ **Wrong:**

```javascript
agents.research = { class: "ResearchAudienceAgent" };
```

✅ **Correct:**

```javascript
if (this.agentsConfig[agentId]) {
  agents[agentId] = { class: this.getAgentClassName(agentId) };
}
```

### **2. Always Use agents.config.json**

- All agent definitions must be in `agents.config.json`
- No agent definitions in orchestration classes
- No hardcoded agent references

### **3. Validate Agent Existence**

- Check if agent exists in config before using
- Log warnings for missing agents
- Fail gracefully with clear error messages

### **4. Use Consistent Naming**

- Agent IDs must match between config and code
- Class names follow `{AgentName}Agent` pattern
- File names match class names

## **🔍 VALIDATION**

### **Automated Checks**

- OrchestrationManager validates agent existence
- Frontend displays warnings for missing agents
- API returns consistent error messages

### **Manual Validation**

- Check agents page for orchestration tags
- Verify all agents appear in correct orchestrations
- Test adding new agents and orchestrations

This architecture ensures that we have a **true single source of truth** that will be upheld for all future agents and orchestrations.
