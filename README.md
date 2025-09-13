# Tablewind

Tablewind is a React/Next.js/Tailwind CSS library for data tables. It provides a set of reusable components that support inline editing, filtering, sorting, pagination, and more – all styled with Tailwind CSS.

## Features

- **Inline Editing:** Edit data directly in the table.
- **Sorting & Filtering:** Easily sort and filter your data.
- **Pagination:** Built-in pagination controls.
- **Bulk Actions:** Support for selecting and acting on multiple rows.
- **Customizable:** Leverage Tailwind CSS to customize styling.
- **Dual Navigation Support:** Use the default React Router version or the Next.js version via separate entry points.

## Installation

Install via npm:

```bash
npm install tablewind
```

Or using Yarn:

```bash
yarn add tablewind
```

## Peer Dependencies

Ensure you have the following installed in your project:

- **react** (>= 18.0.0)
- **react-dom** (>= 18.0.0)
- **swr** (^2.3.2)
- **tailwindcss** (^4.0.0)

### Optional (Based on Your Environment)

- **Next.js**: `next` (>= 15.0.0) – for using the Next.js version.
- **React Router**: `react-router-dom` (>= 7.0.0) – for using the React Router version.

## Usage

### Default (React Router Version)

```tsx
import { DataTable } from 'tablewind';

function MyComponent() {
    return (
        <DataTable
            endpoint="/api/data"
            columns={[
                // Define your column configurations here
            ]}
            fetcher={fetch} // Or your custom fetcher function
        />
    );
}
```

### Next.js Version

```tsx
import { DataTable } from 'tablewind/next';

function MyPage() {
    return (
        <DataTable
            endpoint="/api/data"
            columns={[
                // Define your column configurations here
            ]}
            fetcher={fetch} // Or your custom fetcher function
        />
    );
}
```

## API: `DataTable` Props

| Prop Name               | Type                                         | Description                                                                 | Optional |
|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|----------|
| `pageTitle`            | `string`                                    | The main heading for the table page.                                       | Yes      |
| `pageSubtitle`         | `string`                                    | Subtitle displayed beneath the main title.                                 | Yes      |
| `addNewUrl`            | `string`                                    | URL to navigate to when the "Add New" button is clicked.                  | Yes      |
| `endpoint`             | `string`                                    | API endpoint used to fetch table data.                                     | No       |
| `columns`              | `ColumnConfig<T>[]`                         | Column definitions for the table.                                          | No       |
| `initialQuery`         | `Record<string, string>`                    | Initial query params to pre-load filters or pagination.                    | Yes      |
| `fetcher`              | `(url: string) => Promise<PaginatedResponse<T>>` | Custom function for fetching data.                                   | Yes      |
| `onRowSelect`          | `(selectedIds: string[], clearSelectionsAfterAction?: () => void, revalidate?: () => void) => void` | Callback when row selection changes. Optionally provides a function to clear selections after bulk actions and a function to revalidate data. | Yes      |
| `filterFields`         | `FilterField[]`                             | Array of field definitions for building the filter UI.                     | Yes      |
| `bulkActions`          | `BulkAction[]`                              | List of bulk actions to display when multiple rows are selected.           | Yes      |
| `className`            | `string`                                    | Custom CSS class for the table container.                                  | Yes      |
| `handleDelete`         | `(id: string) => void`                      | Callback invoked when a row is deleted.                                    | Yes      |
| `dateRangeFilter`      | `{ queryParamBase: string }`                | Enables a plug-and-play date range filter using the provided param base.   | Yes      |
| `loadingComponent`     | `React.ReactNode`                           | Custom component to render during loading.                                 | Yes      |
| `errorComponent`       | `React.ReactNode`                           | Custom component to render on error.                                       | Yes      |
| `redirectOnError`      | `() => void`                                | Called when there's an error; useful for redirecting.                      | Yes      |
| `navigate`             | `(url: string) => void`                     | Function used to navigate (Next.js or React Router).                       | Yes      |
| `showMobileFilters`    | `boolean`                                   | Controls visibility of the filter panel on mobile.                         | No       |
| `setShowMobileFilters` | `(open: boolean) => void`                   | Sets the visibility state of mobile filters.                               | No       |
| `showSelectionAlert`   | `boolean`                                   | Shows an alert with the number of selected items when any items are selected. Defaults to `false`. | Yes      |
| `showKeepSelectedOption` | `boolean`                                 | Shows a checkbox to keep items selected after bulk actions. Defaults to `false`. | Yes      |
| `onEditSave`           | `(id: string, newValues: EditValues) => void` | Called when an inline edit is saved.                                    | Yes      |
| `onEditCancel`         | `() => void`                                | Called when inline edit mode is cancelled.                                 | Yes      |

## Selection Alert Features

Tablewind provides optional features to enhance the user experience when selecting rows:

### Selection Alert

By default, Tablewind only shows an alert when all items are selected. You can enable a selection alert that appears whenever any items are selected:

```tsx
<DataTable
    endpoint="/api/data"
    columns={columns}
    showSelectionAlert={true}  // Shows "X items selected" for any selection
    // ... other props
/>
```

### Keep Selected After Bulk Actions

You can provide users with the option to keep items selected after performing bulk actions:

