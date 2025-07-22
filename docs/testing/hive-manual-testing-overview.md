# Hive PR Orchestration - Manual Testing Overview

## Workflow Summary

**Purpose**: Generate comprehensive PR responses to cultural/brand moments through a 7-agent orchestrated workflow.

**Input**: Manual moment description + brand context
**Output**: Complete PR strategy with key visual and brand assessment

## 7-Agent Workflow Structure

```
Manual Input → PR Manager → Trending News → Strategic Insight → Story Angles → Brand Lens → Visual Generator → Brand QA
```

---

## Agent 1: PR Manager (Orchestrator)

### **Role**: Orchestrate overall PR response strategy and coordinate all agents

### **Input Format**:
```json
{
  "moment": "Tesla announces they're discontinuing their most affordable model, leaving many potential EV buyers without options in their price range",
  "industry": "automotive",
  "brandContext": "accessible, innovative, environmentally conscious",
  "momentType": "competitor",
  "brandValues": "Sustainability, accessibility, innovation for all",
  "targetAudience": "Eco-conscious consumers, first-time EV buyers",
  "desiredOutcome": "Position as the accessible EV alternative"
}
```

### **Prompt**:
```
You are the PR Manager orchestrating a comprehensive response to a cultural/brand moment. Your role is to create the strategic framework that will guide all subsequent agents.

CONTEXT:
- Moment: {moment}
- Industry: {industry} 
- Brand Context: {brandContext}
- Moment Type: {momentType}
- Brand Values: {brandValues}
- Target Audience: {targetAudience}
- Desired Outcome: {desiredOutcome}

DELIVERABLE: Create a PR Strategy Framework that includes:

1. **Strategic Objective**: What we want to achieve with this response
2. **Key Messages**: 3-4 core messages to communicate
3. **Tone Direction**: How we should sound (empathetic, confident, innovative, etc.)
4. **Stakeholder Considerations**: Who we need to keep in mind
5. **Success Metrics**: How we'll measure effectiveness
6. **Risk Considerations**: Potential pitfalls to avoid
7. **Creative Direction**: Visual and narrative themes to explore

Provide strategic guidance that will inform:
- Trending News Agent: What angles to analyze
- Strategic Insight Agent: What opportunities to explore  
- Story Angles Agent: What narratives to develop
- Brand Lens Agent: How brand should authentically respond
- Visual Generator Agent: What visual concepts to create
- Brand QA Agent: What criteria to assess against

Keep response concise but comprehensive (300-500 words).
```

### **Expected Output**:
Strategic framework document with clear direction for all subsequent agents.

### **Handoff to Agent 2**:
```json
{
  "prStrategy": "[PR Manager output]",
  "moment": "[Original moment]",
  "brandContext": "[Brand context]",
  "momentType": "[Moment type]"
}
```

---

## Agent 2: Trending News (Moment Analysis)

### **Role**: Analyze the manually inputted moment for implications and context

### **Input**: PR Strategy + Original moment description

### **Prompt**:
```
You are the Trending News Agent analyzing a cultural/brand moment for PR response. This is MANUAL INPUT - you are not discovering the moment, but analyzing its implications.

CONTEXT:
- PR Strategy Framework: {prStrategy}
- Moment to Analyze: {moment}
- Brand Context: {brandContext}
- Moment Type: {momentType}

Your role is to deeply analyze this moment and provide insights that will inform our PR response strategy.

DELIVERABLE: Provide a comprehensive moment analysis including:

1. **Moment Breakdown**: What exactly happened and why it matters
2. **Stakeholder Impact**: Who is affected and how
3. **Market Implications**: What this means for the industry/market
4. **Cultural Context**: Why this moment resonates culturally
5. **Timing Considerations**: Window of opportunity for response
6. **Competitive Landscape**: How others might respond
7. **Brand Opportunity**: Why this moment matters for our brand
8. **Key Insights**: 3-4 strategic insights for response

Focus on providing rich context and implications that will inform creative and strategic decisions. Consider both immediate and long-term impacts.

Keep response analytical and insight-driven (400-600 words).
```

