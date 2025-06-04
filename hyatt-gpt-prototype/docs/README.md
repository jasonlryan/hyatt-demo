# Hyatt GPT Prototype - Dynamic AI Agent System

A sophisticated multi-agent PR campaign system that leverages OpenAI's Responses API for structured outputs and dynamic workflow control.

## 🚀 New Features (v2.0)

### ✅ **True Dynamic Flow Control**

- **Quality-based decisions**: Agents validate their own outputs and determine next steps
- **Alternative strategies**: System adapts when trends are weak or data quality is poor
- **Retry mechanisms**: Failed phases can be retried with improved prompts
- **Flow tracking**: All decisions are logged with reasoning

### ✅ **Real Data Source Integration**

- **Google Trends API**: Live trending topic analysis
- **News API**: Recent industry news and sentiment
- **Social Media APIs**: Real-time social sentiment analysis
- **Data quality tracking**: System knows when using real vs AI-generated data

### ✅ **Enhanced Agent Interaction**

- **Cross-agent collaboration**: Agents respond to each other's findings
- **Data synthesis validation**: System checks alignment between phases
- **Collaborative refinement**: Agents improve their analysis based on others' work
- **Quality scoring**: Each phase gets confidence scores

### ✅ **Adaptive Campaign Types**

- **Campaign analysis**: System determines campaign type, complexity, and risk level
- **Dynamic prompts**: Agents adapt their approach based on campaign characteristics
- **Urgency handling**: Different flows for urgent vs standard campaigns
- **Industry specialization**: Agents adjust expertise based on target industry

### ✅ **Quality Control System**

- **Data validation**: Comprehensive checks for each phase output
- **Synthesis analysis**: Validates coherence between research, trends, and story
- **Quality reports**: Overall campaign quality assessment
- **Threshold management**: Configurable quality thresholds for flow control

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ DataSourceManager│    │ QualityController│    │ AgentOrchestrator│
│                 │    │                  │    │                 │
│ • Google Trends │    │ • Data Validation│    │ • Dynamic Flow  │
│ • News APIs     │◄───┤ • Quality Scoring│◄───┤ • Agent Coord   │
│ • Social Media  │    │ • Flow Decisions │    │ • Campaign Mgmt │
│ • Mock Data     │    │ • Synthesis Check│    │ • Quality Track │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI AGENTS (OpenAI Responses API)             │
├─────────────────┬─────────────────┬─────────────────┬───────────┤
│ ResearchAgent   │ TrendingAgent   │ StoryAgent      │ PRManager │
│ • Audience Data │ • Trend Analysis│ • Story Angles  │ • Campaign│
│ • Demographics  │ • Cultural Moments│ • Headlines   │   Coord   │
│ • Key Drivers   │ • Media Opps    │ • Key Messages  │ • Handoffs│
│ • External Data │ • Real Trends   │ • Angle Strength│ • Summary │
└─────────────────┴─────────────────┴─────────────────┴───────────┘
```

## ⚙️ Configuration

### Environment Variables

```bash
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-2024-08-06
OPENAI_MAX_TOKENS=2000

# Agent-Specific Configuration (Updated for Structured Outputs)
RESEARCH_MODEL=gpt-4o-2024-08-06
RESEARCH_MAX_TOKENS=2500
TRENDING_MODEL=gpt-4o-2024-08-06
TRENDING_MAX_TOKENS=3000
STORY_MODEL=gpt-4o-2024-08-06
STORY_MAX_TOKENS=3500
PR_MANAGER_MODEL=gpt-4o-mini-2024-07-18
PR_MANAGER_MAX_TOKENS=2000

# 🆕 DYNAMIC FEATURES
ENABLE_DYNAMIC_FLOW=true
ENABLE_QUALITY_CONTROL=true
ENABLE_AGENT_INTERACTION=true
ENABLE_REAL_DATA_SOURCES=false
ENABLE_MANUAL_REVIEW=false

# 🆕 QUALITY THRESHOLDS
MIN_TREND_RELEVANCE=60
MIN_AUDIENCE_CONFIDENCE=70
MIN_STORY_ANGLE_STRENGTH=65
SKIP_WEAK_TRENDS_THRESHOLD=50
ALTERNATIVE_STRATEGY_TRIGGER=40
REQUIRE_DATA_VALIDATION=true

# 🆕 EXTERNAL DATA APIS (Optional)
GOOGLE_TRENDS_API_KEY=your-google-trends-key
NEWS_API_KEY=your-news-api-key
SOCIAL_MEDIA_API_KEY=your-social-api-key

