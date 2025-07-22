---

# ARCHIVED: This plan has been superseded by hive-orchestration-modernization-plan.md. Please refer to the new plan for all future work.

# Hive Orchestration UI Pattern Adaptation Plan

**Note:** This plan assumes the Hive Orchestrator has already been genericized using the patterns validated in Hyatt (see Phase 1 of the hyatt-hive-genericization-plan.md). Complete genericization before starting this transformation.

## Overview

This plan outlines how to adapt the Hive Orchestrator for PR response to cultural/brand moments using the same UI components and patterns as the Hyatt orchestration. All new workflow logic will use dynamic industry/brand context and generic prompts.

## What Hive Orchestration Actually Does

### **The Real Scenario:**

1. **Cultural/Brand Moment Input** - Manual input of a significant moment (brand crisis, cultural trend, news event, competitor move)
2. **PR Manager Orchestration** - PR Manager coordinates the response strategy across specialized agents
3. **Strategic Analysis** - Discover insights and creative angles for brand response
4. **Brand Positioning** - Determine how the brand can authentically tell the story
5. **Visual Execution** - Generate key visual assets for the response
6. **Brand QA** - Final assessment of the complete PR response

### **The 6-Agent Workflow (PR Manager Led):**

1. **PRManagerAgent** - "Orchestrate the PR response strategy across all agents"
2. **TrendingNewsAgent** - "Analyze this moment - manual input (not discovery)"
3. **StrategicInsightAgent** - "What's the creative opportunity behind this moment?"
4. **StoryAnglesAgent** - "What narrative angles could we take?"
5. **BrandLensAgent** - "How can the brand authentically tell this story?"
6. **VisualGeneratorAgent** - "Create key visual for the chosen approach"
7. **BrandQAAgent** - "Final brand alignment and effectiveness assessment"

### **Correct Agent Flow:**

```
Manual Moment Input → PR Manager (Orchestrator)
  ↓
TrendingNews (Moment Analysis)
  ↓
Strategic Insight (Creative Step)
  ↓
Story Angles (Narrative Options)
  ↓
Brand Lens (How can brand tell the story?)
  ↓
Visual Generator (Key Visual Creation)
  ↓
Brand QA (Final Assessment)
```

## Remaining Work Plan

### Phase 1: Update Workflow Order and Agent Roles

#### 1.1 Reorder HiveOrchestrator Workflow

**Objective**: Implement correct PR Manager-led workflow with proper agent sequence

**Current Situation**:

- Wrong agent order: Trend → Brand Lens → Visual Prompt → Modular Elements → QA
- Missing PR Manager orchestration role
- Brand Lens used incorrectly in position 2

**End Goal**:

- PR Manager orchestrates the entire workflow
- Correct sequence: Manual Input → Trending News → Strategic Insight → Story Angles → Brand Lens → Visual Generator → Brand QA
- Brand Lens positioned correctly to determine how brand tells the story

**Codex Prompt**:

```
Update HiveOrchestrator to implement PR Manager-led workflow.

Current file: hive/orchestrations/classes/HiveOrchestrator.js

REQUIREMENTS:
1. Reorder agents to correct sequence:
   - Step 1: PRManagerAgent (orchestrate overall strategy)
   - Step 2: TrendingNewsAgent (analyze manual moment input)
   - Step 3: StrategicInsightAgent (creative opportunity analysis)
   - Step 4: StoryAnglesAgent (narrative angle generation)
   - Step 5: BrandLensAgent (how brand tells the story)
   - Step 6: VisualGeneratorAgent (create key visual)
   - Step 7: BrandQAAgent (final assessment)

2. Update agent roles:
   - PR Manager: Overall strategy orchestration
   - Trending News: Moment analysis (manual input, not discovery)
   - Strategic Insight: Creative opportunity identification
   - Story Angles: Narrative options generation
   - Brand Lens: Brand storytelling approach
   - Visual Generator: Key visual creation
   - Brand QA: Final brand alignment

3. Update context passing:
   - Each agent builds on previous outputs
   - PR Manager context flows through all agents
   - Brand Lens receives story angles to determine brand approach

4. Update deliverable structure:
   - PR Strategy Overview (text)
   - Moment Analysis (text)
   - Creative Insights (text)
   - Narrative Angles (text)
   - Brand Story Approach (text)
   - Key Visual (image)
   - Brand Assessment (text)
```

#### 1.2 Update Agent Prompts for Correct Roles

**Objective**: Align agent prompts with their correct roles in PR workflow

**Current Situation**:

- Agent prompts don't match the correct PR workflow roles
- Brand Lens prompt positioned as general brand analysis
- Missing PR Manager orchestration prompts

**End Goal**:

- PR Manager prompt for orchestrating overall strategy
- Trending News prompt for analyzing manual moment input
- Strategic Insight prompt for creative opportunity discovery
- Story Angles prompt for narrative angle generation
- Brand Lens prompt specifically for "how can brand tell this story"
- Updated Visual Generator and Brand QA prompts

**Codex Prompt**:

```
Update agent prompts to match correct PR workflow roles.

Files to update:
- hive/agents/prompts/pr_manager_gpt.md (NEW - orchestration role)
- hive/agents/prompts/trending_news_gpt.md (moment analysis)
- hive/agents/prompts/strategic_insight_gpt.md (creative opportunity)
- hive/agents/prompts/story_angles_headlines_gpt.md (narrative angles)
- hive/agents/prompts/brand_lens_gpt.md (how brand tells story)
- hive/agents/prompts/visual_generator_gpt.md (key visual creation)
- hive/agents/prompts/brand_qa.md (final assessment)

REQUIREMENTS:
1. PR Manager Agent (NEW):
   - Role: Orchestrate overall PR response strategy
   - Input: Manual moment description + brand context
   - Output: Strategic framework for other agents

2. Trending News Agent:
   - Role: Analyze manual moment input (not discovery)
   - Input: Moment description from user
   - Output: Moment analysis and implications

3. Strategic Insight Agent:
   - Role: Creative opportunity identification
   - Input: Moment analysis + PR strategy framework
   - Output: Creative insights and opportunities

4. Story Angles Agent:
   - Role: Generate narrative angle options
   - Input: Creative insights + strategic framework
   - Output: Multiple narrative approaches

5. Brand Lens Agent:
   - Role: "How can the brand tell this story?"
   - Input: Story angles + brand context
   - Output: Brand's authentic storytelling approach

6. Visual Generator Agent:
   - Role: Create key visual for chosen approach
   - Input: Brand story approach + creative direction
   - Output: Key visual concept and execution

7. Brand QA Agent:
   - Role: Final brand alignment assessment
   - Input: Complete PR response (text + visual)
   - Output: Brand alignment assessment and recommendations
```

#### 1.3 Update API Endpoint for PR Manager Workflow

**Objective**: Update API to support PR Manager-led 7-agent workflow

**Current Situation**:

- API configured for 5-agent visual creation workflow
- Missing PR Manager orchestration endpoint
- Wrong phase definitions and tracking

**End Goal**:

- Support 7-agent PR Manager workflow
- Correct phase names and tracking
- Proper manual moment input handling

**Codex Prompt**:

```
Update Hive API endpoint for PR Manager-led workflow.

Current file: hive/routes/visual.js

REQUIREMENTS:
1. Update workflow phases (7 phases):
   - pr_strategy → PR Manager orchestration
   - moment_analysis → Trending News analysis
   - creative_insights → Strategic Insight opportunities
   - story_angles → Story Angles generation
   - brand_approach → Brand Lens storytelling
   - key_visual → Visual Generator creation
   - final_assessment → Brand QA review

2. Update input structure:
   - moment: "Manual description of the cultural/brand moment"
   - industry: "tech|retail|hospitality|etc."
   - brandContext: "luxury|accessible|innovative|etc."
   - momentType: "crisis|opportunity|competitor|cultural"
   - brandValues: "Core brand values and positioning"
   - targetAudience: "Primary audience for response"
   - desiredOutcome: "What we want to achieve"

3. Update deliverable titles:
   - "PR Strategy" → PR Manager orchestration
   - "Moment Analysis" → Trending News insights
   - "Creative Insights" → Strategic opportunities
   - "Story Angles" → Narrative approaches
   - "Brand Approach" → How brand tells story
   - "Key Visual" → Visual execution
   - "Final Assessment" → Brand QA review

4. Update workflow state tracking:
   - Support 7-phase workflow progression
   - Proper agent dependency tracking
   - Real-time status updates for each phase
```

### Phase 2: Update Frontend for New Workflow

#### 2.1 Update HiveAgentCollaboration for 7-Agent Workflow

**Objective**: Display correct 7-agent PR Manager workflow in UI

**Current Situation**:

- UI shows 5-agent workflow with wrong sequence
- Missing PR Manager orchestration visualization
- Wrong phase descriptions and agent roles

**End Goal**:

- Display 7-agent PR Manager-led workflow
- Correct agent roles and phase descriptions
- Visual indication of PR Manager orchestration role

**Codex Prompt**:

```
Update HiveAgentCollaboration for PR Manager-led 7-agent workflow.

Current file: frontend/src/components/shared/HiveAgentCollaboration.tsx

REQUIREMENTS:
1. Update to 7 phases:
   - pr_strategy: "PR Manager - Orchestrating response strategy"
   - moment_analysis: "Trending News - Analyzing the moment"
   - creative_insights: "Strategic Insight - Finding creative opportunities"
   - story_angles: "Story Angles - Generating narrative approaches"
   - brand_approach: "Brand Lens - How can the brand tell this story?"
   - key_visual: "Visual Generator - Creating key visual"
   - final_assessment: "Brand QA - Final brand alignment"

2. Update phase icons and styling:
   - PR Manager: Orchestration/conductor icon
   - Trending News: Analysis/magnifying glass icon
   - Strategic Insight: Lightbulb/creative icon
   - Story Angles: Multiple paths/narrative icon
   - Brand Lens: Brand/storytelling icon
   - Visual Generator: Image/creative icon
   - Brand QA: Check/assessment icon

3. Visual hierarchy:
   - Highlight PR Manager as orchestrator
   - Show sequential flow through agents
   - Indicate dependencies between phases

4. Update deliverable handling:
   - Handle 7 different deliverable types
   - Proper text/image deliverable display
   - Updated phase completion indicators
```

#### 2.2 Update HiveMomentForm for Manual Input

**Objective**: Emphasize manual moment input (not automated discovery)

**Current Situation**:

- Form might suggest automated moment discovery
- Missing emphasis on manual input requirement
- Needs clearer guidance for moment description

**End Goal**:

- Clear indication this is manual moment input
- Better guidance for describing moments
- Proper context fields for PR Manager orchestration

**Codex Prompt**:

```
Update HiveMomentForm to emphasize manual moment input.

Current file: frontend/src/components/shared/HiveMomentForm.tsx

REQUIREMENTS:
1. Update form labels and descriptions:
   - "Manual Moment Input" as form title
   - "Describe the moment you want to respond to" as main prompt
   - Clear indication this is not automated discovery

2. Enhanced moment input field:
   - Larger textarea for detailed moment description
   - Placeholder examples of different moment types
   - Character count and guidance for detail level

3. PR Manager context fields:
   - Brand values and positioning
   - Strategic objectives for response
   - Key stakeholders to consider
   - Timeline/urgency indicators

4. Form validation and guidance:
   - Require sufficient detail in moment description
   - Validate brand context completeness
   - Provide examples of effective moment inputs

Example placeholders:
- Crisis: "Brand faces backlash over..."
- Opportunity: "Cultural moment emerges around..."
- Competitor: "Competitor launches campaign that..."
- Cultural: "Social movement gains momentum around..."
```

### Phase 3: Test Complete PR Manager Workflow

#### 3.1 Test End-to-End PR Manager Orchestration

**Objective**: Verify complete 7-agent workflow with correct sequencing

**Current Situation**:

- Need to test new PR Manager orchestration
- Verify correct agent sequencing and outputs
- Test manual moment input processing

**End Goal**:

- Complete 7-agent workflow functions correctly
- PR Manager properly orchestrates other agents
- Brand Lens correctly positioned for storytelling approach
- Quality outputs at each phase

**Testing Scenarios**:

```
Test complete PR Manager workflow with different moment types.

Testing requirements:
1. Test manual moment input:
   - Crisis response scenario
   - Cultural opportunity scenario
   - Competitor response scenario
   - Brand activation moment

2. Test 7-agent workflow sequence:
   - PR Manager: Strategic orchestration
   - Trending News: Manual moment analysis
   - Strategic Insight: Creative opportunity identification
   - Story Angles: Narrative approach options
   - Brand Lens: "How can brand tell this story?"
   - Visual Generator: Key visual creation
   - Brand QA: Final assessment

3. Test agent dependencies:
   - Each agent builds on previous outputs
   - Brand Lens receives story angles correctly
   - Visual Generator uses brand approach
   - Brand QA assesses complete response

4. Test deliverable quality:
   - PR Manager provides strategic framework
   - Brand Lens answers "how brand tells story"
   - Visual Generator creates relevant key visual
   - Brand QA provides actionable assessment

Expected outputs:
1. PR Strategy Framework (text)
2. Moment Analysis (text)
3. Creative Opportunities (text)
4. Narrative Approaches (text)
5. Brand Storytelling Approach (text)
6. Key Visual (image)
7. Brand Assessment (text)
```

