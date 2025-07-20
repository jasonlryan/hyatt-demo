# Hive Orchestration UI Pattern Adaptation Plan

## Overview

This plan outlines how to adapt the Hive Orchestrator for **PR response to cultural/brand moments** using the same UI components and patterns as the Hyatt orchestration. The goal is to create a moment-based workflow that generates PR ideas and visual assets when cultural or brand moments are detected.

## What Hive Orchestration Actually Does

### **The Real Scenario:**

1. **Cultural/Brand Moment Detection** - A significant moment happens (brand crisis, cultural trend, news event, competitor move)
2. **Hive Orchestration Triggers** - System detects the moment and automatically starts the orchestration
3. **Generate PR Ideas** - "How could the brand respond to this moment?"
4. **Assess and Refine** - Evaluate ideas and pick the best one
5. **Create Visual Assets** - Generate key visual and executions for the chosen idea
6. **Brand QA** - Final assessment of the complete PR response

### **The 6-Agent Workflow:**

1. **TrendingNewsAgent** - "What's happening in this moment? What are the implications?"
2. **StrategicInsightAgent** - "What's the human truth behind this moment?"
3. **StoryAnglesAgent** - "What PR ideas could we execute based on this moment?"
4. **PRManagerAgent** - "Synthesize the best idea into a comprehensive PR strategy"
5. **VisualPromptGeneratorAgent** - "Create key visual for the chosen PR idea"
6. **BrandQAAgent** - "Is this a good PR response? Does it align with our brand?"

## Remaining Work Plan

### Phase 1: Genericize Prompts and Update Workflow

#### 1.1 Genericize Agent Prompts

**Objective**: Make all agent prompts work for any industry/brand, not just hospitality

**Current Situation**:

- Prompts are hard-coded for "hospitality campaigns" and "travel industry"
- Specific to "Hyatt luxury hospitality"
- Not flexible for different industries or brand contexts

**End Goal**:

- Generic prompts that work for any industry/brand
- Dynamic context injection based on moment input
- Flexible for PR crisis, cultural opportunity, competitor response

**Codex Prompt**:

```
Genericize agent prompts to work for any industry and brand context.

Files to update:
- hive/agents/prompts/trending_news_gpt.md
- hive/agents/prompts/strategic_insight_gpt.md
- hive/agents/prompts/story_angles_headlines_gpt.md
- hive/agents/prompts/pr_manager_gpt.md
- hive/agents/prompts/brand_qa.md

REQUIREMENTS:
1. Replace hard-coded industry references with placeholders:
   - "hospitality, travel" → "[INDUSTRY]"
   - "Hyatt luxury hospitality" → "[BRAND_CONTEXT]"
   - "travel industry trends" → "[INDUSTRY] trends"

2. Add moment-specific sections for PR response scenarios:
   - Crisis response handling
   - Cultural opportunity response
   - Competitor move response
   - Brand activation moments

3. Make prompts accept dynamic context:
   - Industry type (tech, retail, hospitality, etc.)
   - Brand positioning (luxury, accessible, innovative, etc.)
   - Moment type (crisis, opportunity, competitor, cultural)
   - Target audience segments

4. Maintain existing functionality while adding flexibility

Example transformations:
- "hospitality campaigns" → "[INDUSTRY] campaigns"
- "travel industry trends" → "[INDUSTRY] trends and cultural moments"
- "luxury hospitality" → "[BRAND_CONTEXT]"
```

#### 1.2 Update HiveOrchestrator for New Workflow

**Objective**: Replace current visual-focused workflow with PR response workflow

**Current Situation**:

- Uses visual-focused agents (VisualPromptGenerator, ModularElementsRecommender)
- Designed for marketing campaign visual creation
- Wrong agent order and dependencies

**End Goal**:

- Use PR-focused agents in correct order
- Include visual generation step for chosen PR idea
- Proper moment-based input handling

**Codex Prompt**:

