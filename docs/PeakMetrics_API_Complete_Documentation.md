# PeakMetrics API Complete Documentation

## 🎯 **Overview**

This document provides a comprehensive overview of the PeakMetrics API capabilities, including both the **data retrieval API** and the **native alerting system** that we discovered.

## 📊 **API Services**

PeakMetrics operates **two separate API services**:

### 1. **Data API** (`api.peakmetrics.com`)

- **Purpose**: Data retrieval and analysis
- **Endpoints**: Workspaces, narratives, mentions
- **Authentication**: JWT Bearer token

### 2. **Alerting API** (`flux.peakm.com`)

- **Purpose**: Real-time alerting and notifications
- **Endpoints**: Alert creation and management
- **Authentication**: Same JWT Bearer token
- **Discovery**: Found through investigation (not in original docs)

## 🔐 **Authentication**

```bash
POST https://api.peakmetrics.com/access/token
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password",
  "client_id": "your_client_id"
}
```

**Response:**

```json
{
  "Token": "jwt_token_here",
  "ExpiresIn": 3600
}
```

## 📡 **Data API Endpoints**

### **Workspaces**

```bash
GET https://api.peakmetrics.com/workspaces
Authorization: Bearer {token}
```

**Response:**

```json
[
  {
    "id": 85779,
    "title": "BMW",
    "query": "BMW",
    "channels": ["news", "twitter", "reddit"],
    "narrativeDetection": {
      "status": "active"
    },
    "created": "2024-01-01T00:00:00Z",
    "modified": "2024-01-01T00:00:00Z"
  }
]
```

### **Narratives**

```bash
GET https://api.peakmetrics.com/workspaces/{workspaceId}/narratives
Authorization: Bearer {token}
```

**Parameters:**

- `limit` (1-1000, default: 1000)
- `offset` (default: 0)
- `sort` (relevancy, mentionCount, avgSentiment, created, favorite)
- `since` (required, ISO date)
- `to` (required, ISO date)
- `channels` (array of channel names)

### **Mentions**

```bash
GET https://api.peakmetrics.com/workspaces/{workspaceId}/mentions
Authorization: Bearer {token}
```

**Parameters:**

- `limit` (1-50, default: 10)
- `offset` (default: 0)
- `sort` (created, published, confidence)
- `order` (asc, desc)
- `since` (required, ISO date)
- `to` (required, ISO date)
- `narratives.id` (array of narrative IDs)
- `channels` (array of channel names)
- `filter_expression` (Elasticsearch query)

## 🚨 **Alerting API Endpoints**

### **Create Alert**

```bash
POST https://flux.peakm.com/alerts/alert
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Velocity Spike Alert - BMW",
  "whenThis": {
    "value": null,
    "text": "velocity > 50",
    "parts": {
      "always": ["workspace:85779"],
      "sometimes": [],
      "never": []
    }
  },
  "happens": {
    "text": "News, Twitter, Reddit",
    "value": {
      "tags": [
        { "tag": "news", "id": 1, "friendly": "News" },
        { "tag": "twitter", "id": 2, "friendly": "Twitter V2" },
        { "tag": "reddit", "id": 3, "friendly": "Reddit" }
      ],
      "sources": []
    }
  },
  "that": [
    {
      "text": "send me an email",
      "value": 2
    }
  ],
  "frequency": {
    "value": 60,
    "text": "every 60 minutes"
  },
  "tags": [],
  "search": "workspaces"
}
```

### **List Alerts**

```bash
GET https://flux.peakm.com/alerts/alert/{username}
Authorization: Bearer {token}
```

### **Get Specific Alert**

```bash
GET https://flux.peakm.com/alerts/alert/{username}/{alertId}
Authorization: Bearer {token}
```

### **Delete Alert**

```bash
DELETE https://flux.peakm.com/alerts/alert
Authorization: Bearer {token}
```

## 🎯 **Alert Types**

### **1. Velocity Alerts**

```json
{
  "whenThis": {
    "text": "velocity > 50"
  }
}
```

### **2. Sentiment Alerts**

```json
{
  "whenThis": {
    "text": "sentiment negative"
  }
}
```

### **3. Mention Volume Alerts**

```json
{
  "whenThis": {
    "text": "mentions >= 10"
  }
}
```

### **4. Keyword Alerts**

```json
{
  "whenThis": {
    "text": "crisis OR scandal OR recall",
    "parts": {
      "sometimes": ["crisis", "scandal", "recall"]
    }
  }
}
```

## 📧 **Alert Actions**

| Action | Value | Description                     |
| ------ | ----- | ------------------------------- |
| Email  | 2     | Send email notification         |
| Slack  | 3     | Send Slack notification         |
| Track  | 5     | Just track without notification |

## 📊 **Available Sources**

- `news` - News articles
- `twitter` - Twitter posts
- `reddit` - Reddit posts
- `instagram` - Instagram posts
- `facebook` - Facebook posts
- `youtube` - YouTube videos
- `telegram` - Telegram messages
- `blogsdiscussions` - Blog posts and discussions
- `bluesky` - Bluesky posts
- `threads` - Threads posts
- `tiktok` - TikTok videos
- `vk` - VK posts
- `weibo` - Weibo posts

## 🔍 **Query Language**

PeakMetrics uses **Elasticsearch query syntax** for complex filtering:

### **Basic Queries**

```
velocity > 50
sentiment negative
mentions >= 10
```

### **Keyword Queries**

