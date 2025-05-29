# Hyatt GPT Prototype - System Assessment & Fix Plan

## Executive Summary

The Hyatt GPT prototype suffers from fundamental architectural issues that make it appear hardcoded and repetitive despite having sophisticated AI agents. The system has no external configuration schema, distributed logic across multiple files, and critical flaws in how campaign context is passed between components.

## Critical Issues Identified

### 1. **Campaign Brief Not Reaching Agents** ⚠️ CRITICAL

**Problem**: The original campaign brief is NOT being passed to agents. Instead, they receive generic metadata:

- `campaignType: "general_campaign"`
- `urgency: "medium"`
- `targetMarket: "general market"`

**Evidence**: All campaigns show repetitive messages like:

- "As we transition to the next phase of our campaign for Hyatt's new eco-resort launch..."
- "Regenerative Luxury: The Future of Travel" (same theme across all campaigns)

**Root Cause**: The `analyzeCampaignBrief()` method extracts keywords but doesn't preserve the original brief content for agents to reference.

### 2. **Broken Collaborative Input Method**

**Problem**: The `collaborativeInput()` method in agents has hardcoded logic:

```javascript
// ResearchAudienceAgent.js line 219-245
async collaborativeInput(previousPhases) {
    const topDrivers = Object.entries(research.keyDrivers)
      .sort(([, a], [, b]) => parseInt(b) - parseInt(a))
      .slice(0, 3);

    const contribution = `Based on my analysis, ${topDrivers[0][1]} of our target audience...`
}
```

**Issues**:

- Tries to parse `keyDrivers` as percentages but they're arrays of strings
- Generates templated responses instead of dynamic AI content
- No actual OpenAI API call for collaborative synthesis

### 3. **Frontend Deliverables Display Issue**

**Problem**: "No content available" appears because:

- The `formatDeliverableData()` function expects specific structures
- The final strategy object is deeply nested but frontend only checks top-level properties
- No proper null checking for nested properties

### 4. **Distributed Configuration Chaos**

**Current State**:

- System prompts in `/GPTs/*.md` files
- Hardcoded responses in agent methods
- Flow logic in `AgentOrchestrator.js`
- Display logic in `public/index.html`
- No central configuration schema

### 5. **Generic Fallback Responses**

**Problem**: When API calls fail, agents return generic templates:

```javascript
// Line 340-361 in ResearchAudienceAgent.js
if (messageType === "intro") {
  return `I'll analyze ${
    campaignType.includes("sustainability")
      ? "environmentally-conscious traveler groups..."
      : "your target traveler demographics..."
  }`;
}
```

These fallbacks are being triggered too often, making everything feel hardcoded.

### 6. **Quality Control False Positives**

**Evidence**:

- Data Synthesis shows 0-35% alignment
- Quality reports show "excellent (95-99% confidence)"

The quality control system isn't actually validating content relevance.

## Architecture Problems

### 1. **No Central Configuration Schema**

- Campaign workflow is hardcoded in orchestrator
- Agent behaviors scattered across files
- No declarative way to modify workflow

### 2. **Tight Coupling**

- Agents directly reference each other's output structure
- Frontend tightly coupled to backend data structures
- No abstraction layer between components

### 3. **Poor Error Handling**

- Silent failures with generic fallbacks
- No retry mechanisms for API calls
- Lost context during error recovery

## Fix Plan

### Phase 1: Immediate Fixes (1-2 days)

#### 1.1 Pass Campaign Brief to All Components

```javascript
// In analyzeCampaignBrief() method
return {
  originalBrief: brief, // ADD THIS
  campaignType,
  urgency,
  // ... rest of analysis
};
```

#### 1.2 Fix PR Manager Parameter Issues

```javascript
// Fix all .join() errors by adding defaults
const focusAreas = campaignContext.focusAreas || [];
const keywords = campaignContext.keywords || [];
```

#### 1.3 Make CollaborativeInput Dynamic

- Replace hardcoded logic with actual OpenAI API calls
- Use agent's system prompt for collaborative synthesis
- Remove percentage parsing logic

#### 1.4 Fix Frontend Deliverable Display

- Add comprehensive null checking
- Handle deeply nested structures properly
- Show partial data instead of "No content available"

### Phase 2: Remove Hardcoding (3-5 days)

#### 2.1 Create Campaign Configuration Schema

