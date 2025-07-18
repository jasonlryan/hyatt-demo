# Hyatt GPT Campaign System - Setup Guide for Brito

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/jasonlryan/hyatt-demo.git
cd hyatt-demo
git checkout for_brito
```

### 2. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Add Your OpenAI API Key

1. Copy the example environment file:

   ```bash
   cp hyatt-gpt-prototype/env.example hyatt-gpt-prototype/.env
   ```

2. Edit the `.env` file and add your OpenAI API key:
   ```bash
   nano hyatt-gpt-prototype/.env
   ```
3. Replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

**Where to get your API key:**

- Go to https://platform.openai.com/api-keys
- Create a new secret key
- Copy and paste it into the `.env` file

### 4. Start the System

```bash
# Start both servers (backend + frontend)
./start-servers.sh
```

This will start:

- **Backend API**: http://localhost:3000
- **Frontend UI**: http://localhost:5173

### 5. Use the System

1. Open your browser to http://localhost:5173
2. Click "Create New Campaign"
3. Paste any campaign brief from `Use cases/briefs.md`
4. Watch the AI agents work through the campaign phases

## 📁 What's Included

- **15 Campaign Briefs**: Ready-to-use scenarios in `Use cases/briefs.md`
- **5 AI Agents**: Research, Strategic Insight, Trending News, Story Angles, PR Manager
- **React Frontend**: Modern UI for campaign management
- **Node.js Backend**: API server with campaign orchestration

## 🛠 Troubleshooting

**If servers won't start:**

```bash
# Kill any existing processes
pkill -f "node.*server.js"
pkill -f "vite"

# Try starting again
./start-servers.sh
```

**If you see "white screen" in frontend:**

- Check that both servers are running
- Make sure your OpenAI API key is set correctly
- Try refreshing the browser

**If campaigns aren't working:**

- Verify your OpenAI API key has credits
- Check the terminal for error messages
- Look for campaign files being created in `hyatt-gpt-prototype/campaigns/`

## 💡 Tips

- **Test with Brief #2**: The wellness resort campaign works well for demos
- **Watch the Terminal**: You'll see real-time AI agent conversations
- **Campaign Files**: Each campaign saves to `hyatt-gpt-prototype/campaigns/`
- **HITL Reviews**: Campaigns pause for human review between phases

That's it! The system should be working. Any issues, check the terminal output for error messages.
