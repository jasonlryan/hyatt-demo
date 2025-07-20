# 🚀 Agent Generation System Plan

## 🎯 **Overview**

This plan builds the **real agent generation system** that was promised but never delivered. It creates the 5 core agents needed to make the orchestration generator actually functional instead of fake.

## 🚨 **Current Problem**

- ❌ **No real agent generation** - Only fake promises and incomplete code
- ❌ **No agent validation** - No way to check if generated agents work
- ❌ **No agent registration** - No integration with orchestrator system
- ❌ **No config management** - Manual coordination between files
- ❌ **No single source of truth** - Multiple hardcoded arrays and configs

## 🏗️ **Solution: Build the 5 Core Agents**

### **Agent 1: Agent Class Generator**

**Purpose**: Creates agent classes from templates

**Input**:

```json
{
  "agentId": "custom_analytics",
  "role": "analytics",
  "requirements": "Analyze campaign performance data and provide insights",
  "context": "Hive reactive framework orchestration"
}
```

**Output**:

```javascript
// hive/agents/classes/CustomAnalyticsAgent.js
class CustomAnalyticsAgent extends BaseAgent {
  constructor() {
    super({
      id: "custom_analytics",
      name: "Custom Analytics Agent",
      description: "Analyzes campaign performance data and provides insights",
      model: "gpt-4o-2024-08-06",
      temperature: 0.3,
      maxTokens: 2000,
    });
  }

  async analyzePerformance(data) {
    // Generated method based on role
  }

  async generateInsights(context) {
    // Generated method based on requirements
  }
}
```

**Template System**:

- Base template with common methods
- Role-specific method generation
- Context-aware customization
- Proper BaseAgent extension

### **Agent 2: Agent Prompt Generator**

**Purpose**: Creates system prompts for agents

**Input**:

```json
{
  "agentId": "custom_analytics",
  "role": "analytics",
  "context": "Campaign performance analysis",
  "examples": ["data analysis", "insight generation", "reporting"]
}
```

**Output**:

```markdown
# Custom Analytics Agent

## Purpose

Analyze campaign performance data and provide actionable insights for optimization.

## Role

You are a specialized analytics agent within the Hive reactive framework orchestration.

## Capabilities

- Data analysis and interpretation
- Performance metric calculation
- Insight generation and recommendations
- Report creation and visualization

## Input Format

- Campaign performance data
- Historical benchmarks
- Target metrics and KPIs

## Output Format

- Structured analysis results
- Actionable recommendations
- Visual data representations
- Performance insights

## Examples

[Generated examples based on context]
```

**Template System**:

- Role-based prompt templates
- Context-aware customization
- Example generation
- Structured format enforcement

### **Agent 3: Agent Validator**

**Purpose**: Validates generated agents

**Input**:

```json
{
  "agentClass": "// Generated agent class code...",
  "agentPrompt": "# Generated prompt...",
  "agentConfig": { "id": "custom_analytics", ... }
}
```

**Output**:

```json
{
  "isValid": true,
  "errors": [],
  "warnings": ["Consider adding error handling"],
  "suggestions": ["Add input validation for data parameter"],
  "validationDetails": {
    "syntax": "valid",
    "baseAgentExtension": "valid",
    "requiredMethods": "valid",
    "promptStructure": "valid",
    "configConsistency": "valid"
  }
}
```

**Validation Checks**:

- JavaScript syntax validation
- BaseAgent extension verification
- Required method presence
- Prompt structure validation
- Config consistency checks
- Integration compatibility

### **Agent 4: Agent Registrar**

**Purpose**: Registers agents with orchestrator

**Input**:

```json
{
  "agentConfig": {
    "id": "custom_analytics",
    "name": "Custom Analytics Agent",
    "class": "CustomAnalyticsAgent",
    "config": { ... }
  },
  "orchestrationContext": "hive"
}
```

**Output**:

```json
{
  "registered": true,
  "updatedFiles": [
    "hive/agents/agents.config.json",
    "hive/orchestrations/configs/hive.json"
  ],
  "integrationStatus": "success",
  "orchestratorReady": true
}
```

**Registration Process**:

- Update agents.config.json
- Update orchestration configs
- Register with OrchestrationManager
- Update index files
- Verify integration

### **Agent 5: Config Updater**

**Purpose**: Updates all config files

**Input**:

```json
{
  "newAgents": [
    {
      "id": "custom_analytics",
      "config": { ... }
    }
  ],
  "orchestrationUpdates": {
    "hive": {
      "agents": ["custom_analytics", ...]
    }
  }
}
```

**Output**:

```json
{
  "updatedFiles": [
    "hive/agents/agents.config.json",
    "hive/orchestrations/configs/hive.json",
    "hive/orchestrations/configs/orchestrations.json"
  ],
  "backupCreated": true,
  "validationPassed": true,
  "systemReady": true
}
```

**Update Process**:

- Create backups of existing configs
- Update agents.config.json
- Update orchestration configs
- Update index files
- Validate all changes
- Restart orchestration manager

## 🔧 **Implementation Plan**

### **Phase 1: Create `/api/generate-agents` Endpoint**

**File**: `pages/api/generate-agents.js`

```javascript
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { agents, orchestrationContext, existingAgents } = req.body;

    // Step 1: Generate agent classes
    const agentClasses = await generateAgentClasses(
      agents,
      orchestrationContext
    );

    // Step 2: Generate agent prompts
    const agentPrompts = await generateAgentPrompts(
      agents,
      orchestrationContext
    );

    // Step 3: Validate generated agents
    const validationResults = await validateGeneratedAgents(
      agentClasses,
      agentPrompts
    );

    // Step 4: Register agents with orchestrator
    const registrationResults = await registerAgents(
      agentClasses,
      orchestrationContext
    );

    // Step 5: Update config files
    const configResults = await updateConfigFiles(
      agentClasses,
      orchestrationContext
    );

    res.status(200).json({
      generatedAgents: agentClasses,
      generatedPrompts: agentPrompts,
      validation: validationResults,
      registration: registrationResults,
      configUpdates: configResults,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalAgents: agents.length,
        orchestrationContext,
      },
    });
  } catch (error) {
    console.error("Agent generation failed:", error);
    res.status(500).json({
      error: "Failed to generate agents",
      details: error.message,
    });
  }
}
```

### **Phase 2: Build Agent Generation Functions**

#### **2.1 Agent Class Generation**

```javascript
async function generateAgentClasses(agentIds, context) {
  const generatedAgents = [];

  for (const agentId of agentIds) {
    const agentClass = await generateAgentClass(agentId, context);
    generatedAgents.push(agentClass);
  }

  return generatedAgents;
}

async function generateAgentClass(agentId, context) {
  const systemPrompt = `You are an AI agent architect. Generate a complete agent class that:
1. Extends BaseAgent
2. Has appropriate constructor configuration
3. Includes role-specific methods
4. Follows established patterns
5. Is ready for immediate use

Generate JSON with:
{
  "className": "AgentClassName",
  "classCode": "// Complete agent class code",
  "config": {
    "model": "gpt-4o-2024-08-06",
    "temperature": 0.3,
    "maxTokens": 2000
  }
}`;

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

  return JSON.parse(response.output_text);
}
```

#### **2.2 Agent Prompt Generation**

```javascript
async function generateAgentPrompts(agentIds, context) {
  const generatedPrompts = [];

  for (const agentId of agentIds) {
    const prompt = await generateAgentPrompt(agentId, context);
    generatedPrompts.push(prompt);
  }

  return generatedPrompts;
}

async function generateAgentPrompt(agentId, context) {
  const systemPrompt = `You are an AI prompt engineer. Generate a complete system prompt that:
1. Defines the agent's purpose and role
2. Specifies input/output formats
3. Provides clear examples
4. Follows established prompt patterns
5. Is ready for immediate use

Generate JSON with:
{
  "promptCode": "# Complete system prompt in markdown",
  "metadata": {
    "role": "agent role",
    "context": "usage context"
  }
}`;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
    input: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate prompt for: ${agentId} in context: ${context}`,
      },
    ],
    temperature: 0.3,
  });

  return JSON.parse(response.output_text);
}
```

#### **2.3 Agent Validation**

```javascript
async function validateGeneratedAgents(agentClasses, agentPrompts) {
  const validationResults = [];

  for (let i = 0; i < agentClasses.length; i++) {
    const classValidation = await validateAgentClass(agentClasses[i]);
    const promptValidation = await validateAgentPrompt(agentPrompts[i]);

    validationResults.push({
      agentId: agentClasses[i].className,
      classValidation,
      promptValidation,
      overallValid: classValidation.isValid && promptValidation.isValid,
    });
  }

  return validationResults;
}

