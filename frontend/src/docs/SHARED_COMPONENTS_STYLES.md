# Shared Components Tailwind Reference

This document lists the main Tailwind utility classes and custom CSS selectors used by the extracted shared UI components. Use it as a quick reference when creating new orchestrations.

## SharedCampaignForm
- `bg-white rounded-lg shadow-md p-6` – form card container
- `text-2xl font-bold text-slate-800 mb-4` – heading style
- `mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md` – selected orchestration banner
- `block text-sm font-medium text-slate-600 mb-2` – form labels
- `w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition` – textarea input
- Buttons use `px-4 py-2` plus background colors such as `bg-green-600` and `bg-gray-200`

## SharedProgressPanel
- `bg-slate-700 rounded-lg shadow-md p-6` – card container
- `text-2xl font-bold text-white mb-4` – heading
- Status badges use background utilities like `bg-blue-100`, `bg-green-100`, etc.
- View progress button uses `bg-indigo-500 hover:bg-indigo-600 text-white rounded-md`

## SharedDeliverablePanel and Card
The panel and card rely on styles defined in `deliverableStyles.css`:
- `.deliverable-card`, `.deliverable-header`, `.deliverable-title-text`
- `.deliverable-status.ready`, `.deliverable-status.reviewed`, `.deliverable-status.pending`
- Action buttons use `.deliverable-icon-btn`

## SharedBreadcrumbs
- `flex items-center space-x-2 text-sm text-gray-600` – wrapper
- `text-green-600 hover:text-green-700` – back link
- `text-gray-800 font-medium` – current page

## SharedHitlToggle
- Wrapper `flex items-center gap-2`
- Toggle switch `relative inline-flex h-6 w-12 items-center rounded-full`
- Toggle knob `inline-block h-4 w-4 transform rounded-full bg-white`

## SharedActionButtons
- Wrapper `flex justify-center space-x-4`
- Buttons: `px-6 py-2` with `bg-green-500` or `bg-blue-500`

## SharedModal
- Overlay `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`
- Content container `bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`
