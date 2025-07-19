# Proactive Styling Development Prompt

## 🎯 **Use This Prompt When Creating New Components**

When you need to create a new React component, use this prompt to ensure it follows the unified styling system from the start:

---

**"Create a new React component for [COMPONENT_NAME] that follows the unified styling system. Use ONLY design tokens (bg-primary, text-text-primary, etc.) and NEVER hardcoded colors (bg-blue-600, text-gray-900, etc.). Follow the mandatory component patterns and ensure proper hover states, focus states, and accessibility."**

---

## 🚨 **CRITICAL: Never Use Hardcoded Colors**

### **❌ FORBIDDEN:**

```jsx
// NEVER write these:
bg-blue-500, bg-blue-600, bg-green-500, bg-green-600
text-blue-600, text-gray-900, text-slate-800
border-blue-200, border-gray-200
hover:bg-blue-600, focus:ring-blue-500
```

### **✅ REQUIRED:**

```jsx
// ALWAYS write these:
bg-primary, bg-success, bg-secondary
text-primary, text-text-primary, text-text-secondary
border-border, border-primary
hover:bg-primary-hover, focus:ring-primary
```

## 🎨 **Mandatory Component Templates**

### **Page Component Template**

```jsx
import React from 'react';

interface [ComponentName]Props {
  // Define your props here
}

const [ComponentName]: React.FC<[ComponentName]Props> = ({ /* props */ }) => {
  return (
    <div className="bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">[Page Title]</h1>

        {/* Your content here */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">[Section Title]</h2>
          <p className="text-text-secondary mb-4">[Description]</p>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium">
              Primary Action
            </button>
            <button className="px-4 py-2 bg-secondary text-text-primary border border-border rounded hover:bg-secondary-hover transition-colors font-medium">
              Secondary Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default [ComponentName];
```

### **Card Component Template**

```jsx
import React from 'react';

interface [ComponentName]Props {
  // Define your props here
}

const [ComponentName]: React.FC<[ComponentName]Props> = ({ /* props */ }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <h2 className="text-xl font-semibold text-text-primary mb-4">[Card Title]</h2>
      <p className="text-text-secondary mb-4">[Card description]</p>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium">
          Primary Action
        </button>
        <button className="px-4 py-2 bg-secondary text-text-primary border border-border rounded hover:bg-secondary-hover transition-colors font-medium">
          Secondary Action
        </button>
      </div>
    </div>
  );
};

export default [ComponentName];
```

### **Form Component Template**

```jsx
import React, { useState } from 'react';

interface [ComponentName]Props {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const [ComponentName]: React.FC<[ComponentName]Props> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <h2 className="text-xl font-semibold text-text-primary mb-6">[Form Title]</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fieldName" className="block text-sm font-medium text-text-secondary mb-2">
            [Field Label]
          </label>
          <input
            id="fieldName"
            type="text"
            className="w-full px-3 py-2 border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="[Placeholder text]"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-secondary text-text-primary border border-border rounded hover:bg-secondary-hover transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default [ComponentName];
```

## 🎯 **Semantic Color Usage Guide**

### **Primary Actions (Main CTAs)**

```jsx
// Use for main actions like Save, Submit, Create
<button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium">
  Save Campaign
</button>
```

### **Success Actions (Positive outcomes)**

```jsx
// Use for success actions like Complete, Approve, Activate
<button className="px-4 py-2 bg-success hover:bg-success-hover text-white rounded transition-colors font-medium">
  Complete
</button>
```

### **Secondary Elements (Supporting content)**

```jsx
// Use for neutral backgrounds and secondary actions
<div className="bg-secondary p-4">
  <p className="text-text-secondary">Supporting text</p>
</div>

<button className="px-4 py-2 bg-secondary text-text-primary border border-border rounded hover:bg-secondary-hover transition-colors font-medium">
  Cancel
</button>
```

### **Text Hierarchy**

```jsx
// Main headings
<h1 className="text-text-primary font-bold">Main Title</h1>

// Secondary text
<p className="text-text-secondary">Description text</p>

// Muted text
<span className="text-text-muted">Helper text</span>
```

## 🔍 **Quick Reference**

### **Available Design Tokens**

```css
/* Background Colors */
bg-primary, bg-primary-hover, bg-primary-light, bg-primary-lighter
bg-success, bg-success-hover, bg-success-light, bg-success-lighter
bg-secondary, bg-secondary-hover
bg-warning, bg-error, bg-info

/* Text Colors */
text-primary, text-primary-light, text-primary-lighter
text-success, text-success-light, text-success-lighter
text-text-primary, text-text-secondary, text-text-muted

/* Border Colors */
border-border, border-border-focus, border-primary

/* Focus States */
focus:ring-primary, focus:border-primary

/* Hover States */
hover:bg-primary-hover, hover:bg-success-hover
```

### **Common Patterns**

```jsx
// Page container
<div className="bg-secondary min-h-screen">
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Content */}
  </div>
</div>

// Card
<div className="bg-white rounded-lg shadow-md p-6 border border-border">
  {/* Content */}
</div>

// Button
<button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium">
  Action
</button>

// Input
<input className="w-full px-3 py-2 border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary transition" />

// Label
<label className="block text-sm font-medium text-text-secondary mb-2">
  Label
</label>
```

## ⚠️ **Validation Checklist**

Before committing any new component:

- [ ] **NO hardcoded colors** (`bg-blue-600`, `text-gray-900`, etc.)
- [ ] **ALL colors use design tokens** (`bg-primary`, `text-text-primary`, etc.)
- [ ] **Consistent patterns** used throughout
- [ ] **Hover states** included for all interactive elements
- [ ] **Focus states** included for accessibility
- [ ] **Semantic color choices** made appropriately
- [ ] **Component follows established patterns**

## 🚀 **Usage Instructions**

1. **Copy the appropriate template** above for your component type
2. **Replace placeholder text** with your actual content
3. **Use design tokens** for all colors
4. **Follow semantic color usage** guidelines
5. **Test accessibility** and hover states
6. **Verify no hardcoded colors** before committing

This approach ensures all new components follow the unified styling system from the start, preventing the need for retrospective fixes later.
