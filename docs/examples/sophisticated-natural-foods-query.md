# Sophisticated Natural Foods Brand Query Example

## Brand Context: "Green Harvest Organics"

A premium natural foods brand specializing in organic produce, plant-based products, and sustainable packaging.

---

## 🎯 **Workspace Creation Query**

```javascript
// Primary workspace query - broad but focused
{
  "title": "Green Harvest Organics - Comprehensive Market Intelligence",
  "query": "Green Harvest Organics OR \"Green Harvest\" OR @greenharvest",
  "channels": ["news", "twitter", "reddit", "instagram", "youtube", "blogsdiscussions"]
}
```

---

## 🔍 **Sophisticated Runtime Queries**

### **1. Competitive Intelligence & Market Analysis**

```javascript
// Monitor competitors and market dynamics
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:Whole Foods OR text:Whole Foods OR title:Trader Joe OR text:Trader Joe) AND
  (title:organic OR text:organic OR title:natural OR text:natural) AND
  (sentiment > 0 OR sentiment < 0)
) AND since=2024-01-01&to=2024-01-31&channels=news,twitter
```

### **2. Industry Trends & Consumer Behavior**

```javascript
// Track emerging trends in natural foods
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:plant-based OR text:plant-based OR title:vegan OR text:vegan) AND
  (title:trend OR text:trend OR title:growth OR text:growth OR title:demand OR text:demand) AND
  (velocity > 20)
) AND since=2024-01-01&to=2024-01-31&channels=news,blogsdiscussions,reddit
```

### **3. Regulatory & Compliance Monitoring**

```javascript
// Monitor regulatory changes affecting natural foods
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:FDA OR text:FDA OR title:USDA OR text:USDA OR title:organic OR text:organic) AND
  (title:regulation OR text:regulation OR title:compliance OR text:compliance OR title:certification OR text:certification) AND
  (domain:*.gov OR domain:reuters.com OR domain:bloomberg.com OR domain:wsj.com)
) AND since=2024-01-01&to=2024-01-31&channels=news
```

### **4. Influencer & Celebrity Endorsements**

```javascript
// Track celebrity and influencer mentions in natural foods space
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:Oprah OR text:Oprah OR title:Gwyneth OR text:Gwyneth OR title:Ellen OR text:Ellen) AND
  (title:organic OR text:organic OR title:natural OR text:natural OR title:healthy OR text:healthy) AND
  (sentiment > 30)
) AND since=2024-01-01&to=2024-01-31&channels=instagram,twitter,youtube
```

### **5. Supply Chain & Sustainability Issues**

```javascript
// Monitor supply chain disruptions and sustainability topics
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:supply chain OR text:supply chain OR title:shortage OR text:shortage OR title:disruption OR text:disruption) AND
  (title:organic OR text:organic OR title:natural OR text:natural OR title:produce OR text:produce) AND
  (sentiment < -20)
) AND since=2024-01-01&to=2024-01-31&channels=news,reddit
```

### **6. Health & Wellness Trends**

```javascript
// Track health and wellness movements affecting natural foods
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:wellness OR text:wellness OR title:health OR text:health OR title:nutrition OR text:nutrition) AND
  (title:organic OR text:organic OR title:natural OR text:natural OR title:superfood OR text:superfood) AND
  (velocity > 50)
) AND since=2024-01-01&to=2024-01-31&channels=instagram,youtube,blogsdiscussions
```

### **7. Crisis & Reputation Management**

```javascript
// Monitor potential crises and reputation threats
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:recall OR text:recall OR title:contamination OR text:contamination OR title:outbreak OR text:outbreak) AND
  (title:organic OR text:organic OR title:natural OR text:natural OR title:food OR text:food) AND
  (sentiment < -50)
) AND since=2024-01-01&to=2024-01-31&channels=news,twitter,reddit
```

### **8. Geographic & Demographic Targeting**

```javascript
// Monitor specific geographic markets and demographics
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:California OR text:California OR title:Los Angeles OR text:Los Angeles OR title:San Francisco OR text:San Francisco) AND
  (title:organic OR text:organic OR title:natural OR text:natural OR title:millennial OR text:millennial) AND
  (geo_distance:100mi AND lat:34.0522 AND lon:-118.2437)
) AND since=2024-01-01&to=2024-01-31&channels=instagram,twitter
```

### **9. Seasonal & Event-Based Monitoring**

