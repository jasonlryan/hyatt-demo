# Global Styles Upgrade Brief for Hyatt GPT System

## Problem Statement

The current CSS implementation has critical accessibility issues:

- White text on white backgrounds (invisible text)
- Dark text on dark backgrounds (poor contrast)
- Inconsistent color schemes across components
- No proper design system or component library
- Global CSS rules overriding component-specific styles

## Current Issues Identified

1. **Global heading styles** forcing all h1, h2, h3 to white text
2. **Modal titles** appearing white on white backgrounds
3. **Inconsistent button styling** across the application
4. **Poor contrast ratios** throughout the interface
5. **No responsive design system** for mobile/tablet
6. **Missing accessibility features** (focus states, ARIA support)

## Solution: Implement Zeno Design System

### 1. Color Palette & Variables

```css
:root {
  /* Primary Colors */
  --color-primary: #4caf50;
  --color-primary-hover: #45a049;
  --color-primary-light: rgba(76, 175, 80, 0.1);

  /* Neutral Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f8f9fa;
  --color-gray-100: #f1f3f4;
  --color-gray-200: #e9ecef;
  --color-gray-300: #dee2e6;
  --color-gray-400: #ced4da;
  --color-gray-500: #adb5bd;
  --color-gray-600: #6c757d;
  --color-gray-700: #495057;
  --color-gray-800: #343a40;
  --color-gray-900: #212529;

  /* Semantic Colors */
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-error: #dc3545;
  --color-info: #17a2b8;

  /* Text Colors */
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-muted: #adb5bd;
  --text-inverse: #ffffff;

  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
}
```

### 2. Typography System

```css
/* Typography Scale */
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

/* Font Weights */
.font-light {
  font-weight: 300;
}
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
.font-extrabold {
  font-weight: 800;
}
```

### 3. Component Library

#### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--text-inverse);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--color-gray-300);
}

.btn-secondary:hover {
  background: var(--bg-primary);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

#### Cards

```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.1);
}
```

#### Modals

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 0.75rem;
  max-width: 32rem;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
```

### 4. Layout System

```css
/* Grid System */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

/* Flexbox Utilities */
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-6 {
  gap: 1.5rem;
}
```

### 5. Accessibility Features

```css
/* Focus States */
.btn:focus,
.card:focus,
.modal:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #006400;
    --text-primary: #000000;
    --bg-primary: #ffffff;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6. Responsive Design

```css
/* Breakpoints */
@media (min-width: 640px) {
  /* sm */
}
@media (min-width: 768px) {
  /* md */
}
@media (min-width: 1024px) {
  /* lg */
}
@media (min-width: 1280px) {
  /* xl */
}

/* Mobile First Approach */
.modal-content {
  margin: 1rem;
  max-width: calc(100vw - 2rem);
}

@media (min-width: 768px) {
  .modal-content {
    margin: 5% auto;
    max-width: 32rem;
  }
}
```

## Implementation Plan

### Phase 1: Foundation (Week 1)

1. Replace current `index.css` with new design system
2. Implement CSS variables and color palette
3. Create base typography and spacing system
4. Test accessibility compliance

### Phase 2: Components (Week 2)

1. Implement button component library
2. Create card component system
3. Build modal component with proper styling
4. Add form component styles

### Phase 3: Layout & Navigation (Week 3)

1. Implement responsive grid system
2. Create header and navigation components
3. Build sidebar and main content layouts
4. Add responsive breakpoints

### Phase 4: Polish & Testing (Week 4)

1. Cross-browser testing
2. Accessibility audit and fixes
3. Performance optimization
4. Documentation and style guide

## Success Metrics

- [ ] 100% WCAG 2.1 AA compliance
- [ ] All text has minimum 4.5:1 contrast ratio
- [ ] Responsive design works on all screen sizes
- [ ] No more white-on-white or dark-on-dark text
- [ ] Consistent component styling across the application
- [ ] Improved user experience and accessibility scores

## Files to Update

1. `frontend/src/index.css` - Complete replacement
2. `frontend/src/components/HitlReviewModal.tsx` - Update classes
3. `frontend/src/components/GlobalNav.tsx` - Update styling
4. All other component files - Update to use new design system

## Testing Checklist

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Test with keyboard navigation only
- [ ] Test in high contrast mode
- [ ] Test with reduced motion preferences
- [ ] Validate HTML semantics and ARIA attributes

This upgrade will transform the current problematic styling into a professional, accessible, and maintainable design system that follows modern web standards and best practices.
