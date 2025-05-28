# Hyatt GPT Agent Prototype

A collaborative AI agent system for Hyatt Hotels PR campaign development using OpenAI's GPT-4 API.

## Features

- **Real OpenAI Integration**: Uses GPT-4 API with sophisticated system prompts from markdown files
- **Three Specialized Agents**: Research & Audience, Trending News, and Story Angles & Headlines
- **Conversational Workflow**: Agents collaborate in realistic conversation flow
- **Dynamic Campaign Analysis**: Intelligent brief analysis and contextual responses
- **Real-time Web Interface**: Beautiful UI with live conversation updates
- **Campaign Persistence**: Saves completed campaigns as JSON files

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Add your OpenAI API key to `.env`:

   ```
   OPENAI_API_KEY=your-actual-openai-api-key-here
   ```

3. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Start the Server

```bash
npm start
```

The system will be available at:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api/campaigns
- **Health Check**: http://localhost:3000/health

## How It Works

### Agent System Prompts

Each agent loads its sophisticated system prompt from markdown files in the `../GPTs/` directory:

- `research_audience_gpt.md` - Research & Audience GPT
- `trending_news_gpt.md` - Trending News GPT
- `story_angles_headlines_gpt.md` - Story Angles & Headlines GPT

### Conversational Flow

1. **PR Manager** introduces the campaign brief
2. **Research & Audience GPT** analyzes target demographics and motivations
3. **Trending News GPT** identifies current trends and media opportunities
4. **Story Angles GPT** develops strategic narratives and headlines
5. **Collaborative Phase** - All agents work together on final strategy
6. **PR Manager** concludes with integrated campaign plan

### Real OpenAI Integration

- Each agent makes real GPT-4 API calls using their system prompts
- Fallback responses if API is unavailable
- Temperature settings optimized per agent (Research: 0.2, Trending: 0.3, Story: 0.4)
- 200 token limit for conversation responses

## API Endpoints

- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/:id` - Get campaign status
- `GET /api/campaigns` - List all campaigns
- `GET /health` - System health check

## Campaign Brief Format

```
Campaign Brief: [Campaign Name]
Property Overview: [Description]
Target Market: [Demographics]
Key Objectives: [Goals]
Timeline: [Launch timing]
Special Considerations: [Any specific requirements]
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## File Structure

```
hyatt-gpt-prototype/
├── agents/
│   ├── ResearchAudienceAgent.js
│   ├── TrendingNewsAgent.js
│   └── StoryAnglesAgent.js
├── campaigns/           # Saved campaign files
├── public/
│   └── index.html      # Web interface
├── AgentOrchestrator.js # Main orchestration logic
├── server.js           # Express server
└── package.json
```

## Notes

- Requires valid OpenAI API key for full functionality
- Campaign data is saved locally in `campaigns/` directory
- System prompts are loaded from `../GPTs/` markdown files
- Fallback responses available if OpenAI API is unavailable
