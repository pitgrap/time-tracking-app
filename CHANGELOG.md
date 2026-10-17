# Changelog

# 0.14.1

- Fixed: settings changes (daily work hours/pause) weren't reflected in the UI until a reload
- Fixed: tracking's tick interval wasn't cleared on unmount
- Fixed: tracking state was mutated directly instead of going through React state
- Fixed: "Reset today"/custom start time could be lost if triggered while the day-off view was shown
- Fixed: day-off/working-day detection could go stale in a long-lived tab (e.g. pinned as a start page)
- Fixed: missing React key on the weekday checkboxes list
- Fixed: `deleteAllTrackings` could skip entries by mutating storage mid-iteration
- Fixed: average working time showed `NaN` for an empty history
- Fixed: unguarded `JSON.parse` of corrupted localStorage could blank-screen the app; added a top-level error boundary as a safety net
- Fixed: CSV export didn't escape fields containing the delimiter, quotes, or newlines
- Improved: Settings/History dialogs now use native `<dialog>` semantics (focus trap, backdrop, ESC-to-close) and real `<button>` controls, for better accessibility
- Added: `eslint-plugin-react-hooks` to catch hook-rule violations
- Added: Vitest + React Testing Library test suite, run in CI

# 0.14.0

- Updated pnpm to v11, use `packageManager` field for version pin
- Updated node engines range to `24 || 26`
- Simplified CI workflow, pnpm version now resolved from `packageManager` field
- Updated `pnpm-workspace.yaml` to use `allowBuilds` instead of `onlyBuiltDependencies`
- Updated dependencies (`i18next`, `react`, `react-dom`, `react-i18next`, `react-time-picker`, and dev dependencies), fixes CVEs

# 0.13.2

- Feature: Show projected end time (start + daily work + break) in tracking view
- Feature: Rename live current time label from "End" to "Now" for clarity
- Improvement: Redesigned time overview block with a card-style CSS grid layout
- Improvement: Extracted repeated time calculations into shared constants
- Updated dependencies (`eslint` 10.2.1 → 10.3.0)

# 0.13.1

- Feature: Show release version in app
- Updated all dependencies to the latest major version.

# 0.13.0

- Feature: Added setting to select working weekdays
- Updated node to v24
- Updated all dependencies to the latest minor version.

## 0.12.0

- Updated GitHub Actions
- Added Dependabot to update GitHub Actions
- Updated all dependencies to the latest minor version.

## 0.11.0

- Updated to pnpm version 10
- Updated node to v22
- Updated all dependencies to the latest major version.
- Updated GitHub Actions
- Remove react-csv and replace with own component for CSV export

## 0.10.0

- Updated to pnpm version 9
- Updated node to v20
- Updated all dependencies to the latest major version.
- Updated GitHub Actions

## 0.9.0

- Added the possibility to correct the starting time
- Updated to pnpm version 8
- Updated all dependencies to the latest major version.

## 0.8.0

- Change order of history. Show the latest entries first.
- Move download history button to top to avoid scrolling with many entries.
- Updated all dependencies to the latest major version.
- Prefix package with "@pitgrap"
- Updated GitHub Actions

## 0.7.0

- Added new setting "daily automatic break". It will be subtracted from the daily work. The default is "0".
- Updated node to v18
- Updated all dependencies

## 0.6.1

- Added button to settings to reset start time
- Fixed a bug, when tracking is crossing midnight

## 0.6.0

- Switched from react-scripts to vite

## 0.5.0

- Added CSV export for history
- Added average working time and overtime in history
- Fixed preselected language in settings
- Updated dependencies

## 0.4.0

- Added i18n with english and german translation
- Added changelog file
- Updated dependencies

## 0.3.0

- Fixed order of history entries

## 0.2.0

- Added history and settings

## 0.1.0

- Initial version of the app with automatic time tracking
