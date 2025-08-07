# Orchestrations Documentation
_Last Updated: 2025-08-07_

This directory contains comprehensive documentation for all orchestrations in the unified workflow system.

## 📚 Documentation Index

### Core Orchestrations

- [Hyatt Orchestrator](./HyattOrchestrator.md) - Campaign-based PR orchestration  
- [Hive Orchestrator](./HiveOrchestrator.md) - Spark-based cultural moment orchestration

### System Documentation

- [Agent Mapping](./AgentMapping.md) - Maps agent IDs to configurations and capabilities
- [Feature Parity Checklist](./FeatureParityChecklist.md) - Ensures feature consistency during migrations

### Configuration System

- **Orchestration Config**: `../hive/orchestrations/orchestrations.config.json` - Central workflow configuration
- **Configuration Guide**: `../hive/orchestrations/ORCHESTRATION_CONFIG_README.md` - How to configure workflows
- **Orchestration-Aware Agents**: `../hive/docs/ORCHESTRATION_AWARE_AGENTS.md` - Agent orchestration awareness system

## 🏗️ Architecture Overview

The unified orchestration system consists of:

1. **Dynamic Configuration** - JSON-based workflow definitions with orchestration-specific terminology
2. **Orchestration-Aware Agents** - Agents that adapt behavior based on workflow context  
3. **Unified API** - Single endpoints supporting multiple workflow types
4. **React Components** - Shared UI components with orchestration-specific adaptations
5. **Workflow Engine** - Manages agent flow based on dynamic configuration

### Key Concepts

- **Workflows**: Universal term for all orchestrations (Campaigns, Sparks, etc.)
- **Orchestration Types**: Different workflow patterns (Hyatt = Campaigns, Hive = Sparks)  
- **Agent Context**: Agents receive orchestration type and adapt their behavior
- **Dynamic References**: No hardcoded agent names - all come from configuration

## 📁 Current File Structure

```
hive/
├── orchestrations/
│   ├── orchestrations.config.json    # Central workflow configuration  
│   ├── OrchestrationConfig.js         # Configuration utility class
│   ├── ORCHESTRATION_CONFIG_README.md # Configuration guide
│   └── classes/
│       ├── HyattOrchestrator.js       # Campaign orchestration
│       └── HiveOrchestrator.js        # Spark orchestration
├── agents/
│   ├── classes/                       # Agent implementations
│   └── prompts/                       # Agent prompts
├── docs/
│   └── ORCHESTRATION_AWARE_AGENTS.md  # Agent orchestration guide
└── routes/
    └── campaigns.js                   # Unified API endpoints
```

## 🔄 Development Workflow

### Adding New Orchestrations
1. **Add to Config** - Update `orchestrations.config.json` with new workflow definition
2. **No Code Changes** - Agents automatically work with new orchestrations
3. **Test Configuration** - Verify agents reference correct workflow agents
4. **Update Documentation** - Document the new orchestration purpose and workflow

### Making Agent Changes  
1. **Check Orchestration Awareness** - Ensure agents accept orchestration context
2. **Test All Workflows** - Verify changes work across all orchestration types
3. **Update Prompts** - Ensure prompts are generic, not orchestration-specific

## 📝 Documentation Standards

- **Keep it current** - Update docs with every major change (include datestamp)
- **Orchestration-agnostic** - Document unified concepts, not specific implementations  
- **Configuration-driven** - Reference config files rather than hardcoded examples
- **Cross-reference** - Link to actual configuration files and implementations

## 🚀 Quick Start

### For New Orchestrations
1. Review the [Configuration Guide](../hive/orchestrations/ORCHESTRATION_CONFIG_README.md)
2. Add your workflow to `orchestrations.config.json`
3. Test with existing agents - no code changes needed!

### For Agent Development
1. Read [Orchestration-Aware Agents](../hive/docs/ORCHESTRATION_AWARE_AGENTS.md)
2. Ensure agents accept `orchestrationType` parameter
3. Use `OrchestrationConfig.js` utility for dynamic agent references

### For API Integration  
1. Use `/api/workflows` with `orchestrationId` parameter
2. Or use specific endpoints: `/api/campaigns` (Hyatt) or `/api/sparks` (Hive)
3. All endpoints support the unified workflow system

---

_Last updated: 2025-08-07_
_Status: Current with unified workflow system_
