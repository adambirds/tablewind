# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v4.0.1] - 2025-09-13

### Fixed

- **onEditSave Callback**: Fixed bug where the `revalidate` function was not being passed to the `onEditSave` callback, causing inline editing to not refresh data after successful saves
- **Type Definitions**: Updated `InlineEditCallbacks` interface to properly include the `revalidate` parameter in the `onEditSave` callback signature

## [v4.0.0] - 2025-09-12

### 🚨 BREAKING CHANGES

- **Function Signatures Updated**: The `onRowSelect` callback now receives optional second and third parameters: `clearSelectionsAfterAction?: () => void, revalidate?: () => void`
- **Bulk Action Signatures Updated**: All `BulkAction` onClick handlers now receive optional second and third parameters: `clearSelectionsAfterAction?: () => void, revalidate?: () => void`

### Added

- **Selection Alert Feature**: New `showSelectionAlert` prop to display selection count when any items are selected (instead of only when all items are selected)
- **Keep Selected Option**: New `showKeepSelectedOption` prop to show a checkbox allowing users to keep selections after bulk actions
- **Data Revalidation Support**: Added `revalidate` function to callbacks, enabling data refresh without component re-mounting
- **Enhanced Bulk Actions**: Bulk actions now receive `clearSelectionsAfterAction` and `revalidate` functions for better control over selection state and data freshness

### Changed

- **CSS Variables**: Updated hardcoded colors in checkbox inputs to use consistent CSS variable theming system
- **Selection Persistence**: Improved selection state management to work better with data revalidation

### Migration Guide

#### Breaking Changes
1. **onRowSelect callback** (optional parameters added):
   ```tsx
   // Before
   onRowSelect?: (selectedIds: string[]) => void;
   
   // After  
   onRowSelect?: (
     selectedIds: string[], 
     clearSelectionsAfterAction?: () => void, 
     revalidate?: () => void
   ) => void;
   ```

2. **BulkAction onClick handlers** (optional parameters added):
   ```tsx
   // Before
   onClick: (selectedIds: string[]) => void;
   
   // After
   onClick: (
     selectedIds: string[], 
     clearSelectionsAfterAction?: () => void, 
     revalidate?: () => void
   ) => void;
   ```

#### Recommended Migration (for new features)
To use the new "keep selected" functionality, replace component re-mounting patterns with the new `revalidate` function:

```tsx
// Current approach (still works, but prevents "keep selected" from working)
const [refreshKey, setRefreshKey] = useState(0);
<DataTable key={refreshKey} {...props} />
```
```tsx
// Recommended approach (enables "keep selected" functionality)
<DataTable
  bulkActions={[
    {
      key: "delete",
      label: "Delete Selected",
      onClick: (
        selectedIds: string[],
        clearSelectionsAfterAction?: () => void,
        revalidate?: () => void
      ) => {
        performBulkAction(selectedIds).then(() => {
          revalidate?.();                 // Refresh data without losing selections
          clearSelectionsAfterAction?.(); // Conditionally clear based on user preference
        });
      },
    },
  ]}
  showSelectionAlert
  showKeepSelectedOption
  {...otherProps}
/>

```

## [v3.3.3] - 2025-04-23

### Fixed

- Ensure the bulk action dropdown closes on click elsewhere and is still clickable.
- Ensure the multi-select dropdown closes on click elsewhere and is still clickable.

Fixes two bugs introduced in the last version.

## [v3.3.2] - 2025-04-23

### Fixed

- Ensure the bulk action dropdown closes on click elsewhere.
- Ensure the multi-select dropdown is scrollable.
- Ensure the multi-select dropdown closes on click elsewhere.

## [v3.3.1] - 2025-04-22

### Fixed

- Remove some unneeded console logging.

## [v3.3.0] - 2025-04-22

### Fixed

- Fix major issue that causes infinite re-renders on changing/resetting filters.

## [v3.2.0] - 2025-04-21

### Added

- Add support for inline editing of non-flat datasets.

## [v3.1.0] - 2025-04-20

### Added

- Added the ability to pass the whole row to the bulk action rather than just the ID. You can choose between.

## [v3.0.0] - 2025-04-20

### Fixed

- Fix an issue where changing/resetting filters can cause an infinte loop.
- Fix an issue with date presets not quite accurate. A month is now assumed to be 30 days.

### Added

- Added specific mobile styling to improve mobile layout.
- **Breaking Change**: You now need to pass state, to the props `showMobileFilters` and `setShowMobileFilters` to ensure mobile filters stay open on filter change.

## [v2.6.0] - 2025-04-20

### Added

- Added default `Error` and Loading components to improve the UX.
- Added support for passing a custom error component by the prop `errorComponent`.
- Added support for passing a custom loading component by the prop `loadingComponent`.
- Added the ability redirect on error instead. You can pass a navigate/router function to the prop `redirectOnError`.

### Fixed

- Fix issue fetching all records when clicking mark all selected.

## [v2.5.1] - 2025-04-19

### Fixed

- Fix issue with resetting the date filters.

## [v2.5.0] - 2025-04-19

### Added

- Added optional date filtering support to the table.

### Fixed

- Fix an issue with default text color on multi-select dropdowns for dark scheme.

## [v2.4.0] - 2025-04-18

### Added

- Added `datetime` as an editable field type. Now a vlid option for `inputType`.

### Fixed

- Fix an issue with default text color on multi-select dropdowns for dark scheme.

## [v2.3.3] - 2025-04-18

### Fixed

- Reverted the changes to `Select...` as it wasn't a library issue.

## [v2.3.2] - 2025-04-18

### Fixed

- Resolved issue where clicking `Select...` didn't remove a selction in inline editing.

## [v2.3.1] - 2025-04-18

### Fixed

- Resolved issue where clicking `Select...` didn't remove a selction in inline editing.

## [v2.3.0] - 2025-04-14

- Added new optional prop for `addNewUrl`. If this prop isn't set the button will not show.

## [v2.2.4] - 2025-04-14

- Remove more padding from filter bar so it can be handled by the user.

## [v2.2.3] - 2025-04-14

- Remove padding from filter bar so it can be handled by the user.

## [v2.2.2] - 2025-04-14

- Fix issues with borders not applying for Microsoft Edge. Increased to 2px.

## [v2.2.1] - 2025-04-14

- Remove padding from data table so it can be handled by the user.

## [v2.2.0] - 2025-04-01

- Pass navigate function to datatable as a prop.

## [v2.1.0] - 2025-02-23

- Added ability to customise the colors of the table components.

## [v2.0.0] - 2025-02-18

### Added

- Added next router as a prop to avoid app router invariant issue.

## [v1.0.5] - 2025-02-18

### Fixed

- Attempt to fix issue with finding type declarations.

## [v1.0.4] - 2025-02-18

### Fixed

- Fixed issue with finding type declarations.

## [v1.0.3] - 2025-02-18

### Fixed

- Fixed issue with finding type declarations.

## [v1.0.2] - 2025-02-18

### Fixed

- Fixed issue with NextJS transpiling dependencies.

## [v1.0.1] - 2025-02-18

### Fixed

- Issue with dependency causing module nto to be found.

### Updated

- Updated multiple npm packages.

## [v1.0.0] - 2025-02-17

### Added

- Initial release of Tablewind.
- Core DataTable components with support for inline editing, filtering, sorting, and pagination.
- Dual entry points for integration with React Router and Next.js.
- Bulk action support and customizable table features.
