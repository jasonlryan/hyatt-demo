# Hyatt & Hive Genericization Plan

## Overview

This plan outlines a two-phase approach to make both Hyatt and Hive orchestrations industry-agnostic. **Phase 1** focuses on genericizing Hyatt's campaign analysis and agent prompts while maintaining full functionality. **Phase 2** applies the same genericization to Hive for PR response to cultural/brand moments.

## Why This Two-Phase Approach?

### **Risk Mitigation Strategy:**

1. **Test with Working System** - Hyatt is proven and functional
2. **Validate Genericization** - Ensure placeholders work correctly
3. **Maintain Backward Compatibility** - Hyatt still works for hospitality
4. **Reuse Validated Approach** - Apply same pattern to Hive

### **Current Problem:**

- Both orchestrations have hard-coded industry references
- Hyatt: `identifyIndustry()`, `extractCampaignKeywords()` hard-coded for hospitality
- Hive: Agent prompts hard-coded for "hospitality campaigns"
- Need industry flexibility for both systems

## Phase 1: Genericize Hyatt Orchestrator (Week 1)

### 1.1 Update Hyatt's Campaign Analysis

**Objective**: Make Hyatt's campaign analysis industry-agnostic

**Current Situation**:

- `identifyIndustry()` hard-coded for hospitality detection
- `extractCampaignKeywords()` has hospitality-specific terms
- `extractTargetMarket()` assumes hospitality audiences
- `extractFocusAreas()` hospitality-focused

**End Goal**:

- Dynamic industry detection from campaign brief
- Generic keyword extraction for any industry
- Flexible target market analysis
- Industry-agnostic focus areas

**Codex Prompt**:

```
Update Hyatt's campaign analysis to be industry-agnostic.

Current file: hive/orchestrations/classes/HyattOrchestrator.js

REQUIREMENTS:
1. Update identifyIndustry() method:
   - Remove hard-coded hospitality detection
   - Add dynamic industry detection from brief text
   - Support: hospitality, technology, retail, healthcare, finance, automotive, etc.
   - Return "general" as fallback

2. Update extractCampaignKeywords() method:
   - Replace hospitality-specific terms with generic industry detection
   - Add industry-agnostic campaign terms
   - Support audience keywords across industries
   - Maintain existing functionality for hospitality

3. Update extractTargetMarket() method:
   - Remove hospitality-specific audience assumptions
   - Add generic audience detection
   - Support multiple industry audience types

4. Update extractFocusAreas() method:
   - Make focus areas industry-agnostic
   - Support common focus areas across industries
   - Maintain hospitality compatibility

5. Add brand context extraction:
   - Extract brand positioning from brief
   - Support: luxury, accessible, innovative, traditional, etc.

Example transformations:
- "hospitality, hotel, resort" → dynamic industry detection
- "luxury hospitality" → industry + brand context
- "tech startup" → industry: technology, brand: innovative
```

### 1.2 Genericize Hyatt Agent Prompts

**Objective**: Update Hyatt's agent prompts to use industry/brand placeholders

**Current Situation**:

- Prompts hard-coded for "hospitality campaigns"
- Specific to "Hyatt luxury hospitality"
- Not flexible for different industries

**End Goal**:

- Generic prompts with `[INDUSTRY]`, `[BRAND_CONTEXT]` placeholders
- Dynamic context injection based on campaign analysis
- Maintain existing functionality for hospitality

**Codex Prompt**:

```
Genericize Hyatt agent prompts to work for any industry.

Files to update:
- hive/agents/prompts/trending_news_gpt.md
- hive/agents/prompts/strategic_insight_gpt.md
- hive/agents/prompts/story_angles_headlines_gpt.md
- hive/agents/prompts/pr_manager_gpt.md
- hive/agents/prompts/research_audience_gpt.md

REQUIREMENTS:
1. Replace hard-coded industry references:
   - "hospitality, travel" → "[INDUSTRY]"
   - "Hyatt luxury hospitality" → "[BRAND_CONTEXT]"
   - "travel industry trends" → "[INDUSTRY] trends"

2. Add dynamic context injection:
   - Industry type from campaign analysis
   - Brand positioning from campaign analysis
   - Target audience segments
   - Campaign objectives

3. Maintain existing functionality:
   - Hospitality campaigns should work exactly as before
   - All existing features preserved
   - No breaking changes

4. Add industry-specific guidance:
   - Industry-specific trend categories
   - Industry-specific audience insights
   - Industry-specific story angles

Example transformations:
- "hospitality campaigns" → "[INDUSTRY] campaigns"
- "travel industry trends" → "[INDUSTRY] trends and cultural moments"
- "luxury hospitality" → "[BRAND_CONTEXT]"
```

### 1.3 Update Hyatt Context Passing

**Objective**: Pass industry and brand context to agents

**Current Situation**:

- Campaign context doesn't include industry/brand information
- Agents don't receive dynamic context
- Hard-coded assumptions in agent calls

**End Goal**:

- Pass industry and brand context to all agents
- Dynamic context injection in agent prompts
- Flexible agent responses based on context

**Codex Prompt**:

