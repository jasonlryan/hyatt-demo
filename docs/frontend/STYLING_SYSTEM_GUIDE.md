# 🎨 Unified Styling System Guide

## 🎯 **Overview**

This guide documents the **Unified Styling System** for the Hive application. The system uses **CSS custom properties (design tokens)** mapped to Tailwind CSS classes to ensure consistent, maintainable, and brand-aligned styling across the entire application.

## 🏗️ **Architecture**

### **Design Tokens → Tailwind Mapping**

The system uses CSS custom properties defined in `frontend/src/styles/design-tokens.css` and mapped in `frontend/tailwind.config.js`:

```css
/* Design Tokens (frontend/src/styles/design-tokens.css) */
:root {
  /* Primary Colors - Hyatt Brand */
  --color-primary: #0078d4;
  --color-primary-hover: #106ebe;
  --color-primary-light: #e6f3ff;
  --color-primary-lighter: #f0f8ff;

  /* Success Colors */
  --color-success: #107c10;
  --color-success-hover: #0e6b0e;
  --color-success-light: #e6f4e6;

  /* Text Colors */
  --color-text-primary: #323130;
  --color-text-secondary: #605e5c;
  --color-text-muted: #8a8886;

  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f3f2f1;
  --color-bg-secondary-hover: #edebe9;

  /* Border Colors */
  --color-border: #edebe9;
  --color-border-hover: #c8c6c4;
}
```

```javascript
// Tailwind Config Mapping (frontend/tailwind.config.js)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          lighter: "var(--color-primary-lighter)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          hover: "var(--color-success-hover)",
          light: "var(--color-success-light)",
        },
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        secondary: {
          DEFAULT: "var(--color-bg-secondary)",
          hover: "var(--color-bg-secondary-hover)",
        },
        border: "var(--color-border)",
        "border-hover": "var(--color-border-hover)",
      },
    },
  },
};
```

## 🎨 **Color Usage Guidelines**

### **Primary Actions & Brand Elements**

```jsx
// ✅ CORRECT - Primary buttons, links, brand elements
<button className="bg-primary hover:bg-primary-hover text-white">
  Save Changes
</button>

<a className="text-primary hover:text-primary-hover">
  Learn More
</a>
```

### **Success States & Positive Actions**

```jsx
// ✅ CORRECT - Success messages, confirmations
<div className="bg-success-light text-success border border-success">
  Changes saved successfully!
</div>

<button className="bg-success hover:bg-success-hover text-white">
  Confirm
</button>
```

### **Text Hierarchy**

```jsx
// ✅ CORRECT - Text color hierarchy
<h1 className="text-text-primary">Main Heading</h1>
<p className="text-text-secondary">Secondary text</p>
<span className="text-text-muted">Muted helper text</span>
```

### **Backgrounds & Containers**

```jsx
// ✅ CORRECT - Background usage
<div className="bg-bg-primary">Main content area</div>
<div className="bg-secondary hover:bg-secondary-hover">Interactive container</div>
```

### **Borders & Dividers**

```jsx
// ✅ CORRECT - Border usage
<div className="border border-border">Content container</div>
<div className="border-t border-border">Divider</div>
```

## ❌ **Forbidden Patterns**

### **Hardcoded Colors (NEVER USE)**

```jsx
// ❌ FORBIDDEN - Hardcoded Tailwind colors
<button className="bg-blue-600 hover:bg-blue-700">Save</button>
<div className="text-gray-900">Heading</div>
<span className="bg-green-100 text-green-800">Status</span>
```

### **Inconsistent Patterns**

```jsx
// ❌ FORBIDDEN - Mixed patterns
<button className="bg-primary text-blue-600">Mixed colors</button>
<div className="text-text-primary border-blue-200">Inconsistent</div>
```

## 🔧 **Component Patterns**

### **Button Components**

```jsx
// Primary Button
<button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors">
  Primary Action
</button>

// Secondary Button
<button className="px-4 py-2 bg-secondary hover:bg-secondary-hover text-text-primary font-medium rounded transition-colors">
  Secondary Action
</button>

// Success Button
<button className="px-4 py-2 bg-success hover:bg-success-hover text-white font-medium rounded transition-colors">
  Confirm
</button>
```

### **Form Elements**

```jsx
// Input Field
<input
  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
  placeholder="Enter text..."
/>

// Label
<label className="block text-sm font-medium text-text-secondary mb-2">
  Field Label
</label>
```

