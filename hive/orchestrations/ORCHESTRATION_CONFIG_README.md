# Orchestration Configuration System

## Overview

The orchestration system now uses a dynamic configuration approach that allows you to define any number of orchestrations without modifying agent code.

## Configuration File

Orchestrations are defined in `orchestrations.config.json`:

```json
{
  "orchestrations": {
    "orchestration-key": {
      "name": "Display Name",
      "description": "Description of the orchestration",
      "workflowType": "workflow-type",
      "workflowLabel": "Workflow Label",
      "workflow": [
        {
          "agent": "agent-id",
          "name": "Agent Display Name",
          "role": "What this agent does in this orchestration"
        }
      ]
    }
  }
}
```

### Workflow Types

Each orchestration defines its own workflow terminology:
- **Hyatt**: `workflowType: "campaign"` - Business uses "Campaign" terminology
- **Hive**: `workflowType: "spark"` - Business uses "Spark" terminology

This allows each orchestration to use domain-appropriate language while maintaining a unified system.

## Adding a New Orchestration

1. Edit `orchestrations.config.json`
2. Add your new orchestration under the `orchestrations` key
3. Define the workflow with agents in order
4. That's it! No code changes needed

### Example: Adding a "Quick Response" Orchestration

```json
"quick-response": {
  "name": "QUICK RESPONSE",
  "description": "Rapid response for time-sensitive situations",
  "workflow": [
    {
      "agent": "pr-manager",
      "name": "PR Manager",
      "role": "Rapid assessment and coordination"
    },
    {
      "agent": "trending",
      "name": "Trending News Agent",
      "role": "Quick trend analysis"
    },
    {
      "agent": "story",
      "name": "Story Angles Agent",
      "role": "Fast story development"
    }
  ]
}
```

## Using Orchestrations

When calling PR Manager or other orchestration-aware agents, pass the orchestration type:

```javascript
// In HiveOrchestrator
await this.prManager.generateCampaignIntroduction(
  brief,
  context,
  'hive'  // orchestration type from config
);

// In a new orchestrator
await this.prManager.generateCampaignIntroduction(
  brief,
  context,
  'quick-response'  // your new orchestration
);
```

## Benefits

1. **No Code Changes**: Add orchestrations without modifying any agent code
2. **Clear Workflows**: Each orchestration clearly defines its agent sequence
3. **Agent Roles**: Each agent's role is documented per orchestration
4. **Scalable**: Supports unlimited orchestrations
5. **Maintainable**: All orchestration logic in one place

## API Reference

### OrchestrationConfig Methods

- `getOrchestration(type)`: Get full orchestration config
- `getWorkflow(type)`: Get workflow array for an orchestration
- `getNextAgent(type, currentAgent)`: Get the next agent in workflow
- `getWorkflowDescription(type)`: Get human-readable workflow description
- `getAgentRole(type, agentId)`: Get an agent's role in a specific orchestration
- `getAllOrchestrationTypes()`: List all available orchestration types

## Agent Updates

Agents that are orchestration-aware will:
1. Receive the orchestration type as a parameter
2. Load the appropriate workflow from the config
3. Reference only agents that exist in that workflow
4. Provide context-appropriate responses

This ensures agents never reference agents from other orchestrations and always follow the defined workflow.