## Completed Work

### ✅ Phase 1: Backend Workflow Infrastructure - COMPLETE

#### 1.1 Backend Foundation - ✅ **DONE**

- **✅ Sequential API endpoint**: `/api/hive-orchestrate` with workflow management
- **✅ Agent classes**: All agent classes properly implemented
- **✅ Image generation**: Working image generation functionality
- **✅ Workflow state management**: Complete state tracking and persistence
- **✅ Real-time updates**: Polling and progress tracking system

#### 1.2 UI State Management - ✅ **DONE**

- **✅ activeWorkflows Map**: Tracking running workflows
- **✅ Workflow state structure**: Complete phase/status/deliverable tracking
- **✅ API endpoints**: GET /api/hive/workflows/:id and /workflows
- **✅ Phase tracking**: Real-time status updates

### ✅ Phase 2: Frontend Components - COMPLETE

#### 2.1 Core Components - ✅ **DONE**

- **✅ HiveOrchestrationPage**: Uses SharedOrchestrationLayout
- **✅ HiveMomentForm**: Moment-based input form
- **✅ HiveAgentCollaboration**: Agent workflow visualization
- **✅ ImageDeliverableCard**: Image deliverable handling
- **✅ useHiveWorkflowState**: Workflow state management hook

#### 2.2 UI Integration - ✅ **DONE**

- **✅ SharedProgressPanel**: Overall workflow progress
- **✅ SharedDeliverablePanel**: Deliverable viewing
- **✅ Real-time updates**: 2-second polling for progress
- **✅ Error handling**: Graceful error management

### ✅ Phase 3: Type System - COMPLETE

#### 3.1 Type Definitions - ✅ **DONE**

- **✅ HiveWorkflowState**: Complete workflow state typing
- **✅ Deliverable types**: text/image/mixed support
- **✅ Phase status tracking**: Proper TypeScript definitions

## Implementation Timeline

**Prerequisite:** Complete Hyatt genericization and apply the same to Hive before starting this transformation. See hyatt-hive-genericization-plan.md for details.

### Week 1: Workflow Restructure

- ✅ **Day 1-2**: Update HiveOrchestrator for 7-agent PR Manager workflow
- ✅ **Day 3-4**: Update all agent prompts for correct roles
- ✅ **Day 5**: Update API endpoint for new workflow phases

### Week 2: Frontend Updates and Testing

- ✅ **Day 1-2**: Update HiveAgentCollaboration for 7-agent display
- ✅ **Day 3**: Update HiveMomentForm for manual input emphasis
- ✅ **Day 4-5**: End-to-end testing of complete PR Manager workflow

## Success Metrics

1. **PR Manager Orchestration**: PR Manager properly coordinates all agents ⚠️ **NEEDS IMPLEMENTATION**
2. **Correct Agent Sequence**: Trending News → Strategic Insight → Story Angles → Brand Lens → Visual Generator → Brand QA ⚠️ **NEEDS IMPLEMENTATION**
3. **Brand Lens Positioning**: Brand Lens correctly answers "how can brand tell this story?" ⚠️ **NEEDS IMPLEMENTATION**
4. **Manual Input Processing**: System handles manual moment input effectively ⚠️ **NEEDS IMPLEMENTATION**
5. **Visual Consistency**: Uses same UI patterns as Hyatt orchestration ✅
6. **Complete Deliverables**: All 7 phases produce quality outputs ⚠️ **NEEDS TESTING**

## Risk Mitigation

1. **Workflow Complexity**: 7-agent workflow more complex than 5-agent ⚠️ **MONITOR**
2. **Agent Dependencies**: Ensure proper output passing between agents ⚠️ **TEST THOROUGHLY**
3. **Performance**: Longer workflow may impact user experience ⚠️ **MONITOR**
4. **Quality Control**: More agents mean more potential failure points ⚠️ **TEST THOROUGHLY**

## Conclusion

The Hive orchestration has a solid technical foundation but needs restructuring for the correct PR Manager-led workflow. The key changes are:

1. **PR Manager orchestration** of the entire response strategy
2. **Correct agent sequence** with Brand Lens positioned to answer "how can the brand tell this story?"
3. **Manual moment input** rather than automated discovery
4. **7-agent workflow** instead of current 5-agent structure

This will create a powerful PR response system where the PR Manager coordinates specialized agents to create comprehensive, brand-aligned responses to cultural and brand moments.
