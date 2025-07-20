# 🚀 Agent Generation System Plan - COMPLETION FOCUS

## 🎯 **Overview**

This plan focuses on **completing the agent generation system** that is currently 70% functional but missing critical validation and multi-agent support components.

## 📊 **Current Status: 70% Complete**

### **✅ COMPLETED COMPONENTS** (Moved to end)

- ✅ Basic `/api/generate-agents` endpoint
- ✅ Agent class generation with OpenAI Responses API
- ✅ Agent prompt generation
- ✅ File saving to filesystem
- ✅ Config updates to `agents.config.json`
- ✅ Cleanup functionality
- ✅ Proper OpenAI API usage

### **❌ CRITICAL MISSING COMPONENTS**

| Component                  | Priority        | Effort    | Status     | Impact                            |
| -------------------------- | --------------- | --------- | ---------- | --------------------------------- |
| **Agent Validation**       | 🔴 Critical     | 1-2 hours | ❌ Missing | Prevents broken agents            |
| **Multi-Agent Generation** | 🔴 Critical     | 2-3 hours | ❌ Missing | Only generates 1 agent at a time  |
| **Agent Registration**     | 🟡 Important    | 3-4 hours | ❌ Missing | No dynamic loading                |
| **Error Handling**         | 🟡 Important    | 2-3 hours | ❌ Missing | Poor failure handling             |
| **Agent Testing**          | 🟢 Nice to Have | 4-5 hours | ❌ Missing | No validation of generated agents |

## 🎯 **MINIMAL VIABLE AGENT GENERATION**

**To make agent generation fully functional, you need:**

1. **AgentValidator class** - Validate generated code before saving
2. **Multi-agent processing** - Handle multiple agents in one request
3. **Better error handling** - Validate and handle failures gracefully

**Total Effort**: ~6-8 hours to complete agent generation system

## 🚨 **CRITICAL ISSUES TO FIX**

### **Issue 1: No Agent Validation** 🔴 **CRITICAL**

**Problem**: Generated agents are saved without validation, potentially creating broken agents.

**Current Code** (lines 560-590 in `hive/routes/generation.js`):

```javascript
async function saveGeneratedAgent(agentId, agentClass, agentPrompt) {
  // ❌ NO VALIDATION - saves potentially broken code
  await fs.promises.writeFile(agentClassPath, agentClass.classCode, "utf8");
  await fs.promises.writeFile(agentPromptPath, agentPrompt.promptCode, "utf8");
}
```

**Solution**: Create `AgentValidator` class and validate before saving.

### **Issue 2: Single Agent Generation** 🔴 **CRITICAL**

**Problem**: Only generates one agent at a time, even when multiple agents are requested.

**Current Code** (lines 365-375 in `hive/routes/generation.js`):

```javascript
// Generate agent class and prompt for the first agent
const agentId = agents[0]; // ❌ ONLY PROCESSES FIRST AGENT
const agentClass = await generateAgentClass(agentId, orchestrationContext);
const agentPrompt = await generateAgentPrompt(agentId, orchestrationContext);
```

**Solution**: Loop through all agents and generate them in batch.

### **Issue 3: Poor Error Handling** 🟡 **IMPORTANT**

**Problem**: Limited error handling and no validation before saving.

**Current Code**:

```javascript
} catch (error) {
  console.error("Agent generation failed:", error);
  res.status(500).json({
    error: "Failed to generate agent",
    details: error.message,
  });
}
```

**Solution**: Add comprehensive validation and graceful error handling.

## 🔧 **IMPLEMENTATION PLAN**

### **Phase 1: Agent Validation System** 🔴 **CRITICAL - 1-2 hours**

#### **Step 1.1: Create AgentValidator Class**

**File**: `utils/agentValidator.js`