# 🆕 CAMPAIGN ANALYSIS
AUTO_DETECT_CAMPAIGN_TYPE=true
ADAPTIVE_AGENT_BEHAVIOR=true
DYNAMIC_PROMPT_ADJUSTMENT=true
```

### Quick Start

1. **Clone and Install**

```bash
git clone <repository>
cd hyatt-gpt-prototype
npm install
```

2. **Configure Environment**

```bash
cp env.example .env
# Edit .env with your OpenAI API key and preferences
```

3. **Start the Server**

```bash
npm start
```

4. **Access the Interface**

```
http://localhost:3000
```

## 🎯 Usage Examples

### Basic Campaign (AI-Generated Data)

```bash
# Set in .env
ENABLE_REAL_DATA_SOURCES=false
ENABLE_DYNAMIC_FLOW=true
ENABLE_QUALITY_CONTROL=true
```

### Advanced Campaign (Real Data Sources)

```bash
# Set in .env
ENABLE_REAL_DATA_SOURCES=true
GOOGLE_TRENDS_API_KEY=your-key
NEWS_API_KEY=your-key
ENABLE_DYNAMIC_FLOW=true
ENABLE_QUALITY_CONTROL=true
ENABLE_AGENT_INTERACTION=true
```

### High-Quality Campaign (Strict Validation)

```bash
# Set in .env
MIN_AUDIENCE_CONFIDENCE=85
MIN_TREND_RELEVANCE=75
MIN_STORY_ANGLE_STRENGTH=80
REQUIRE_DATA_VALIDATION=true
```

### HITL Manual Review

```bash
ENABLE_MANUAL_REVIEW=true
```

When manual review is enabled the orchestrator pauses after each phase.
The web UI shows a banner describing which phase is awaiting approval.
Click **Resume** to continue with the next phase or **Refine** to restart the
campaign with updated instructions. After the collaborative phase the system
awaits **Final Sign-Off**. Choose **Finalize** to mark the campaign complete.

## 🔄 Dynamic Flow Examples

### Standard Flow

```
Research → Trending → Story → Collaborative → Final Sign-Off → Complete
```

### Alternative Flow (Weak Trends)

```
Research → Trending (weak) → Story (alternative strategy) → Collaborative → Complete
```

### Quality Control Flow

```
Research → Quality Check → Trending → Quality Check → Story → Synthesis Validation → Complete
```

### Retry Flow

```
Research → Quality Check (fail) → Research Retry → Trending → Story → Complete
```

## 📊 Quality Metrics

The system tracks multiple quality dimensions:

- **Data Integrity**: Structural completeness of agent outputs
- **Confidence Scores**: AI confidence in analysis quality
- **Synthesis Alignment**: How well phases work together
- **External Data Quality**: Real vs mock data usage
- **Flow Decisions**: Why certain paths were taken

## 🛠️ API Endpoints

### Campaign Management

- `POST /api/campaigns` - Start new campaign
- `GET /api/campaigns/:id` - Get campaign status
- `GET /api/campaigns` - List all campaigns

### Quality Control

- `GET /api/campaigns/:id/quality` - Get quality report
- `GET /api/campaigns/:id/flow` - Get flow decisions

### Data Sources

- `GET /api/data-sources/status` - Check external API status
- `POST /api/data-sources/test` - Test data source connections

## 🔧 Development

### Adding New Data Sources

1. **Extend DataSourceManager**

```javascript
// In utils/DataSourceManager.js
async getNewDataSource(keywords) {
  // Implementation
}
```

2. **Update Quality Controller**

```javascript
// In utils/QualityController.js
validateNewDataType(data) {
  // Validation logic
}
```

3. **Configure Environment**

```bash
NEW_DATA_SOURCE_API_KEY=your-key
```

### Custom Quality Thresholds

```javascript
// In utils/QualityController.js
constructor() {
  this.customThreshold = parseInt(process.env.CUSTOM_THRESHOLD) || 50;
}
```

## 📈 Performance

### Optimization Features

- **Parallel API calls**: Multiple data sources fetched simultaneously
- **Intelligent caching**: Reduces redundant API calls
- **Adaptive timeouts**: Longer timeouts for complex analysis
- **Background processing**: Non-blocking workflow execution

### Monitoring

- **Quality tracking**: Real-time quality metrics
- **Performance logging**: API response times and success rates
- **Error handling**: Graceful degradation when external APIs fail
- **Data source fallbacks**: AI-generated data when real sources unavailable

## 🚨 Error Handling

The system includes comprehensive error handling:

- **API failures**: Graceful fallback to AI-generated data
- **Quality failures**: Automatic retry mechanisms
- **Timeout handling**: Configurable timeouts for all operations
- **Data validation**: Structural validation of all outputs
- **Flow recovery**: System continues even if individual phases fail

## 📝 Logging

Comprehensive logging system tracks:

- **Agent activities**: All agent actions and decisions
- **Quality metrics**: Confidence scores and validation results
- **Flow decisions**: Why certain paths were taken
- **Data sources**: Which APIs were used and their quality
- **Performance**: Response times and success rates

## 🔐 Security

- **API key management**: Secure environment variable handling
- **Input validation**: All user inputs are validated
- **Rate limiting**: Prevents API abuse
- **Error sanitization**: No sensitive data in error messages

## 📚 Documentation

- **Agent System Prompts**: Located in `GPTs/` directory
- **API Documentation**: Available at `/api/docs` when server is running
- **Quality Metrics**: Detailed explanations in `utils/QualityController.js`
- **Flow Logic**: Documented in `AgentOrchestrator.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Update documentation
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with OpenAI Responses API for guaranteed structured outputs and dynamic workflow control.**
