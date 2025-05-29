# Setup Instructions - IMPORTANT!

## Why You're Seeing Repetitive Content

The system is currently using **MOCK DATA** instead of real web searches because:

1. **Missing API Keys**: The external data sources are not configured
2. **Feature Flag**: `ENABLE_REAL_DATA_SOURCES` is set to `false`

This causes:

- Same phrases appearing in every campaign ("Regenerative Luxury", "environmentally-conscious Millennials")
- No actual trending data or news
- Generic responses that feel hardcoded

## To Enable Real Web Searches

### 1. Create a `.env` file in the `hyatt-gpt-prototype` directory:

```bash
# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=your-openai-api-key-here

# External Data Sources (OPTIONAL but recommended for dynamic content)
ENABLE_REAL_DATA_SOURCES=true  # Set to true when you have API keys
GOOGLE_TRENDS_API_KEY=your-google-trends-api-key-here
NEWS_API_KEY=your-newsapi-org-key-here  # Get from https://newsapi.org
SOCIAL_MEDIA_API_KEY=your-twitter-api-key-here

# Model Configuration
PR_MANAGER_MODEL=gpt-4o-mini-2024-07-18
RESEARCH_MODEL=gpt-4o-2024-08-06
TRENDING_MODEL=gpt-4o-2024-08-06
STORY_MODEL=gpt-4o-2024-08-06
```

### 2. Get API Keys:

- **OpenAI**: https://platform.openai.com/api-keys (REQUIRED)
- **News API**: https://newsapi.org/register (FREE tier available)
- **Google Trends**: Complex setup, can skip initially
- **Twitter/X API**: https://developer.twitter.com (Optional)

### 3. What Happens Without External APIs:

When `ENABLE_REAL_DATA_SOURCES=false` or API keys are missing:

- Uses mock data with random percentages (60-100% interest)
- Returns generic article titles with placeholder keywords
- Generates fake social sentiment (50-80% positive)

### 4. Current Error Messages in Your Logs:

```
🔄 Social Media API failed, using mock data: Request failed with status code 401
🔄 News API failed, using mock data: Request failed with status code 401
🔄 Google Trends API failed, using mock data: Request failed with status code 404
```

These indicate missing or invalid API keys.

## To See Dynamic Content:

1. At minimum, set up your OpenAI API key
2. For trending data, add a News API key (free)
3. Set `ENABLE_REAL_DATA_SOURCES=true`
4. Restart the server

## Why The Integrated Plan Shows "No content available"

This has been fixed in the latest update. The frontend now properly extracts content from the nested strategy object structure.

## Testing Without External APIs

Even without external APIs, the system should show varied content IF you provide different campaign briefs. Try these:

1. "Launch campaign for new business hotel in Tokyo targeting corporate travelers"
2. "Promote wellness retreat in Arizona for stressed professionals"
3. "Announce luxury beach resort in Caribbean for honeymooners"

Each should generate different content based on the brief, even with mock data.

## Still Seeing Repetitive Content?

The issue is that the system analyzes the brief but extracts generic terms like:

- `campaignType: "product_launch"`
- `targetMarket: "general market"`
- `urgency: "medium"`

This causes all campaigns to look similar. The agents ARE receiving the full brief now (after our fixes), but they need more specific prompting to generate unique content.

## Next Steps

1. Add your OpenAI API key (minimum requirement)
2. Optionally add News API key for trending data
3. Provide detailed, specific campaign briefs
4. The system will generate more varied content
