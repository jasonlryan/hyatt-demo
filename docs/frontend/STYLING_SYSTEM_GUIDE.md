# Unified Styling System Guide

## 🎯 Overview

The Hive Agent System uses a **unified styling system** based on design tokens and consistent patterns. This system eliminates styling chaos and provides a maintainable, scalable approach to UI design.

## 🏗️ Architecture

### **Design Tokens (Single Source of Truth)**

Located in: `frontend/src/styles/design-tokens.css`

```css
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

### **Tailwind Integration**

Located in: `frontend/tailwind.config.js`

```javascript
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

## 🎨 Standard Component Patterns

### **Page Structure**

```jsx
<div className="bg-secondary min-h-screen">
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold text-text-primary mb-4">Page Title</h1>
    {/* Content */}
  </div>
</div>
```

### **Cards & Containers**

```css
/* Standard card */
bg-white rounded-lg shadow-md p-6 border border-border

/* Page background */
bg-secondary min-h-screen

/* Modal overlay */
bg-black bg-opacity-50
```

### **Buttons**

```css
/* Primary button */
px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors

/* Secondary button */
px-4 py-2 bg-secondary text-text-primary border border-border rounded hover:bg-gray-100 transition-colors

/* Disabled button */
px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed
```

### **Typography**

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

### **Form Elements**

```css
/* Input fields */
w-full px-3 py-2 border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary transition

/* Labels */
block text-sm font-medium text-text-primary mb-2

/* Textareas */
w-full h-32 p-3 border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary transition
```

### **Status Indicators**

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

## 🔧 Usage Guidelines

### **DO: Use Design Tokens**

```jsx
// ✅ CORRECT - Using design tokens
<button className="bg-primary hover:bg-primary-hover text-white">
  Save
</button>

<div className="bg-secondary min-h-screen">
  <h1 className="text-text-primary">Title</h1>
</div>
```

### **DON'T: Use Hardcoded Colors**

```jsx
// ❌ WRONG - Hardcoded colors
<button className="bg-green-600 hover:bg-green-700 text-white">
  Save
</button>

<div className="bg-gray-50 min-h-screen">
  <h1 className="text-gray-900">Title</h1>
</div>
```

### **Color Mapping Reference**

```css
/* OLD → NEW */
bg-green-600 → bg-primary
bg-green-700 → bg-primary-hover
bg-blue-600 → bg-primary (for actions)
bg-blue-700 → bg-primary-hover
text-gray-900 → text-text-primary
text-gray-600 → text-text-secondary
text-blue-600 → text-primary
bg-gray-50 → bg-secondary
bg-slate-50 → bg-secondary
border-gray-200 → border-border
border-slate-200 → border-border
focus:ring-blue-500 → focus:ring-primary
focus:border-blue-500 → focus:border-primary
```

## 🎯 Brand Color Usage

### **Hyatt Brand Colors (For Hyatt-Specific Features Only)**

```jsx
// Hyatt orchestration features
<div className="bg-hyatt-blue hover:bg-hyatt-blue-hover">
  Hyatt Campaign
</div>

// Hyatt accent elements
<span className="text-hyatt-gold">Hyatt Brand</span>
```

### **General UI Colors (For System Features)**

```jsx
// Primary actions
<button className="bg-primary hover:bg-primary-hover">
  Save
</button>

// Secondary elements
<div className="bg-secondary text-text-primary">
  Content
</div>
```

## 📋 Migration Checklist

### **For Each Component:**

- [ ] Replace hardcoded colors with design tokens
- [ ] Update hover states to use token variants
- [ ] Ensure consistent spacing patterns
- [ ] Test component in isolation
- [ ] Test component in context
- [ ] Update component documentation

### **Common Replacements:**

```jsx
// Buttons
bg-blue-600 hover:bg-blue-700 → bg-primary hover:bg-primary-hover
bg-green-600 hover:bg-green-700 → bg-primary hover:bg-primary-hover

// Text
text-gray-900 → text-text-primary
text-gray-600 → text-text-secondary
text-blue-600 → text-primary

// Backgrounds
bg-gray-50 → bg-secondary
bg-slate-50 → bg-secondary

// Borders
border-gray-200 → border-border
border-slate-200 → border-border

// Focus states
focus:ring-blue-500 → focus:ring-primary
focus:border-blue-500 → focus:border-primary
```

## 🔍 Testing & Validation

### **Visual Consistency Check**

- [ ] All components use design tokens
- [ ] No hardcoded color values
- [ ] Consistent hover states
- [ ] Proper contrast ratios

### **Accessibility Check**

- [ ] Text contrast meets WCAG standards
- [ ] Focus states are visible
- [ ] Color is not the only indicator

### **Cross-Browser Testing**

- [ ] CSS custom properties work in all browsers
- [ ] Tailwind classes render correctly
- [ ] Hover states function properly

## 🚀 Best Practices

1. **Always use design tokens** - Never hardcode colors
2. **Test in context** - Verify components work together
3. **Document changes** - Update style guides when adding new patterns
4. **Maintain consistency** - Use the same patterns across similar components
5. **Consider accessibility** - Ensure proper contrast and focus states

## 📚 Complete Token Reference

### **Color Tokens**

- `--color-primary` – primary green used for buttons and highlights
- `--color-primary-hover` – darker primary green for hover states
- `--color-secondary` – light gray page background
- `--color-border` – neutral border color
- `--color-text-primary` – default text color
- `--color-text-secondary` – muted text color
- `--color-success` – success states
- `--color-warning` – warning states
- `--color-error` – error states
- `--color-info` – info states
- `--color-hyatt-blue` – Hyatt brand blue
- `--color-hyatt-blue-hover` – darker Hyatt blue for hover
- `--color-hyatt-gold` – Hyatt brand gold

### **Typography Tokens**

- `--font-sans` – main sans-serif font stack
- `--font-base-size` – base font size

### **Spacing Tokens**

- `--spacing-container` – horizontal padding for the main container

This unified styling system provides a solid foundation for consistent, maintainable UI development across the entire Hive Agent System.
