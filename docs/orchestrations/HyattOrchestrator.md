# Hyatt Orchestrator

## Overview

The Hyatt Orchestrator is the primary PR campaign orchestration system. It now supports campaigns across any industry, providing a comprehensive workflow for research, strategy development, content creation, and campaign management.

## 🎯 Purpose

- **PR Campaign Development**: End-to-end PR campaign creation and management
- **Audience Research**: Deep demographic and psychographic analysis
- **Content Strategy**: Story angles, headlines, and strategic insights
- **Campaign Coordination**: Multi-agent collaboration and workflow management

## 🏗️ Architecture

### Core Components

1. **Campaign Form** (`SharedCampaignForm`)

   - Campaign brief input
   - Orchestration selection
   - Campaign loading from existing campaigns

2. **Progress Panel** (`SharedProgressPanel`)

   - Campaign status display
   - Phase tracking
   - Detailed progress access

3. **Agent Collaboration** (`AgentCollaboration`)

   - Real-time agent communication
   - Phase-based workflow execution
   - Manual review integration

4. **Deliverables Panel** (`SharedDeliverablePanel`)
   - Campaign output display
   - Deliverable management
   - Download and review capabilities

### Layout Structure

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Side Panel    │   Main Content  │  Deliverables   │
│   (Transcript)   │   (Campaign)    │    (Outputs)    │
│                 │                 │                 │
│ - Agent Messages│ - Campaign Form │ - Research      │
│ - Conversation  │ - Progress      │ - Strategy      │
│ - Status Log    │ - Collaboration │ - Content       │
└─────────────────┴─────────────────┴─────────────────┘
```

## 🤖 Agent Configuration

### Primary Agents

| Agent ID     | Name                         | Role                                        | Priority |
| ------------ | ---------------------------- | ------------------------------------------- | -------- |
| `research`   | Research & Audience GPT      | Audience analysis and demographic insights  | 1        |
| `trending`   | Trending News GPT            | Trend identification and news opportunities | 2        |
| `story`      | Story Angles & Headlines GPT | Content creation and story development      | 3        |
| `strategic`  | Strategic Insight GPT        | Strategic recommendations and insights      | 4        |
| `pr-manager` | PR Manager GPT               | Campaign coordination and management        | 5        |

### Agent Workflow

```
Campaign Brief
    ↓
Research Agent (Audience Analysis)
    ↓
Trending Agent (Opportunity Identification)
    ↓
Strategic Agent (Strategy Development)
    ↓
Story Agent (Content Creation)
    ↓
PR Manager (Coordination & Review)
    ↓
Deliverables
```

## 📋 Workflows

### 1. Research Workflow

- **Trigger**: Campaign creation
- **Agents**: `research`
- **Output**: Audience demographics, psychographics, segmentation
- **Duration**: ~4 seconds

### 2. Trending Workflow

- **Trigger**: Research completion
- **Agents**: `trending`
- **Output**: Trending topics, news opportunities, timing recommendations
- **Duration**: ~5 seconds

### 3. Strategy Workflow

- **Trigger**: Trending analysis completion
- **Agents**: `strategic`
- **Output**: Strategic insights, recommendations, campaign direction
- **Duration**: ~5 seconds

### 4. Content Workflow

- **Trigger**: Strategy completion
- **Agents**: `story`
- **Output**: Story angles, headlines, content recommendations
- **Duration**: ~6 seconds

### 5. Management Workflow

- **Trigger**: Content creation completion
- **Agents**: `pr-manager`
- **Output**: Campaign coordination, final deliverables, next steps
- **Duration**: ~3 seconds

## ⚙️ Configuration

### Default Settings

```json
{
  "maxConcurrentWorkflows": 5,
  "timeout": 300000,
  "retryAttempts": 3,
  "enableLogging": true,
  "reactiveFramework": false,
  "parallelExecution": false
}
```

### Agent-Specific Settings

| Agent      | Model                  | Temperature | Max Tokens | Timeout |
| ---------- | ---------------------- | ----------- | ---------- | ------- |
| research   | gpt-4o-2024-08-06      | 0.2         | 2500       | 45000   |
| trending   | gpt-4o-2024-08-06      | 0.3         | 3000       | 45000   |
| story      | gpt-4o-2024-08-06      | 0.4         | 3500       | 45000   |
| strategic  | gpt-4o-2024-08-06      | 0.3         | 3000       | 45000   |
| pr-manager | gpt-4o-mini-2024-07-18 | 0.7         | 4000       | 45000   |

## 🔄 Human-in-the-Loop (HITL)

### Review Points

- After each workflow completion
- Before proceeding to next phase
- At final deliverable stage

### Actions Available

- **Resume**: Continue to next phase
- **Refine**: Provide additional instructions and retry
- **Review**: Examine detailed outputs

### HITL Toggle

- Located in page header
- Enables/disables manual review requirement
- Default: Enabled

## 📊 Deliverables

### Research Deliverables

- Audience demographics analysis
- Psychographic profiles
- Market segmentation
- Competitive analysis

### Strategy Deliverables

- Strategic insights
- Campaign recommendations
- Timing and positioning advice
- Risk assessment

### Content Deliverables

- Story angles and narratives
- Headline suggestions
- Content themes
- Messaging framework

### Management Deliverables

- Campaign timeline
- Resource requirements
- Success metrics
- Next steps

## 🧪 Testing

### Manual Testing Checklist

- [ ] Campaign creation with valid brief
- [ ] Agent workflow execution
- [ ] HITL review functionality
- [ ] Deliverable generation and display
- [ ] Campaign loading from existing campaigns
- [ ] Error handling and recovery

### Automated Testing

- Unit tests for agent interactions
- Integration tests for workflow execution
- UI component tests
- End-to-end campaign tests

## 📈 Performance Metrics

### Key Performance Indicators

- Campaign completion rate
- Agent response times
- User satisfaction scores
- Deliverable quality ratings

### Monitoring

- Workflow execution times
- Agent success rates
- Error frequencies
- User interaction patterns

## 🔄 Changelog

### Version 1.0.0 (2024-07-XX)

- Initial implementation
- Basic agent workflow
- HITL integration
- Deliverable management

### Recent Updates

- Shared component integration
- Style system updates
- Performance optimizations

### Planned Features

- Advanced analytics dashboard
- Custom workflow templates
- Enhanced collaboration features

## 🚧 Known Issues

### Current Limitations

- Sequential workflow execution (no parallel processing)
- Limited customization options
- No advanced analytics

### Workarounds

- Use HITL for manual adjustments
- Leverage refine functionality for improvements
- Monitor agent outputs for quality

## 📚 Related Documentation

- [Agent Mapping](./AgentMapping.md) - Detailed agent capabilities
- [Workflow Definitions](./WorkflowDefinitions.md) - Workflow specifications
- [Configuration Guide](./ConfigurationGuide.md) - Customization options
- [Feature Parity Checklist](./FeatureParityChecklist.md) - Feature completeness

---

_Last updated: 2024-07-XX_
_Version: 1.0.0_