```javascript
class AgentValidator {
  static validateAgentClass(classCode) {
    const errors = [];

    // Check for BaseAgent extension
    if (!classCode.includes("extends BaseAgent")) {
      errors.push("Agent must extend BaseAgent class");
    }

    // Check for required methods
    if (!classCode.includes("process")) {
      errors.push("Agent must implement process method");
    }

    // Check for proper imports
    if (!classCode.includes('require("./BaseAgent")')) {
      errors.push("Agent must import BaseAgent");
    }

    // Check for proper exports
    if (!classCode.includes("module.exports")) {
      errors.push("Agent must export the class");
    }

    // Check for Responses API usage
    if (classCode.includes("chat.completions.create")) {
      errors.push(
        "Agent MUST use responses.create() NOT chat.completions.create()"
      );
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateAgentPrompt(promptCode) {
    const errors = [];

    // Check for markdown structure
    if (!promptCode.includes("#")) {
      errors.push("Prompt must include markdown headers");
    }

    // Check for purpose section
    if (!promptCode.includes("Purpose") && !promptCode.includes("purpose")) {
      errors.push("Prompt must include purpose section");
    }

    return { isValid: errors.length === 0, errors };
  }
}

module.exports = AgentValidator;
```

#### **Step 1.2: Integrate Validation into Generation**

**Update**: `hive/routes/generation.js` - `saveGeneratedAgent` function

```javascript
const AgentValidator = require("../../utils/agentValidator");

async function saveGeneratedAgent(agentId, agentClass, agentPrompt) {
  // ✅ VALIDATE BEFORE SAVING
  const classValidation = AgentValidator.validateAgentClass(
    agentClass.classCode
  );
  const promptValidation = AgentValidator.validateAgentPrompt(
    agentPrompt.promptCode
  );

  if (!classValidation.isValid) {
    throw new Error(
      `Agent class validation failed: ${classValidation.errors.join(", ")}`
    );
  }

  if (!promptValidation.isValid) {
    throw new Error(
      `Agent prompt validation failed: ${promptValidation.errors.join(", ")}`
    );
  }

  // Save files only after validation passes
  const baseDir = process.cwd();
  const agentClassDir = path.join(baseDir, "agents", "classes");
  const agentClassPath = path.join(agentClassDir, `${agentClass.className}.js`);

  await fs.promises.mkdir(agentClassDir, { recursive: true });
  await fs.promises.writeFile(agentClassPath, agentClass.classCode, "utf8");

  const agentPromptDir = path.join(baseDir, "agents", "prompts");
  const agentPromptPath = path.join(agentPromptDir, `${agentId}.md`);

  await fs.promises.mkdir(agentPromptDir, { recursive: true });
  await fs.promises.writeFile(agentPromptPath, agentPrompt.promptCode, "utf8");

  return { agentClassPath, agentPromptPath };
}
```

### **Phase 2: Multi-Agent Generation** 🔴 **CRITICAL - 2-3 hours**

#### **Step 2.1: Update Main Endpoint**

**Update**: `hive/routes/generation.js` - Main `/api/generate-agents` handler

```javascript
app.post("/api/generate-agents", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { agents, orchestrationContext, cleanup = false } = req.body;

    // Handle cleanup request
    if (cleanup && agents && agents.length > 0) {
      const cleanupResult = await cleanupTestAgent(agents[0]);
      return res.status(200).json({
        message: "Test agent cleaned up",
        cleanupResult,
      });
    }

    if (!agents || !Array.isArray(agents) || agents.length === 0) {
      return res.status(400).json({ error: "Agents array is required" });
    }

    if (!orchestrationContext) {
      return res
        .status(400)
        .json({ error: "Orchestration context is required" });
    }

    console.log(
      `🎯 Generating ${agents.length} agents: ${agents.join(
        ", "
      )} for context: ${orchestrationContext}`
    );

    // ✅ GENERATE ALL AGENTS
    const generatedAgents = [];
    const errors = [];

    for (const agentId of agents) {
      try {
        console.log(`🤖 Generating agent: ${agentId}`);

        const agentClass = await generateAgentClass(
          agentId,
          orchestrationContext
        );
        const agentPrompt = await generateAgentPrompt(
          agentId,
          orchestrationContext
        );

        // Validate before saving
        const classValidation = AgentValidator.validateAgentClass(
          agentClass.classCode
        );
        const promptValidation = AgentValidator.validateAgentPrompt(
          agentPrompt.promptCode
        );

        if (!classValidation.isValid || !promptValidation.isValid) {
          const validationErrors = [
            ...classValidation.errors,
            ...promptValidation.errors,
          ];
          throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
        }

        // Save the generated files
        const filePaths = await saveGeneratedAgent(
          agentId,
          agentClass,
          agentPrompt
        );

        // Update agent config
        const configUpdated = await updateAgentConfig(
          agentId,
          agentClass,
          agentPrompt,
          orchestrationContext
        );

        generatedAgents.push({
          agentId,
          agentClass,
          agentPrompt,
          filePaths,
          configUpdated,
        });

        console.log(`✅ Successfully generated agent: ${agentId}`);
      } catch (error) {
        console.error(`❌ Failed to generate agent ${agentId}:`, error.message);
        errors.push({ agentId, error: error.message });
      }
    }

    // Reload orchestrations to include the new agents
    orchestrationManager.reloadAgentsConfig();

    res.status(200).json({
      generatedAgents,
      errors,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalAgents: agents.length,
        successfulAgents: generatedAgents.length,
        failedAgents: errors.length,
        context: orchestrationContext,
      },
    });
  } catch (error) {
    console.error("Agent generation failed:", error);
    res.status(500).json({
      error: "Failed to generate agents",
      details: error.message,
    });
  }
});
```

