# System Architecture Overview

## Overview

The Hyatt GPT Agent System is a comprehensive AI-powered orchestration platform designed for PR campaign management and content creation. The system combines a React frontend with a Node.js backend orchestration engine.

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  API Endpoints  │    │ Orchestration   │
│   (Port 5173)   │◄──►│   (Pages API)   │◄──►│   Engine        │
│                 │    │                 │    │  (Port 3001)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Shared        │    │   OpenAI API    │    │   Agent Library │
│   Components    │    │   (External)    │    │   (9 Agents)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Core Components

### 1. Frontend Application (React + TypeScript)

**Location**: `frontend/`
**Port**: 5173 (development)

**Key Features**:

- **Orchestration Pages**: Individual orchestration interfaces
- **Shared Components**: Reusable UI components library
- **Orchestration Builder**: AI-powered orchestration generator
- **Real-time Updates**: Polling-based status updates
- **Human-in-the-Loop**: Manual review and refinement

**Technology Stack**:

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Vitest for testing

### 2. API Layer (Pages API)

**Location**: `pages/api/`
**Framework**: Next.js API routes

**Endpoints**:

- `/api/orchestrations` - Orchestration management
- `/api/generate-orchestration` - AI orchestration generation
- `/api/save-orchestration` - Orchestration persistence
- `/api/save-css` - Style management

### 3. Orchestration Engine (Node.js)

**Location**: `hyatt-gpt-prototype/`
**Port**: 3001

**Core Features**:

- **Agent Management**: 9 specialized AI agents
- **Workflow Engine**: Sequential and parallel execution
- **Campaign Management**: End-to-end campaign lifecycle
- **Human-in-the-Loop**: Manual review integration

**Technology Stack**:

- Node.js with Express
- OpenAI API integration
- File-based data storage
- Nodemon for development

## 🤖 Agent System

### Agent Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Agent Config  │    │   Agent Classes │    │   Prompt Files  │
│   (JSON)        │◄──►│   (JavaScript)  │◄──►│   (Markdown)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Available Agents

1. **Research & Audience GPT** - Demographic analysis
2. **Trending News GPT** - Trend identification
3. **Story Angles & Headlines GPT** - Content creation
4. **Strategic Insight GPT** - Strategic recommendations
5. **PR Manager GPT** - Campaign coordination
6. **Visual Prompt Generator** - Visual creative prompts
7. **Modular Elements Recommender** - Visual components
8. **Trend & Cultural Analyzer** - Cultural analysis
9. **Brand QA Agent** - Quality assurance

### Agent Configuration

Each agent is configured with:

- **Model**: OpenAI model selection
- **Temperature**: Creativity vs. consistency
- **Max Tokens**: Response length limits
- **Timeout**: Response time limits
- **Role**: Specific function in workflows

## 🔄 Workflow System

### Workflow Types

1. **Sequential Workflows** (Hyatt Style)

   ```
   research → trending → strategic → story → pr-manager
   ```

2. **Parallel Workflows** (Hive Style)

   ```
   research + trending → strategic + story → pr-manager
   ```

3. **Creative Workflows**
   ```
   research → visual_prompt_generator → modular_elements_recommender → brand_qa
   ```

### Workflow Engine Features

- **Phase-based Execution**: Step-by-step workflow progression
- **Error Handling**: Graceful failure recovery
- **Timeout Management**: Configurable time limits
- **Retry Logic**: Automatic retry on failures
- **Status Tracking**: Real-time progress updates

## 📊 Data Flow

### Campaign Creation Flow

```
1. User Input (Brief) → Frontend Form
2. Frontend → API → Orchestration Engine
3. Orchestration Engine → Agent Selection
4. Agents → OpenAI API → Responses
5. Responses → Workflow Processing
6. Results → Frontend → User Interface
```

### Real-time Updates

```
1. Frontend Polling → API Status Check
2. API → Orchestration Engine → Current State
3. State Changes → Frontend → UI Updates
4. Human Review → Manual Actions → Workflow Continuation
```

## 🎨 Frontend Architecture

### Component Hierarchy

```
App
├── GlobalNav
├── OrchestrationsPage
└── Orchestration Pages
    ├── HyattStyleOrchestrationTemplate
    ├── SharedOrchestrationLayout
    │   ├── SidePanel (Transcript)
    │   ├── Main Content
    │   └── Deliverables Panel
    └── Shared Components
        ├── SharedCampaignForm
        ├── SharedProgressPanel
        ├── SharedDeliverablePanel
        └── SharedModal
```

### State Management

- **Local State**: React hooks for component state
- **API State**: Polling-based status updates
- **Shared State**: Context for global application state
- **Persistence**: File-based storage for campaigns

## 🔧 Configuration Management

### Environment Variables

```env
# OpenAI Configuration
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o-2024-08-06

# Server Configuration
PORT=3001
NODE_ENV=development

# Feature Flags
ENABLE_HITL=true
ENABLE_LOGGING=true
```

### Configuration Files

- **Agent Config**: `hyatt-gpt-prototype/agents/agents.config.json`
- **Orchestration Config**: `hyatt-gpt-prototype/orchestrations/configs/orchestrations.config.json`
- **Frontend Config**: `frontend/vite.config.ts`, `frontend/tailwind.config.js`

## 🔒 Security Considerations

### API Security

- **Input Validation**: All user inputs validated
- **Rate Limiting**: API request throttling
- **Error Handling**: Secure error responses
- **CORS Configuration**: Cross-origin request handling

### Data Security

- **Environment Variables**: Sensitive data in .env files
- **File Permissions**: Secure file system access
- **API Key Management**: Secure OpenAI key handling

## 📈 Scalability

### Current Architecture Benefits

- **Modular Design**: Easy to add new agents and orchestrations
- **Component Reusability**: Shared components reduce duplication
- **API-First Design**: Clear separation of concerns
- **File-based Storage**: Simple and reliable

### Future Scalability Options

- **Database Integration**: Replace file storage with database
- **Microservices**: Split into smaller, focused services
- **Caching Layer**: Add Redis for performance
- **Load Balancing**: Multiple orchestration engine instances

## 🔄 Development Workflow

### Code Organization

```
DEMO/
├── frontend/               # React frontend
├── hyatt-gpt-prototype/    # Backend orchestration
├── pages/                  # API endpoints
├── docs/                   # Documentation
└── Use cases/              # Test briefs
```

### Development Process

1. **Feature Development**: Add new orchestrations or agents
2. **Testing**: Use test briefs from Use cases/
3. **Documentation**: Update relevant documentation
4. **Deployment**: Build and deploy changes

## 📚 Related Documentation

- **[Setup Guide](./setup.md)** - Installation and configuration
- **[Orchestration Developer Guide](../orchestrations/ORCHESTRATION_DEVELOPER_GUIDE.md)** - Creating new orchestrations
- **[Agent Mapping](../orchestrations/AgentMapping.md)** - Detailed agent capabilities
- **[Frontend Style Guide](../frontend/STYLE_TOKENS_REFERENCE.md)** - UI development

---

_Last updated: 2024-07-XX_
_Version: 1.0.0_
