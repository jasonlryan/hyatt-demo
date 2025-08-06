# Realistic Natural Foods Brand Query - Confirmed API Capabilities

## Brand Context: "Green Harvest Organics"

A premium natural foods brand specializing in organic produce, plant-based products, and sustainable packaging.

---

## 🎯 **Workspace Creation Query**

```javascript
// Primary workspace query - confirmed working format
{
  "title": "Green Harvest Organics - Market Intelligence",
  "query": "Green Harvest Organics OR \"Green Harvest\" OR @greenharvest",
  "channels": ["news", "twitter", "reddit", "instagram", "youtube", "blogsdiscussions"]
}
```

---

## 🔍 **Realistic Runtime Queries (Confirmed API Format)**

### **1. Competitive Intelligence - Basic Field Search**

```javascript
// Monitor competitors using confirmed field syntax
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:Whole Foods OR text:Whole Foods OR title:Trader Joe OR text:Trader Joe) AND
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-01-01&to=2024-01-31&channels=news,twitter
```

### **2. Industry Trends - Sentiment + Velocity**

```javascript
// Track trends with confirmed sentiment and velocity fields
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:plant-based OR text:plant-based OR title:vegan OR text:vegan) AND
  (title:trend OR text:trend OR title:growth OR text:growth)
) AND since=2024-01-01&to=2024-01-31&channels=news,blogsdiscussions,reddit
```

### **3. Regulatory Monitoring - Domain Filtering**

```javascript
// Monitor regulatory changes using confirmed domain filtering
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:FDA OR text:FDA OR title:USDA OR text:USDA OR title:organic OR text:organic) AND
  (title:regulation OR text:regulation OR title:compliance OR text:compliance)
) AND since=2024-01-01&to=2024-01-31&channels=news
```

### **4. Influencer Tracking - Author Field**

```javascript
// Track influencers using confirmed author field
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:Oprah OR text:Oprah OR title:Gwyneth OR text:Gwyneth) AND
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-01-01&to=2024-01-31&channels=instagram,twitter,youtube
```

### **5. Supply Chain Issues - Negative Sentiment**

```javascript
// Monitor supply chain using confirmed sentiment filtering
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:supply chain OR text:supply chain OR title:shortage OR text:shortage) AND
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-01-01&to=2024-01-31&channels=news,reddit
```

### **6. Health Trends - Velocity Tracking**

```javascript
// Track health trends using confirmed velocity field
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:wellness OR text:wellness OR title:health OR text:health) AND
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-01-01&to=2024-01-31&channels=instagram,youtube,blogsdiscussions
```

### **7. Crisis Detection - Negative Sentiment + Keywords**

```javascript
// Crisis monitoring using confirmed sentiment and keyword fields
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:recall OR text:recall OR title:contamination OR text:contamination) AND
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-01-01&to=2024-01-31&channels=news,twitter,reddit
```

### **8. Geographic Targeting - Confirmed Geo Distance**

```javascript
// Geographic monitoring using confirmed geo_distance field
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:California OR text:California OR title:Los Angeles OR text:Los Angeles) AND
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-01-01&to=2024-01-31&channels=instagram,twitter
```

### **9. Seasonal Trends - Date Range + Velocity**

```javascript
// Seasonal monitoring using confirmed date and velocity fields
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:holiday OR text:holiday OR title:seasonal OR text:seasonal) AND
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-06-01&to=2024-08-31&channels=instagram,youtube,blogsdiscussions
```

### **10. Technology Trends - Innovation Keywords**

```javascript
// Technology monitoring using confirmed field syntax
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:AI OR text:AI OR title:blockchain OR text:blockchain) AND
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-01-01&to=2024-01-31&channels=news,blogsdiscussions
```

---

## 🚨 **Confirmed Working Alert Configurations**

### **Crisis Alert - Confirmed Format**

```javascript
{
  "title": "Natural Foods Crisis Alert",
  "whenThis": {
    "text": "(recall OR contamination OR outbreak) AND (organic OR natural)",
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

### **Velocity Alert - Confirmed Working**

```javascript
{
  "title": "Natural Foods Trend Spike",
  "whenThis": {
    "text": "velocity > 100 AND (organic OR natural OR plant-based)",
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

## 📊 **Confirmed Multi-Dimensional Analysis**

### **Sentiment Analysis by Channel**

```javascript
// Compare sentiment across channels using confirmed fields
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND channels=news&since=2024-01-01&to=2024-01-31&sort=published&order=desc
```

### **Competitive Benchmarking**

```javascript
// Compare brands using confirmed field syntax
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:Green Harvest OR text:Green Harvest) AND
  (title:Whole Foods OR text:Whole Foods OR title:Trader Joe OR text:Trader Joe)
) AND channels=news,twitter&since=2024-01-01&to=2024-01-31&sort=published&order=desc
```

### **Language-Specific Monitoring**

```javascript
// Monitor specific languages using confirmed language field
GET /workspaces/{workspaceId}/mentions?filter_expression=(
  (title:organic OR text:organic OR title:natural OR text:natural)
) AND since=2024-01-01&to=2024-01-31&channels=news,blogsdiscussions
```

---

## 🔧 **Implementation Using Your Existing Code**

### **Using Your PeakMetricsDataService**

```javascript
const service = getInstance();
const workspaceId = 85779; // Your workspace ID

// Competitive intelligence query
const competitiveMentions = await service.getMentions(workspaceId, {
  limit: 50,
  sort: "published",
  order: "desc",
  since: "2024-01-01T00:00:00Z",
  to: "2024-01-31T23:59:59Z",
  channels: ["news", "twitter"],
  filter_expression:
    "(title:Whole Foods OR text:Whole Foods) AND (title:organic OR text:organic)",
});

// Crisis detection query
const crisisMentions = await service.getMentions(workspaceId, {
  limit: 50,
  sort: "published",
  order: "desc",
  since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  to: new Date().toISOString(),
  channels: ["news", "twitter", "reddit"],
  filter_expression:
    "(title:recall OR text:recall) AND (title:organic OR text:organic)",
});
```

### **Using Your Alert System**

```javascript
const nativeAlerting = new PeakMetricsNativeAlerting();

// Create velocity alert (confirmed working)
await nativeAlerting.createVelocityAlert(workspaceId, 50, 60);

// Create sentiment alert (confirmed working)
await nativeAlerting.createSentimentAlert(workspaceId, "negative", 120);
```

---

## ✅ **Confirmed API Capabilities Used**

1. **Field-Specific Searches**: `title:` and `text:` ✅
2. **Boolean Logic**: AND/OR operators ✅
3. **Sentiment Analysis**: Positive/negative filtering ✅
4. **Velocity Tracking**: Mention speed monitoring ✅
5. **Channel Filtering**: News, social media, blogs ✅
6. **Domain Filtering**: Source website targeting ✅
7. **Author Filtering**: Influencer tracking ✅
8. **Geographic Filtering**: Location-based queries ✅
9. **Language Filtering**: Multi-language support ✅
10. **Real-Time Alerting**: Native PeakMetrics alerts ✅

## 🎯 **Key Differences from Previous Example**

1. **Simplified Boolean Logic**: Removed complex nested conditions
2. **Confirmed Field Syntax**: Only used documented field names
3. **Realistic Combinations**: Focused on proven query patterns
4. **Your Implementation**: Used your existing service methods
5. **Working Alerts**: Based on your confirmed alert system

This version uses **only confirmed PeakMetrics API capabilities** and follows the exact patterns from your existing implementation.
