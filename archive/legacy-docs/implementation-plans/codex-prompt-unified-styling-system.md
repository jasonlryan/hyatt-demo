# Codex Prompt: Unified Styling System Implementation

## 🎯 **Objective**

Implement a unified styling system across the entire codebase to eliminate styling chaos and create a consistent, maintainable design system based on design tokens and standardized patterns.

## 📋 **Context**

The codebase currently suffers from **multiple conflicting styling approaches**:

- Hardcoded Tailwind colors (`bg-green-600`, `bg-blue-600`, `bg-gray-50`)
- Inconsistent color usage (green-600 vs green-500 vs primary)
- Mixed component patterns across different pages
- No single source of truth for colors and styling

## 🏗️ **Implementation Plan**

### **Phase 1: Foundation (Week 1)**

#### **1.1 Update Design Tokens**

- Expand `frontend/src/styles/design-tokens.css` with complete color system
- Add status colors (success, warning, error, info)
- Ensure all tokens have proper contrast ratios
- Document token usage in `docs/frontend/STYLING_SYSTEM_GUIDE.md`

#### **1.2 Update Tailwind Config**

- Map all design tokens to Tailwind classes in `frontend/tailwind.config.js`
- Add brand colors (Hyatt blue, gold)
- Test token accessibility
- Ensure proper CSS custom property integration

#### **1.3 Create Style Guide**

- Document standard component patterns
- Create visual examples for each pattern
- Establish naming conventions
- Update `docs/frontend/STYLING_SYSTEM_GUIDE.md`

### **Phase 2: Core Components (Week 2)**

#### **2.1 Shared Components**

Update these components to use unified system:

- `frontend/src/components/shared/SharedCampaignForm.tsx`
- `frontend/src/components/shared/SharedProgressPanel.tsx`
- `frontend/src/components/shared/SharedActionButtons.tsx`
- `frontend/src/components/shared/SharedHitlToggle.tsx`
- `frontend/src/components/shared/SharedModal.tsx`

#### **2.2 Navigation Components**

- `frontend/src/components/GlobalNav.tsx`
- `frontend/src/components/Header.tsx`
- Breadcrumbs in `frontend/src/components/shared/SharedBreadcrumbs.tsx`

#### **2.3 Layout Components**

- `frontend/src/components/orchestrations/SharedOrchestrationLayout.tsx`
- `frontend/src/components/orchestrations/BaseOrchestrationPage.tsx`
- `frontend/src/components/SidePanel.tsx`

### **Phase 3: Page Components (Week 3)**

#### **3.1 Orchestration Pages**

- `frontend/src/components/OrchestrationsPage.tsx`
- `frontend/src/components/orchestrations/OrchestrationBuilderPage.tsx`
- `frontend/src/components/orchestrations/HyattOrchestrationPage.tsx`
- `frontend/src/components/orchestrations/HiveOrchestrationPage.tsx`
- `frontend/src/components/orchestrations/GenericOrchestrationTemplate.tsx`

#### **3.2 Other Pages**

- `frontend/src/components/AgentsPage.tsx`
- `frontend/src/components/WorkflowsPage.tsx`
- `frontend/src/components/ReviewPanel.tsx`
- All modal components

### **Phase 4: Utilities & Polish (Week 4)**

#### **4.1 Utility Classes**

- Create utility classes for common patterns
- Update CSS files to use design tokens
- Remove hardcoded color values
- Update `archive/development-artifacts/used_classes.txt`

#### **4.2 Testing & Validation**

- Test all components for visual consistency
- Validate accessibility (contrast ratios)
- Test responsive behavior
- Cross-browser testing

## 🎨 **Target Unified System**

### **Design Tokens (Single Source of Truth)**

```css
/* frontend/src/styles/design-tokens.css */
:root {
  /* Primary Colors */
  --color-primary: #4caf50; /* Green for actions */
  --color-primary-hover: #45a049; /* Darker green for hover */
  --color-secondary: #f8f9fa; /* Light background */
  --color-border: #e9ecef; /* Borders */

  /* Text Colors */
  --color-text-primary: #212529; /* Main text */
  --color-text-secondary: #6c757d; /* Secondary text */

  /* Status Colors */
  --color-success: #28a745; /* Success states */
  --color-warning: #ffc107; /* Warning states */
  --color-error: #dc3545; /* Error states */
  --color-info: #17a2b8; /* Info states */

  /* Brand Colors */
  --color-hyatt-blue: #002d72; /* Hyatt brand blue */
  --color-hyatt-blue-hover: #0046a8; /* Hyatt blue hover */
  --color-hyatt-gold: #d4af37; /* Hyatt brand gold */

  /* Typography */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-base-size: 16px;

  /* Spacing */
  --spacing-container: 2rem;
}
```

### **Tailwind Configuration**

```javascript
// frontend/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary system
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        secondary: "var(--color-secondary)",
        border: "var(--color-border)",

        // Text system
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",

        // Status system
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",

        // Brand colors
        "hyatt-blue": "var(--color-hyatt-blue)",
        "hyatt-blue-hover": "var(--color-hyatt-blue-hover)",
        "hyatt-gold": "var(--color-hyatt-gold)",
      },
    },
  },
};
```

### **Standard Component Patterns**

#### **Cards & Containers**

