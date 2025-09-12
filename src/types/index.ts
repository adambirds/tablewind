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
    /**
     * Label for the column header.
     */
    label: string;

    /**
     * Path to access the value. Supports dot notation for nested fields (e.g. "ebayItem.sourceLocation").
     */
    accessor: keyof T | string;

    /**
     * Key to use when saving the value in payload. Defaults to `accessor` if not provided.
     * Use this to flatten nested objects into a flat payload for the API.
     */
    saveKey?: string;

    /**
     * If true, this column can be sorted.
     */
    sortable?: boolean;

    /**
     * Optional override key for sorting (e.g. Django ORM-compatible key like "ebay_item__source_location").
     */
    sortKey?: string;

    /**
     * Custom rendering logic for a cell (used in non-editing mode).
     */
    render?: (row: T) => React.ReactNode;

    /**
     * Whether this field is editable in inline edit mode.
     */
    editable?: boolean;

    /**
     * Type of input to use in inline edit mode.
     */
    inputType?: 'text' | 'checkbox' | 'select' | 'multi-select' | 'datetime';

    /**
     * Used for `select` and `multi-select` input types.
     */
    options?: Array<{ id: string; name: string }>;


    /**
     * Optional custom value getter for inline edit mode.
     * Use this if you need to manually extract the value from a nested structure.
     */
    getValue?: (row: T) => unknown;
}


export type FilterFieldType = 'text' | 'select' | 'multi-select';

export interface FilterField {
    name: string;
    apiKey?: string;
    allOption?: string;
    type: FilterFieldType;
    options?: { id: string; name: string }[];
}

export type BulkAction<T = Record<string, unknown>> =
    | {
          key: string;
          label: string;
          onClick: (selectedIds: string[]) => void;
          mode?: 'ids';
          className?: string;
      }
    | {
          key: string;
          label: string;
          onClick: (selectedRows: T[]) => void;
          mode: 'objects';
          className?: string;
      };


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
    onRowSelect?: (selectedIds: string[], clearSelectionsAfterAction?: () => void) => void;
    /** Filter fields to render above the table */
    filterFields?: FilterField[];
    /** Bulk actions to render in the bulk actions bar */
    bulkActions?: BulkAction<T>[];
    /** Optional className to override container styling */
    className?: string;
    /** Handler for deleting */
    handleDelete?: (id: string) => void;
    /** Handler for date filter */
    dateRangeFilter?: {
        queryParamBase: string;
    };
    loadingComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
    redirectOnError?: () => void;
    navigate?: (url: string) => void;
    showMobileFilters: boolean;
    setShowMobileFilters: (open: boolean) => void;
    /** If true, shows an alert with the number of selected items when any items are selected */
    showSelectionAlert?: boolean;
    /** If true, shows a checkbox to keep items selected after bulk actions */
    showKeepSelectedOption?: boolean;
}
