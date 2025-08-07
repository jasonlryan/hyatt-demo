# Hive System Setup Guide

## Overview

This guide covers the setup and installation of the Hive System, a dynamic orchestration platform featuring configuration-driven workflows and orchestration-aware agents. Includes both the React frontend and the Node.js backend orchestration engine.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **OpenAI API Key** for AI agent functionality

## 🚀 Quick Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd DEMO

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../hive
npm install
```

### 2. Environment Configuration

Create environment files for the backend:

```bash
# Copy example environment file
cp hive/env.example hive/.env

# Edit the environment file with your settings
nano hive/.env
```

Required environment variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-2024-08-06
PORT=3001
NODE_ENV=development
```

### 3. Start the System

#### Option A: Use the provided startup script

```bash
# From the root directory
./start-servers.sh
```

#### Option B: Start manually

```bash
# Terminal 1: Start backend
cd hive
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## 📁 Directory Structure

```
DEMO/
├── frontend/               # React frontend (port 5173)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── hive/    # Backend orchestration (port 3001)
│   ├── agents/
│   ├── orchestrations/
│   ├── server.js
│   └── package.json
├── pages/                  # API endpoints
├── docs/                   # Documentation
└── Use cases/              # Test briefs
```

## 🔧 Configuration

### Frontend Configuration

The frontend uses Vite for development. Key configuration files:

- `frontend/vite.config.ts` - Vite configuration
- `frontend/tailwind.config.js` - Tailwind CSS configuration
- `frontend/tsconfig.json` - TypeScript configuration

### Backend Configuration

The backend orchestration system configuration:

- **Primary Config**: `hive/orchestrations/orchestrations.config.json` - Single source of truth for all orchestrations, agents, and UI terminology
- **Legacy Config**: `hive/agents/agents.config.json` - Legacy agent definitions (being phased out)

#### Configuration-Driven Architecture

The system is now 95% configuration-driven, meaning:
- New orchestrations can be added by editing `orchestrations.config.json`
- Agent mappings are dynamic and orchestration-specific
- UI terminology automatically adapts based on orchestration type
- No code changes required for new workflow types

## 🧪 Testing the Setup

### 1. Verify Frontend

- Open `http://localhost:5173` in your browser
- You should see the orchestration selection page
- Navigate to "Orchestration Builder" to test the system

### 2. Verify Backend

- Check `http://localhost:3001/health` (if available)
- Test API endpoints in the frontend

### 3. Test Dynamic Orchestrations

#### Test Hyatt Orchestration (Campaign)
- Navigate to "Hyatt Orchestrator" 
- Create a new Campaign with sample brief
- Verify workflow: PR Manager → Research → Trending → Story

#### Test Hive Orchestration (Spark)
- Navigate to "Hive Orchestrator"
- Create a new Spark with cultural moment brief  
- Verify workflow: PR Manager → Trending → Strategic → Story → Brand Lens → Visual → Brand QA

#### Test Configuration System
- Check that UI displays "Campaign" for Hyatt and "Spark" for Hive
- Verify agent handoffs work correctly in both orchestrations

## 🚨 Troubleshooting

### Common Issues

#### Frontend Won't Start

```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Backend API Errors

```bash
# Check environment variables
cd hive
cat .env

# Verify OpenAI API key is valid
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### Port Conflicts

```bash
# Check what's using the ports
lsof -i :5173  # Frontend port
lsof -i :3001  # Backend port
```

### Logs and Debugging

#### Frontend Logs

```bash
cd frontend
npm run dev -- --debug
```

#### Backend Logs

```bash
cd hive
DEBUG=* npm start
```

## 🔄 Development Workflow

### Making Changes

1. **Frontend Changes**

   ```bash
   cd frontend
   npm run dev  # Hot reload enabled
   ```

2. **Backend Changes**

   ```bash
   cd hive
   npm run dev  # Uses nodemon for auto-restart
   ```

3. **API Changes**
   - Edit files in `pages/api/`
   - Changes are reflected immediately in development

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
```

## 📚 Next Steps

After setup, explore:

1. **[Architecture Overview](./architecture.md)** - Understand the dynamic system architecture
2. **[Configuration Guide](./single-source-of-truth.md)** - Learn about the unified configuration system
3. **[Test Briefs](../../Use cases/briefs.md)** - Test both orchestration types
4. **[Plans Archive](../../archive/completed-plans/)** - Review implementation achievements

### Understanding the System

- **Dynamic Configuration**: Review `hive/orchestrations/orchestrations.config.json` to see how orchestrations are defined
- **BaseAgent Architecture**: Check `hive/agents/classes/BaseAgent.js` for the orchestration-aware foundation
- **Orchestration Service**: See `frontend/src/services/orchestrationService.ts` for frontend integration

## 🆘 Getting Help

- Check the [main documentation](../README.md) for comprehensive guides
- Review [troubleshooting section](#-troubleshooting) for common issues
- Check the [archive](../../archive/) for legacy setup information

---

_Last updated: 2025-01-08_  
_Version: 2.0.0 - Dynamic Orchestration System_  
_System Status: 95% Configuration-Driven, Production-Ready_
