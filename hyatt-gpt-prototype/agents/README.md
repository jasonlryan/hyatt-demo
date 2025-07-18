# Consolidated Agents System

This directory contains all AI agents, their configurations, and system prompts in a unified structure.

## Directory Structure

```
/agents/
├── agents.config.json          # Main configuration file for all agents
├── classes/                    # Agent class implementations
│   ├── PRManagerAgent.js
│   ├── ResearchAudienceAgent.js
│   ├── TrendingNewsAgent.js
│   ├── StoryAnglesAgent.js
│   └── StrategicInsightAgent.js
├── prompts/                    # GPT system prompts
│   ├── pr_manager_gpt.md
│   ├── research_audience_gpt.md
│   ├── trending_news_gpt.md
│   ├── story_angles_headlines_gpt.md
│   └── strategic_insight_gpt.md
├── index.js                    # Main agents export
├── package.json
└── README.md
```

## Configuration

All agent settings are managed through `agents.config.json` which includes:

- **Individual agent configurations** (model, temperature, max tokens, timeouts, delays)
- **Available models** with recommendations and structured output support
- **Global system settings** (fallback values, feature flags)
- **Quality thresholds** for campaign validation
- **Data source configuration** (external APIs, mock data settings)

### Key Features

- **UI-Configurable**: All settings can be modified through the web interface
- **Environment Fallback**: Falls back to environment variables if config file is missing
- **Hot-Reloadable**: Changes take effect immediately without restart
- **Validation**: Built-in validation for model compatibility and parameter ranges

## Usage

### Importing Agents

```javascript
// Import all agents
const agents = require("./agents");
const { PRManagerAgent, ResearchAudienceAgent } = agents;

// Or import individual agents
const PRManagerAgent = require("./agents/classes/PRManagerAgent");
```

### Configuration Management

Agents automatically load their configuration from `agents.config.json` on initialization. The configuration includes:

```json
{
  "agents": {
    "research": {
      "id": "research",
      "name": "Research & Audience GPT",
      "enabled": true,
      "model": "gpt-4o-2024-08-06",
      "temperature": 0.2,
      "maxTokens": 2500,
      "timeout": 45000,
      "delay": 4000,
      "promptFile": "research_audience_gpt.md"
    }
  }
}
```

## Agent Classes

Each agent class follows a consistent pattern:

1. **Constructor**: Initializes OpenAI client and loads configuration
2. **loadConfiguration()**: Reads settings from agents.config.json with environment fallback
3. **loadSystemPrompt()**: Loads system prompt from prompts/ directory
4. **Agent-specific methods**: Implementation of agent functionality

## System Prompts

All system prompts are stored in the `prompts/` directory as Markdown files. These define:

- Agent personality and role
- Response format and structure
- Quality guidelines
- Interaction patterns

## Integration

The consolidated agents system integrates with:

- **Frontend UI**: Real-time configuration editing through `/agents` page
- **Backend API**: Configuration endpoints at `/api/config/agents`
- **Campaign System**: Used by AgentOrchestrator for campaign execution
- **Quality Control**: Integrated with quality thresholds and validation

## Migration from Environment Variables

The system maintains backward compatibility with environment variables:

- If `agents.config.json` is missing, agents fall back to environment variables
- Environment variables follow the pattern: `{AGENT}_MODEL`, `{AGENT}_TEMPERATURE`, etc.
- Gradual migration is supported - agents can be moved to config file individually

## Development

### Adding New Agents

1. Create agent class in `classes/` directory
2. Add system prompt to `prompts/` directory
3. Update `agents.config.json` with agent configuration
4. Export agent in `index.js`

### Modifying Configuration

- **UI Method**: Use the `/agents` page in the web interface
- **File Method**: Edit `agents.config.json` directly
- **API Method**: Use `PUT /api/config/agents` endpoint

### Testing

Agents can be tested individually:

```javascript
const agent = new ResearchAudienceAgent();
await agent.loadSystemPrompt();
// Test agent methods
```

## Benefits

- **Centralized Configuration**: All agent settings in one place
- **User-Friendly**: No need to edit environment files
- **Version Control**: Configuration changes are tracked
- **Validation**: Built-in validation prevents invalid configurations
- **Flexibility**: Easy to add new agents and modify existing ones
- **Maintainability**: Clear separation of concerns and consistent structure