```
Update Hyatt to pass industry and brand context to agents.

Current file: hive/orchestrations/classes/HyattOrchestrator.js

REQUIREMENTS:
1. Update campaign context structure:
   - Add industry field from identifyIndustry()
   - Add brandContext field from extractBrandContext()
   - Add targetAudience field from extractTargetMarket()
   - Maintain existing fields for backward compatibility

2. Update agent context passing:
   - Pass industry context to all agent calls
   - Pass brand context to all agent calls
   - Update agent prompt injection with dynamic values
   - Maintain existing agent functionality

3. Update agent intro messages:
   - Include industry context in agent introductions
   - Include brand context in agent introductions
   - Update message templates with placeholders

4. Update handoff messages:
   - Include industry context in phase handoffs
   - Include brand context in phase handoffs
   - Maintain existing handoff functionality

Example context structure:
{
  industry: "technology",
  brandContext: "innovative",
  targetAudience: "young professionals",
  // ... existing fields
}
```

### 1.4 Test Hyatt with Generic Prompts

**Objective**: Verify Hyatt works correctly with genericized prompts

**Current Situation**:

- Need to test genericization doesn't break existing functionality
- Verify new industries work correctly
- Ensure backward compatibility

**End Goal**:

- Hyatt works for hospitality (backward compatibility)
- Hyatt works for other industries (new functionality)
- All phases complete successfully

**Codex Prompt**:

```
Test Hyatt orchestration with genericized prompts.

Testing requirements:
1. Test backward compatibility:
   - Run hospitality campaign (should work exactly as before)
   - Verify all phases complete successfully
   - Check agent responses maintain quality
   - Validate final deliverables

2. Test new industries:
   - Test technology industry campaign
   - Test retail industry campaign
   - Test healthcare industry campaign
   - Verify industry-specific responses

3. Test context injection:
   - Verify industry context passed correctly
   - Verify brand context passed correctly
   - Check agent prompts use correct placeholders
   - Validate dynamic context replacement

4. Test edge cases:
   - Unknown industry (should use "general")
   - Mixed industry references
   - Missing brand context
   - Complex campaign briefs

Expected results:
- Hospitality campaigns work identically to before
- New industries generate appropriate responses
- Context placeholders replaced correctly
- No errors or broken functionality
```

## Phase 2: Apply Genericization to Hive (Week 2)

### 2.1 Update Hive Workflow for PR Response

**Objective**: Transform Hive from visual creation to PR response workflow

**Current Situation**:

- Uses visual-focused agents (VisualPromptGenerator, ModularElementsRecommender)
- Designed for marketing campaign visual creation
- Wrong agent order for PR response

**End Goal**:

- Use PR-focused agents in correct order
- Include visual generation step for chosen PR idea
- Proper moment-based input handling

**Codex Prompt**:

```
Update HiveOrchestrator to use PR response workflow.

Current file: hive/orchestrations/classes/HiveOrchestrator.js

REQUIREMENTS:
1. Replace current agents with PR-focused agents:
   - TrendingNewsAgent (analyze the moment)
   - StrategicInsightAgent (find human truth)
   - StoryAnglesAgent (generate PR ideas)
   - PRManagerAgent (synthesize strategy)
   - VisualPromptGeneratorAgent (create key visual for chosen idea)
   - BrandQAAgent (final brand alignment)

2. Update workflow order:
   - Step 1: Analyze moment and implications
   - Step 2: Discover human truth behind moment
   - Step 3: Generate PR response ideas
   - Step 4: Synthesize best idea into PR strategy
   - Step 5: Create key visual for chosen PR idea
   - Step 6: Final brand alignment assessment

3. Update context handling:
   - Accept moment input instead of campaign brief
   - Pass industry, brand context, moment type
   - Handle different moment scenarios (crisis, opportunity, etc.)

4. Update deliverable structure:
   - Moment analysis (text)
   - Strategic insights (text)
   - PR ideas (text)
   - PR strategy (text)
   - Key visual (image)
   - Brand assessment (text)
```

### 2.2 Update Hive API for Moment Input

**Objective**: Change Hive API to accept moment input instead of campaign details

**Current Situation**:

- API expects campaign, visualObjective, heroVisualDescription
- Designed for marketing campaign creation
- Wrong input structure for PR response

**End Goal**:

- Accept moment description and context
- Handle different moment types
- Pass correct context to agents

**Codex Prompt**:

```
Update Hive API endpoint for moment input.

Current file: hive/routes/visual.js

REQUIREMENTS:
1. Update input validation:
   - Replace campaign, visualObjective, heroVisualDescription
   - Add moment, industry, brandContext, momentType
   - Validate required fields for PR response

2. Update context structure:
   - moment: "Description of the cultural/brand moment"
   - industry: "tech|retail|hospitality|etc."
   - brandContext: "luxury|accessible|innovative|etc."
   - momentType: "crisis|opportunity|competitor|cultural"
   - targetAudience: "Who we want to reach"
   - desiredOutcome: "What we want to achieve"

3. Update workflow phases:
   - trend_analysis → moment_analysis
   - brand_lens → strategic_insights
   - visual_prompt → pr_ideas
   - modular_elements → pr_strategy
   - qa_review → key_visual
   - Add final_qa phase

4. Update deliverable titles and types:
   - "Trend Insights" → "Moment Analysis"
   - "Brand Lens" → "Strategic Insights"
   - "Visual Prompt" → "PR Ideas"
   - "Modular Elements" → "PR Strategy"
   - "QA Review" → "Key Visual"
   - Add "Brand Assessment"
```

