# 🚀 OpenAI Responses API Requirement

## 📋 **Overview**

**MANDATORY REQUIREMENT**: All orchestrations in the Hive system MUST use the OpenAI Responses API (`responses.create()`) instead of the regular chat completions API (`chat.completions.create()`).

## 🎯 **Why Responses API is Required**

### **Performance Benefits**

- **Faster Response Times**: Responses API is optimized for quick, structured outputs
- **Better Throughput**: Designed for high-volume orchestration workflows
- **Reduced Latency**: Significantly faster than chat completions API

### **Consistency Benefits**

- **Unified Architecture**: All existing agents already use Responses API
- **Predictable Behavior**: Consistent response format across all components
- **Integration Compatibility**: Seamless integration with existing orchestration system

### **Reliability Benefits**

- **Better Error Handling**: More robust error responses
- **Structured Outputs**: Designed for programmatic consumption
- **Stable Interface**: Less prone to breaking changes

## 🔧 **Implementation Requirements**

### **API Call Pattern**

```javascript
// ✅ CORRECT - Use Responses API
const response = await openai.responses.create({
  model: "gpt-4o-2024-08-06",
  input: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ],
  temperature: 0.3,
});

const result = response.output_text;

// ❌ INCORRECT - Don't use Chat Completions API
const completion = await openai.chat.completions.create({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ],
  temperature: 0.3,
  max_tokens: 2000,
});

const result = completion.choices[0].message.content;
```

### **Key Differences**

| Aspect          | Responses API          | Chat Completions API                    |
| --------------- | ---------------------- | --------------------------------------- |
| Method          | `responses.create()`   | `chat.completions.create()`             |
| Input Parameter | `input`                | `messages`                              |
| Output Access   | `response.output_text` | `completion.choices[0].message.content` |
| Max Tokens      | Not needed             | Required                                |
| Response Format | Not needed             | Optional                                |

## 📋 **Files Already Updated**

### **✅ Agent Classes (All Updated)**

- `hive/agents/classes/StrategicInsightAgent.js`
- `hive/agents/classes/PRManagerAgent.js`
- `hive/agents/classes/ResearchAudienceAgent.js`
- `hive/agents/classes/StoryAnglesAgent.js`
- `hive/agents/classes/TrendingNewsAgent.js`
- `hive/agents/classes/BaseAgent.js`

### **✅ API Endpoints (All Updated)**

- `pages/api/generate-orchestration.js`
- `pages/api/generate-page.js`
- `pages/api/generate-component.js`
- `hive/server.js` (all instances)

## 🎯 **Integration Requirements**

### **For New Orchestration Generation**

1. **Agent Generation**: All generated agents MUST use `responses.create()`
2. **Page Generation**: All generated pages MUST use `responses.create()`
3. **Component Generation**: All generated components MUST use `responses.create()`
4. **Orchestration Generation**: All orchestration logic MUST use `responses.create()`

### **Validation Rules**

#### **❌ Forbidden Patterns**

- `chat.completions.create()` calls
- `messages` parameter usage
- `max_tokens` parameter usage
- `response_format` parameter usage
- `completion.choices[0].message.content` access

#### **✅ Required Patterns**

- `responses.create()` calls
- `input` parameter usage
- `response.output_text` access
- Follow established patterns from existing agents

## 🔍 **Validation & Testing**

### **Automated Validation**

The `AgentValidator` class includes Responses API validation:

```javascript
// Check for Responses API usage
if (classCode.includes("chat.completions.create")) {
  errors.push(
    "Agent MUST use responses.create() NOT chat.completions.create()"
  );
}

if (!classCode.includes("responses.create")) {
  errors.push("Agent MUST use openai.responses.create() API");
}

if (classCode.includes('"messages"')) {
  errors.push("Agent MUST use 'input' parameter NOT 'messages'");
}

if (classCode.includes("choices[0].message.content")) {
  errors.push(
    "Agent MUST use response.output_text NOT completion.choices[0].message.content"
  );
}
```

### **Manual Testing Checklist**

- [ ] Verify agent uses `responses.create()`
- [ ] Verify agent uses `input` parameter
- [ ] Verify agent uses `response.output_text`
- [ ] Verify no `max_tokens` parameter
- [ ] Verify no `response_format` parameter
- [ ] Test agent functionality
- [ ] Verify response times are acceptable

## 📊 **Performance Metrics**

### **Expected Performance**

- **Response Time**: < 2 seconds average
- **Throughput**: 10+ requests per minute
- **Reliability**: 99.9% success rate
- **Integration**: 100% compatibility with existing system

### **Monitoring**

- Track response times for all API calls
- Monitor error rates
- Alert on performance degradation
- Log API usage patterns

## 🚨 **Common Issues & Solutions**

### **Issue: Agent Still Using Chat Completions API**

**Solution**: Update agent to use `responses.create()` pattern

### **Issue: Response Format Errors**

**Solution**: Use `response.output_text` instead of `completion.choices[0].message.content`

### **Issue: Missing Parameters**

**Solution**: Remove `max_tokens` and `response_format` parameters

### **Issue: Integration Failures**

**Solution**: Ensure all components use consistent API patterns

## 🔄 **Migration Guide**

### **For Existing Code**

1. **Identify Chat Completions Usage**

   ```javascript
   // Find all instances of chat.completions.create
   grep -r "chat.completions.create" .
   ```

2. **Update API Calls**

   ```javascript
   // Before
   const completion = await openai.chat.completions.create({
     model: "gpt-4o-2024-08-06",
     messages: [...],
     temperature: 0.3,
     max_tokens: 2000,
   });
   const result = completion.choices[0].message.content;

   // After
   const response = await openai.responses.create({
     model: "gpt-4o-2024-08-06",
     input: [...],
     temperature: 0.3,
   });
   const result = response.output_text;
   ```

3. **Test Functionality**
   - Verify responses are correct
   - Check performance improvements
   - Ensure integration compatibility

### **For New Development**

1. **Use Responses API from Start**

   - Always use `responses.create()`
   - Always use `input` parameter
   - Always use `response.output_text`

2. **Follow Established Patterns**
   - Copy patterns from existing agents
   - Use consistent error handling
   - Maintain performance standards

## 📚 **References**

- [OpenAI Responses API Documentation](https://platform.openai.com/docs/api-reference/responses)
- [Existing Agent Implementations](../hive/agents/classes/)
- [API Endpoint Examples](../pages/api/)

## 🔗 **Related Documentation**

- [Orchestration Generator Improvement Plan](../plans/orchestration-generator-end-to-end-improvement-plan.md)
- [Agent Development Guide](../system/agent-development.md)
- [API Integration Guide](../system/api-integration.md)
