# Codex Prompt: Unified Styling System Migration

## 🎯 **Mission**

You are tasked with completing the migration of remaining React components from hardcoded Tailwind colors to the unified design token system. **Phases 1, 2, and 3 are COMPLETE** - we need to finish Phases 4 and 5.

## 📋 **Context**

### **Current State:**

- **Foundation Complete**: Design tokens, Tailwind config, style guide, and Cursor rule are all established
- **Phases 1-3 COMPLETE**: Shared components, navigation, and core pages are fully migrated
- **Remaining Work**: Phases 4 (Orchestration Components) and 5 (Supporting Components)
- **Progress**: 9 out of 20+ components migrated (45% complete)

### **Design Token System:**

```css
/* Available Design Tokens */
:root {
  /* Primary Colors (Hyatt Green) */
  --color-primary: #006241;
  --color-primary-hover: #004d32;
  --color-primary-light: #e6f2ef;
  --color-primary-lighter: #f0f9f6;

  /* Success Colors (Green variants) */
  --color-success: #059669;
  --color-success-hover: #047857;
  --color-success-light: #d1fae5;
  --color-success-lighter: #ecfdf5;

  /* Secondary Colors (Neutral) */
  --color-secondary: #f8fafc;
  --color-secondary-hover: #f1f5f9;

  /* Text Colors */
  --color-text-primary: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;

  /* Border Colors */
  --color-border: #e2e8f0;
  --color-border-focus: #006241;

  /* Status Colors */
  --color-info: #3b82f6;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### **Token Mapping (OLD → NEW):**

```css
/* PRIMARY COLORS */
bg-blue-500 → bg-primary
bg-blue-600 → bg-primary
bg-blue-700 → bg-primary-hover
hover:bg-blue-600 → hover:bg-primary-hover
hover:bg-blue-700 → hover:bg-primary-hover

text-blue-500 → text-primary
text-blue-600 → text-primary
text-blue-700 → text-primary
text-blue-800 → text-primary

border-blue-200 → border-border
border-blue-500 → border-primary
border-blue-600 → border-primary

/* SUCCESS COLORS */
bg-green-500 → bg-success
bg-green-600 → bg-success
bg-green-700 → bg-success-hover
hover:bg-green-600 → hover:bg-success-hover
hover:bg-green-700 → hover:bg-success-hover

text-green-500 → text-success
text-green-600 → text-success
text-green-700 → text-success
text-green-800 → text-success

/* SECONDARY COLORS */
bg-gray-50 → bg-secondary
bg-gray-100 → bg-secondary
bg-gray-200 → bg-secondary
bg-gray-300 → bg-secondary
bg-slate-50 → bg-secondary
bg-slate-100 → bg-secondary
bg-slate-200 → bg-secondary
bg-slate-300 → bg-secondary

text-gray-800 → text-text-primary
text-gray-900 → text-text-primary
text-slate-800 → text-text-primary
text-slate-900 → text-text-primary

border-gray-200 → border-border
border-slate-200 → border-border

/* LIGHT VARIANTS */
bg-blue-50 → bg-primary-light
bg-blue-100 → bg-primary-light
text-blue-100 → text-primary-light
text-blue-200 → text-primary-lighter

