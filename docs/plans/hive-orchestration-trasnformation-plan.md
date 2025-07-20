# Hive Orchestration UI Pattern Adaptation Plan

## Overview

This plan outlines how to adapt the Hive Orchestrator to use the same UI components and patterns as the Hyatt orchestration, while maintaining its **moment-based** workflow (not campaign-based). The goal is to create visual consistency and better user experience by using SharedAgentCollaboration, SharedDeliverablePanel, and other shared components to show the 5-agent sequential workflow and image deliverables.

## Current State Analysis

### Hive Orchestration Backend

- ✅ **Well-structured 5-step workflow**: Trend Analysis → Brand Lens → Visual Prompt → Modular Elements → QA Review
- ✅ **Produces image deliverables**: Base64 encoded images from AI generation
- ✅ **Proper agent coordination**: Error handling and workflow management
- ✅ **Moment-based input**: Takes context/moment input (not campaign brief)
- ❌ **No UI integration**: Doesn't use shared UI components like Hyatt
- ❌ **Wrong agent order**: Current implementation runs agents in wrong sequence
- ❌ **Missing Brand Lens**: Brand Lens agent not included in current flow

### Hive Landing Page

- ❌ **Uses OrchestrationPageTemplate**: With custom `renderExtraCenter` component
- ❌ **Doesn't follow Hyatt pattern**: Missing `SharedAgentCollaboration` integration
- ❌ **No proper deliverable handling**: No proper image deliverable display
- ❌ **No agent handoff visualization**: Can't see the 5-agent sequential workflow

### Hyatt Pattern (Target UI Components)

- ✅ **SharedOrchestrationLayout**: With side panels for conversation and deliverables
- ✅ **SharedAgentCollaboration**: Phase-based workflow visualization
- ✅ **SharedDeliverablePanel**: Consistent deliverable display
- ✅ **Agent handoff visualization**: Clear progression through phases
- ✅ **HITL review integration**: Full human-in-the-loop capabilities

## Remaining Work Plan

### Phase 1: Fix Backend Workflow Logic

#### 1.1 Fix Agent Execution Order

**Objective**: Implement proper sequential 5-agent workflow with correct order and Brand Lens agent

**Current Situation**:

- Current `/api/hive-orchestrate` endpoint runs agents in wrong order
- Missing Brand Lens agent entirely
- No real-time progress tracking for UI

**End Goal**:

- Sequential execution: Trend → Brand Lens → Visual Prompt → Modular Elements → QA Review
- Include Brand Lens agent in workflow
- Add UI state tracking for real-time progress

**Codex Prompt**:

```
Update the Hive orchestration backend to implement proper sequential agent execution.

Current file: hive/routes/visual.js
Current endpoint: /api/hive-orchestrate

Requirements:
1. Fix agent execution order to: Trend Cultural Analyzer → Brand Lens → Visual Prompt Generator → Modular Elements Recommender → Brand QA
2. Add Brand Lens agent to the workflow (import BrandLensAgent)
3. Each agent should build on previous agent's output
4. Add UI state tracking with phases and status updates
5. Return workflow state for frontend consumption

Agent dependencies:
- Brand Lens needs Trend Cultural Analyzer output
- Visual Prompt needs Brand Lens output
- Modular Elements needs Visual Prompt output
- QA Review needs all previous outputs

Include proper error handling and status tracking for each phase.
```

#### 1.2 Add UI State Management

**Objective**: Add backend state tracking for workflow progress

**Current Situation**:

- No workflow state persistence
- No real-time progress updates
- No phase status tracking

**End Goal**:

- Track workflow state with phases, status, and deliverables
- Provide endpoints for frontend to poll progress
- Store workflow history

**Codex Prompt**:

