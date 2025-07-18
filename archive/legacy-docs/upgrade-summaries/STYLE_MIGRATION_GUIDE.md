# Style Migration Guide

This guide explains how to migrate existing styles to the new design token system.

## 1. Replace Hardcoded Colors

1. Identify hex colors or Tailwind utilities using non‑token values.
2. Replace them with CSS variables defined in `styles/design-tokens.css`.
   - Example: `#3498db` → `var(--color-primary)`
   - Example: `bg-green-600` → `bg-primary`

## 2. Update Components

- Shared components should use token based classes such as `bg-primary` and `hover:bg-primary-hover`.
- Custom CSS files should import `design-tokens.css` and reference the variables.

## 3. Test Changes

Run the application and visually verify that components render correctly.
Use `npm run lint:styles` to ensure no hardcoded hex colors remain.