bg-green-50 → bg-success-light
bg-green-100 → bg-success-light
text-green-100 → text-success-light
text-green-200 → text-success-lighter
```

## 🚀 **Migration Process**

### **For Each Component:**

#### **Step 1: Analysis**

1. **Identify hardcoded colors** using grep or search
2. **Document current usage** - what colors are used where
3. **Understand component context** - how it's used in the app

#### **Step 2: Planning**

1. **Map colors to tokens** using the mapping above
2. **Consider semantic meaning** - primary actions vs success states
3. **Plan hover/focus states** - ensure consistency

#### **Step 3: Implementation**

1. **Replace colors systematically** - one pattern at a time
2. **Preserve functionality** - don't break existing features
3. **Maintain accessibility** - ensure contrast ratios work

#### **Step 4: Testing**

1. **Visual verification** - component looks correct
2. **Interaction testing** - hover, focus, click states work
3. **Integration testing** - works in context with other components

## 📋 **Component Priority List**

### **✅ Phase 1: High-Impact Shared Components (COMPLETE)**

1. **SharedCampaignForm.tsx** ✅ - Fully migrated
2. **SharedActionButtons.tsx** ✅ - Fully migrated
3. **SharedProgressPanel.tsx** ✅ - Fully migrated
4. **SharedBreadcrumbs.tsx** ✅ - Fully migrated
5. **SharedModal.tsx** ✅ - Fully migrated

### **✅ Phase 2: Navigation & Layout (COMPLETE)**

6. **GlobalNav.tsx** ✅ - Fully migrated
7. **Header.tsx** ✅ - Fully migrated
8. **SidePanel.tsx** ✅ - No hardcoded colors found
9. **SharedOrchestrationLayout.tsx** ✅ - No hardcoded colors found

### **✅ Phase 3: Core Pages (COMPLETE)**

10. **OrchestrationsPage.tsx** ✅ - Fully migrated
11. **WorkflowsPage.tsx** ✅ - Fully migrated
12. **ReviewPanel.tsx** ✅ - Fully migrated

### **🔄 Phase 4: Orchestration Components (IN PROGRESS)**

13. **OrchestrationBuilderPage.tsx** - Still has blue hardcoded colors
14. **HyattOrchestrationPage.tsx** - Still has green hardcoded colors
15. **HiveOrchestrationPage.tsx** - Still has green hardcoded colors
16. **BaseOrchestrationPage.tsx** - Still has green hardcoded colors

### **🔄 Phase 5: Supporting Components (IN PROGRESS)**

17. **AgentCollaboration.tsx** - Still has blue/green hardcoded colors
18. **CampaignSelector.tsx** - Still has blue hardcoded colors
19. **StylePanel.tsx** - Still has blue hardcoded colors
20. **agentStyles.tsx** - Still has blue/green hardcoded colors

## 🔧 **Implementation Guidelines**

### **Color Semantics:**

- **Primary Actions**: Use `bg-primary` / `text-primary` for main CTAs
- **Success States**: Use `bg-success` / `text-success` for positive actions
- **Secondary Elements**: Use `bg-secondary` / `text-text-secondary` for supporting elements
- **Borders**: Use `border-border` for standard borders, `border-primary` for focus states

### **State Management:**

- **Hover States**: Always use `-hover` variants (e.g., `hover:bg-primary-hover`)
- **Focus States**: Use `focus:ring-primary` and `focus:border-primary`
- **Disabled States**: Use `disabled:bg-secondary` and `disabled:text-text-muted`

### **Accessibility:**

- **Contrast Ratios**: Ensure text meets WCAG AA standards
- **Focus Indicators**: Maintain visible focus states
- **Color Independence**: Don't rely solely on color for information

### **Code Quality:**

- **Consistency**: Use the same token for similar purposes across components
- **Readability**: Choose semantic tokens over generic ones
- **Maintainability**: Avoid custom color values

## 🚨 **Critical Rules**

### **DO:**

- ✅ **Follow the token mapping exactly** - no deviations
- ✅ **Test each component after migration** - verify functionality
- ✅ **Preserve existing behavior** - don't break features
- ✅ **Use semantic tokens** - `bg-primary` for primary actions, `bg-success` for success
- ✅ **Maintain accessibility** - ensure contrast and focus states work

### **DON'T:**

- ❌ **Use hardcoded colors** - no `bg-blue-500` or `text-green-600`
- ❌ **Skip testing** - always verify after changes
- ❌ **Mix old and new** - complete migration for each component
- ❌ **Ignore hover states** - always include hover variants
- ❌ **Break existing functionality** - preserve all current features

## 📊 **Success Criteria**

### **For Each Component:**

- [ ] **0 hardcoded colors** remain
- [ ] **All interactions work** - hover, focus, click states
- [ ] **Visual consistency** with other migrated components
- [ ] **No console errors** or build failures
- [ ] **Accessibility maintained** - contrast and focus indicators

### **For Overall System:**

- [ ] **100% design token usage** across all components
- [ ] **Consistent visual language** throughout the application
- [ ] **Improved maintainability** - easy to modify colors globally
- [ ] **Brand alignment** - proper Hyatt colors throughout

## 🎯 **Execution Instructions**

### **For Each Component Migration:**

1. **Start with Phase 4 components** - Orchestration components first
2. **Follow the 4-step process** - Analysis, Planning, Implementation, Testing
3. **Use the exact token mapping** - no creative deviations
4. **Test thoroughly** - visual and functional verification
5. **Document changes** - note any special considerations

### **Quality Assurance:**

- **Before starting**: Understand the component's role and usage
- **During migration**: Make incremental changes and test frequently
- **After completion**: Verify in context with other components
- **Before moving on**: Ensure no regressions or broken functionality

## 📚 **Reference Materials**

- **Design Tokens**: `frontend/src/styles/design-tokens.css`
- **Tailwind Config**: `frontend/tailwind.config.js`
- **Style Guide**: `docs/frontend/STYLING_SYSTEM_GUIDE.md`
- **Cursor Rule**: `.cursor/rules/styling-system.mdc`
- **Example Migrations**:
  - `frontend/src/components/OrchestrationsPage.tsx` (fully migrated)
  - `frontend/src/components/GlobalNav.tsx` (fully migrated)
  - `frontend/src/components/shared/SharedActionButtons.tsx` (fully migrated)

## 🚀 **Ready to Continue**

You now have everything needed to complete the remaining component migrations. Start with **Phase 4: Orchestration Components** and work through each component methodically, following the process and guidelines outlined above.

**Current Progress**: 45% complete (9/20+ components migrated)
**Remaining Work**: 11+ components across Phases 4 and 5

**Remember**: This is the final phase of a critical refactoring that will complete the unified styling system. Take your time, test thoroughly, and ensure each component is fully migrated before moving to the next.

**Good luck!** 🎯
