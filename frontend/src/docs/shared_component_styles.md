# Shared Component Styles

This document lists the Tailwind CSS classes and any custom styles used by the shared UI components extracted from the Hyatt orchestration.

## SharedCampaignForm
- `bg-white rounded-lg shadow-md p-6`
- `text-2xl font-bold text-slate-800 mb-4`
- `mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md`
- `text-sm text-blue-800`
- `mb-4`
- `block text-sm font-medium text-slate-600 mb-2`
- `w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`
- `flex justify-between items-center`
- `flex gap-3`
- `px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors`
- `relative`
- `px-4 py-2 bg-white text-gray-700 font-medium rounded border border-gray-300 hover:border-gray-400 flex items-center transition-colors`
- `absolute left-0 mt-1 w-80 bg-white rounded border border-gray-200 shadow-sm z-50`
- `p-3 border-b border-gray-100`
- `text-gray-900 font-medium text-sm`
- `max-h-64 overflow-y-auto`
- `w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0`
- `text-gray-900 text-sm`
- `text-xs text-gray-500 mt-1`
- `p-4 text-center text-gray-500 text-sm`
- `px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`
- `px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors`

## SharedProgressPanel
- `bg-slate-700 rounded-lg shadow-md p-6`
- `text-2xl font-bold text-white mb-4`
- `text-sm text-slate-300 mb-1`
- `flex items-center`
- `inline-block px-2 py-1 rounded-full text-xs font-medium`
- `flex items-center justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors text-sm`

## SharedDeliverablePanel and SharedDeliverableCard
Custom CSS from `deliverableStyles.css` is reused for these components.
Key classes include:
- `deliverable-card`
- `deliverable-header`
- `deliverable-title`
- `deliverable-icon`
- `deliverable-title-text`
- `deliverable-status`
- `text-center py-8 text-gray-500`
- `space-y-4`
- `flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow`
- `flex items-start justify-between gap-2`
- `flex-1 min-w-0`
- `flex items-center gap-2 mb-1`
- `text-2xl`
- `text-lg font-semibold truncate`
- `flex items-center gap-2 text-sm text-gray-500`
- `flex flex-col items-end gap-2 ml-2`
- `deliverable-icon-btn`

## SharedBreadcrumbs
- `flex items-center space-x-2 text-sm text-gray-600`
- `text-green-600 hover:text-green-700 transition-colors`
- `text-gray-800 font-medium`

## SharedHitlToggle
- `flex items-center gap-2`
- `text-sm text-gray-600`
- `relative inline-flex h-6 w-12 items-center rounded-full`
- `bg-green-600` / `bg-gray-300`
- `inline-block h-4 w-4 transform rounded-full bg-white`
- `translate-x-7` / `translate-x-1`
- `absolute text-xs font-medium`
- `text-white left-1` / `text-gray-600 right-1`

## SharedActionButtons
- `flex gap-3 items-center`
- `flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm`
- `flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm`

## SharedModal
Uses the global modal classes defined in `index.css`:
- `modal`
- `modal-content`
- `modal-header`
- `modal-body`
- `modal-footer`
- `btn btn-secondary`