```
Add UI state management to Hive orchestrator for real-time progress tracking.

Files to update:
- hive/orchestrations/classes/HiveOrchestrator.js
- hive/routes/campaigns.js (add new endpoints)

Requirements:
1. Add activeWorkflows Map to track running workflows
2. Create workflow state structure with phases, status, deliverables
3. Add endpoints: GET /api/hive/workflows/:id, GET /api/hive/workflows
4. Update POST /api/hive/orchestrate to return workflow ID
5. Track phase transitions and timing
6. Store deliverables as they're created

Workflow state should include:
- id, status, currentPhase, phases (with status/timing), deliverables, timestamps
- Support for: initializing, trend_analysis, brand_lens, visual_prompt, modular_elements, qa_review, completed, failed
```

### Phase 2: Enhance Frontend Components

#### 2.1 Improve HiveAgentCollaboration

**Objective**: Add real-time progress indicators and better phase visualization

**Current Situation**:

- Basic phase display without real-time updates
- Missing progress indicators and status messages
- No active phase highlighting

**End Goal**:

- Real-time progress indicators for active phases
- Status messages showing current agent activity
- Visual feedback for completed/pending/active phases

**Codex Prompt**:

```
Enhance HiveAgentCollaboration component to show real-time workflow progress.

Current file: frontend/src/components/shared/HiveAgentCollaboration.tsx

Requirements:
1. Add real-time progress indicators (spinning icons, status messages)
2. Show current active phase with visual highlighting
3. Display status messages for each agent's activity
4. Add phase timing information (start/end times)
5. Handle workflow states: running, completed, failed
6. Use consistent styling with Hyatt's SharedAgentCollaboration

Design guidance:
- Use Lucide icons: Play, CheckCircle, AlertCircle, Eye
- Follow existing color scheme: primary, success, error
- Add loading spinners for active phases
- Show phase completion status with checkmarks
- Include "View Deliverable" buttons for completed phases
```

#### 2.2 Add Progress Panel Integration

**Objective**: Integrate SharedProgressPanel for overall workflow progress

**Current Situation**:

- Missing SharedProgressPanel in HiveOrchestrationPage
- No overall progress visualization

**End Goal**:

- Show overall workflow progress like Hyatt
- Display workflow status and timing
- Provide progress details access

**Codex Prompt**:

```
Add SharedProgressPanel integration to HiveOrchestrationPage.

Current file: frontend/src/components/orchestrations/HiveOrchestrationPage.tsx

Requirements:
1. Import and use SharedProgressPanel component
2. Adapt workflow state to match campaign interface expected by SharedProgressPanel
3. Show overall workflow progress and status
4. Handle progress panel's onViewProgress callback
5. Display workflow timing and completion status

Integration guidance:
- Pass workflow as campaign prop to SharedProgressPanel
- Map workflow status to campaign status format
- Handle onViewProgress to open side panel
- Show workflow start/completion times
- Display current phase and overall progress percentage
```

#### 2.3 Enhance useHiveWorkflowState Hook

**Objective**: Add real-time polling and better state management

**Current Situation**:

- No real-time updates from backend
- Missing polling for workflow progress
- Limited error handling

**End Goal**:

- Real-time workflow progress updates
- Automatic polling for active workflows
- Better error handling and state management

**Codex Prompt**:

```
Enhance useHiveWorkflowState hook for real-time workflow updates.

Current file: frontend/src/hooks/useHiveWorkflowState.ts

Requirements:
1. Add polling mechanism for active workflows
2. Implement real-time progress updates
3. Add better error handling and loading states
4. Support workflow state transitions
5. Add methods for loading existing workflows

Implementation guidance:
- Poll every 2 seconds for active workflows
- Stop polling when workflow completes or fails
- Handle API errors gracefully
- Add loading states for different operations
- Support loading workflow by ID
- Add workflow reset functionality
```

### Phase 3: Fix Image Deliverable Handling

#### 3.1 Update ImageDeliverableCard

**Objective**: Improve image display and add download functionality

**Current Situation**:

- Basic image display without download
- Missing proper image type detection
- Limited mixed content handling

**End Goal**:

- Image download functionality
- Better mixed content display
- Proper image type detection

**Codex Prompt**:

