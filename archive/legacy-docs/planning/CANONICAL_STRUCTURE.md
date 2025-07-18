# Canonical Project Structure

This document outlines the canonical structure established for the Hyatt GPT Agents System after consolidation and cleanup.

## 🎯 **Canonical Agents Location: `/agents/`**

The **single source of truth** for all agent-related files is now:

```
/agents/
├── agents.config.json          # ✅ CANONICAL: All agent configurations
├── classes/                    # ✅ CANONICAL: Agent implementations
│   ├── PRManagerAgent.js
│   ├── ResearchAudienceAgent.js
│   ├── TrendingNewsAgent.js
│   ├── StoryAnglesAgent.js
│   └── StrategicInsightAgent.js
├── prompts/                    # ✅ CANONICAL: System prompts
│   ├── pr_manager_gpt.md
│   ├── research_audience_gpt.md
│   ├── trending_news_gpt.md
│   ├── story_angles_headlines_gpt.md
│   └── strategic_insight_gpt.md
├── index.js                    # ✅ CANONICAL: Main exports
├── package.json
└── README.md
```

## 🧹 **Cleanup Performed**

### Removed Duplicate Directories:

- ❌ `/hyatt-gpt-prototype/agents/` (duplicate agent classes)
- ❌ `/hyatt-gpt-prototype/agents.config.json` (duplicate config)
- ❌ `/hyatt-gpt-prototype/GPTs/` (duplicate prompts)
- ❌ `/GPTs/` (duplicate prompts at root)

### Result:

- **Before**: 3 copies of prompts, 2 copies of agents, 2 copies of config
- **After**: 1 canonical location for everything

## 🔗 **Integration Points**

All systems now reference the canonical `/agents/` directory:

### Frontend (`/frontend/`)

- **AgentsPage**: Loads config from `/api/config/agents`
- **API calls**: Use endpoints that point to canonical structure

### Backend (`/hyatt-gpt-prototype/`)

- **server.js**: References `../agents/agents.config.json`
- **AgentOrchestrator.js**: Imports from `../agents/classes/`
- **API endpoints**: Serve from `../agents/prompts/`

### Agent Classes (`/agents/classes/`)

- **Configuration**: Load from `../agents.config.json`
- **Prompts**: Load from `../prompts/`
- **Exports**: Through `/agents/index.js`

## 📁 **Project Structure Overview**

```
/DEMO/
├── agents/                     # 🎯 CANONICAL: All agent resources
├── frontend/                   # React frontend application
├── hyatt-gpt-prototype/        # Backend server and orchestration
├── Plans/                      # Project planning documents
├── Use cases/                  # Use case documentation
├── Outputs/                    # Generated campaign outputs
└── [other project files]
```

## ✅ **Benefits of Canonical Structure**

1. **Single Source of Truth**: No more confusion about which files are current
2. **Easier Maintenance**: Changes only need to be made in one place
3. **Clear Dependencies**: All systems reference the same canonical location
4. **Better Version Control**: No more duplicate commits across multiple locations
5. **Simplified Deployment**: One directory to manage for all agent resources
6. **Reusability**: Other projects can easily import from `/agents/`

## 🔧 **Development Workflow**

### To modify agent behavior:

1. Edit agent class in `/agents/classes/`
2. Update prompts in `/agents/prompts/`
3. Adjust configuration in `/agents/agents.config.json`

### To add new agents:

1. Create class in `/agents/classes/`
2. Add prompt in `/agents/prompts/`
3. Update config in `/agents/agents.config.json`
4. Export in `/agents/index.js`

### To deploy changes:

- All agent resources are in `/agents/` - deploy this directory
- Backend references are relative paths - no changes needed
- Frontend uses API endpoints - no changes needed

## 🚀 **Next Steps**

1. **Test Integration**: Verify all systems work with canonical structure
2. **Update Documentation**: Ensure all docs reference canonical paths
3. **CI/CD Updates**: Update deployment scripts to use canonical structure
4. **Team Communication**: Inform team of new canonical structure

---

**Last Updated**: July 16, 2024  
**Status**: ✅ Implemented and Tested
