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

* **react** (>= 18.0.0)
* **react-dom** (>= 18.0.0)
* **swr** (^2.3.2)
* **tailwindcss** (^4.0.0)
### Optional (Based on Your Environment)
* **Next.js**: `next` (>= 15.0.0) – for using the Next.js version.
* **React Router**: `react-router-dom` (>= 7.0.0) – for using the React Router version.

## Usage
### Default (React Router Version)
By default, Tablewind exports the React Router version. For example:

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
            columns={[
                // Define your column configurations here
            ]}
            fetcher={fetch} // Or your custom fetcher function
            // Other props as needed...
        />
    );
}
```

## API
### DataTable Props
* **endpoint**: The API endpoint to fetch data.
* **columns**: An array of column configuration objects.
* **fetcher**: A function to fetch data (e.g., `fetch` or a custom function).
* **initialQuery** (optional): An object containing initial query parameters.
* **onRowSelect** (optional): Callback invoked when rows are selected.
* **filterFields** (optional): An array defining filter fields.
* **bulkActions** (optional): Array of actions for bulk operations.
* **onEditSave** (optional): Callback invoked when an inline edit is saved.
* **onEditCancel** (optional): Callback invoked when inline editing is canceled.
* **handleDelete** (optional): Callback to handle row deletion.

For detailed API usage, please refer to the source code or open an issue on GitHub. More comprehensive docs will follow soon, as this expects the backend APIs to work in a particular way.

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