```
Update HiveOrchestrator to use PR response workflow instead of visual creation.

Current file: hive/orchestrations/classes/HiveOrchestrator.js

REQUIREMENTS:
1. Replace current agents with PR-focused agents:
   - TrendingNewsAgent (analyze the moment)
   - StrategicInsightAgent (find human truth)
   - StoryAnglesAgent (generate PR ideas)
   - PRManagerAgent (synthesize strategy)
   - VisualPromptGeneratorAgent (create key visual for chosen idea)
   - BrandQAAgent (final brand alignment)

2. Update workflow order:
   - Step 1: Analyze moment and implications
   - Step 2: Discover human truth behind moment
   - Step 3: Generate PR response ideas
   - Step 4: Synthesize best idea into PR strategy
   - Step 5: Create key visual for chosen PR idea
   - Step 6: Final brand alignment assessment

3. Update context handling:
   - Accept moment input instead of campaign brief
   - Pass industry, brand context, moment type
   - Handle different moment scenarios (crisis, opportunity, etc.)

4. Update deliverable structure:
   - Moment analysis (text)
   - Strategic insights (text)
   - PR ideas (text)
   - PR strategy (text)
   - Key visual (image)
   - Brand assessment (text)
```

#### 1.3 Update API Endpoint for Moment Input

**Objective**: Change API to accept moment input instead of campaign details

**Current Situation**:

- API expects campaign, visualObjective, heroVisualDescription
- Designed for marketing campaign creation
- Wrong input structure for PR response

**End Goal**:

- Accept moment description and context
- Handle different moment types
- Pass correct context to agents

**Codex Prompt**:

```
Update Hive API endpoint to accept moment input for PR response.

Current file: hive/routes/visual.js

REQUIREMENTS:
1. Update input validation:
   - Replace campaign, visualObjective, heroVisualDescription
   - Add moment, industry, brandContext, momentType
   - Validate required fields for PR response

2. Update context structure:
   - moment: "Description of the cultural/brand moment"
   - industry: "tech|retail|hospitality|etc."
   - brandContext: "luxury|accessible|innovative|etc."
   - momentType: "crisis|opportunity|competitor|cultural"
   - targetAudience: "Who we want to reach"
   - desiredOutcome: "What we want to achieve"

3. Update workflow phases:
   - trend_analysis → moment_analysis
   - brand_lens → strategic_insights
   - visual_prompt → pr_ideas
   - modular_elements → pr_strategy
   - qa_review → key_visual
   - Add final_qa phase

4. Update deliverable titles and types:
   - "Trend Insights" → "Moment Analysis"
   - "Brand Lens" → "Strategic Insights"
   - "Visual Prompt" → "PR Ideas"
   - "Modular Elements" → "PR Strategy"
   - "QA Review" → "Key Visual"
   - Add "Brand Assessment"
```

### Phase 2: Update Frontend for Moment Input

#### 2.1 Create HiveMomentForm Component

**Objective**: Replace campaign form with moment input form

**Current Situation**:

- HiveMomentForm collects campaign details
- Designed for marketing campaign creation
- Wrong fields for PR response

**End Goal**:

- Form for moment description and context
- Industry and brand context selection
- Moment type classification

**Codex Prompt**:

```
Create HiveMomentForm for PR response to cultural/brand moments.

Current file: frontend/src/components/shared/HiveMomentForm.tsx

REQUIREMENTS:
1. Replace campaign fields with moment fields:
   - moment: Textarea for moment description
   - industry: Dropdown (tech, retail, hospitality, etc.)
   - brandContext: Dropdown (luxury, accessible, innovative, etc.)
   - momentType: Dropdown (crisis, opportunity, competitor, cultural)
   - targetAudience: Text input
   - desiredOutcome: Text input

2. Update form validation:
   - Require moment description
   - Require industry and brand context
   - Optional target audience and desired outcome

3. Update form labels and placeholders:
   - "Campaign Context" → "Describe the cultural/brand moment"
   - "Moment Type" → "What type of moment is this?"
   - Add helpful examples and guidance

4. Update form submission:
   - Send moment context instead of campaign context
   - Maintain existing form structure and styling
```

