# Orchestrations Documentation

This directory contains comprehensive documentation for all orchestrations in the Hive Agent System.

## 📚 Documentation Index

### Core Orchestrations

- [Hyatt Orchestrator](./HyattOrchestrator.md) - Primary PR campaign orchestration
- [Hive Orchestrator](./HiveOrchestrator.md) - Reactive framework orchestration
- [Template Orchestrator](./TemplateOrchestrator.md) - Example orchestration template

### Meta-Orchestrations

- [Orchestration Builder](./OrchestrationBuilder.md) - AI-powered orchestration generator

### System Documentation

- [Feature Parity Checklist](./FeatureParityChecklist.md) - Ensures no features are lost during migrations
- [Agent Mapping](./AgentMapping.md) - Maps agent IDs to configurations and capabilities
- [Workflow Definitions](./WorkflowDefinitions.md) - Detailed workflow specifications
- [Configuration Guide](./ConfigurationGuide.md) - How to configure and customize orchestrations

## 🏗️ Architecture Overview

The orchestration system consists of:

1. **Orchestration Pages** - React components that provide the UI for each orchestration
2. **Shared Components** - Reusable UI components (forms, panels, modals)
3. **Agent System** - AI agents with specific roles and capabilities
4. **Workflow Engine** - Manages the flow of work between agents
5. **Configuration System** - JSON-based configuration for agents and orchestrations

## 📁 File Structure

```
orchestrations/
├── docs/                    # This directory
│   ├── README.md           # This file
│   ├── HyattOrchestrator.md
│   ├── HiveOrchestrator.md
│   ├── TemplateOrchestrator.md
│   ├── OrchestrationBuilder.md
│   ├── FeatureParityChecklist.md
│   ├── AgentMapping.md
│   ├── WorkflowDefinitions.md
│   └── ConfigurationGuide.md
├── classes/                # Orchestrator class implementations
├── configs/                # Configuration files
├── workflows/              # Workflow definitions
├── index.js               # Main entry point
└── README.md              # Module overview
```

## 🔄 Development Workflow

1. **Document First** - Update documentation before making changes
2. **Feature Parity** - Use the checklist to ensure no features are lost
3. **Test Thoroughly** - Test each orchestration after changes
4. **Update Changelog** - Document all changes in the relevant orchestration's changelog

## 📝 Documentation Standards

- **Keep it current** - Update docs with every major change
- **Be specific** - Include code examples and configuration snippets
- **Link everything** - Cross-reference related documentation
- **Version control** - Include dates and version information

## 🚀 Quick Start

1. Read the [Feature Parity Checklist](./FeatureParityChecklist.md) to understand the system
2. Review [Agent Mapping](./AgentMapping.md) to understand available capabilities
3. Choose an orchestration to work with from the list above
4. Follow the specific documentation for that orchestration

---

_Last updated: 2024-07-XX_
_Version: 1.0.0_