async function validateAgentClass(agentClass) {
  // Validate JavaScript syntax
  try {
    eval(`(${agentClass.classCode})`);
  } catch (error) {
    return { isValid: false, errors: [`Syntax error: ${error.message}`] };
  }

  // Validate BaseAgent extension
  if (!agentClass.classCode.includes("extends BaseAgent")) {
    return { isValid: false, errors: ["Must extend BaseAgent"] };
  }

  // Validate required methods
  const requiredMethods = ["constructor"];
  const missingMethods = requiredMethods.filter(
    (method) => !agentClass.classCode.includes(method)
  );

  if (missingMethods.length > 0) {
    return {
      isValid: false,
      errors: [`Missing required methods: ${missingMethods.join(", ")}`],
    };
  }

  return { isValid: true, errors: [] };
}
```

#### **2.4 Agent Registration**

```javascript
async function registerAgents(agentClasses, context) {
  const registrationResults = [];

  for (const agentClass of agentClasses) {
    const result = await registerAgent(agentClass, context);
    registrationResults.push(result);
  }

  return registrationResults;
}

async function registerAgent(agentClass, context) {
  // Update agents.config.json
  const configPath = path.join(
    process.cwd(),
    "hive",
    "agents",
    "agents.config.json"
  );
  const config = JSON.parse(await fs.readFile(configPath, "utf8"));

  config.agents[agentClass.className.toLowerCase()] = {
    id: agentClass.className.toLowerCase(),
    name: agentClass.className,
    description: `Generated agent for ${context}`,
    model: agentClass.config.model,
    temperature: agentClass.config.temperature,
    maxTokens: agentClass.config.maxTokens,
    enabled: true,
  };

  await fs.writeFile(configPath, JSON.stringify(config, null, 2));

  return {
    agentId: agentClass.className,
    registered: true,
    configUpdated: true,
  };
}
```

#### **2.5 Config Updates**

```javascript
async function updateConfigFiles(agentClasses, context) {
  // Update orchestration configs
  const orchestrationConfigs = await updateOrchestrationConfigs(
    agentClasses,
    context
  );

  // Update index files
  const indexUpdates = await updateIndexFiles(agentClasses);

  return {
    orchestrationConfigs,
    indexUpdates,
    systemReady: true,
  };
}

async function updateOrchestrationConfigs(agentClasses, context) {
  const configPath = path.join(
    process.cwd(),
    "hive",
    "orchestrations",
    "configs",
    "orchestrations.json"
  );

  let config = {};
  if (fs.existsSync(configPath)) {
    config = JSON.parse(await fs.readFile(configPath, "utf8"));
  }

  // Add new orchestration if it doesn't exist
  if (!config.orchestrations) {
    config.orchestrations = {};
  }

  const orchestrationId = context.toLowerCase().replace(/\s+/g, "_");
  config.orchestrations[orchestrationId] = {
    name: context,
    description: `Generated orchestration for ${context}`,
    agents: agentClasses.map((ac) => ac.className.toLowerCase()),
    class: `${context.replace(/\s+/g, "")}Orchestrator`,
    workflows: [`${orchestrationId}_workflow`],
  };

  await fs.writeFile(configPath, JSON.stringify(config, null, 2));

  return {
    updated: true,
    orchestrationId,
    agentCount: agentClasses.length,
  };
}
```

### **Phase 3: File Generation Service Enhancement**

**File**: `utils/fileGenerator.js`

```javascript
export class FileGenerator {
  // ... existing methods ...

  async generateAgentClass(agentId, className, classCode) {
    const agentDir = path.join(process.cwd(), "hive", "agents", "classes");
    const filePath = path.join(agentDir, `${className}.js`);

    await fs.promises.writeFile(filePath, classCode, "utf8");
    return filePath;
  }

