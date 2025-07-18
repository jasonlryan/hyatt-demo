# Agent Mapping

## Overview

This document provides a comprehensive mapping of all available AI agents in the system, their capabilities, configurations, and use cases. This mapping is used by the Orchestration Builder and other orchestrations to understand and utilize agent capabilities effectively.

## 🤖 Agent Library

### Core PR Agents

#### 1. Research & Audience GPT (`research`)

- **ID**: `research`
- **Name**: Research & Audience GPT
- **Description**: Analyzes target audiences and provides demographic insights
- **Model**: `gpt-4o-2024-08-06`
- **Temperature**: 0.2
- **Max Tokens**: 2500
- **Timeout**: 45000ms
- **Delay**: 4000ms
- **Role**: `research`
- **Priority**: 1

**Capabilities:**

- Demographic analysis
- Psychographic profiling
- Market segmentation
- Competitive research
- Audience persona development

**Use Cases:**

- Initial campaign research
- Target audience identification
- Market opportunity analysis
- Competitive positioning

---

#### 2. Trending News GPT (`trending`)

- **ID**: `trending`
- **Name**: Trending News GPT
- **Description**: Identifies trending topics and news opportunities
- **Model**: `gpt-4o-2024-08-06`
- **Temperature**: 0.3
- **Max Tokens**: 3000
- **Timeout**: 45000ms
- **Delay**: 5000ms
- **Role**: `trending`
- **Priority**: 2

**Capabilities:**

- Trend identification
- News opportunity analysis
- Timing recommendations
- Viral content detection
- Cultural moment analysis

**Use Cases:**

- Newsjacking opportunities
- Trending topic integration
- Content timing optimization
- Viral campaign planning

---

#### 3. Story Angles & Headlines GPT (`story`)

- **ID**: `story`
- **Name**: Story Angles & Headlines GPT
- **Description**: Creates compelling story angles and headlines
- **Model**: `gpt-4o-2024-08-06`
- **Temperature**: 0.4
- **Max Tokens**: 3500
- **Timeout**: 45000ms
- **Delay**: 6000ms
- **Role**: `story`
- **Priority**: 3

**Capabilities:**

- Story angle development
- Headline generation
- Narrative creation
- Content themes
- Messaging frameworks

**Use Cases:**

- Content strategy development
- Campaign messaging
- Press release creation
- Social media content

---

#### 4. Strategic Insight GPT (`strategic`)

- **ID**: `strategic`
- **Name**: Strategic Insight GPT
- **Description**: Provides strategic insights and recommendations
- **Model**: `gpt-4o-2024-08-06`
- **Temperature**: 0.3
- **Max Tokens**: 3000
- **Timeout**: 45000ms
- **Delay**: 5000ms
- **Role**: `strategic`
- **Priority**: 4

**Capabilities:**

- Strategic planning
- Campaign recommendations
- Risk assessment
- Performance optimization
- Long-term planning

**Use Cases:**

- Campaign strategy development
- Strategic planning
- Performance analysis
- Risk management

---

#### 5. PR Manager GPT (`pr-manager`)

- **ID**: `pr-manager`
- **Name**: PR Manager GPT
- **Description**: Coordinates campaigns and manages overall strategy
- **Model**: `gpt-4o-mini-2024-07-18`
- **Temperature**: 0.7
- **Max Tokens**: 4000
- **Timeout**: 45000ms
- **Delay**: 3000ms
- **Role**: `manager`
- **Priority**: 5

**Capabilities:**

- Campaign coordination
- Project management
- Stakeholder communication
- Timeline management
- Quality assurance

**Use Cases:**

- Campaign management
- Project coordination
- Stakeholder updates
- Final deliverable review

---

### Visual & Creative Agents

#### 6. Visual Prompt Generator (`visual_prompt_generator`)

- **ID**: `visual_prompt_generator`
- **Name**: Visual Prompt Generator
- **Description**: Generates detailed, actionable visual prompts for campaign creative
- **Model**: `gpt-4o-2024-08-06`
- **Temperature**: 0.7
- **Max Tokens**: 2000
- **Timeout**: 45000ms
- **Delay**: 4000ms
- **Role**: `visual_prompt`
- **Priority**: 6

**Capabilities:**

- Visual prompt generation
- Creative direction
- Brand visual guidelines
- Campaign imagery concepts
- Design specifications

**Use Cases:**

- Campaign visual development
- Brand creative direction
- Design brief creation
- Visual content strategy

---

#### 7. Modular Elements Recommender (`modular_elements_recommender`)

- **ID**: `modular_elements_recommender`
- **Name**: Modular Elements Recommender
- **Description**: Suggests modular visual elements, overlays, and motifs
- **Model**: `gpt-4o-2024-08-06`
- **Temperature**: 0.7
- **Max Tokens**: 2000
- **Timeout**: 45000ms
- **Delay**: 4000ms
- **Role**: `modular_elements`
- **Priority**: 7

**Capabilities:**

- Modular element suggestions
- Visual component recommendations
- Brand element integration
- Design system guidance
- Asset optimization

