# Unified Style Guide

This guide defines the standard styling patterns used across the frontend. All components should rely on the design tokens defined in `src/styles/design-tokens.css` and the Tailwind mappings in `tailwind.config.js`.

## Cards & Containers

```css
/* Standard card */
bg-white rounded-lg shadow-md p-6 border border-border

/* Page background */
bg-secondary min-h-screen

/* Modal overlay */
bg-black bg-opacity-50
```

## Buttons

```css
/* Primary button */
px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors

/* Secondary button */
px-4 py-2 bg-secondary text-text-primary border border-border rounded hover:bg-gray-100 transition-colors

/* Disabled button */
px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed
```

## Typography

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

## Form Elements

```css
/* Input fields */
w-full px-3 py-2 border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary transition

/* Labels */
block text-sm font-medium text-text-primary mb-2

/* Textareas */
w-full h-32 p-3 border border-border rounded focus:ring-2 focus:ring-primary focus:border-primary transition
```

## Status Indicators

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