#### 2.2 Update HiveAgentCollaboration for New Workflow

**Objective**: Update agent collaboration to show PR response workflow

**Current Situation**:

- Shows visual creation workflow phases
- Wrong phase names and descriptions
- Not aligned with PR response process

**End Goal**:

- Show PR response workflow phases
- Correct phase names and descriptions
- Aligned with moment analysis process

**Codex Prompt**:

```
Update HiveAgentCollaboration to show PR response workflow.

Current file: frontend/src/components/shared/HiveAgentCollaboration.tsx

REQUIREMENTS:
1. Update phase definitions:
   - trend_analysis → moment_analysis: "Analyzing the moment and implications"
   - brand_lens → strategic_insights: "Discovering human truth behind the moment"
   - visual_prompt → pr_ideas: "Generating PR response ideas"
   - modular_elements → pr_strategy: "Synthesizing PR strategy"
   - qa_review → key_visual: "Creating key visual for chosen idea"
   - Add final_qa: "Final brand alignment assessment"

2. Update phase icons and labels:
   - Use appropriate icons for each PR phase
   - Update phase descriptions to reflect PR workflow
   - Maintain existing styling and structure

3. Update deliverable handling:
   - Handle text deliverables for analysis and strategy
   - Handle image deliverable for key visual
   - Update deliverable titles and types
```

### Phase 3: Test Complete PR Response Workflow

#### 3.1 Test End-to-End PR Response

**Objective**: Verify complete workflow from moment input to PR strategy and visual

**Current Situation**:

- Need to test new PR response workflow
- Verify genericized prompts work correctly
- Test visual generation for PR ideas

**End Goal**:

- Complete PR response workflow works
- Genericized prompts handle different industries/brands
- Visual generation works for chosen PR idea

**Codex Prompt**:

```
Test complete Hive PR response workflow end-to-end.

Testing requirements:
1. Test moment input and processing:
   - Submit moment description
   - Verify industry and brand context passed correctly
   - Check moment type classification

2. Test PR workflow phases:
   - Moment analysis completes successfully
   - Strategic insights generated
   - PR ideas created
   - PR strategy synthesized
   - Key visual generated for chosen idea
   - Brand assessment completed

3. Test genericized prompts:
   - Test with different industries (tech, retail, hospitality)
   - Test with different brand contexts (luxury, accessible, innovative)
   - Test with different moment types (crisis, opportunity, competitor, cultural)

4. Test visual generation:
   - Verify key visual is created for chosen PR idea
   - Check image displays correctly in UI
   - Test image download functionality

Expected workflow:
1. Moment Analysis (text) - "What's happening?"
2. Strategic Insights (text) - "What's the human truth?"
3. PR Ideas (text) - "How could we respond?"
4. PR Strategy (text) - "Comprehensive response plan"
5. Key Visual (image) - "Visual for chosen idea"
6. Brand Assessment (text) - "Is this aligned?"
```

## Completed Work

### ✅ Phase 1: Backend Workflow Logic - COMPLETE

#### 1.1 Fix Agent Execution Order - ✅ **DONE**

- **✅ Correct agent order implemented**: Trend → Brand Lens → Visual Prompt → Modular Elements → QA Review
- **✅ Brand Lens agent added**: Properly imported and included in workflow
- **✅ Sequential execution**: Each agent builds on previous output
- **✅ UI state tracking**: Workflow state with phases and status updates

#### 1.2 Add UI State Management - ✅ **DONE**

- **✅ activeWorkflows Map**: Implemented for tracking running workflows
- **✅ Workflow state structure**: Complete with phases, status, deliverables, timestamps
- **✅ API endpoints**:
  - `GET /api/hive/workflows/:id` ✅
  - `GET /api/hive/workflows` ✅
  - `POST /api/hive-orchestrate` returns workflow ID ✅
