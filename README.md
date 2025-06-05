# Hyatt GPT Demo

This repository contains a prototype multi‑agent system for generating PR campaigns.

## Prerequisites

- **Node.js** >=20 (tested with v20.19.2)
- **npm** >=9 (tested with v11.4.1)

Install dependencies in both `hyatt-gpt-prototype` and `frontend`:

```bash
npm install --prefix hyatt-gpt-prototype
npm install --prefix frontend
```

## Backend

1. Copy `hyatt-gpt-prototype/env.example` to `hyatt-gpt-prototype/.env` and fill in your keys. The server loads all variables from this file via `dotenv`.
2. Start the API server:

```bash
cd hyatt-gpt-prototype
npm start    # runs server.js on port 3000
```

## Frontend

Run the React/Vite frontend which proxies API requests to the backend:

```bash
cd frontend
npm run dev
```

Vite serves the app on <http://localhost:5173> and proxies `/api` to `http://localhost:3000`.

## Combined Development

From the repository root you can start both services at once:

```bash
npm run dev
```

## Basic Usage

1. Open the frontend in your browser.
2. Enter a campaign brief and click **Create Campaign** to start a new campaign.
3. The **Progress** panel displays agent messages as the campaign progresses.
4. Deliverables produced by each agent appear in the **Deliverables** panel. Click **View** to read them.
5. Once all phases finish you can access the final integrated campaign plan in the deliverables list.

Environment settings such as API keys, flow control flags and quality thresholds are read from `.env` in `hyatt-gpt-prototype`.
