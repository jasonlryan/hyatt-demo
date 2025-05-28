# How to Enable REAL Web Searches

## Current State: 100% Mock Data

The agents are currently using **MOCK DATA ONLY** - no real web searches are happening.

## Evidence from Logs:

```
🔄 Social Media API failed, using mock data: Request failed with status code 401
🔄 News API failed, using mock data: Request failed with status code 401
🔄 Google Trends API failed, using mock data: Request failed with status code 404
```

## Why This Happens:

1. **Missing API Keys**: External data sources need valid API keys
2. **Feature Disabled**: `ENABLE_REAL_DATA_SOURCES=false` (default)
3. **Mock Fallback**: System falls back to hardcoded mock data

## To Enable Real Web Searches:

### 1. Set Environment Variables in `.env`:

```bash
# Enable real data sources
ENABLE_REAL_DATA_SOURCES=true

# API Keys for real web searches
GOOGLE_TRENDS_API_KEY=your-google-trends-api-key
NEWS_API_KEY=your-news-api-key-from-newsapi.org
SOCIAL_MEDIA_API_KEY=your-twitter-bearer-token
```

### 2. Get Required API Keys:

**News API** (newsapi.org):

- Sign up at https://newsapi.org/
- Get free API key (500 requests/day)
- Add to `NEWS_API_KEY`

**Google Trends API**:

- Enable Google Trends API in Google Cloud Console
- Create API key with Trends API access
- Add to `GOOGLE_TRENDS_API_KEY`

**Twitter API** (for social sentiment):

- Apply for Twitter Developer account
- Get Bearer Token from Twitter API v2
- Add to `SOCIAL_MEDIA_API_KEY`

### 3. Restart the Server:

```bash
npm start
```

## What Changes With Real Data:

- **Dynamic trending topics** instead of mock data
- **Real news articles** related to campaign keywords
- **Actual social media sentiment** analysis
- **Unique responses** for each campaign
- **Current events** incorporated into strategies

## Current Mock Data Patterns:

The system generates the same mock patterns:

- Random interest scores (60-100)
- Generic article titles
- Fake sentiment percentages
- Same hashtags and trends

This is why every campaign feels repetitive and hardcoded!