```css
/* Standard card */
bg-white rounded-lg shadow-md p-6 border border-border

/* Page background */
bg-secondary min-h-screen

/* Modal overlay */
bg-black bg-opacity-50
```

#### **Buttons**

```css
/* Primary button */
px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors

/* Secondary button */
px-4 py-2 bg-secondary text-text-primary border border-border rounded hover:bg-gray-100 transition-colors

/* Disabled button */
px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed
```

#### **Typography**

```css
/* Page headers */
text-2xl font-bold text-text-primary mb-4

/* Section headers */
text-xl font-semibold text-text-primary mb-3

/* Body text */
text-text-primary leading-relaxed

/* Secondary text */
text-text-secondary text-sm
```

#### **Form Elements**

```css
/* Input fields */
w-full px-3 py-2 border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary transition

/* Labels */
block text-sm font-medium text-text-primary mb-2

/* Textareas */
w-full h-32 p-3 border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary transition
```

#### **Status Indicators**

```css
/* Success */
bg-success text-white px-2 py-1 rounded-full text-xs

/* Warning */
bg-warning text-black px-2 py-1 rounded-full text-xs

/* Error */
bg-error text-white px-2 py-1 rounded-full text-xs

/* Info */
bg-info text-white px-2 py-1 rounded-full text-xs
```

## 🔧 **Migration Strategy**

### **Step-by-Step Migration Process**

#### **1. Component Analysis**

```bash
# Find all hardcoded colors
grep -r "bg-green-\|bg-blue-\|bg-gray-\|bg-slate-\|bg-indigo-" frontend/src/
grep -r "text-green-\|text-blue-\|text-gray-\|text-slate-\|text-indigo-" frontend/src/
```

#### **2. Token Mapping**

```css
/* OLD → NEW */
bg-green-600 → bg-primary
bg-green-700 → bg-primary-hover
text-gray-900 → text-text-primary
text-gray-600 → text-text-secondary
bg-gray-50 → bg-secondary
border-gray-200 → border-border
```

#### **3. Component Updates**

```jsx
// BEFORE
<div className="bg-gray-50 min-h-screen">
  <button className="bg-green-600 hover:bg-green-700 text-white">
    Action
  </button>
</div>

// AFTER
<div className="bg-secondary min-h-screen">
  <button className="bg-primary hover:bg-primary-hover text-white">
    Action
  </button>
</div>
```

### **Migration Checklist Per Component**

- [ ] Replace hardcoded colors with design tokens
- [ ] Update hover states to use token variants
- [ ] Ensure consistent spacing patterns
- [ ] Test component in isolation
- [ ] Test component in context
- [ ] Update component documentation

## 📊 **Success Metrics**

### **Quantitative Metrics**

- [ ] **0 hardcoded color values** in component files
- [ ] **100% design token usage** across all components
- [ ] **Consistent visual appearance** across all pages
- [ ] **Improved accessibility scores** (WCAG compliance)

### **Qualitative Metrics**

- [ ] **Developer experience** - easier to maintain and modify
- [ ] **User experience** - consistent visual language
- [ ] **Brand consistency** - proper Hyatt colors throughout
- [ ] **Code quality** - reduced duplication and complexity

## ⚠️ **Risks & Mitigation**

### **Risks**

1. **Breaking changes** - visual regressions during migration
2. **Developer resistance** - learning new token system
3. **Incomplete migration** - leaving some components behind
4. **Performance impact** - additional CSS complexity

### **Mitigation Strategies**

1. **Incremental migration** - component by component
2. **Visual regression testing** - screenshots before/after
3. **Developer training** - documentation and examples
4. **Code reviews** - ensure token usage compliance
5. **Performance monitoring** - track CSS bundle size

## 🚀 **Implementation Instructions**

### **For Codex AI:**

1. **Start with Phase 1**: Update design tokens and Tailwind config first
2. **Work incrementally**: Update one component at a time
3. **Test thoroughly**: Verify each component works correctly
4. **Document changes**: Update style documentation as you go
5. **Maintain consistency**: Use the same patterns across all components
6. **Focus on accessibility**: Ensure proper contrast ratios
7. **Preserve functionality**: Don't break existing features
8. **Follow the plan**: Stick to the 4-phase implementation approach

### **Key Principles:**

- **Build on existing code** - don't replace, improve
- **Maintain backward compatibility** - gradual migration
- **Test frequently** - validate changes immediately
- **Document everything** - keep style guide updated
- **Focus on user experience** - consistent visual language

## 📅 **Timeline**

- **Week 1**: Foundation (design tokens, Tailwind config, style guide)
- **Week 2**: Core components (shared, navigation, layout)
- **Week 3**: Page components (orchestrations, other pages)
- **Week 4**: Utilities, testing, documentation

**Total Estimated Time**: 4 weeks

## 🎯 **Expected Outcomes**

### **Immediate Benefits**

- ✅ **Visual consistency** across all components
- ✅ **Easier maintenance** - change colors in one place
- ✅ **Better accessibility** - proper contrast ratios
- ✅ **Brand alignment** - consistent Hyatt colors

### **Long-term Benefits**

- ✅ **Developer productivity** - clear patterns to follow
- ✅ **Reduced bugs** - consistent styling behavior
- ✅ **Easier onboarding** - clear style documentation
- ✅ **Future-proof** - scalable design system

This unified styling system will transform the codebase from styling chaos into a cohesive, maintainable design system that scales with the project's growth.