### **Status Indicators**

```jsx
// Success Status
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success">
  ✓ Active
</span>

// Info Status
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-light text-primary">
  ℹ Info
</span>
```

## 🛡️ **Enforcement Mechanisms**

### **1. Cursor Rules (`.cursor/rules/styling-system.mdc`)**

The Cursor IDE enforces styling standards through rules that:

- **Forbid hardcoded colors** (bg-blue-_, text-green-_, etc.)
- **Require design token usage** for all color properties
- **Provide real-time feedback** during development
- **Suggest correct patterns** automatically

### **2. Code Review Checklist**

Every component must pass these checks:

- [ ] No hardcoded color values (`bg-blue-*`, `text-green-*`, etc.)
- [ ] All colors use design tokens (`bg-primary`, `text-text-primary`, etc.)
- [ ] Hover states use token variants (`hover:bg-primary-hover`)
- [ ] Focus states are accessible (`focus:ring-primary`)
- [ ] Visual consistency with existing components

### **3. Automated Validation**

```bash
# Check for hardcoded colors
grep -r "bg-blue-\|bg-green-\|bg-gray-\|text-blue-\|text-green-\|text-gray-" frontend/src/components/

# Should return no results in production code
```

### **4. Development Workflow**

1. **New Component Development**:

   - Use design tokens from the start
   - Follow established patterns
   - Test with different color schemes

2. **Component Updates**:

   - Migrate any hardcoded colors to tokens
   - Maintain visual consistency
   - Update documentation if needed

3. **Code Review**:
   - Verify design token usage
   - Check accessibility compliance
   - Ensure brand consistency

## 📚 **Reference Materials**

### **Design Token Reference**

| Token                 | Usage                             | Example                                  |
| --------------------- | --------------------------------- | ---------------------------------------- |
| `bg-primary`          | Primary buttons, brand elements   | `<button className="bg-primary">`        |
| `bg-primary-hover`    | Primary button hover states       | `hover:bg-primary-hover`                 |
| `bg-success`          | Success actions, confirmations    | `<button className="bg-success">`        |
| `text-text-primary`   | Main headings, important text     | `<h1 className="text-text-primary">`     |
| `text-text-secondary` | Secondary text, descriptions      | `<p className="text-text-secondary">`    |
| `bg-secondary`        | Secondary backgrounds, containers | `<div className="bg-secondary">`         |
| `border-border`       | Standard borders, dividers        | `<div className="border border-border">` |

### **Migration Patterns**

| Old Pattern       | New Pattern           | Context         |
| ----------------- | --------------------- | --------------- |
| `bg-blue-600`     | `bg-primary`          | Primary actions |
| `bg-green-600`    | `bg-success`          | Success states  |
| `text-gray-900`   | `text-text-primary`   | Main text       |
| `text-gray-600`   | `text-text-secondary` | Secondary text  |
| `bg-gray-50`      | `bg-secondary`        | Backgrounds     |
| `border-gray-200` | `border-border`       | Borders         |

## 🎯 **Best Practices**

### **1. Semantic Usage**

- Use `primary` for main actions and brand elements
- Use `success` for positive states and confirmations
- Use `text-*` tokens for proper text hierarchy
- Use `secondary` for supporting elements

### **2. Accessibility**

- Maintain proper contrast ratios
- Use focus states for keyboard navigation
- Ensure color isn't the only indicator of state

### **3. Consistency**

- Follow established patterns from existing components
- Use the same token for similar purposes across components
- Maintain visual hierarchy through token usage

### **4. Maintainability**

- Centralize color changes in design tokens
- Use semantic token names for clarity
- Document any new token additions

## 🚀 **Getting Started**

### **For New Developers**

1. Read this guide thoroughly
2. Review existing components for patterns
3. Use the design token reference table
4. Follow the enforcement mechanisms

### **For Component Migration**

1. Identify hardcoded colors using grep
2. Map to appropriate design tokens
3. Test visual consistency
4. Update documentation

### **For Design Changes**

1. Update design tokens in `design-tokens.css`
2. Test across all components
3. Update this documentation
4. Communicate changes to the team

## 📞 **Support**

- **Questions**: Review existing components for examples
- **Issues**: Check the enforcement mechanisms
- **Updates**: Follow the development workflow
- **Documentation**: Keep this guide updated

---

**Remember**: The unified styling system ensures consistency, maintainability, and brand alignment. Always use design tokens instead of hardcoded colors!