```
Enhance ImageDeliverableCard component with better image handling.

Current file: frontend/src/components/shared/ImageDeliverableCard.tsx

Requirements:
1. Add image download functionality
2. Improve mixed content display (text + images)
3. Better image type detection
4. Add loading states for images
5. Handle image errors gracefully

Design guidance:
- Use Download icon from Lucide for download button
- Show image previews for mixed content
- Add proper alt text and accessibility
- Handle base64 and URL images
- Show loading spinner while images load
- Add error fallback for failed images
```

#### 3.2 Update Deliverable Types

**Objective**: Add proper type support for image deliverables

**Current Situation**:

- Missing type field in Deliverable interface
- Limited support for mixed content types

**End Goal**:

- Proper type definitions for image deliverables
- Support for text, image, and mixed content types

**Codex Prompt**:

```
Update Deliverable type to support image deliverables.

Current file: frontend/src/types/index.ts

Requirements:
1. Add type field to Deliverable interface
2. Support 'text', 'image', 'mixed' types
3. Update HiveWorkflowState to include proper phase tracking
4. Add proper typing for image content

Type definitions needed:
- Deliverable.type: 'text' | 'image' | 'mixed'
- HiveWorkflowState.phases: proper phase status tracking
- Image content structure with imageUrl and metadata
```

### Phase 4: Testing and Integration

#### 4.1 End-to-End Testing

**Objective**: Test complete workflow from moment input to deliverables

**Current Situation**:

- No comprehensive testing of complete workflow
- Missing integration tests

**End Goal**:

- Complete workflow testing
- Error scenario testing
- Performance validation

**Codex Prompt**:

```
Create comprehensive testing plan for Hive orchestration workflow.

Testing requirements:
1. Test complete 5-agent sequential workflow
2. Test error handling and recovery
3. Test image generation and display
4. Test real-time progress updates
5. Test deliverable viewing and download
6. Test workflow state persistence

Test scenarios:
- Happy path: complete workflow with all agents
- Error path: agent failure and recovery
- Performance: multiple concurrent workflows
- UI: responsive design and accessibility
- Integration: frontend-backend communication
```

## Completed Work

### ✅ Frontend Components Implemented

1. **HiveOrchestrationPage** - Uses SharedOrchestrationLayout like Hyatt
2. **HiveMomentForm** - Moment-based input form (not campaign)
3. **HiveAgentCollaboration** - Basic 5-agent workflow visualization
4. **ImageDeliverableCard** - Handles image deliverables
5. **useHiveWorkflowState** - Hook for workflow state management
6. **HiveWorkflowState type** - Added to types
7. **SharedDeliverablePanel** - Updated to handle image deliverables

### ✅ Backend Foundation

1. **Basic API endpoint** - `/api/hive-orchestrate` exists
2. **Agent classes** - All 5 agents available
3. **Image generation** - Working image generation
4. **Basic workflow** - Simple orchestration flow

## Implementation Timeline

### Week 1: Backend Fixes

- Fix agent execution order and add Brand Lens
- Add UI state management and endpoints
- Test backend workflow

### Week 2: Frontend Enhancements

- Improve HiveAgentCollaboration with real-time updates
- Add SharedProgressPanel integration
- Enhance useHiveWorkflowState hook

### Week 3: Image Handling & Testing

- Update ImageDeliverableCard and types
- Comprehensive testing
- Bug fixes and refinements

## Success Metrics

1. **Visual Consistency**: Hive uses same UI components as Hyatt
2. **Workflow Visualization**: Clear 5-agent sequential workflow display
3. **Image Support**: Proper display and management of visual deliverables
4. **User Experience**: Smooth workflow from moment input to completion
5. **Performance**: No degradation in system performance

## Risk Mitigation

1. **Backward Compatibility**: Maintain existing Hive functionality
2. **Testing Strategy**: Comprehensive testing at each phase
3. **Rollback Plan**: Ability to revert changes if issues arise
4. **User Training**: Documentation for new workflow visualization

## Conclusion

The foundation is in place with frontend components implemented. The remaining work focuses on fixing the backend workflow logic, enhancing real-time progress tracking, and improving image deliverable handling. This will create a consistent user experience across orchestrations with proper visualization of the 5-agent sequential workflow and support for image deliverables.
