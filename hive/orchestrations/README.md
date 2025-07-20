# Orchestrations

This directory contains all orchestration logic for managing agent workflows and collaborations.

## Structure

```
orchestrations/
├── classes/           # Orchestrator class implementations
│   ├── BaseOrchestrator.js
│   ├── HyattOrchestrator.js
│   └── HiveOrchestrator.js
├── workflows/         # Workflow definitions and templates
├── index.js          # Main export file
└── README.md         # This file
```

## Orchestrator Types

### 1. Hyatt Orchestrator

- **Purpose**: Traditional sequential workflow execution for PR campaigns
- **Use Case**: Linear processes where steps depend on previous results
- **Features**:
  - Step-by-step execution
  - Error handling and retries
  - Detailed logging
  - Sequential agent coordination

### 2. Hive Orchestrator

- **Purpose**: Reactive framework with parallel agent collaboration
- **Use Case**: Complex workflows requiring parallel processing
- **Features**:
  - Parallel agent execution
  - Reactive event handling
  - Dynamic workflow adaptation
  - Real-time collaboration

## Usage

### Basic Usage

```javascript
const { createOrchestrator } = require("./orchestrations");

// Create a Hyatt orchestrator
const hyattOrchestrator = createOrchestrator("hyatt", {
  maxConcurrentWorkflows: 5,
  timeout: 300000,
});

// Create a hive orchestrator
const hiveOrchestrator = createOrchestrator("hive", {
  reactiveFramework: true,
  parallelExecution: true,
});
```

### Starting a Workflow

```javascript
// Initialize the orchestrator
await orchestrator.initialize();

// Start a workflow
const result = await orchestrator.startWorkflow("pr_campaign_workflow", {
  campaignBrief: "Launch new eco-resort campaign",
  targetAudience: "environmentally conscious travelers",
});
```

### Getting Status

```javascript
const status = orchestrator.getStatus();
console.log("Active workflows:", status.activeWorkflows);
console.log("Available agents:", status.agents);
```

## Configuration

The `orchestrations.config.json` file defines:

- Available orchestrators and their settings
- Workflow definitions and steps
- Global configuration options

### Adding a New Orchestrator

1. Create a new class in `classes/` extending `BaseOrchestrator`
2. Add configuration to `orchestrations.config.json`
3. Export from `index.js`
4. Update this README

### Adding a New Workflow

1. Define the workflow in `orchestrations.config.json`
2. Specify steps/stages and agent assignments
3. Set timeouts and error handling
4. Test with the orchestrator

## Workflow Types

### Sequential Workflows (Agent Orchestrator)

```json
{
  "steps": [
    { "agent": "pr_manager", "action": "analyze_brief" },
    { "agent": "research_audience", "action": "research_audience" },
    { "agent": "strategic_insight", "action": "generate_insights" }
  ]
}
```

### Parallel Workflows (Hive Orchestrator)

```json
{
  "stages": [
    {
      "agents": ["research_audience", "trending_news"],
      "parallel": true
    }
  ]
}
```

## Best Practices

1. **Error Handling**: Always implement proper error handling in custom orchestrators
2. **Logging**: Use the built-in logging system for debugging
3. **Timeouts**: Set appropriate timeouts for each workflow step
4. **Resource Management**: Clean up resources in the `cleanup()` method
5. **Configuration**: Use the config system for flexible deployment

## Migration from Root Level

The orchestrators were moved from the root level to this organized structure. Update imports:

**Before:**

```javascript
const HyattOrchestrator = require("./HyattOrchestrator");
```

**After:**

```javascript
const { HyattOrchestrator } = require("./orchestrations");
```
