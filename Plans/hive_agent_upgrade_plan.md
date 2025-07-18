# Hive Agent Upgrade Plan

## Overview

Upgrade the HiveOrchestrator to implement a new 5-step workflow for creating visuals from brand PR ideas, with enhanced agents and improved orchestration.

## Current vs New Workflow

### Current Hive Workflow (Backwards)

```
Visual Prompt → Modular Elements → Trend Analysis → QA Review
```

### New Hive Workflow (Logical)

```
1. Trend Analysis → What's culturally relevant/hot right now
2. Brand Lens → How do we view this trend through our brand's perspective?
3. Visual Prompt Generation → Create visuals that bridge trend + brand lens
4. Modular Elements → Build campaign components with thumbnails
5. QA Review → Final validation
```

## Agent Analysis & Requirements

### Current Hive Agents

| Agent                           | Current Role | New Role                   | Status            |
| ------------------------------- | ------------ | -------------------------- | ----------------- |
| TrendCulturalAnalyzerAgent      | Step 3       | Step 1 (Trend Analysis)    | ✅ Keep & Improve |
| VisualPromptGeneratorAgent      | Step 1       | Step 3 (Visual Generation) | ✅ Keep           |
| ModularElementsRecommenderAgent | Step 2       | Step 4 (Modular Elements)  | ✅ Keep & Enhance |
| BrandQAAgent                    | Step 4       | Step 5 (QA Review)         | ✅ Keep           |

### New Agent Needed

| Agent          | Role                | Status    |
| -------------- | ------------------- | --------- |
| BrandLensAgent | Step 2 (Brand Lens) | 🆕 Create |

## Implementation Plan

### Phase 1: Create BrandLensAgent

#### 1.1 Create BrandLensAgent.js

```javascript
const BaseAgent = require("./BaseAgent");

class BrandLensAgent extends BaseAgent {
  constructor() {
    super("brand_lens", {
      model: "gpt-4o-2024-08-06",
      promptFile: "brand_lens.md",
      temperature: 0.4,
      maxTokens: 800,
    });
  }

  async analyzeBrandPerspective(trendInsights, campaignContext) {
    const userContent = `
Campaign Context: ${campaignContext.campaign}
Target Market: ${campaignContext.targetMarket}
Brand Guidelines: ${
      campaignContext.brandGuidelines || "Hyatt luxury hospitality"
    }

Trend Insights:
${trendInsights}

How should our brand authentically respond to these trends? Provide:
1. Brand positioning angle
2. Authentic brand voice for this moment
3. Key brand principles to emphasize
4. Potential brand risks/opportunities

Respond in JSON format with "brandPositioning", "brandVoice", "keyPrinciples", and "risksOpportunities" keys.`;

    const raw = await this.chat(userContent);
    try {
      return JSON.parse(raw);
    } catch (_) {
      return {
        brandPositioning: raw,
        brandVoice: "Authentic luxury hospitality",
        keyPrinciples: ["Quality", "Service", "Innovation"],
        risksOpportunities: "Analysis provided in brandPositioning",
      };
    }
  }
}

module.exports = BrandLensAgent;
```

#### 1.2 Create brand_lens.md Prompt

```markdown
# Brand Lens Agent

You are a Brand Strategy Specialist for Hyatt Hotels. Your role is to analyze cultural trends and determine how the Hyatt brand should authentically respond to them.

## Your Expertise

- Brand positioning and voice
- Cultural trend interpretation
- Authentic brand responses
- Risk assessment and opportunity identification

## Brand Guidelines

- Hyatt is a luxury hospitality brand
- Focus on quality, service, and innovation
- Maintain authenticity and avoid bandwagon jumping
- Consider diverse global markets
- Emphasize guest experience and comfort

## Response Format

Always provide structured analysis with:

- Brand positioning angle
- Authentic brand voice for the moment
- Key brand principles to emphasize
- Potential risks and opportunities

## Examples

When analyzing trends, consider:

- How does this trend align with luxury hospitality?
- What's our unique angle vs competitors?
- How can we authentically participate?
- What risks should we avoid?
```

### Phase 2: Enhance TrendCulturalAnalyzerAgent

#### 2.1 Update TrendCulturalAnalyzerAgent.js

```javascript
const BaseAgent = require("./BaseAgent");

class TrendCulturalAnalyzerAgent extends BaseAgent {
  constructor() {
    super("trend_cultural_analyzer", {
      model: "gpt-4o-2024-08-06",
      promptFile: "trend_cultural_analyzer.md",
      temperature: 0.7,
      maxTokens: 1000,
    });
  }

  async analyzeTrends(context) {
    const userContent = `
