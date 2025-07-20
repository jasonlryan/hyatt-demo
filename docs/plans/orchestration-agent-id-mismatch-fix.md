# Orchestration Agent ID Mismatch Fix

## **🎯 PROBLEM STATEMENT**

The Agents page does not display orchestration tags for most agents because there's a **critical ID mismatch** between the orchestration configuration and the agents configuration.

### **Root Cause**

- **OrchestrationManager** returns agent IDs that don't match the actual agent IDs in `agents.config.json`
- **Frontend** tries to match these IDs but fails, so no orchestration tags are displayed
- **Result**: Most agents appear as "unused" when they should show their orchestration tags

## **📊 CURRENT SITUATION**

### **API Response (What OrchestrationManager Returns)**

```json
{
  "orchestrators": {
    "hyatt": {
      "agents": [
        "research",
        "trending",
        "story",
        "pr_manager",
        "strategic_insight"
      ]
    },
    "hive": {
      "agents": ["visual", "modular", "trend", "qa", "brand_lens"]
    }
  }
}
```

### **Agents Config (What Actually Exists)**

```json
{
  "agents": {
    "research": { ... },
    "trending": { ... },
    "story": { ... },
    "pr-manager": { ... },        // ❌ Mismatch: pr_manager vs pr-manager
    "strategic": { ... },         // ❌ Mismatch: strategic_insight vs strategic
    "visual_prompt_generator": { ... },  // ❌ Mismatch: visual vs visual_prompt_generator
    "modular_elements_recommender": { ... }, // ❌ Mismatch: modular vs modular_elements_recommender
    "trend_cultural_analyzer": { ... },   // ❌ Mismatch: trend vs trend_cultural_analyzer
    "brand_qa": { ... },          // ❌ Mismatch: qa vs brand_qa
    "brand_lens": { ... }
  }
}
```

### **Frontend Logic (What Tries to Match)**

```typescript
const getAgentOrchestrations = (agentId: string): string[] => {
  if (!orchestrations) return [];

  const usedBy: string[] = [];
  Object.values(orchestrations.orchestrators).forEach((orchestration) => {
    if (orchestration.agents.includes(agentId)) {
      // ❌ This fails due to ID mismatch
      usedBy.push(orchestration.name);
    }
  });
  return usedBy;
};
```

## **🎯 BRIEF**

### **Objective**

Fix the agent ID mismatch so that orchestration tags display correctly on the Agents page.

### **Scope**

- Update OrchestrationManager to return correct agent IDs
- Ensure agent IDs match between orchestration configs and agents.config.json
- Verify orchestration tags appear on Agents page

### **Out of Scope**

- No architectural changes
- No new features
- No overengineering
- Just fix the ID mismatch

## **🔧 IMPLEMENTATION**

### **Step 1: Fix OrchestrationManager Agent IDs**

#### **File: `hive/orchestrations/OrchestrationManager.js`**

**Current (Lines ~95-105):**

```javascript
if (className === "HyattOrchestrator") {
  const hyattAgentIds = [
    "research",
    "trending",
    "story",
    "pr_manager",
    "strategic_insight",
  ];
  // ...
} else if (className === "HiveOrchestrator") {
  const hiveAgentIds = ["visual", "modular", "trend", "qa", "brand_lens"];
  // ...
}
```

**Fix to:**

```javascript
if (className === "HyattOrchestrator") {
  const hyattAgentIds = [
    "research",
    "trending",
    "story",
    "pr-manager",
    "strategic",
  ];
  // ...
} else if (className === "HiveOrchestrator") {
  const hiveAgentIds = [
    "visual_prompt_generator",
    "modular_elements_recommender",
    "trend_cultural_analyzer",
    "brand_qa",
    "brand_lens",
  ];
  // ...
}
```

### **Step 2: Fix HyattOrchestrator Agent References**

#### **File: `hive/orchestrations/classes/HyattOrchestrator.js`**

**Current (Lines ~35-45):**

```javascript
const agentMapping = {
  research: "researchAgent",
  trending: "trendingAgent",
  story: "storyAgent",
  pr_manager: "prManagerAgent", // ❌ Wrong
  strategic_insight: "strategicInsightAgent", // ❌ Wrong
};
```

**Fix to:**

```javascript
const agentMapping = {
  research: "researchAgent",
  trending: "trendingAgent",
  story: "storyAgent",
  "pr-manager": "prManagerAgent", // ✅ Fixed
  strategic: "strategicInsightAgent", // ✅ Fixed
};
```

### **Step 3: Restart Server**

```bash
# Stop current server
pkill -f "node server.js"

# Start server with updated code
npm run start:backend
```

### **Step 4: Verify Fix**

#### **Test API Response**

```bash
curl http://localhost:3000/api/orchestrations | jq '.orchestrators.hyatt.agents'
# Expected: ["research", "trending", "story", "pr-manager", "strategic"]

curl http://localhost:3000/api/orchestrations | jq '.orchestrators.hive.agents'
# Expected: ["visual_prompt_generator", "modular_elements_recommender", "trend_cultural_analyzer", "brand_qa", "brand_lens"]
```

#### **Test Frontend**

1. Open Agents page in browser
2. Verify orchestration tags appear for:
   - **Hyatt agents**: Research, Trending, Story, PR Manager, Strategic
   - **Hive agents**: Visual Prompt Generator, Modular Elements Recommender, Trend & Cultural Analyzer, Brand QA, Brand Lens

## **✅ SUCCESS CRITERIA**

1. **API returns correct agent IDs** that match agents.config.json
2. **Orchestration tags display** on Agents page for all agents that are part of orchestrations
3. **No "unused agents"** showing for agents that are actually used in orchestrations
4. **No breaking changes** to existing functionality

## **🚨 ROLLBACK PLAN**

If the fix breaks anything:

1. Revert OrchestrationManager.js changes
2. Revert HyattOrchestrator.js changes
3. Restart server
4. Verify original functionality still works

## **📝 IMPLEMENTATION ORDER**

1. **Fix OrchestrationManager.js** - Update agent ID arrays
2. **Fix HyattOrchestrator.js** - Update agent mapping
3. **Restart server** - Apply changes
4. **Test API** - Verify correct agent IDs returned
5. **Test frontend** - Verify orchestration tags appear

## **🎯 EXPECTED OUTCOME**

After this fix:

- **Research & Audience GPT** → "Hyatt Orchestrator" tag
- **Trending News GPT** → "Hyatt Orchestrator" tag
- **Story Angles & Headlines GPT** → "Hyatt Orchestrator" tag
- **PR Manager GPT** → "Hyatt Orchestrator" tag
- **Strategic Insight GPT** → "Hyatt Orchestrator" tag
- **Visual Prompt Generator** → "Hive Orchestrator" tag
- **Modular Elements Recommender** → "Hive Orchestrator" tag
- **Trend & Cultural Analyzer** → "Hive Orchestrator" tag
- **Brand QA Agent** → "Hive Orchestrator" tag
- **Brand Lens Agent** → "Hive Orchestrator" tag

**Simple fix. No overengineering. Just match the IDs correctly.**

## Implementation Notes

Agent IDs in OrchestrationManager and orchestration classes now match agents.config.json. Orchestration configs updated accordingly.