### 2.3 Update Hive Frontend for Moment Input

**Objective**: Update frontend to collect moment information instead of campaign details

**Current Situation**:

- HiveMomentForm collects campaign details
- Designed for marketing campaign creation
- Wrong fields for PR response

**End Goal**:

- Form for moment description and context
- Industry and brand context selection
- Moment type classification

**Codex Prompt**:

```
Update Hive frontend for moment input.

Files to update:
- frontend/src/components/shared/HiveMomentForm.tsx
- frontend/src/components/shared/HiveAgentCollaboration.tsx

REQUIREMENTS:
1. Update HiveMomentForm:
   - Replace campaign fields with moment fields
   - moment: Textarea for moment description
   - industry: Dropdown (tech, retail, hospitality, etc.)
   - brandContext: Dropdown (luxury, accessible, innovative, etc.)
   - momentType: Dropdown (crisis, opportunity, competitor, cultural)
   - targetAudience: Text input
   - desiredOutcome: Text input

2. Update HiveAgentCollaboration:
   - Update phase definitions for PR workflow
   - Update phase icons and descriptions
   - Handle new deliverable types

3. Update form validation and submission:
   - Require moment description
   - Require industry and brand context
   - Send moment context instead of campaign context
```

### 2.4 Test Complete Hive PR Workflow

**Objective**: Verify complete PR response workflow from moment input to strategy and visual

**Current Situation**:

- Need to test new PR response workflow
- Verify genericized prompts work for Hive
- Test visual generation for PR ideas

**End Goal**:

- Complete PR response workflow works
- Genericized prompts handle different industries/brands
- Visual generation works for chosen PR idea

**Codex Prompt**:

```
Test complete Hive PR response workflow.

Testing requirements:
1. Test moment input and processing:
   - Submit moment description
   - Verify industry and brand context passed correctly
   - Check moment type classification

2. Test PR workflow phases:
   - Moment analysis completes successfully
   - Strategic insights generated
   - PR ideas created
   - PR strategy synthesized
   - Key visual generated for chosen idea
   - Brand assessment completed

3. Test genericized prompts:
   - Test with different industries (tech, retail, hospitality)
   - Test with different brand contexts (luxury, accessible, innovative)
   - Test with different moment types (crisis, opportunity, competitor, cultural)

4. Test visual generation:
   - Verify key visual is created for chosen PR idea
   - Check image displays correctly in UI
   - Test image download functionality

Expected workflow:
1. Moment Analysis (text) - "What's happening?"
2. Strategic Insights (text) - "What's the human truth?"
3. PR Ideas (text) - "How could we respond?"
4. PR Strategy (text) - "Comprehensive response plan"
5. Key Visual (image) - "Visual for chosen idea"
6. Brand Assessment (text) - "Is this aligned?"
```

## Implementation Timeline

### Week 1: Genericize Hyatt

- **Day 1-2**: Update Hyatt's campaign analysis to be industry-agnostic
- **Day 3-4**: Genericize Hyatt agent prompts
- **Day 5**: Update Hyatt context passing
- **Weekend**: Test Hyatt with generic prompts thoroughly

### Week 2: Apply to Hive

- **Day 1-2**: Update Hive workflow for PR response
- **Day 3**: Update Hive API for moment input
- **Day 4**: Update Hive frontend for moment input
- **Day 5**: Test complete Hive PR workflow

## Success Metrics

### Phase 1 Success (Hyatt):

1. **Backward Compatibility**: Hyatt works identically for hospitality ✅
2. **Industry Flexibility**: Hyatt works for tech, retail, healthcare, etc. ✅
3. **Context Injection**: Industry/brand context passed correctly ✅
4. **Quality Maintenance**: Agent responses maintain quality ✅

### Phase 2 Success (Hive):

1. **PR Workflow**: Complete PR response workflow functions ✅
2. **Generic Flexibility**: Works for any industry/brand combination ✅
3. **Visual Generation**: Key visual created for chosen PR idea ✅
4. **User Experience**: Smooth workflow from moment input to strategy ✅

## Risk Mitigation

1. **Backward Compatibility**: Hyatt must work exactly as before for hospitality
2. **Incremental Testing**: Test each phase thoroughly before proceeding
3. **Rollback Plan**: Ability to revert changes if issues arise
4. **Validation Strategy**: Comprehensive testing with multiple industries

## Conclusion

This two-phase approach ensures we don't break the working Hyatt system while making both orchestrations industry-flexible. By testing genericization with Hyatt first, we validate the approach before applying it to Hive's PR response workflow. The result will be two powerful, industry-agnostic orchestration systems that can handle any industry and brand context.