```tsx
<DataTable
    endpoint="/api/data"
    columns={columns}
    showSelectionAlert={true}
    showKeepSelectedOption={true}  // Shows checkbox to keep selections
    bulkActions={[
        {
            key: 'delete',
            label: 'Delete Selected',
            onClick: (selectedIds, clearSelectionsAfterAction, revalidate) => {
                // Perform bulk delete
                deleteItems(selectedIds).then(() => {
                    // Refresh the data without losing component state
                    revalidate?.();
                    // Conditionally clear selections based on user preference
                    clearSelectionsAfterAction?.();
                });
            }
        }
    ]}
    // ... other props
/>
```

When `showKeepSelectedOption` is enabled, a checkbox labeled "Keep selected after bulk action" appears in the selection alert. Users can check this to prevent their selections from being cleared after bulk actions are performed.

**Important**: Use the `revalidate` function instead of forcing component re-mounts (e.g., with key props) to refresh data. This preserves the selection state and allows the "keep selected" functionality to work properly.

### Alternative Usage with onRowSelect

You can also access the revalidate function through the `onRowSelect` callback:

```tsx
<DataTable
    endpoint="/api/data"
    columns={columns}
    onRowSelect={(selectedIds, clearSelectionsAfterAction, revalidate) => {
        // Store revalidate function for use in your bulk actions
        console.log(`${selectedIds.length} items selected`);
        // Use revalidate() when you need to refresh data
    }}
    // ... other props
/>
```

## Importing CSS & Overriding Theme Colors

Before using Tablewind, be sure to import its CSS file into your project (for example, in your global stylesheet or in Next.js’s `src/app/globals.css`):

```css
@import 'tailwindcss';
@import 'tablewind/tablewind.css';
```

To customize Tablewind’s colors, override the following CSS variables in your own stylesheet. For example:

```css
:root {
    --dark-tablewind-accent: #yourCustomColor;
}
```

The available override variables are:

```css
--dark-tablewind-accent
--dark-tablewind-accent-hover
--light-tablewind-accent
--light-tablewind-accent-hover

--dark-tablewind-text-primary
--dark-tablewind-text-secondary
--light-tablewind-text-primary
--light-tablewind-text-secondary

--dark-tablewind-border-primary
--light-tablewind-border-primary

--dark-tablewind-bg-primary
--dark-tablewind-bg-primary-hover
--light-tablewind-bg-primary
--light-tablewind-bg-primary-hover

--dark-success-alert-bg
--dark-success-alert-text
--light-success-alert-bg
--light-success-alert-text

--dark-reset-filters-bg
--dark-reset-filters-bg-hover
--dark-reset-filters-text
--light-reset-filters-bg
--light-reset-filters-bg-hover
--light-reset-filters-text

--dark-button-delete-bg
--dark-button-delete-bg-hover
--dark-button-delete-text
--light-button-delete-bg
--light-button-delete-bg-hover
--light-button-delete-text

--dark-button-edit-bg
--dark-button-edit-bg-hover
--dark-button-edit-text
--light-button-edit-bg
--light-button-edit-bg-hover
--light-button-edit-text

--dark-button-cancel-bg
--dark-button-cancel-bg-hover
--dark-button-cancel-text
--light-button-cancel-bg
--light-button-cancel-bg-hover
--light-button-cancel-text

--dark-button-save-bg
--dark-button-save-bg-hover
--dark-button-save-text
--light-button-save-bg
--light-button-save-bg-hover
--light-button-save-text

--dark-button-pagination-bg
--dark-button-pagination-bg-hover
--dark-button-pagination-text
--light-button-pagination-bg
--light-button-pagination-bg-hover
--light-button-pagination-text

--dark-button-pagination-disabled-bg
--dark-button-pagination-disabled-text
--light-button-pagination-disabled-bg
--light-button-pagination-disabled-text

--dark-pagination-text
--light-pagination-text

--dark-switch-bg
--light-switch-bg

--dark-show-filters-bg
--dark-show-filters-bg-hover
--dark-show-filters-text
--light-show-filters-bg
--light-show-filters-bg-hover
--light-show-filters-text

--dark-header-bg
--light-header-bg

--dark-table-divider
--light-table-divider

--dark-table-header-bg
--light-table-header-bg

--dark-header-ring
--light-header-ring

--dark-bulk-dropdown-bg
--dark-bulk-dropdown-bg-hover
--dark-bulk-dropdown-text
--dark-bulk-dropdown-ring
--dark-bulk-dropdown-divider
--light-bulk-dropdown-bg
--light-bulk-dropdown-bg-hover
--light-bulk-dropdown-text
--light-bulk-dropdown-ring
--light-bulk-dropdown-divider

--dark-multi-select-item-bg
--dark-multi-select-item-text
--light-multi-select-item-bg
--light-multi-select-item-text
```

## Contributing

Contributions are welcome! However, whilst this has been open sourced, it was built to solve a specific set of use cases I have with my projects. If you have ideas for new features or improvements, please open an issue or submit a pull request, however it will only get merged if it will work with my projects.

## License

This project is licensed under the [MIT License](/LICENSE).

## Changelog

For a complete list of changes, see the [CHANGELOG.md](./CHANGELOG.md) file.

## Funding

If you find this project useful and would like to support its development, please consider donating via one of the platforms below:

[GitHub Sponsors](https://github.com/sponsors/adambirds)

Thank you for your support!