### **Phase 3: Agent Registration System** 🟡 **IMPORTANT - 3-4 hours**

#### **Step 3.1: Create AgentRegistry Class**

**File**: `hive/agents/index.js`

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
        try {
          const AgentClass = require(`./classes/${file}`);
          agents[agentId] = AgentClass;
        } catch (error) {
          console.warn(`Failed to load agent ${agentId}:`, error.message);
        }
      }
    }

    return agents;
  }

  static async registerNewAgent(agentId, agentClass) {
    // Register with OrchestrationManager
    const OrchestrationManager = require("../orchestrations/OrchestrationManager");
    const manager = new OrchestrationManager();

    // Update agent configuration
    await manager.reloadAgentsConfig();

    return {
      registered: true,
      agentId,
      className: agentClass.className,
    };
  }

  static async getExistingAgentIds() {
    const configPath = path.join(__dirname, "agents.config.json");
    if (!fs.existsSync(configPath)) {
      return [];
    }

    const config = JSON.parse(await fs.readFile(configPath, "utf8"));
    return Object.keys(config.agents || {});
  }
}

module.exports = AgentRegistry;
```

### **Phase 4: Enhanced Error Handling** 🟡 **IMPORTANT - 2-3 hours**

#### **Step 4.1: Comprehensive Error Handling**

**Update**: Add error handling to all generation functions

```javascript
async function generateAgentClass(agentId, context) {
  try {
    const { OpenAI } = require("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // ... existing code ...

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate agent class for: ${agentId} in context: ${context}`,
        },
      ],
      temperature: 0.3,
    });

    // Validate response
    if (!response.output_text) {
      throw new Error("No output text received from OpenAI");
    }

    // ... rest of existing code ...
  } catch (error) {
    throw new Error(
      `Failed to generate agent class for ${agentId}: ${error.message}`
    );
  }
}
```

### **Phase 5: Agent Testing System** 🟢 **NICE TO HAVE - 4-5 hours**

#### **Step 5.1: Create AgentTester Class**

**File**: `utils/agentTester.js`

```javascript
class AgentTester {
  static async testGeneratedAgent(agentId, agentClass) {
    try {
      // Test agent instantiation
      const AgentClass = require(`../hive/agents/classes/${agentClass.className}.js`);
      const agent = new AgentClass();

      // Test system prompt loading
      await agent.loadSystemPrompt();

      // Test basic functionality
      const result = await agent.process("test input");

      return {
        isValid: true,
        result,
        agentId,
        className: agentClass.className,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
        agentId,
        className: agentClass.className,
      };
    }
  }

  static async testAllGeneratedAgents(generatedAgents) {
    const testResults = [];

    for (const agent of generatedAgents) {
      const result = await this.testGeneratedAgent(
        agent.agentId,
        agent.agentClass
      );
      testResults.push(result);
    }

    return testResults;
  }
}

module.exports = AgentTester;
```

## 📋 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Agent Validation** 🔴 **CRITICAL**

- [ ] Create `utils/agentValidator.js`
- [ ] Add validation to `saveGeneratedAgent` function
- [ ] Test validation with sample agents
- [ ] Add validation error handling

### **Phase 2: Multi-Agent Generation** 🔴 **CRITICAL**

- [ ] Update main endpoint to handle multiple agents
- [ ] Add batch processing logic
- [ ] Add individual agent error handling
- [ ] Test with multiple agents

### **Phase 3: Agent Registration** 🟡 **IMPORTANT**

- [ ] Create `hive/agents/index.js` with AgentRegistry
- [ ] Add dynamic agent loading
- [ ] Integrate with OrchestrationManager
- [ ] Test agent registration

### **Phase 4: Error Handling** 🟡 **IMPORTANT**

- [ ] Add comprehensive error handling to all functions
- [ ] Add validation error handling
- [ ] Add graceful failure handling
- [ ] Test error scenarios

### **Phase 5: Agent Testing** 🟢 **NICE TO HAVE**

- [ ] Create `utils/agentTester.js`
- [ ] Add agent testing functionality
- [ ] Integrate testing into generation pipeline
- [ ] Test complete workflow

## 🧪 **TESTING STRATEGY**

### **Test 1: Agent Validation**

```bash
curl -X POST http://localhost:3000/api/generate-agents \
  -H "Content-Type: application/json" \
  -d '{
    "agents": ["test_agent"],
    "orchestrationContext": "Test orchestration"
  }'
```

### **Test 2: Multi-Agent Generation**

```bash
curl -X POST http://localhost:3000/api/generate-agents \
  -H "Content-Type: application/json" \
  -d '{
    "agents": ["agent1", "agent2", "agent3"],
    "orchestrationContext": "Multi-agent test"
  }'
```

### **Test 3: Error Handling**

```bash
curl -X POST http://localhost:3000/api/generate-agents \
  -H "Content-Type: application/json" \
  -d '{
    "agents": ["invalid_agent"],
    "orchestrationContext": "Error test"
  }'
```

## 🚀 **EXPECTED OUTCOMES**

### **Before (Current State - 70% Complete)**

- ✅ Basic agent generation works
- ❌ No validation before saving
- ❌ Only generates one agent at a time
- ❌ Poor error handling
- ❌ No agent testing

### **After (Target State - 100% Complete)**

- ✅ Complete agent generation system
- ✅ Validation before saving
- ✅ Multi-agent batch processing
- ✅ Comprehensive error handling
- ✅ Agent testing and validation
- ✅ Production-ready agent generation

## 📊 **SUCCESS METRICS**

- **100%** of generated agents pass validation
- **0** broken agents created
- **< 30 seconds** generation time for single agent
- **< 2 minutes** generation time for multiple agents
- **100%** error handling coverage
- **0** unhandled exceptions

---

**Status**: 🚧 Implementation Phase  
**Priority**: 🔴 Critical  
**Estimated Effort**: 6-8 hours  
**Dependencies**: Existing agent generation infrastructure

---

## ✅ **COMPLETED COMPONENTS** (Reference)

### **✅ Basic Agent Generation Endpoint**

- **File**: `hive/routes/generation.js` (lines 335-629)
- **Status**: ✅ **COMPLETE**
- **Functionality**: Generates agent classes and prompts using OpenAI Responses API

### **✅ Agent Class Generation**

- **File**: `hive/routes/generation.js` (lines 418-493)
- **Status**: ✅ **COMPLETE**
- **Functionality**: Creates JavaScript classes extending BaseAgent

### **✅ Agent Prompt Generation**

- **File**: `hive/routes/generation.js` (lines 494-559)
- **Status**: ✅ **COMPLETE**
- **Functionality**: Creates markdown system prompts

### **✅ File Saving System**

- **File**: `hive/routes/generation.js` (lines 560-589)
- **Status**: ✅ **COMPLETE**
- **Functionality**: Saves agent classes and prompts to filesystem

### **✅ Config Updates**

- **File**: `hive/routes/generation.js` (lines 590-630)
- **Status**: ✅ **COMPLETE**
- **Functionality**: Updates `agents.config.json` with new agents

### **✅ Cleanup Functionality**

- **File**: `hive/routes/generation.js` (lines 631-704)
- **Status**: ✅ **COMPLETE**
- **Functionality**: Removes test agents and their files

### **✅ OpenAI Responses API Integration**

- **Status**: ✅ **COMPLETE**
- **Functionality**: Uses correct `responses.create()` API format
