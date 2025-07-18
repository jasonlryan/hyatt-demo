# Shared Component CSS Overview

All shared components rely on Tailwind utility classes plus a single custom stylesheet `deliverableStyles.css` located in `frontend/src/components`.

Classes defined there include:
- `.deliverable-card`, `.deliverable-header`, `.deliverable-title-text`
- `.deliverable-status.*` for ready/reviewed/pending badges
- `.deliverable-icon-btn`, `.deliverable-btn`, `.deliverable-btn-primary`, `.deliverable-btn-secondary`
- Modal styling classes prefixed with `deliverable-modal-`

When integrating the shared components ensure this stylesheet is imported once in your application entry point. Each component file already imports the CSS where needed.
