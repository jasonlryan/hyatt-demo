# 🚀 Orchestration Generator Agent Generation Plan

## 🎯 **Overview**

This plan addresses the **critical gap** in the orchestration generator where it creates orchestrations with agent IDs that don't have corresponding agent classes or prompts. Currently, the system generates non-functional orchestrations that reference non-existent agents.

## 🚨 **Current Problem**

### **What's Missing:**

- ❌ **Agent class generation** - No automated creation of agent classes
- ❌ **Agent prompt generation** - No automated creation of system prompts
- ❌ **Agent registration** - No integration with orchestrator system
- ❌ **Agent validation** - No checking if agents exist before creating orchestrations

### **Impact:**

- Generated orchestrations are **non-functional**
- Users create orchestrations that **cannot run**
- System creates **broken configurations**
- **Wasted development time** and user frustration

## 🏗️ **Solution Architecture**

### **Enhanced Orchestration Pipeline**

```
User Input → Orchestration Builder
    ↓
generate-orchestration.js → Creates config + docs + agent list
    ↓
generate-agents.js → Creates missing agent classes + prompts
    ↓
generate-page.js → Creates styled React page
    ↓
generate-component.js → Creates styled components
    ↓
File Generation Service → Saves all files to filesystem
    ↓
save-orchestration.js → Saves config + docs + file paths + agent metadata
    ↓
Agent Registration → Registers new agents with orchestrator
    ↓
Dynamic Routing → Loads generated pages in App.tsx
```

## 🔧 **Implementation Plan**

### **Phase 1: Agent Generation API**

#### **1.1 Create Agent Generation Endpoint**

**File**: `pages/api/generate-agents.js`

**Purpose**: Generate agent classes and prompts for missing agents

**Input**:

```json
{
  "agents": ["custom_analytics", "brand_specialist"],
  "orchestrationContext": "Hive reactive framework",
  "existingAgents": ["pr_manager", "research_audience"]
}
```

**Output**:

```json
{
  "generatedAgents": [
    {
      "id": "custom_analytics",
      "className": "CustomAnalyticsAgent",
      "classCode": "// Generated agent class...",
      "promptCode": "# Custom Analytics Agent\n\n## Purpose...",
      "config": {
        "model": "gpt-4o-2024-08-06",
        "temperature": 0.3,
        "maxTokens": 2000
      }
    }
  ],
  "metadata": {
    "generatedAt": "2024-07-19T...",
    "totalAgents": 2,
    "existingAgents": 5
  }
}
```

#### **1.2 Agent Generation Logic**

**System Prompt**:

```
You are an AI agent architect. Generate complete agent implementations including:

1. Agent Class (extends BaseAgent)
2. System Prompt (markdown)
3. Configuration (model, temperature, etc.)

Available agent patterns:
- research: Audience research and demographic analysis
- trending: Trend identification and news opportunities
- story: Story angles and headline creation
- strategic: Strategic insights and recommendations
- pr-manager: Campaign coordination and strategy management
- visual_prompt_generator: Visual creative prompts
- modular_elements_recommender: Modular visual elements
- trend_cultural_analyzer: Cultural trend analysis
- brand_qa: Brand alignment and quality assurance

Generate JSON with:
{
  "className": "AgentClassName",
  "classCode": "// Complete agent class code",
  "promptCode": "# Complete system prompt",
  "config": {
    "model": "gpt-4o-2024-08-06",
    "temperature": 0.3,
    "maxTokens": 2000
  }
}
```

### **Phase 2: File Generation Service Enhancement**

#### **2.1 Extend FileGenerator Class**

**File**: `utils/fileGenerator.js`

**New Methods**:

```javascript
class FileGenerator {
  // Existing methods...

  async generateAgentClass(agentId, className, classCode) {
    const agentDir = path.join(process.cwd(), "hive", "agents", "classes");
    const filePath = path.join(agentDir, `${className}.js`);

    await fs.writeFile(filePath, classCode);
    return filePath;
  }

  async generateAgentPrompt(agentId, promptCode) {
    const promptDir = path.join(process.cwd(), "hive", "agents", "prompts");
    const filePath = path.join(promptDir, `${agentId}.md`);

    await fs.writeFile(filePath, promptCode);
    return filePath;
  }

  async updateAgentConfig(newAgents) {
    const configPath = path.join(
      process.cwd(),
      "hive",
      "agents",
      "agents.config.json"
    );
    const config = JSON.parse(await fs.readFile(configPath, "utf8"));

    // Add new agents to config
    newAgents.forEach((agent) => {
      config.agents[agent.id] = {
        name: agent.className,
        description: agent.description,
        model: agent.config.model,
        temperature: agent.config.temperature,
        maxTokens: agent.config.maxTokens,
      };
    });

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    return configPath;
  }
}
```

#### **2.2 Agent Validation Service**

**File**: `utils/agentValidator.js`

**Purpose**: Validate agent generation and integration

```javascript
class AgentValidator {
  static validateAgentClass(classCode) {
    // Check for required BaseAgent extension
    // Validate syntax
    // Check for required methods
    return { isValid: boolean, errors: string[] };
  }

  static validateAgentPrompt(promptCode) {
    // Check markdown syntax
    // Validate prompt structure
    // Check for required sections
    return { isValid: boolean, errors: string[] };
  }

  static checkExistingAgents(agentIds) {
    const existingAgents = this.getExistingAgentIds();
    return {
      existing: agentIds.filter(id => existingAgents.includes(id)),
      missing: agentIds.filter(id => !existingAgents.includes(id))
    };
  }
}
```

### **Phase 3: Orchestration Builder Integration**

#### **3.1 Update OrchestrationBuilderPage.tsx**

**File**: `frontend/src/components/orchestrations/OrchestrationBuilderPage.tsx`

**Enhanced Flow**:

```typescript
const handleGenerateOrchestration = async () => {
  // Step 1: Generate orchestration
  const orchestrationResponse = await fetch("/api/generate-orchestration", {...});

  // Step 2: Generate missing agents
  const agentsResponse = await fetch("/api/generate-agents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agents: orchestration.agents,
      orchestrationContext: orchestration.description,
      existingAgents: await getExistingAgentIds()
    })
  });

  // Step 3: Generate page
  const pageResponse = await fetch("/api/generate-page", {...});

  // Step 4: Generate components
  const componentResponse = await fetch("/api/generate-component", {...});

  // Step 5: Save everything
  const saveResponse = await fetch("/api/save-orchestration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...orchestration,
      generatedAgents: agentsResponse.generatedAgents,
      generatedPage: pageResponse.page,
      generatedComponent: componentResponse.component
    })
  });
};
```

#### **3.2 Progress Tracking**

**Enhanced UI**:

```typescript
const [generationProgress, setGenerationProgress] = useState({
  step: 0,
  totalSteps: 5,
  currentStep: "",
  details: "",
});

const steps = [
  "Generating orchestration specification...",
  "Generating missing agents...",
  "Generating React page...",
  "Generating UI components...",
  "Saving orchestration and files...",
];
```

### **Phase 4: Save Orchestration Enhancement**

#### **4.1 Update save-orchestration.js**

**File**: `pages/api/save-orchestration.js`

**Enhanced Logic**:

```javascript
export default async function handler(req, res) {
  try {
    const orchestration = req.body;

    // Generate missing agents if provided
    if (orchestration.generatedAgents) {
      const fileGenerator = new FileGenerator();
      const agentValidator = new AgentValidator();

      for (const agent of orchestration.generatedAgents) {
        // Validate agent class
        const classValidation = agentValidator.validateAgentClass(
          agent.classCode
        );
        if (!classValidation.isValid) {
          return res.status(400).json({
            error: `Agent class validation failed: ${classValidation.errors.join(
              ", "
            )}`,
          });
        }

        // Validate agent prompt
        const promptValidation = agentValidator.validateAgentPrompt(
          agent.promptCode
        );
        if (!promptValidation.isValid) {
          return res.status(400).json({
            error: `Agent prompt validation failed: ${promptValidation.errors.join(
              ", "
            )}`,
          });
        }

        // Generate agent files
        await fileGenerator.generateAgentClass(
          agent.id,
          agent.className,
          agent.classCode
        );
        await fileGenerator.generateAgentPrompt(agent.id, agent.promptCode);
      }

      // Update agent configuration
      await fileGenerator.updateAgentConfig(orchestration.generatedAgents);
    }

    // Continue with existing orchestration saving logic...
  } catch (error) {
    console.error("Error saving orchestration:", error);
    res.status(500).json({
      error: "Failed to save orchestration",
      details: error.message,
    });
  }
}
```