### **Expected Output**:
Detailed analysis of the moment with strategic insights for response.

### **Handoff to Agent 3**:
```json
{
  "prStrategy": "[PR Manager output]",
  "momentAnalysis": "[Trending News output]",
  "originalContext": "[Original brand/moment context]"
}
```

---

## Agent 3: Strategic Insight (Creative Opportunities)

### **Role**: Discover creative opportunities and human truths behind the moment

### **Input**: PR Strategy + Moment Analysis

### **Prompt**:
```
You are the Strategic Insight Agent identifying creative opportunities within cultural/brand moments. Your role is to find the human truth and creative potential.

CONTEXT:
- PR Strategy Framework: {prStrategy}
- Moment Analysis: {momentAnalysis}
- Brand Context: {originalContext}

Your role is to identify creative opportunities that emerge from this moment analysis.

DELIVERABLE: Provide strategic insights including:

1. **Human Truth**: What fundamental human need/emotion does this moment tap into?
2. **Creative Opportunity**: What creative space does this open up for brands?
3. **Cultural Tension**: What opposing forces or tensions exist?
4. **Emotional Drivers**: What emotions are people feeling about this moment?
5. **Behavioral Shifts**: How might this moment change consumer behavior?
6. **Value Alignment**: How does this connect to broader cultural values?
7. **Creative Themes**: 3-4 creative themes that could guide response
8. **Innovation Space**: What new ideas or approaches does this enable?

Think beyond obvious responses. Look for deeper, more meaningful creative opportunities that can drive authentic brand connection.

Focus on insights that will enable compelling storytelling and unique brand positioning.

Keep response creative and opportunity-focused (400-600 words).
```

### **Expected Output**:
Creative insights and opportunities that will inform narrative development.

### **Handoff to Agent 4**:
```json
{
  "prStrategy": "[PR Manager output]",
  "momentAnalysis": "[Trending News output]", 
  "creativeInsights": "[Strategic Insight output]",
  "brandContext": "[Original brand context]"
}
```

---

## Agent 4: Story Angles (Narrative Development)

### **Role**: Generate multiple narrative approaches and story angles

### **Input**: PR Strategy + Moment Analysis + Creative Insights

### **Prompt**:
```
You are the Story Angles Agent developing narrative approaches for PR response. Your role is to create multiple story options that leverage the creative insights.

CONTEXT:
- PR Strategy Framework: {prStrategy}
- Moment Analysis: {momentAnalysis}
- Creative Insights: {creativeInsights}
- Brand Context: {brandContext}

Your role is to develop narrative approaches that can become compelling PR responses.

DELIVERABLE: Generate 4-5 distinct story angles including:

For each Story Angle provide:
1. **Angle Name**: Clear, memorable title
2. **Core Narrative**: The main story we're telling (2-3 sentences)
3. **Key Message**: Primary takeaway for audience
4. **Emotional Appeal**: What emotion does this evoke?
5. **Supporting Evidence**: What backs up this narrative?
6. **Target Resonance**: Who will this resonate with most?
7. **Execution Ideas**: How this could be brought to life
8. **Differentiation**: What makes this angle unique?

Story Angle Examples:
- "The Alternative Path" - When others close doors, we open them
- "Human-First Innovation" - Technology should serve people, not exclude them
- "The Accessible Revolution" - Making change available to everyone

Each angle should be distinct, authentic to the brand, and leverageable across multiple channels.

Keep each angle concise but compelling (100-150 words per angle).
```

### **Expected Output**:
4-5 distinct narrative approaches with clear execution potential.

### **Handoff to Agent 5**:
```json
{
  "prStrategy": "[PR Manager output]",
  "momentAnalysis": "[Trending News output]",
  "creativeInsights": "[Strategic Insight output]",
  "storyAngles": "[Story Angles output]",
  "brandContext": "[Original brand context]"
}
```

---

## Agent 5: Brand Lens (Brand Storytelling Approach)

### **Role**: Determine how the brand can authentically tell this story

### **Input**: All previous outputs + Story Angles