```
crisis OR scandal OR recall
(title:BMW OR text:BMW) AND sentiment:negative
```

### **Complex Queries**

```
(velocity > 100) AND (sentiment < -20) AND (mentions >= 20)
```

## 📈 **Data Fields**

### **Workspace Fields**

- `id` - Unique identifier
- `title` - Workspace name
- `query` - Search query
- `channels` - Available channels
- `narrativeDetection` - Narrative detection status

### **Narrative Fields**

- `id` - Unique identifier
- `title` - AI-generated title
- `isFavorite` - Favorited status
- `aggregations.mentionCount` - Number of mentions
- `aggregations.avgSentiment` - Average sentiment (-100 to 100)
- `aggregations.relevancyScore` - Relevancy score (0-100)
- `created` - Creation timestamp
- `summary` - Narrative summary
- `tags` - User-assigned tags

### **Mention Fields**

- `id` - Unique identifier
- `title` - Mention title
- `text` - Mention text
- `url` - Original URL
- `domain` - Source domain
- `author` - Content author
- `channels` - Source channels
- `media` - Media attachments
- `language` - Content language (ISO 639-1)
- `enrichments.sentiment.polarity` - Sentiment score (-100 to 100)
- `enrichments.narratives` - Associated narratives
- `created` - Creation timestamp
- `processed` - Processing timestamp
- `published` - Publication timestamp

## 🚀 **Implementation Examples**

### **JavaScript/Node.js**

```javascript
const axios = require("axios");

class PeakMetricsClient {
  constructor() {
    this.baseURL = "https://api.peakmetrics.com";
    this.alertingURL = "https://flux.peakm.com";
    this.token = null;
  }

  async authenticate(username, password, clientId) {
    const response = await axios.post(`${this.baseURL}/access/token`, {
      username,
      password,
      client_id: clientId,
    });
    this.token = response.data.Token;
  }

  async getWorkspaces() {
    const response = await axios.get(`${this.baseURL}/workspaces`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return response.data;
  }

  async createAlert(alertConfig) {
    const response = await axios.post(
      `${this.alertingURL}/alerts/alert`,
      alertConfig,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}
```

### **Python**

```python
import requests

class PeakMetricsClient:
    def __init__(self):
        self.base_url = "https://api.peakmetrics.com"
        self.alerting_url = "https://flux.peakm.com"
        self.token = None

    def authenticate(self, username, password, client_id):
        response = requests.post(f"{self.base_url}/access/token", json={
            "username": username,
            "password": password,
            "client_id": client_id
        })
        self.token = response.json()["Token"]

    def get_workspaces(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(f"{self.base_url}/workspaces", headers=headers)
        return response.json()

    def create_alert(self, alert_config):
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        response = requests.post(f"{self.alerting_url}/alerts/alert",
                               json=alert_config, headers=headers)
        return response.json()
```

## 🎉 **Key Discoveries**

### **1. Native Alerting System**

- **Found**: `flux.peakm.com` alerting API
- **Capability**: Real-time server-side alerting
- **Advantage**: No polling required!

### **2. Multiple Alert Types**

- Velocity spikes
- Sentiment changes
- Mention volume
- Keyword detection
- Custom Elasticsearch queries

### **3. Multiple Notification Channels**

- Email notifications
- Slack notifications
- Tracking only

### **4. Configurable Frequencies**

- Every 30 minutes (high priority)
- Every 60 minutes (normal)
- Every 120 minutes (low priority)
- Custom intervals

## 📋 **Best Practices**

### **1. Alert Configuration**

- Use appropriate thresholds for your use case
- Set reasonable frequencies to avoid spam
- Combine multiple conditions for precision

### **2. Query Optimization**

- Use specific workspace IDs in `always` array
- Leverage Elasticsearch query syntax
- Test queries before creating alerts

### **3. Error Handling**

- Implement proper authentication error handling
- Handle rate limits gracefully
- Monitor alert delivery success

## 🔧 **Integration Examples**

### **Crisis Detection**

```json
{
  "title": "Crisis Alert - BMW",
  "whenThis": {
    "text": "crisis OR scandal OR recall OR lawsuit",
    "parts": {
      "always": ["workspace:85779"],
      "sometimes": ["crisis", "scandal", "recall", "lawsuit"]
    }
  },
  "that": [
    { "text": "send me an email", "value": 2 },
    { "text": "send me a Slack", "value": 3 }
  ],
  "frequency": { "value": 30, "text": "every 30 minutes" }
}
```

### **Positive PR Opportunities**

```json
{
  "title": "Positive PR Alert - BMW",
  "whenThis": {
    "text": "award OR recognition OR innovation OR success",
    "parts": {
      "always": ["workspace:85779"],
      "sometimes": ["award", "recognition", "innovation", "success"]
    }
  },
  "that": [{ "text": "send me an email", "value": 2 }],
  "frequency": { "value": 120, "text": "every 2 hours" }
}
```

## 📚 **Additional Resources**

- **Scraped Documentation**: `/docs/scraped/`
- **OpenAPI Spec**: `/docs/scraped/peakmetrics_openapi_from_collection.yaml`
- **Collection Data**: `/docs/scraped/collection_data.json`
- **Implementation**: `/hive/utils/peakMetricsNativeAlerts.js`

---

**Note**: This documentation was compiled from the official PeakMetrics API documentation at [https://docs.api.peakmetrics.com](https://docs.api.peakmetrics.com) and our discovery of the native alerting system at `flux.peakm.com`.