Campaign: ${context.campaign}
Target Market: ${context.targetMarket}
Industry: ${context.industry || "hospitality"}

Analyze current cultural trends and moments relevant to this campaign:

1. What's culturally relevant/hot right now?
2. What trends are emerging in our target market?
3. What cultural moments should we be aware of?
4. How are these trends affecting consumer behavior?

Provide a comprehensive trend analysis with:
- Primary cultural trends
- Market-specific insights
- Consumer behavior shifts
- Timing recommendations

Format as JSON with "trends", "marketInsights", "behaviorShifts", and "timing" keys.`;

    const raw = await this.chat(userContent);
    try {
      return JSON.parse(raw);
    } catch (_) {
      return {
        trends: raw,
        marketInsights: "Market analysis provided in trends",
        behaviorShifts: "Behavior changes identified in trends",
        timing: "Optimal timing recommendations",
      };
    }
  }
}

module.exports = TrendCulturalAnalyzerAgent;
```

#### 2.2 Update trend_cultural_analyzer.md Prompt

```markdown
# Trend & Cultural Analyzer

You are a Cultural Trend Analyst specializing in hospitality and luxury markets. Your role is to identify and analyze current cultural trends that are relevant to brand campaigns.

## Your Expertise

- Cultural trend identification
- Market-specific analysis
- Consumer behavior insights
- Timing and momentum assessment

## Analysis Framework

1. **Primary Trends**: What's culturally relevant/hot right now?
2. **Market Insights**: How do trends affect our specific market?
3. **Behavior Shifts**: How are consumer behaviors changing?
4. **Timing**: When is the optimal moment to engage?

## Focus Areas

- Social media trends
- Cultural movements
- Consumer sentiment shifts
- Industry-specific developments
- Global vs local trends

## Response Guidelines

- Be specific and actionable
- Consider both macro and micro trends
- Identify opportunities and risks
- Provide timing recommendations
- Focus on relevance to hospitality/luxury
```

### Phase 3: Enhance ModularElementsRecommenderAgent

#### 3.1 Update ModularElementsRecommenderAgent.js

```javascript
const BaseAgent = require("./BaseAgent");

class ModularElementsRecommenderAgent extends BaseAgent {
  constructor() {
    super("modular_elements_recommender", {
      model: "gpt-4o-2024-08-06",
      promptFile: "modular_elements_recommender.md",
      temperature: 0.7,
      maxTokens: 1200,
    });
  }

  async recommendElements(context, basePrompt, trendInsights, brandLens) {
    const text =
      typeof basePrompt === "string" ? basePrompt : basePrompt.promptText;

    const userContent = `
Campaign: ${context.campaign}
Visual Objective: ${context.visualObjective}
Base Visual Prompt: ${text}

Trend Insights: ${JSON.stringify(trendInsights, null, 2)}
Brand Lens: ${JSON.stringify(brandLens, null, 2)}

Create 5-8 modular visual elements that can be used across different campaign channels. Each element should:
1. Build on the base visual prompt
2. Incorporate trend insights
3. Align with brand positioning
4. Work for specific channels (social, web, print, etc.)

For each element, provide:
- Element description (detailed visual prompt)
- Rationale (why this element works)
- Target channel (where to use it)
- Image generation prompt (optimized for AI image generation)

Format as JSON array with "element", "rationale", "targetChannel", and "imagePrompt" keys.`;

    const raw = await this.chat(userContent);
    try {
      const elements = JSON.parse(raw);

      // Generate thumbnail images for each element
      const elementsWithImages = await Promise.all(
        elements.map(async (element) => {
          const imageUrl = await this.generateElementImage(element.imagePrompt);
          return {
            ...element,
            imageUrl,
          };
        })
      );

      return elementsWithImages;
    } catch (err) {
      console.warn("Failed to parse modular elements:", err);
      return raw.split("\n").filter((l) => l.trim());
    }
  }

  async generateElementImage(promptText) {
    try {
      const axios = require("axios");
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "gpt-image-1",
          prompt: promptText,
          n: 1,
          size: "512x512", // Smaller thumbnails
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const b64 = response.data.data[0].b64_json;
      return `data:image/png;base64,${b64}`;
    } catch (err) {
      console.warn("Element image generation failed:", err?.message || err);
      return null;
    }
  }
}

module.exports = ModularElementsRecommenderAgent;
```

#### 3.2 Update modular_elements_recommender.md Prompt