```javascript
// Monitor seasonal trends and events
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:holiday OR text:holiday OR title:seasonal OR text:seasonal OR title:summer OR text:summer) AND
  (title:organic OR text:organic OR title:natural OR text:natural OR title:produce OR text:produce) AND
  (velocity > 30)
) AND since=2024-06-01&to=2024-08-31&channels=instagram,youtube,blogsdiscussions
```

### **10. Technology & Innovation Trends**

```javascript
// Monitor technology innovations affecting natural foods
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:AI OR text:AI OR title:blockchain OR text:blockchain OR title:automation OR text:automation) AND
  (title:organic OR text:organic OR title:natural OR text:natural OR title:farming OR text:farming) AND
  (sentiment > 0)
) AND since=2024-01-01&to=2024-01-31&channels=news,blogsdiscussions
```

---

## 🚨 **Advanced Alert Configurations**

### **Crisis Alert**

```javascript
{
  "title": "Natural Foods Crisis Alert",
  "whenThis": {
    "text": "(recall OR contamination OR outbreak) AND (organic OR natural) AND sentiment < -70",
    "parts": {
      "always": ["workspace:85779"],
      "sometimes": ["recall", "contamination", "outbreak"],
      "never": ["positive", "safe", "approved"]
    }
  },
  "happens": {
    "text": "News, Twitter, Reddit",
    "value": {
      "tags": [
        {"tag": "news", "id": 1, "friendly": "News"},
        {"tag": "twitter", "id": 2, "friendly": "Twitter"},
        {"tag": "reddit", "id": 3, "friendly": "Reddit"}
      ]
    }
  },
  "that": [{"text": "send me an email", "value": 2}],
  "frequency": {"value": 15, "text": "every 15 minutes"}
}
```

### **Trend Velocity Alert**

```javascript
{
  "title": "Natural Foods Trend Spike",
  "whenThis": {
    "text": "velocity > 100 AND (organic OR natural OR plant-based) AND sentiment > 30",
    "parts": {
      "always": ["workspace:85779"],
      "sometimes": ["trend", "viral", "popular"],
      "never": ["negative", "criticism"]
    }
  },
  "happens": {
    "text": "Instagram, YouTube, TikTok",
    "value": {
      "tags": [
        {"tag": "instagram", "id": 4, "friendly": "Instagram"},
        {"tag": "youtube", "id": 5, "friendly": "YouTube"},
        {"tag": "tiktok", "id": 6, "friendly": "TikTok"}
      ]
    }
  },
  "that": [{"text": "send Slack notification", "value": 3}],
  "frequency": {"value": 30, "text": "every 30 minutes"}
}
```

---

## 📊 **Multi-Dimensional Analysis Queries**

### **Sentiment Analysis by Channel**

```javascript
// Compare sentiment across different channels
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:organic OR text:organic OR title:natural OR text:natural) AND
  (sentiment > 50 OR sentiment < -50)
) AND channels=news&since=2024-01-01&to=2024-01-31&sort=sentiment&order=desc
```

### **Influencer Impact Analysis**

```javascript
// Track influencer mentions and their impact
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (author:influencer OR author:celebrity OR followers > 100000) AND
  (title:organic OR text:organic OR title:natural OR text:natural) AND
  (sentiment > 0)
) AND channels=instagram,twitter,youtube&since=2024-01-01&to=2024-01-31
```

### **Competitive Benchmarking**

```javascript
// Compare brand mentions vs competitors
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:Green Harvest OR text:Green Harvest) AND
  (title:Whole Foods OR text:Whole Foods OR title:Trader Joe OR text:Trader Joe) AND
  (sentiment > 0)
) AND channels=news,twitter&since=2024-01-01&to=2024-01-31&sort=published&order=desc
```

---

## 🎯 **Key Insights from This Example**

1. **One Workspace, Infinite Queries**: Single workspace for "Green Harvest Organics" but 10+ sophisticated query variations
2. **Multi-Dimensional Filtering**: Date, channel, sentiment, geography, author, domain, velocity
3. **Real-Time Intelligence**: Crisis alerts, trend monitoring, competitive analysis
4. **Comprehensive Coverage**: From regulatory changes to social media trends
5. **Actionable Insights**: Each query designed for specific business decisions

This demonstrates the full power of PeakMetrics' query capabilities - far beyond simple brand mentions into comprehensive market intelligence.
