export interface Pagination {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    next_page?: number;
    previous_page?: number;
}

export interface PaginatedResponse<T> {
    results: T[];
    pagination: Pagination;
    // Instead of any, we now expect available_filters to be a record of filter options.
    available_filters?: Record<string, Array<{ id: string; name: string }>>;
}

export interface ColumnConfig<T> {
    label: string;
    accessor: keyof T | string;
    saveKey?: string;
    sortable?: boolean;
    sortKey?: string;
    render?: (row: T) => React.ReactNode;
    // New properties for inline editing:
    editable?: boolean;
    inputType?: 'text' | 'checkbox' | 'select' | 'multi-select';
    options?: Array<{ id: string; name: string }>;
}

export type FilterFieldType = 'text' | 'select' | 'multi-select';

export interface FilterField {
    name: string;
    apiKey?: string;
    allOption?: string;
    type: FilterFieldType;
    options?: { id: string; name: string }[];
}

/** BulkAction allows the consumer to define custom bulk actions */
export interface BulkAction {
    /** Unique key for the action */
    key: string;
    /** Button label */
    label: string;
    /** Callback invoked when the action is triggered; receives the selected row IDs */
    onClick: (selectedIds: string[]) => Promise<void> | void;
    /** Optional additional class names for styling */
    className?: string;
}

export interface DataTableProps<T> {
    /** The title of the page */
    pageTitle?: string;
    /** The subtitle of the page */
    pageSubtitle?: string;
    /** The URL to redirect to when the add button is clicked */
    addNewUrl?: string;
    /** The API endpoint to fetch data from */
    endpoint: string;
    /** Column definitions */
    columns: ColumnConfig<T>[];
    /** Initial query parameters */
    initialQuery?: Record<string, string>;
    /** Optional custom fetcher */
    fetcher?: (url: string) => Promise<PaginatedResponse<T>>;
    /** Callback when row selection changes */
    onRowSelect?: (selectedIds: string[]) => void;
    /** Filter fields to render above the table */
    filterFields?: FilterField[];
    /** Bulk actions to render in the bulk actions bar */
    bulkActions?: BulkAction[];
    /** Optional className to override container styling */
    className?: string;
    /** Handler for deleting */
    handleDelete?: (id: string) => void;
}
