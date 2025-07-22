# Hyatt & Hive Genericization Plan

**Note:** This plan is the foundation for all further Hive orchestration work. Complete Phase 1 before starting the Hive workflow transformation (see hive-orchestration-transformation-plan.md).

## Phase 1: Genericize Hyatt Orchestrator

1. **Refactor Campaign Analysis**
   - Update identifyIndustry(), extractCampaignKeywords(), extractTargetMarket(), and extractFocusAreas() to remove hard-coded hospitality logic and add dynamic detection for any industry/brand.
2. **Genericize Agent Prompts**
   - Update all Hyatt agent prompts to use [INDUSTRY], [BRAND_CONTEXT], etc. instead of hard-coded references.
3. **Update Context Passing**
   - Pass industry, brandContext, and targetAudience to all agents and inject into prompts dynamically.
4. **Test Thoroughly**
   - Test with hospitality and at least two new industries, plus edge cases (unknown industry, missing brand context, complex briefs).
5. **Document and Validate**
   - Update documentation and ensure all tests pass.

## Phase 2: Apply Genericization to Hive

- Use the validated approach from Hyatt to make Hive industry-agnostic before workflow transformation.
- See hive-orchestration-transformation-plan.md for the next steps.

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
