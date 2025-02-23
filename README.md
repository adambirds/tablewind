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

By default, Tablewind exports the React Router version. For example:

```tsx
import { DataTable } from 'tablewind';

function MyComponent() {
    return (
        <DataTable
            endpoint="/api/data"
            columns={
                [
                    // Define your column configurations here
                ]
            }
            fetcher={fetch} // Or your custom fetcher function
            // Other props as needed...
        />
    );
}
```

### Next.js Version

If you're using Next.js, import the Next.js version:

```tsx
import { DataTable } from 'tablewind/next';

function MyPage() {
    return (
        <DataTable
            endpoint="/api/data"
            columns={
                [
                    // Define your column configurations here
                ]
            }
            fetcher={fetch} // Or your custom fetcher function
            // Other props as needed...
        />
    );
}
```

## API

### DataTable Props

- **endpoint**: The API endpoint to fetch data.
- **columns**: An array of column configuration objects.
- **fetcher**: A function to fetch data (e.g., `fetch` or a custom function).
- **initialQuery** (optional): An object containing initial query parameters.
- **onRowSelect** (optional): Callback invoked when rows are selected.
- **filterFields** (optional): An array defining filter fields.
- **bulkActions** (optional): Array of actions for bulk operations.
- **onEditSave** (optional): Callback invoked when an inline edit is saved.
- **onEditCancel** (optional): Callback invoked when inline editing is canceled.
- **handleDelete** (optional): Callback to handle row deletion.

For detailed API usage, please refer to the source code or open an issue on GitHub. More comprehensive docs will follow soon, as this expects the backend APIs to work in a particular way.

## Importing CSS & Overriding Theme Colors

Before using Tablewind, be sure to import its CSS file into your project (for example, in your global stylesheet or in Next.js’s `src/app/globals.css`):

```css
@import 'tailwindcss';
@import 'tablewind/tablewind.css';
```

To customize Tablewind’s colors, override the following CSS variables in your own stylesheet. For example, to change the dark accent color, you can add:

```css
:root {
    --dark-tablewind-accent: #yourCustomColor;
}
```

The available override variables are:

- `--dark-tablewind-accent`
- `--dark-tablewind-accent-hover`
- `--light-tablewind-accent`
- `--light-tablewind-accent-hover`

- `--dark-tablewind-text-primary`
- `--dark-tablewind-text-secondary`
- `--light-tablewind-text-primary`
- `--light-tablewind-text-secondary`

- `--dark-tablewind-border-primary`
- `--light-tablewind-border-primary`

- `--dark-tablewind-bg-primary`
- `--dark-tablewind-bg-primary-hover`
- `--light-tablewind-bg-primary`
- `--light-tablewind-bg-primary-hover`

- `--dark-success-alert-bg`
- `--dark-success-alert-text`
- `--light-success-alert-bg`
- `--light-success-alert-text`

- `--dark-reset-filters-bg`
- `--dark-reset-filters-bg-hover`
- `--dark-reset-filters-text`
- `--light-reset-filters-bg`
- `--light-reset-filters-bg-hover`
- `--light-reset-filters-text`

- `--dark-button-delete-bg`
- `--dark-button-delete-bg-hover`
- `--dark-button-delete-text`
- `--light-button-delete-bg`
- `--light-button-delete-bg-hover`
- `--light-button-delete-text`

- `--dark-button-edit-bg`
- `--dark-button-edit-bg-hover`
- `--dark-button-edit-text`
- `--light-button-edit-bg`
- `--light-button-edit-bg-hover`
- `--light-button-edit-text`

- `--dark-button-cancel-bg`
- `--dark-button-cancel-bg-hover`
- `--dark-button-cancel-text`
- `--light-button-cancel-bg`
- `--light-button-cancel-bg-hover`
- `--light-button-cancel-text`

- `--dark-button-save-bg`
- `--dark-button-save-bg-hover`
- `--dark-button-save-text`
- `--light-button-save-bg`
- `--light-button-save-bg-hover`
- `--light-button-save-text`

- `--dark-button-pagination-bg`
- `--dark-button-pagination-bg-hover`
- `--dark-button-pagination-text`
- `--light-button-pagination-bg`
- `--light-button-pagination-bg-hover`
- `--light-button-pagination-text`

- `--dark-button-pagination-disabled-bg`
- `--dark-button-pagination-disabled-text`
- `--light-button-pagination-disabled-bg`
- `--light-button-pagination-disabled-text`

- `--dark-pagination-text`
- `--light-pagination-text`

- `--dark-switch-bg`
- `--light-switch-bg`

- `--dark-show-filters-bg`
- `--dark-show-filters-bg-hover`
- `--dark-show-filters-text`
- `--light-show-filters-bg`
- `--light-show-filters-bg-hover`
- `--light-show-filters-text`

- `--dark-header-bg`
- `--light-header-bg`

- `--dark-table-divider`
- `--light-table-divider`

- `--dark-table-header-bg`
- `--light-table-header-bg`

- `--dark-header-ring`
- `--light-header-ring`

- `--dark-bulk-dropdown-bg`
- `--dark-bulk-dropdown-bg-hover`
- `--dark-bulk-dropdown-text`
- `--dark-bulk-dropdown-ring`
- `--dark-bulk-dropdown-divider`
- `--light-bulk-dropdown-bg`
- `--light-bulk-dropdown-bg-hover`
- `--light-bulk-dropdown-text`
- `--light-bulk-dropdown-ring`
- `--light-bulk-dropdown-divider`

- `--dark-multi-select-item-bg`
- `--dark-multi-select-item-text`
- `--light-multi-select-item-bg`
- `--light-multi-select-item-text`

## Contributing

Contributions are welcome! However, whilst this has been open sourced, it was built to solve a specific set of use cases I have with my projects.
If you have ideas for new features or improvements, please open an issue or submit a pull request, however it will only get merged if it will work with my projects.

## License

This project is licensed under the [MIT License](/LICENSE).

## Changelog

For a complete list of changes, see the [CHANGELOG.md](./CHANGELOG.md) file.

## Funding

If you find this project useful and would like to support its development, please consider donating via one of the platforms below:

[GitHub Sponsors](https://github.com/sponsors/adambirds)

Thank you for your support!