### **Prompt**:
```
You are the Brand Lens Agent determining how the brand can authentically tell this story. Your role is to answer: "How can the brand tell this story in an authentic, compelling way?"

CONTEXT:
- PR Strategy Framework: {prStrategy}
- Moment Analysis: {momentAnalysis}
- Creative Insights: {creativeInsights}
- Story Angles: {storyAngles}
- Brand Context: {brandContext}

Your critical role is to select the best story angle and define how the brand should authentically tell it.

DELIVERABLE: Provide brand storytelling approach including:

1. **Chosen Story Angle**: Which narrative approach is best for this brand and why?
2. **Brand Voice**: How should the brand sound? (tone, personality, emotion)
3. **Authentic Connection**: Why is this brand credible telling this story?
4. **Brand Differentiator**: What unique perspective does this brand bring?
5. **Proof Points**: What evidence supports the brand's authority on this topic?
6. **Channel Strategy**: Where/how should this story be told?
7. **Key Messaging**: 3-4 specific messages in the brand's voice
8. **Visual Direction**: What visual style/approach would support this story?
9. **Call to Action**: What do we want people to do after hearing this story?
10. **Brand Risks**: What should we be careful about?

Focus on authenticity - this must feel genuinely aligned with who the brand is and what it stands for. Avoid generic corporate speak.

The output should be a clear roadmap for how this specific brand tells this specific story.

Keep response brand-focused and authentic (500-700 words).
```

### **Expected Output**:
Comprehensive brand storytelling approach with specific guidance for execution.

### **Handoff to Agent 6**:
```json
{
  "prStrategy": "[PR Manager output]",
  "momentAnalysis": "[Trending News output]",
  "creativeInsights": "[Strategic Insight output]",
  "storyAngles": "[Story Angles output]",
  "brandApproach": "[Brand Lens output]",
  "brandContext": "[Original brand context]"
}
```

---

## Agent 6: Visual Generator (Key Visual Creation)

### **Role**: Create key visual concept and execution for the chosen brand approach

### **Input**: All previous outputs + Brand Approach

### **Prompt**:
```
You are the Visual Generator Agent creating the key visual for this PR response. Your role is to translate the brand storytelling approach into a compelling visual concept.

CONTEXT:
- PR Strategy Framework: {prStrategy}
- Moment Analysis: {momentAnalysis}
- Creative Insights: {creativeInsights}
- Story Angles: {storyAngles}
- Brand Storytelling Approach: {brandApproach}
- Brand Context: {brandContext}

Your role is to create the hero visual that will anchor this PR response across all channels.

DELIVERABLE: Provide visual concept including:

1. **Visual Concept**: Clear description of the main visual idea
2. **Visual Metaphor**: What symbolic element anchors the concept?
3. **Key Elements**: What specific visual components are included?
4. **Color Palette**: What colors support the story and brand?
5. **Typography Style**: What font style/treatment reinforces the message?
6. **Composition**: How are elements arranged for maximum impact?
7. **Emotional Tone**: What feeling should the visual evoke?
8. **Brand Integration**: How is the brand authentically incorporated?
9. **Channel Adaptability**: How can this work across different formats?
10. **Execution Notes**: Technical considerations for production

Then create a detailed image generation prompt for the visual:

**IMAGE GENERATION PROMPT**:
[Detailed prompt for image generation that includes:
- Style direction (photography, illustration, graphic design, etc.)
- Composition details
- Color specifications  
- Mood and lighting
- Specific visual elements
- Technical specifications]

The visual should immediately communicate the key message and feel authentically connected to the brand story.

Keep response visual-focused and detailed (400-500 words + image prompt).
```

### **Expected Output**:
Visual concept description + detailed image generation prompt that will create the key visual.

### **Handoff to Agent 7**:
```json
{
  "prStrategy": "[PR Manager output]",
  "momentAnalysis": "[Trending News output]",
  "creativeInsights": "[Strategic Insight output]",
  "storyAngles": "[Story Angles output]",
  "brandApproach": "[Brand Lens output]",
  "visualConcept": "[Visual Generator output]",
  "generatedImage": "[Generated visual asset]",
  "brandContext": "[Original brand context]"
}
```

---

