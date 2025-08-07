# Orchestration-Aware Agents Documentation

## Overview

This document describes the orchestration-aware agent system that allows agents to adapt their behavior based on which orchestration workflow they're operating in.

## What is Orchestration Awareness?

Orchestration awareness means agents:
1. Know which orchestration they're operating in
2. Only reference agents that exist in their current workflow
3. Adapt their responses to the specific workflow context
4. Never cross-reference agents from other orchestrations

## Current Status

### ✅ Fully Orchestration-Aware Agents

#### PR Manager (`PRManagerAgent.js`)
**Status**: Fully implemented and tested

**Changes Made**:
- All generation methods accept `orchestrationType` parameter
- Loads orchestration config dynamically from `orchestrations.config.json`
- Validates responses to prevent incorrect agent references
- System prompt updated with explicit rules

**Methods Updated**:
```javascript
generateCampaignIntroduction(brief, context, orchestrationType)
generateHandoffMessage(context, nextPhase, previousData, orchestrationType)
generateFinalDelivery(context, allPhaseData, orchestrationType)
generateCampaignConclusion(context, finalStrategy, orchestrationType)
synthesizeComprehensiveStrategy(allPhaseData, orchestrationType)
```

### ⚠️ Partially Aware Agents

#### BaseAgent (`BaseAgent.js`)
**Status**: Fixed API calls but not orchestration-aware

**Changes Made**:
- Fixed OpenAI API call from `responses.create()` to `chat.completions.create()`

**Still Needed**:
- Accept orchestration context in constructor or chat method
- Pass context to prompts

### ❌ Not Yet Orchestration-Aware

The following agents need to be updated:
- `TrendingNewsAgent.js`
- `StrategicInsightAgent.js`
- `StoryAnglesAgent.js`
- `BrandLensAgent.js`
- `VisualPromptGeneratorAgent.js`
- `BrandQAAgent.js`
- `ResearchAudienceAgent.js`
- `TrendCulturalAnalyzerAgent.js`
- `ModularElementsRecommenderAgent.js`

## Implementation Guide

### Making an Agent Orchestration-Aware

1. **Update Method Signatures**
   ```javascript
   // Before
   async generateContent(data) { }
   
   // After
   async generateContent(data, orchestrationType = 'hyatt') { }
   ```

2. **Load Orchestration Config**
   ```javascript
   const orchestrationConfig = require('../../orchestrations/OrchestrationConfig');
   
   // In your method
   const orchestration = orchestrationConfig.getOrchestration(orchestrationType);
   const workflow = orchestrationConfig.getWorkflowDescription(orchestrationType);
   ```

3. **Update Prompts**
   ```javascript
   const prompt = `
   ORCHESTRATION CONTEXT: ${orchestration.name}
   AVAILABLE AGENTS: ${workflow}
   
   ${yourOriginalPrompt}
   `;
   ```

4. **Update System Prompts**
   - Remove any hardcoded agent references
   - Add rules about only referencing agents in current workflow

5. **Validate Responses** (optional but recommended)
   ```javascript
   if (orchestrationType === 'hive' && response.includes('Research & Audience')) {
     // Correct the response
   }
   ```

## Configuration System

### orchestrations.config.json
```json
{
  "orchestrations": {
    "hive": {
      "name": "HIVE",
      "description": "Cultural moment response orchestration",
      "workflow": [
        { "agent": "pr-manager", "name": "PR Manager", "role": "..." },
        { "agent": "trending", "name": "Trending News Agent", "role": "..." }
        // ... more agents
      ]
    }
  }
}
```

### OrchestrationConfig API
```javascript
const config = require('./OrchestrationConfig');

// Get orchestration details
const orch = config.getOrchestration('hive');

// Get workflow description
const workflow = config.getWorkflowDescription('hive');

// Get next agent
const next = config.getNextAgent('hive', 'pr-manager');

// Get agent role
const role = config.getAgentRole('hive', 'trending');
```

## How Orchestrators Pass Context

### HiveOrchestrator.js
```javascript
const prIntro = await this.prManager.generateCampaignIntroduction(
  context.moment,
  context,
  'hive'  // <-- orchestration type
);
```

### HyattOrchestrator.js
```javascript
const introMessage = await this.prManagerAgent.generateCampaignIntroduction(
  campaignBrief,
  campaignContext,
  'hyatt'  // <-- orchestration type
);
```

## Benefits

1. **Scalability**: Add new orchestrations without code changes
2. **Accuracy**: Agents only reference valid agents in their workflow
3. **Flexibility**: Each orchestration can have unique agent sequences
4. **Maintainability**: Centralized configuration

## Testing

To test if an agent is orchestration-aware:

1. Run it in different orchestrations
2. Check that it only references agents from its current workflow
3. Verify it adapts its language to the orchestration context

## Next Steps

1. Make all remaining agents orchestration-aware
2. Add orchestration context to BaseAgent
3. Create automated tests for orchestration awareness
4. Consider adding orchestration-specific prompts directory

## Common Issues and Solutions

### Issue: Agent still references wrong agents
**Solution**: 
- Make prompts more explicit
- Add response validation
- Update system prompt with strict rules

### Issue: Agent doesn't know its orchestration
**Solution**: 
- Ensure orchestrator passes orchestrationType
- Check that agent method accepts the parameter
- Verify config is loaded correctly

### Issue: New orchestration not recognized
**Solution**: 
- Add to orchestrations.config.json
- Restart any running services
- Check for typos in orchestration key