# Hive Orchestrator

## Overview

The Hive Orchestrator is a **reactive framework orchestration** designed for visual creative generation workflows. It coordinates 5 specialized AI agents in a sequential 5-step process to create comprehensive visual creative campaigns with cultural trend analysis, brand alignment, and quality assurance.

## 🎯 Purpose

- **Visual Creative Generation**: Generate visual prompts and modular elements for creative campaigns
- **Cultural Trend Analysis**: Analyze current trends and cultural insights to inform creative direction
- **Brand Alignment**: Ensure all creative outputs align with brand guidelines and identity
- **Quality Assurance**: Comprehensive review process for brand consistency and creative quality
- **Reactive Framework**: Parallel agent collaboration with real-time coordination

## 🏗️ Architecture

### Core Components

1. **Campaign Form** - Visual creative campaign brief input
2. **Workflow Progress** - 5-step sequential workflow visualization
3. **Agent Status** - Real-time status monitoring for all 5 agents
4. **Progress Panel** - Campaign progress tracking and metrics
5. **Deliverables Panel** - Final outputs and creative assets
6. **Action Buttons** - Campaign refinement and review controls

### Layout Structure

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Navigation    │   Main Content  │   Side Panel    │
│   (Breadcrumbs) │   (Workflow)    │   (Progress)    │
│                 │                 │                 │
│ - Back Button   │ - Campaign Form │ - Progress Bar  │
│ - HITL Toggle   │ - Workflow Steps│ - Agent Status  │
│                 │ - Agent Status  │ - Deliverables  │
│                 │                 │ - Actions       │
└─────────────────┴─────────────────┴─────────────────┘
```

## 🤖 Agent Configuration

### Primary Agents

| Agent ID                       | Agent Name                   | Role Description                                                          |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------------------- |
| `trend_cultural_analyzer`      | Trend Cultural Analyzer      | Analyzes cultural trends and market insights to inform creative direction |
| `brand_lens`                   | Brand Lens                   | Applies brand perspective and guidelines to ensure alignment              |
| `visual_prompt_generator`      | Visual Prompt Generator      | Generates base visual prompts based on context and requirements           |
| `modular_elements_recommender` | Modular Elements Recommender | Creates modular visual elements and components                            |
| `brand_qa`                     | Brand QA                     | Performs quality assurance checks for brand consistency                   |

### Agent Workflow

```
Trend Analysis → Brand Lens → Visual Prompts → Modular Elements → QA Review
```

## 📋 Workflows

### 5-Step Sequential Process

1. **Trend Analysis** (`trend_cultural_analyzer`)

   - Analyzes current cultural trends and market insights
   - Identifies relevant cultural movements and consumer behaviors
   - Provides trend insights to inform creative direction

2. **Brand Lens** (`brand_lens`)

   - Applies brand perspective and guidelines
   - Ensures creative direction aligns with brand identity
   - Provides brand-specific insights and recommendations

3. **Visual Prompt Generation** (`visual_prompt_generator`)

   - Generates base visual prompts based on context
   - Incorporates trend insights and brand guidelines
   - Creates foundation for visual creative development

4. **Modular Elements** (`modular_elements_recommender`)

   - Creates modular visual elements and components
   - Builds upon base prompts and trend analysis
   - Provides flexible creative components for campaigns

5. **QA Review** (`brand_qa`)
   - Performs quality assurance checks
   - Ensures brand consistency across all outputs
   - Validates creative quality and alignment

## ⚙️ Configuration

### Default Settings

```json
{
  "maxConcurrentWorkflows": 10,
  "timeout": 600000,
  "retryAttempts": 2,
  "enableLogging": true,
  "reactiveFramework": true,
  "parallelExecution": true
}
```

## 🔄 Human-in-the-Loop (HITL)

### Review Points

- After each workflow step completion
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

### Analysis Deliverables

- **Trend Insights**: Cultural trend analysis results
- **Brand Lens**: Brand perspective analysis

### Creative Deliverables

- **Visual Prompts**: Generated visual prompts
- **Modular Elements**: Recommended modular elements

### Review Deliverables

- **QA Review**: Quality assurance results

## 🚀 How to Use

### 1. Access the Orchestration

- Navigate to the Orchestrations page
- Select "Hive Orchestrator" from the list
- The Hive interface will load

### 2. Start a Campaign

- Enter a detailed visual creative campaign brief
- Describe the creative requirements and objectives
- Include any specific brand guidelines or constraints

### 3. Monitor Progress

- Watch the 5-step workflow progress in real-time
- Monitor individual agent status and outputs
- Review progress metrics in the side panel

### 4. Review and Refine

- Examine deliverables as they become available
- Use HITL controls to refine or review outputs
- Make adjustments based on feedback

### 5. Complete Campaign

- Review all final deliverables
- Download or export creative assets
- Use results for campaign implementation

## 📝 Example Campaign Brief

**Good Example:**

```
We're launching a new eco-friendly hotel brand targeting millennial travelers.
We need visual creative assets that reflect sustainability, luxury, and adventure.
The campaign should appeal to environmentally conscious consumers who value
unique travel experiences. Include modular elements for social media, website,
and print materials.
```

**Poor Example:**

```
Make some hotel marketing stuff
```

## 🎨 Creative Outputs

### Visual Prompts

- Detailed creative briefs for visual assets
- Style guidelines and aesthetic direction
- Color palette and typography recommendations

### Modular Elements

- Reusable visual components
- Social media templates
- Website design elements
- Print material layouts

### Trend Insights

- Cultural trend analysis
- Consumer behavior insights
- Market opportunity identification

## 🔧 Technical Details

### Agent Integration

- All agents extend BaseAgent class
- System prompts loaded from markdown files
- Real-time communication and coordination
- Error handling and retry mechanisms

### Performance Optimization

- Parallel execution where possible
- Caching of agent outputs
- Efficient resource management
- Scalable architecture

### Error Handling

- Graceful degradation on agent failures
- Automatic retry mechanisms
- User-friendly error messages
- Fallback options for critical failures

## 🚨 Limitations

### Current Limitations

- Requires detailed campaign briefs for optimal results
- Limited to visual creative generation workflows
- Agent outputs may need human refinement
- Processing time scales with campaign complexity

### Known Issues

- Complex campaigns may require multiple iterations
- Brand guidelines must be clearly specified
- Cultural trend analysis limited to available data
- Visual prompt quality depends on input clarity

## 🔄 Future Enhancements

### Planned Features

- Advanced visual asset generation
- Real-time collaboration features
- Enhanced brand guideline integration
- Expanded trend analysis capabilities

### Potential Improvements

- AI-powered creative optimization
- Automated A/B testing integration
- Advanced modular element library
- Cross-platform asset generation

## 📚 Related Documentation

- [Agent Mapping](./AgentMapping.md) - Complete catalog of all AI agents
- [Orchestration Builder](./OrchestrationBuilder.md) - AI-powered orchestration generator
- [Feature Parity Checklist](./FeatureParityChecklist.md) - Ensure no features lost during migrations

---

**Status**: ✅ Active  
**Version**: 2.0.0  
**Last Updated**: 2024-07-19  
**Maintainer**: Hive Development Team
