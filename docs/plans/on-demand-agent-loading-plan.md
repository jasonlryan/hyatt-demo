# On-Demand Agent Loading Implementation Plan

## **Current Status: BROKEN** 🔴

The system is currently non-functional due to my previous changes. Agents are loading but their system prompts are returning `null`, causing OpenAI Responses API failures:

```
Invalid type for 'input[0].content': expected one of an array of objects or string, but got null instead.
```

## **Problem Statement**

### **Current Issues:**

1. **Scalability Problem**: Server startup loads only 5 agents for Hyatt demo
2. **Growing Agent Count**: Now 10+ agents, potentially 100+ in future
3. **Inefficient Loading**: All agents loaded at startup regardless of orchestration selection
4. **Broken System**: My changes broke the working system that had been functioning for months

### **User Requirements:**

- **Startup**: Load 0 agents
- **Orchestration Selection**: Load ALL agents for that specific orchestration WHEN selected
- **Scalability**: Support 100+ agents across multiple orchestrations
- **Common Pattern**: Same loading approach for all orchestrations (not just Hyatt)

## **Proposed Solution: On-Demand Agent Loading**

### **Architecture:**

```
Server Startup → No Agents Loaded
     ↓
User Selects "Hyatt" → Load Hyatt's 5 agents
User Selects "Generic" → Load Generic's 10 agents
User Selects "Future" → Load Future's X agents
```

### **Benefits:**

- ✅ **Scalable**: Only loads needed agents
- ✅ **Fast Startup**: No delay from loading unused agents
- ✅ **Memory Efficient**: Agents loaded only when needed
- ✅ **Future-Proof**: Supports unlimited orchestrations and agents

## **Implementation Plan**

### **Phase 1: Fix Current Broken System** 🔧

**Goal**: Restore working functionality before making improvements

1. **Revert AgentOrchestrator Constructor**

   - Remove my changes that broke agent instantiation
   - Restore original working agent loading logic
   - Ensure system prompts load correctly

2. **Verify System Works**
   - Test Hyatt orchestration functionality
   - Confirm OpenAI API calls succeed
   - Validate agent collaboration works

### **Phase 2: Implement On-Demand Loading** 🚀

**Goal**: Implement user's requested solution

1. **Create Orchestration Configuration**

   ```json
   {
     "hyatt": {
       "agents": ["PRManagerAgent", "ResearchAudienceAgent", "StoryAnglesAgent", "StrategicInsightAgent", "TrendCulturalAnalyzerAgent"]
     },
     "generic": {
       "agents": ["BrandLensAgent", "BrandQAAgent", "ModularElementsRecommenderAgent", "TrendingNewsAgent", "VisualPromptGeneratorAgent", ...]
     }
   }
   ```

2. **Modify AgentOrchestrator**

   - Remove hardcoded agent loading from constructor
   - Add `loadAgentsForOrchestration(orchestrationId)` method
   - Accept agents as parameter instead of creating them

3. **Update Server Endpoints**

   - Modify campaign creation to accept `orchestrationId`
   - Load agents on-demand when orchestration is selected
   - Cache loaded agents for session duration

4. **Frontend Integration**
   - Update orchestration selection to trigger agent loading
   - Show loading state while agents initialize
   - Handle orchestration switching gracefully

### **Phase 3: Testing & Validation** ✅

**Goal**: Ensure system works correctly for all orchestrations

1. **Test Hyatt Orchestration**

   - Verify 5 agents load correctly
   - Confirm all functionality works as before

2. **Test Generic Orchestration**

   - Verify 10+ agents load correctly
   - Test agent collaboration and API calls

3. **Test Orchestration Switching**
   - Switch between orchestrations
   - Verify agents load/unload correctly
   - Test memory usage and performance

## **Technical Implementation Details**

### **Files to Modify:**

1. **`hive/orchestrations/classes/AgentOrchestrator.js`**

   - Remove hardcoded agent creation
   - Add orchestration-based agent loading

2. **`hive/server.js`**

   - Add orchestration configuration
   - Update campaign creation endpoint
   - Implement agent loading logic

3. **`hive/orchestrations/configs/orchestrations.config.json`**

   - Define which agents each orchestration needs

4. **Frontend orchestration components**
   - Update to handle on-demand loading
   - Add loading states and error handling

### **Key Methods to Implement:**

```javascript
// In AgentOrchestrator
async loadAgentsForOrchestration(orchestrationId) {
  const agentConfigs = this.getOrchestrationAgents(orchestrationId);
  const agents = new Map();

  for (const [name, config] of Object.entries(agentConfigs)) {
    const AgentClass = await this.loadAgentClass(config.class);
    const agent = new AgentClass(); // Use existing constructor
    await agent.loadSystemPrompt();
    agents.set(name, agent);
  }

  return agents;
}
```

## **Success Criteria**

### **Functional Requirements:**

- ✅ System starts with 0 agents loaded
- ✅ Selecting orchestration loads all its agents
- ✅ All existing functionality works (Hyatt demo)
- ✅ New orchestrations work correctly
- ✅ No OpenAI API errors
- ✅ Agent collaboration functions properly

### **Performance Requirements:**

- ✅ Startup time < 2 seconds
- ✅ Agent loading time < 5 seconds per orchestration
- ✅ Memory usage scales with active agents only
- ✅ Smooth orchestration switching

### **Scalability Requirements:**

- ✅ Supports 100+ agents across multiple orchestrations
- ✅ No performance degradation with more agents
- ✅ Easy to add new orchestrations and agents

## **Risk Mitigation**

### **High Risk:**

- **Breaking existing functionality**: Mitigate by testing each step
- **Agent loading failures**: Implement proper error handling
- **Memory leaks**: Monitor agent cleanup and caching

### **Medium Risk:**

- **Performance impact**: Profile agent loading times
- **Configuration errors**: Validate orchestration configs
- **Frontend integration**: Test orchestration switching

## **Rollback Plan**

If issues arise:

1. **Immediate**: Revert to last working commit
2. **Partial**: Disable on-demand loading, fall back to startup loading
3. **Gradual**: Implement feature flags for orchestration-by-orchestration rollout

## **Timeline**

- **Phase 1 (Fix)**: 1-2 hours
- **Phase 2 (Implement)**: 4-6 hours
- **Phase 3 (Test)**: 2-3 hours
- **Total**: 7-11 hours

## **Communication Plan**

- **Before each change**: Explain what I'm doing and why
- **After each change**: Test and report results
- **If issues arise**: Stop, diagnose, communicate before proceeding
- **No unrequested changes**: Only implement what's explicitly requested

---

**Next Steps**: Await user approval to proceed with Phase 1 (fixing the broken system).