  async generateAgentPrompt(agentId, promptCode) {
    const promptDir = path.join(process.cwd(), "hive", "agents", "prompts");
    const filePath = path.join(promptDir, `${agentId}.md`);

    await fs.promises.writeFile(filePath, promptCode, "utf8");
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

    newAgents.forEach((agent) => {
      config.agents[agent.id] = {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        model: agent.config.model,
        temperature: agent.config.temperature,
        maxTokens: agent.config.maxTokens,
        enabled: true,
      };
    });

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    return configPath;
  }
}
```

### **Phase 4: Integration with Orchestration Builder**

**File**: `frontend/src/components/orchestrations/OrchestrationBuilderPage.tsx`

```typescript
const handleGenerateOrchestration = async (brief: string) => {
  setGenerationError(null);
  setIsGenerating(true);
  setGenerationStep("orchestration");

  try {
    // Step 1: Generate orchestration
    const orchestrationRes = await fetch("/api/generate-orchestration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: brief }),
    });

    if (!orchestrationRes.ok) {
      throw new Error(
        `Failed to generate orchestration: ${orchestrationRes.statusText}`
      );
    }

    const orchestrationData = await orchestrationRes.json();
    setGeneratedOrchestration(orchestrationData);

    // Step 2: Generate missing agents
    setGenerationStep("agents");
    const agentsRes = await fetch("/api/generate-agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agents: orchestrationData.agents,
        orchestrationContext: orchestrationData.description,
        existingAgents: await getExistingAgentIds(),
      }),
    });

    if (!agentsRes.ok) {
      throw new Error(`Agent generation failed: ${agentsRes.statusText}`);
    }

    const agentsData = await agentsRes.json();
    setGeneratedAgents(agentsData);

    // Step 3: Generate page
    setGenerationStep("page");
    const pageRes = await fetch("/api/generate-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageType: "orchestration",
        requirements: orchestrationData.description,
        features: orchestrationData.workflows.join(", "),
      }),
    });

    if (pageRes.ok) {
      const pageData = await pageRes.json();
      setGeneratedComponent(pageData.page);
    }

    setIsBuilderModalOpen(true);
  } catch (error: any) {
    console.error("Generation error:", error);
    setGenerationError(error.message || "Generation failed");
  } finally {
    setGenerationStep(null);
    setIsGenerating(false);
  }
};
```

## 📋 **Implementation Checklist**

### **Phase 1: Core Endpoint**

- [ ] Create `pages/api/generate-agents.js`
- [ ] Implement agent class generation
- [ ] Implement agent prompt generation
- [ ] Implement agent validation
- [ ] Implement agent registration
- [ ] Implement config updates

### **Phase 2: File Generation**

- [ ] Extend `FileGenerator` class
- [ ] Add agent class generation methods
- [ ] Add agent prompt generation methods
- [ ] Add config update methods
- [ ] Add validation methods

### **Phase 3: Integration**

- [ ] Update OrchestrationBuilderPage
- [ ] Add agent generation step
- [ ] Add progress tracking
- [ ] Add error handling
- [ ] Test complete workflow

### **Phase 4: Testing**

- [ ] Test agent generation API
- [ ] Test generated agents
- [ ] Test integration with orchestrator
- [ ] Test config updates
- [ ] Test error handling

## 🧪 **Testing Strategy**

### **Test 1: Generate Core Agents**

```bash
curl -X POST http://localhost:3000/api/generate-agents \
  -H "Content-Type: application/json" \
  -d '{
    "agents": ["agent_class_generator", "agent_prompt_generator", "agent_validator", "agent_registrar", "config_updater"],
    "orchestrationContext": "Agent generation system for orchestration builder",
    "existingAgents": ["research", "trending", "story", "pr-manager", "strategic"]
  }'
```

### **Test 2: Verify Generated Agents**

- Check agent classes compile
- Check prompts are valid
- Check configs are updated
- Check integration works

### **Test 3: Test Complete Workflow**

- Generate orchestration with new agents
- Verify agents are functional
- Test orchestration execution
- Validate generated files

## 🚀 **Expected Outcomes**

### **Before (Current State)**

- ❌ Fake agent generation promises
- ❌ No real agent creation
- ❌ Manual coordination required
- ❌ No single source of truth

### **After (Target State)**

- ✅ Real agent generation system
- ✅ Complete automation from description to working agents
- ✅ Single source of truth through generated configs
- ✅ No manual coordination required
- ✅ Validation system to catch errors

## 📊 **Success Metrics**

- **100%** of generated agents are functional
- **0** manual agent creation steps required
- **< 2 minutes** from description to working agents
- **100%** agent validation pass rate
- **0** broken agents created

---

**Status**: 🚧 Implementation Phase  
**Priority**: 🔴 Critical  
**Estimated Effort**: 1-2 weeks  
**Dependencies**: Existing orchestration generator infrastructure