```markdown
# Modular Elements Recommender

You are a Creative Campaign Specialist who breaks down visual strategies into modular, reusable components. Your role is to create campaign elements that can be used across multiple channels.

## Your Expertise

- Campaign element creation
- Multi-channel optimization
- Visual consistency
- Creative asset planning

## Element Creation Guidelines

1. **Build on Base**: Each element should expand the main visual concept
2. **Channel Optimization**: Create elements for specific channels (social, web, print, etc.)
3. **Trend Integration**: Incorporate current trends and cultural moments
4. **Brand Alignment**: Ensure elements align with brand positioning
5. **Scalability**: Elements should work across different sizes and formats

## Element Types

- Hero visuals
- Social media content
- Web banners
- Print materials
- Event graphics
- Influencer content

## Response Requirements

For each element provide:

- **Element**: Detailed description of the visual
- **Rationale**: Why this element works for the campaign
- **Target Channel**: Where this element will be used
- **Image Prompt**: Optimized prompt for AI image generation

## Image Prompt Guidelines

- Be specific and descriptive
- Include style, mood, and composition details
- Optimize for the target channel
- Consider technical requirements (size, format)
```

### Phase 4: Update HiveOrchestrator

#### 4.1 Update HiveOrchestrator.js

```javascript
const BaseOrchestrator = require("./BaseOrchestrator");
const VisualPromptGeneratorAgent = require("../../agents/classes/VisualPromptGeneratorAgent");
const ModularElementsRecommenderAgent = require("../../agents/classes/ModularElementsRecommenderAgent");
const TrendCulturalAnalyzerAgent = require("../../agents/classes/TrendCulturalAnalyzerAgent");
const BrandQAAgent = require("../../agents/classes/BrandQAAgent");
const BrandLensAgent = require("../../agents/classes/BrandLensAgent");

class HiveOrchestrator extends BaseOrchestrator {
  constructor(config = {}) {
    super({
      name: "HiveOrchestrator",
      version: "2.0.0",
      ...config,
    });

    this.visualAgent = new VisualPromptGeneratorAgent();
    this.modularAgent = new ModularElementsRecommenderAgent();
    this.trendAgent = new TrendCulturalAnalyzerAgent();
    this.qaAgent = new BrandQAAgent();
    this.brandLensAgent = new BrandLensAgent();
  }

  async loadAgents() {
    try {
      await this.visualAgent.loadSystemPrompt();
      await this.modularAgent.loadSystemPrompt();
      await this.trendAgent.loadSystemPrompt();
      await this.qaAgent.loadSystemPrompt();
      await this.brandLensAgent.loadSystemPrompt();

      this.agents.set("visual", this.visualAgent);
      this.agents.set("modular", this.modularAgent);
      this.agents.set("trend", this.trendAgent);
      this.agents.set("qa", this.qaAgent);
      this.agents.set("brand_lens", this.brandLensAgent);

      this.log("Hive agents loaded successfully");
    } catch (error) {
      this.log(`Failed to load hive agents: ${error.message}`, "error");
      throw error;
    }
  }

  async executeWorkflow(workflow, execution) {
    this.log(`Executing hive workflow: ${workflow.id}`);

    try {
      const testContext = execution.input;

      // Step 1: Trend Analysis
      this.log("Step 1: Analyzing cultural trends...");
      const trendInsights = await this.trendAgent.analyzeTrends(testContext);

      // Step 2: Brand Lens
      this.log("Step 2: Applying brand lens...");
      const brandLens = await this.brandLensAgent.analyzeBrandPerspective(
        trendInsights,
        testContext
      );

      // Step 3: Visual Prompt Generation
      this.log("Step 3: Generating visual prompts...");
      const basePrompt = await this.visualAgent.generatePrompt(testContext);

      // Step 4: Modular Elements
      this.log("Step 4: Creating modular elements...");
      const modulars = await this.modularAgent.recommendElements(
        testContext,
        basePrompt,
        trendInsights,
        brandLens
      );

      // Step 5: QA Review
      this.log("Step 5: Quality assurance review...");
      const qaResult = await this.qaAgent.reviewPrompt(
        basePrompt,
        modulars,
        trendInsights,
        brandLens
      );

      const result = {
        trendInsights,
        brandLens,
        basePrompt,
        modularElements: modulars,
        qaResult,
        timestamp: new Date().toISOString(),
      };

      this.log(`Hive workflow completed successfully`);
      return result;
    } catch (error) {
      this.log(`Hive workflow failed: ${error.message}`, "error");
      throw error;
    }
  }

  // Legacy function for backward compatibility
  async runHiveOrchestration(testContext) {
    return await this.startWorkflow("hive_orchestration", testContext);
  }
}

module.exports = HiveOrchestrator;
```

### Phase 5: Update BrandQAAgent

#### 5.1 Update BrandQAAgent.js