### **Phase 5: Agent Registration System**

#### **5.1 Dynamic Agent Loading**

**File**: `hive/agents/index.js`

**Enhanced Loading**:

```javascript
const fs = require("fs").promises;
const path = require("path");

class AgentRegistry {
  static async loadAllAgents() {
    const agentsDir = path.join(__dirname, "classes");
    const agentFiles = await fs.readdir(agentsDir);

    const agents = {};

    for (const file of agentFiles) {
      if (file.endsWith(".js") && file !== "BaseAgent.js") {
        const agentId = file.replace(".js", "").toLowerCase();
        const AgentClass = require(`./classes/${file}`);
        agents[agentId] = AgentClass;
      }
    }

    return agents;
  }

  static async registerNewAgent(agentId, agentClass) {
    // Register new agent with orchestrator
    // Update agent configuration
    // Reload agent registry
  }
}

module.exports = AgentRegistry;
```

## 📋 **Implementation Checklist**

### **Phase 1: Agent Generation API**

- [ ] Create `pages/api/generate-agents.js`
- [ ] Implement agent generation logic
- [ ] Add agent validation
- [ ] Test agent generation with sample agents

### **Phase 2: File Generation Enhancement**

- [ ] Extend `FileGenerator` class with agent methods
- [ ] Create `AgentValidator` class
- [ ] Add agent file generation capabilities
- [ ] Test file generation and validation

### **Phase 3: Orchestration Builder Integration**

- [ ] Update `OrchestrationBuilderPage.tsx` with agent generation
- [ ] Add progress tracking for agent generation
- [ ] Enhance error handling for agent generation
- [ ] Test complete generation workflow

### **Phase 4: Save Orchestration Enhancement**

- [ ] Update `save-orchestration.js` with agent saving
- [ ] Add agent validation to save process
- [ ] Integrate agent configuration updates
- [ ] Test complete save workflow

### **Phase 5: Agent Registration**

- [ ] Create `AgentRegistry` class
- [ ] Implement dynamic agent loading
- [ ] Add agent registration system
- [ ] Test agent registration and loading

## 🧪 **Testing Strategy**

### **Unit Tests**

- [ ] Agent generation API tests
- [ ] Agent validation tests
- [ ] File generation tests
- [ ] Agent registration tests

### **Integration Tests**

- [ ] Complete orchestration generation workflow
- [ ] Agent integration with orchestrator
- [ ] File system operations
- [ ] Error handling and recovery

### **End-to-End Tests**

- [ ] Create orchestration with new agents
- [ ] Verify agents are functional
- [ ] Test orchestration execution
- [ ] Validate generated files

## 🚀 **Expected Outcomes**

### **Before (Current State)**

- ❌ Orchestration generator creates non-functional orchestrations
- ❌ Users get broken configurations
- ❌ Manual agent creation required
- ❌ Incomplete automation

### **After (Target State)**

- ✅ Complete orchestration generation including agents
- ✅ Functional orchestrations out of the box
- ✅ Full automation from description to working system
- ✅ Validated and tested agent implementations

## 📊 **Success Metrics**

- **100%** of generated orchestrations are functional
- **0** manual agent creation steps required
- **< 5 minutes** from description to working orchestration
- **100%** agent validation pass rate
- **0** broken orchestrations created

## 🔄 **Future Enhancements**

### **Advanced Agent Generation**

- Custom agent patterns based on orchestration type
- Agent interaction patterns and workflows
- Agent testing and validation frameworks
- Agent performance optimization

### **Agent Templates**

- Pre-built agent templates for common use cases
- Agent customization options
- Agent parameter tuning
- Agent specialization patterns

---

**Status**: 🚧 Planning Phase  
**Priority**: 🔴 Critical  
**Estimated Effort**: 2-3 weeks  
**Dependencies**: Existing orchestration generator infrastructure
