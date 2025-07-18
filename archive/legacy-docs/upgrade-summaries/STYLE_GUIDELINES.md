# Style Guidelines

Follow these rules when styling components.

## Design Tokens
- Use variables from `styles/design-tokens.css` for colors, fonts and spacing.
- Access tokens via Tailwind classes (`bg-primary`, `text-primary`) or CSS `var()` references.

## Tailwind Utilities
- Use Tailwind for layout, spacing and responsive utilities.
- Avoid Tailwind color utilities that duplicate design token values.

## Custom CSS
- Reserve custom CSS for complex components or animations.
- Import `design-tokens.css` at the top of custom style sheets.