- **✅ Phase tracking**: All 5 phases with status/timing

### ✅ Phase 2: Frontend Components - COMPLETE

#### 2.1 Improve HiveAgentCollaboration - ✅ **DONE**

- **✅ Real-time progress indicators**: Loading spinners for active phases
- **✅ Status messages**: Visual feedback for each phase
- **✅ Phase visualization**: Clear progression through 5 agents
- **✅ View Deliverable buttons**: For completed phases

#### 2.2 Add Progress Panel Integration - ✅ **DONE**

- **✅ SharedProgressPanel integrated**: Shows overall workflow progress
- **✅ Workflow status display**: Maps workflow to campaign interface
- **✅ Progress callback handling**: Opens side panel on view progress

#### 2.3 Enhance useHiveWorkflowState Hook - ✅ **DONE**

- **✅ Polling mechanism**: 2-second intervals for active workflows
- **✅ Real-time updates**: Automatic progress updates
- **✅ Error handling**: Graceful API error handling
- **✅ State management**: Complete workflow state transitions

### ✅ Phase 3: Type System - COMPLETE

#### 3.1 Update Deliverable Types - ✅ **DONE**

- **✅ Type field added**: `'text' | 'image' | 'mixed'` support
- **✅ HiveWorkflowState**: Proper phase status tracking
- **✅ Image content structure**: Proper typing for image deliverables

### ✅ Frontend Components Implemented

1. **HiveOrchestrationPage** - Uses SharedOrchestrationLayout like Hyatt ✅
2. **HiveMomentForm** - Moment-based input form (not campaign) ✅
3. **HiveAgentCollaboration** - Real-time 5-agent workflow visualization ✅
4. **ImageDeliverableCard** - Handles image deliverables ✅
5. **useHiveWorkflowState** - Hook for workflow state management ✅
6. **HiveWorkflowState type** - Added to types ✅
7. **SharedDeliverablePanel** - Updated to handle image deliverables ✅

### ✅ Backend Foundation

1. **Sequential API endpoint** - `/api/hive-orchestrate` with proper agent order ✅
2. **Agent classes** - All 5 agents with Brand Lens ✅
3. **Image generation** - Working image generation ✅
4. **Workflow state management** - Complete state tracking ✅
5. **Real-time updates** - Polling and progress tracking ✅

## Implementation Timeline

### Week 1: Genericize and Update Workflow

- Genericize all agent prompts for industry/brand flexibility
- Update HiveOrchestrator to use PR response workflow
- Update API endpoint for moment input

### Week 2: Update Frontend and Test

- Update HiveMomentForm for moment input
- Update HiveAgentCollaboration for PR workflow
- Test complete end-to-end PR response workflow

## Success Metrics

1. **Visual Consistency**: Hive uses same UI components as Hyatt ✅
2. **Workflow Visualization**: Clear 6-agent PR response workflow display ⚠️ **NEEDS UPDATE**
3. **Generic Flexibility**: Works for any industry/brand combination ⚠️ **NEEDS WORK**
4. **PR Response Quality**: Generates effective PR strategies and visuals ⚠️ **NEEDS WORK**
5. **User Experience**: Smooth workflow from moment input to PR strategy ⚠️ **NEEDS UPDATE**

## Risk Mitigation

1. **Backward Compatibility**: Maintain existing Hive functionality ✅
2. **Testing Strategy**: Test PR response workflow with different scenarios ⚠️ **IN PROGRESS**
3. **Rollback Plan**: Ability to revert changes if issues arise ✅
4. **User Training**: Documentation for new PR response workflow ⚠️ **NEEDS UPDATE**

## Conclusion

The core Hive orchestration functionality is complete, but we need to transform it from visual marketing creation to PR response to cultural/brand moments. The remaining work focuses on genericizing prompts, updating the workflow to use PR-focused agents, and ensuring the visual generation step creates key visuals for chosen PR ideas. This will create a powerful moment-based PR response system that works for any industry and brand context.