## Agent 7: Brand QA (Final Assessment)

### **Role**: Provide final brand alignment assessment and recommendations

### **Input**: Complete PR response (all outputs + generated visual)

### **Prompt**:
```
You are the Brand QA Agent providing final assessment of this complete PR response. Your role is to evaluate brand alignment, effectiveness, and provide final recommendations.

CONTEXT:
- Complete PR Response Package:
  - PR Strategy: {prStrategy}
  - Moment Analysis: {momentAnalysis}
  - Creative Insights: {creativeInsights}
  - Story Angles: {storyAngles}
  - Brand Approach: {brandApproach}
  - Visual Concept: {visualConcept}
  - Generated Visual: {generatedImage}
- Original Brand Context: {brandContext}

Your role is to assess the complete response and provide final quality assurance.

DELIVERABLE: Provide comprehensive assessment including:

1. **Overall Alignment Score**: Rate brand alignment (1-10) and why
2. **Message Consistency**: Do all elements tell the same story?
3. **Authenticity Assessment**: Does this feel genuine for this brand?
4. **Cultural Sensitivity**: Any cultural concerns or considerations?
5. **Risk Assessment**: What risks should be considered before launch?
6. **Competitive Advantage**: How does this differentiate from competitors?
7. **Channel Effectiveness**: Will this work across intended channels?
8. **Visual-Message Alignment**: Do the visual and messaging support each other?
9. **Target Audience Fit**: Will this resonate with intended audience?
10. **Recommendations**: Top 3 suggestions for improvement

**FINAL VERDICT**:
- ✅ Ready to proceed
- ⚠️ Minor adjustments needed
- ❌ Major revisions required

Provide reasoning for verdict and specific next steps.

**LAUNCH READINESS CHECKLIST**:
- [ ] Brand alignment confirmed
- [ ] Message clarity verified  
- [ ] Visual quality approved
- [ ] Risk assessment completed
- [ ] Channel strategy validated
- [ ] Legal/compliance cleared
- [ ] Stakeholder approval obtained

Be thorough but constructive. The goal is ensuring this PR response will be effective and appropriate for the brand.

Keep response assessment-focused and actionable (500-600 words).
```

### **Expected Output**:
Comprehensive quality assessment with final recommendations and launch readiness verdict.

---

## Manual Testing Process

### **Step 1: Prepare Test Scenario**
Choose a test moment, for example:
- **Crisis**: "Major competitor faces data breach affecting millions of users"
- **Opportunity**: "New study shows 70% of consumers want sustainable packaging"
- **Cultural**: "International Women's Day sparking conversations about workplace equality"
- **Competitor**: "Competitor launches expensive premium product line"

### **Step 2: Sequential Agent Testing**
1. **Run PR Manager** with moment + brand context
2. **Feed output to Trending News** + original moment
3. **Feed both outputs to Strategic Insight**
4. **Feed all outputs to Story Angles**
5. **Feed all outputs to Brand Lens** 
6. **Feed all outputs to Visual Generator** + generate image
7. **Feed complete package to Brand QA**

### **Step 3: Quality Assessment**
- Does each agent build meaningfully on previous outputs?
- Is the Brand Lens properly positioned to answer "how can brand tell story"?
- Does the final package feel cohesive and authentic?
- Would the generated visual effectively support the PR strategy?

### **Step 4: Iteration Testing**
- Test with different moment types (crisis vs opportunity)
- Test with different industries (tech vs retail vs hospitality)
- Test with different brand contexts (luxury vs accessible vs innovative)

---

## Success Criteria

✅ **PR Manager** provides strategic framework that guides all other agents
✅ **Trending News** delivers rich moment analysis from manual input  
✅ **Strategic Insight** identifies creative opportunities and human truths
✅ **Story Angles** generates multiple compelling narrative approaches
✅ **Brand Lens** clearly defines how brand can authentically tell the story
✅ **Visual Generator** creates relevant visual concept and executable prompt
✅ **Brand QA** provides thorough assessment with actionable recommendations

The complete workflow should produce a comprehensive, brand-aligned PR response ready for execution across multiple channels.