```yaml
# campaign-config.yaml
workflow:
  phases:
    - name: research
      agent: ResearchAudienceAgent
      timeout: 30000
      outputs:
        - targetDemographics
        - keyDrivers
        - strategicRecommendations

    - name: trending
      agent: TrendingNewsAgent
      requires: [research]
      timeout: 30000

    - name: story
      agent: StoryAnglesAgent
      requires: [research, trending]

    - name: synthesis
      agent: PRManagerAgent
      requires: [research, trending, story]

quality_control:
  minimum_alignment: 60
  retry_on_failure: true
  max_retries: 2
```

#### 2.2 Create Central Message Templates

```javascript
// message-templates.js
module.exports = {
  handoff: {
    research_to_trending: {
      template:
        "Based on {{research.keyFindings}}, let's analyze {{context.trendingFocus}}",
      required_fields: ["research.keyFindings", "context.trendingFocus"],
    },
  },
};
```

#### 2.3 Implement Dynamic Agent Response Generator

```javascript
class DynamicResponseGenerator {
  async generateResponse(agent, messageType, context, data) {
    const prompt = this.buildPrompt(agent, messageType, context, data);
    return await this.callOpenAI(prompt, agent.systemPrompt);
  }
}
```

### Phase 3: Scalable Architecture (1-2 weeks)

#### 3.1 Implement Plugin Architecture

```javascript
class AgentPlugin {
  constructor(config) {
    this.name = config.name;
    this.systemPrompt = config.systemPrompt;
    this.capabilities = config.capabilities;
  }

  async process(input, context) {
    // Standardized processing
  }
}
```

#### 3.2 Create Workflow Engine

```javascript
class WorkflowEngine {
  constructor(configPath) {
    this.config = this.loadConfig(configPath);
    this.agents = this.loadAgents();
  }

  async executePhase(phaseName, context) {
    const phase = this.config.phases[phaseName];
    const agent = this.agents[phase.agent];
    return await agent.process(context);
  }
}
```

#### 3.3 Implement State Management

```javascript
class CampaignState {
  constructor(campaignId) {
    this.id = campaignId;
    this.state = new Map();
  }

  async savePhaseResult(phase, result) {
    this.state.set(phase, result);
    await this.persist();
  }
}
```

### Phase 4: Quality & Monitoring (1 week)

#### 4.1 Real Quality Validation

```javascript
class ContentQualityValidator {
  async validate(content, expectedContext) {
    // Check for campaign-specific terms
    const contextRelevance = this.checkContextRelevance(
      content,
      expectedContext
    );

    // Check for generic phrases
    const genericityScore = this.detectGenericPhrases(content);

    // Validate against original brief
    const briefAlignment = this.checkBriefAlignment(
      content,
      expectedContext.originalBrief
    );

    return {
      isValid: contextRelevance > 0.7 && genericityScore < 0.3,
      contextRelevance,
      genericityScore,
      briefAlignment,
    };
  }
}
```

#### 4.2 Add Telemetry

```javascript
class TelemetryService {
  trackAgentCall(agent, input, output, duration) {
    this.metrics.record({
      agent: agent.name,
      inputLength: JSON.stringify(input).length,
      outputLength: JSON.stringify(output).length,
      duration,
      timestamp: new Date(),
    });
  }
}
```

## Implementation Priority

1. **IMMEDIATE** (Do Today):

   - Fix campaign brief passing to agents
   - Fix PR Manager parameter errors
   - Add null checks in frontend

2. **HIGH** (This Week):

   - Make collaborativeInput truly dynamic
   - Create configuration schema
   - Remove hardcoded fallbacks

3. **MEDIUM** (Next 2 Weeks):

   - Implement plugin architecture
   - Create workflow engine
   - Add proper state management

4. **LOW** (Future):
   - Advanced quality validation
   - Performance optimization
   - Multi-tenant support

## Success Metrics

- **No repeated phrases** across different campaigns
- **Campaign-specific content** in every response
- **Dynamic collaboration** between agents
- **Configurable workflow** without code changes
- **< 5% generic content** in outputs

## Conclusion

The system's hardcoded feel stems from architectural issues, not intentional hardcoding. The fix requires systematic changes to pass proper context, make all responses truly dynamic, and create a configurable architecture. With these changes, the system will deliver unique, campaign-specific content every time.