**Use Cases:**

- Design system development
- Brand asset creation
- Visual component planning
- Modular design implementation

---

#### 8. Trend & Cultural Analyzer (`trend_cultural_analyzer`)

- **ID**: `trend_cultural_analyzer`
- **Name**: Trend & Cultural Analyzer
- **Description**: Analyzes current trends and cultural moments for visual creative direction
- **Model**: `gpt-4o-2024-08-06`
- **Temperature**: 0.7
- **Max Tokens**: 2000
- **Timeout**: 45000ms
- **Delay**: 4000ms
- **Role**: `trend_culture`
- **Priority**: 8

**Capabilities:**

- Cultural trend analysis
- Visual trend identification
- Cultural moment integration
- Brand relevance assessment
- Creative opportunity spotting

**Use Cases:**

- Cultural campaign development
- Trend integration
- Brand relevance analysis
- Creative opportunity identification

---

#### 9. Brand QA Agent (`brand_qa`)

- **ID**: `brand_qa`
- **Name**: Brand QA Agent
- **Description**: Reviews visual prompts and modular elements for brand alignment and quality
- **Model**: `gpt-4o-2024-08-06`
- **Temperature**: 0.7
- **Max Tokens**: 2000
- **Timeout**: 45000ms
- **Delay**: 4000ms
- **Role**: `brand_qa`
- **Priority**: 9

**Capabilities:**

- Brand alignment review
- Quality assurance
- Brand guideline compliance
- Visual consistency checking
- Brand safety assessment

**Use Cases:**

- Brand compliance review
- Quality assurance
- Brand safety checks
- Visual consistency validation

---

## 🔄 Agent Workflow Patterns

### Sequential Workflow (Hyatt Style)

```
research → trending → strategic → story → pr-manager
```

### Parallel Workflow (Hive Style)

```
research + trending → strategic + story → pr-manager
```

### Creative Workflow

```
research → visual_prompt_generator → modular_elements_recommender → brand_qa
```

### Crisis Management Workflow

```
trending → strategic → pr-manager → brand_qa
```

## 📊 Agent Selection Matrix

| Use Case          | Primary Agents                                   | Secondary Agents | Optional Agents                                       |
| ----------------- | ------------------------------------------------ | ---------------- | ----------------------------------------------------- |
| PR Campaign       | research, trending, story, strategic, pr-manager | -                | visual_prompt_generator                               |
| Content Marketing | research, trending, story                        | strategic        | visual_prompt_generator, modular_elements_recommender |
| Crisis Management | trending, strategic, pr-manager                  | research         | brand_qa                                              |
| Brand Campaign    | research, visual_prompt_generator, brand_qa      | strategic        | modular_elements_recommender, trend_cultural_analyzer |
| Product Launch    | research, trending, story, strategic             | pr-manager       | visual_prompt_generator                               |

## ⚙️ Configuration Reference

### Model Options

- **gpt-4o-2024-08-06**: Most capable, supports structured outputs
- **gpt-4o-mini-2024-07-18**: Faster, cheaper, supports structured outputs
- **gpt-4-turbo**: Legacy model, no structured outputs
- **gpt-4**: Legacy model, no structured outputs

### Temperature Guidelines

- **0.1-0.3**: Factual, consistent outputs (research, analysis)
- **0.4-0.6**: Balanced creativity and consistency (strategy, content)
- **0.7-0.9**: Creative, varied outputs (visual, creative)

### Token Limits

- **2000-2500**: Standard responses
- **3000-3500**: Detailed analysis
- **4000+**: Complex coordination and management

## 🔍 Agent Interaction Patterns

### Sequential Dependencies

- `research` → `trending` (audience context needed for trends)
- `trending` → `strategic` (trends inform strategy)
- `strategic` → `story` (strategy guides content)
- `story` → `pr-manager` (content needs coordination)

### Parallel Capabilities

- `research` + `trending` (can run simultaneously)
- `strategic` + `story` (can run simultaneously)
- `visual_prompt_generator` + `modular_elements_recommender` (can run simultaneously)

### Quality Assurance

- `brand_qa` can review outputs from any visual/creative agent
- `pr-manager` can coordinate and review all agent outputs

## 📝 Usage Guidelines

### For Orchestration Builder

1. Analyze user description for keywords and requirements
2. Select agents based on use case matrix
3. Configure workflow pattern (sequential vs. parallel)
4. Set appropriate temperature and token limits
5. Include quality assurance agents when needed

### For Manual Orchestration Design

1. Start with core agents for the use case
2. Add specialized agents for specific requirements
3. Consider parallel execution for independent tasks
4. Include quality assurance for critical outputs
5. Test agent combinations before deployment

## 🔄 Changelog

### Version 1.0.0 (2024-07-XX)

- Initial agent library definition
- Core PR agent configuration
- Visual and creative agent addition
- Quality assurance agent integration

### Recent Updates

- Structured outputs support
- Model optimization
- Performance tuning
- Documentation standardization

---

_Last updated: 2024-07-XX_
_Version: 1.0.0_