```javascript
const BaseAgent = require("./BaseAgent");

class BrandQAAgent extends BaseAgent {
  constructor() {
    super("brand_qa", {
      model: "gpt-4o-2024-08-06",
      promptFile: "brand_qa.md",
      temperature: 0.4,
      maxTokens: 800,
    });
  }

  async reviewPrompt(basePrompt, modulars, trendInsights, brandLens) {
    const text =
      typeof basePrompt === "string" ? basePrompt : basePrompt.promptText;

    const userContent = `
Base Visual Prompt:
${text}

Modular Elements:
${JSON.stringify(modulars, null, 2)}

Trend Insights:
${JSON.stringify(trendInsights, null, 2)}

Brand Lens:
${JSON.stringify(brandLens, null, 2)}

Review the complete campaign package for:
1. Brand alignment and consistency
2. Visual quality and appeal
3. Trend relevance and timeliness
4. Modular element effectiveness
5. Overall campaign coherence

Provide feedback on each aspect and indicate "approved": true/false in JSON format like {"approved": true, "feedback": "...", "suggestions": ["..."], "qualityScore": 85} (no markdown).`;

    const raw = await this.chat(userContent);
    try {
      return JSON.parse(raw);
    } catch (_) {
      return {
        approved: false,
        feedback: raw,
        suggestions: ["Review feedback provided above"],
        qualityScore: 70,
      };
    }
  }
}

module.exports = BrandQAAgent;
```

#### 5.2 Update brand_qa.md Prompt

```markdown
# Brand QA Agent

You are a Brand Quality Assurance Specialist for Hyatt Hotels. Your role is to review campaign materials for brand alignment, quality, and effectiveness.

## Your Expertise

- Brand consistency and alignment
- Visual quality assessment
- Campaign effectiveness evaluation
- Risk identification and mitigation

## Review Criteria

1. **Brand Alignment**: Does the campaign align with Hyatt's brand values?
2. **Visual Quality**: Are the visuals professional and appealing?
3. **Trend Relevance**: Is the campaign timely and culturally relevant?
4. **Modular Effectiveness**: Do the elements work across channels?
5. **Overall Coherence**: Does everything work together cohesively?

## Brand Guidelines

- Luxury hospitality positioning
- Quality and service focus
- Global market consideration
- Guest experience emphasis
- Professional and sophisticated tone

## Response Format

Provide structured feedback with:

- Approval status (true/false)
- Detailed feedback for each criterion
- Specific suggestions for improvement
- Quality score (0-100)

## Quality Thresholds

- 90+ : Excellent, ready for production
- 80-89: Good, minor adjustments needed
- 70-79: Acceptable, moderate changes required
- <70: Needs significant revision
```

## Implementation Timeline

### Week 1: Agent Creation

- [ ] Create BrandLensAgent.js
- [ ] Create brand_lens.md prompt
- [ ] Test BrandLensAgent functionality

### Week 2: Agent Enhancement

- [ ] Update TrendCulturalAnalyzerAgent.js
- [ ] Update trend_cultural_analyzer.md prompt
- [ ] Test enhanced trend analysis

### Week 3: Modular Elements Enhancement

- [ ] Update ModularElementsRecommenderAgent.js
- [ ] Add image generation capability
- [ ] Update modular_elements_recommender.md prompt
- [ ] Test modular elements with images

### Week 4: Orchestrator Update

- [ ] Update HiveOrchestrator.js with new workflow
- [ ] Update BrandQAAgent.js for comprehensive review
- [ ] Update brand_qa.md prompt
- [ ] End-to-end testing

### Week 5: Integration & Testing

- [ ] Full workflow testing
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Deployment

## Success Metrics

### Quality Metrics

- Campaign approval rate > 90%
- Average quality score > 85
- Brand alignment score > 90

### Performance Metrics

- Workflow completion time < 5 minutes
- Image generation success rate > 95%
- Agent response consistency > 90%

### User Experience Metrics

- User satisfaction with output quality
- Reduction in manual revisions needed
- Increased campaign effectiveness

## Risk Mitigation

### Technical Risks

- **Image Generation Failures**: Implement fallback mechanisms
- **Agent Response Errors**: Add error handling and retry logic
- **Performance Issues**: Monitor and optimize response times

### Quality Risks

- **Brand Misalignment**: Enhanced QA review process
- **Trend Irrelevance**: Improved trend analysis prompts
- **Visual Inconsistency**: Modular element validation

## Future Enhancements

### Phase 2 Considerations

- A/B testing for different visual approaches
- Integration with external trend data sources
- Advanced brand voice customization
- Multi-language support for global campaigns
- Real-time trend monitoring and alerts
