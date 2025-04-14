// src/components/DataTable.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ColumnConfig, DataTableProps, FilterField } from '../types';
import { usePaginatedFetch } from '../hooks/usePaginatedFetch';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { PaginationControls } from './PaginationControls';
import { FilterBar } from './FilterBar';
import { BulkActionDropdown } from './BulkActionDropdown';

type EditValues = Record<string, unknown>;

interface InlineEditCallbacks {
    onEditSave?: (id: string, newValues: EditValues) => void;
    onEditCancel?: () => void;
}

export type DataTableComponentProps<
    T extends { id: string } & Record<string, unknown>,
> = DataTableProps<T> &
    InlineEditCallbacks & {
        navigate?: (url: string) => void;
    };

/**
 * Updated DataTable now accepts an optional `navigate` function.
 * If not provided, it defaults to using window.location.assign.
 */
export function DataTable<T extends { id: string } & Record<string, unknown>>({
    pageTitle,
    pageSubtitle,
    endpoint,
    columns,
    initialQuery = {},
    fetcher,
    onRowSelect,
    filterFields = [],
    bulkActions,
    className,
    onEditSave,
    onEditCancel,
    handleDelete,
    navigate,
}: DataTableProps<T> &
    InlineEditCallbacks & { navigate?: (url: string) => void }) {
    // Define a default navigation function (fallback for plain React apps)
    const defaultNavigate = (url: string) => {
        if (typeof window !== 'undefined') {
            window.location.assign(url);
        }
    };

    // Use the provided navigate prop or fall back to defaultNavigate.
    const nav = navigate || defaultNavigate;

    // Use a single state to hold all query params.
    const [query, setQuery] =
        useState<Record<string, string | string[]>>(initialQuery);

    // Derive pagination and sorting values from query.
    // Removed unused "page" variable.
    const pageSize = Number(query.page_size || '25');
    const sortBy = typeof query.sort_by === 'string' ? query.sort_by : '';
    const order = query.order === 'desc' ? 'desc' : 'asc';

    // Bulk selection state.
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [allItemsSelected, setAllItemsSelected] = useState(false);

    // Inline editing state.
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<EditValues>({});

    // Filter visibility state.
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => setShowFilters((prev) => !prev);

    // ------------------------
    // Inline editing functions
    // ------------------------
    const startEditing = (row: T) => {
        setEditingRowId(row.id);
        const newValues: EditValues = {};
        columns.forEach((col) => {
            if (col.editable) {
                const fieldValue = row[col.accessor as keyof T];
                if (col.inputType === 'multi-select') {
                    const arr = Array.isArray(fieldValue) ? fieldValue : [];
                    newValues[col.accessor as string] = arr
                        .filter((item) => item !== null && item !== undefined)
                        .map((item) =>
                            typeof item === 'object' &&
                            item !== null &&
                            'id' in item
                                ? (item as { id: unknown }).id
                                : item
                        );
                } else if (col.inputType === 'select') {
                    // If the value is already an object, store it directly.
                    if (
                        fieldValue &&
                        typeof fieldValue === 'object' &&
                        'id' in fieldValue
                    ) {
                        newValues[col.accessor as string] = fieldValue;
                    } else {
                        // Otherwise, try to look up the corresponding object in col.options.
                        const selectedOption = col.options?.find(
                            (opt) => opt.id === fieldValue
                        );
                        newValues[col.accessor as string] =
                            selectedOption || null;
                    }
                } else {
                    newValues[col.accessor as string] = fieldValue;
                }
            }
        });
        setEditValues(newValues);
    };

    const saveEdit = (id: string) => {
        const payload: EditValues = { ...editValues };
        columns.forEach((col) => {
            if (col.inputType === 'multi-select') {
                const key = col.saveKey || (col.accessor as string);
                const currentValue = editValues[col.accessor as string];
                payload[key] = Array.isArray(currentValue)
                    ? currentValue.filter(
                          (item) => item !== null && item !== undefined
                      )
                    : [];
                if (col.saveKey) {
                    delete payload[col.accessor as string];
                }
            }
        });
        if (onEditSave) {
            onEditSave(id, payload);
        }
        setEditingRowId(null);
        setEditValues({});
    };

    const cancelEditing = () => {
        if (onEditCancel) {
            onEditCancel();
        }
        setEditingRowId(null);
        setEditValues({});
    };

    // ------------------------
    // URL Query Helpers
    // ------------------------
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
            const value = query[key];
            if (value) {
                if (Array.isArray(value)) {
                    value.forEach((item) => params.append(key, item));
                } else {
                    params.set(key, value);
                }
            }
        });
        return params;
    };

    // ------------------------
    // Sorting function
    // ------------------------
    const handleSort = (column: ColumnConfig<T>) => {
        if (!column.sortable) return;
        const newSortKey = column.sortKey || (column.accessor as string);
        const newOrder =
            sortBy === newSortKey ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
        setQuery((prev) => ({
            ...prev,
            sort_by: newSortKey,
            order: newOrder,
            page: '1',
        }));
    };

    // ------------------------
    // Filtering function
    // ------------------------
    const handleFilterChange = (
        newFilters: Record<string, string | string[]>
    ) => {
        setQuery((prev) => {
            const merged = { ...prev, ...newFilters, page: '1' };
            return shallowEqual(prev, merged) ? prev : merged;
        });
    };

    // ------------------------
    // Pagination functions
    // ------------------------
    const handlePageChange = (newPage: number) =>
        setQuery((prev) => ({ ...prev, page: String(newPage) }));
    const handlePageSizeChange = (newSize: number) =>
        setQuery((prev) => ({
            ...prev,
            page_size: String(newSize),
            page: '1',
        }));

    // ------------------------
    // URL Sync
    // ------------------------
    useEffect(() => {
        const params = buildQueryParams();
        const currentQueryString = new URLSearchParams(
            window.location.search
        ).toString();
        const newQueryString = params.toString();
        if (newQueryString !== currentQueryString) {
            nav(`?${newQueryString}`);
        }
    }, [query, nav]);

    // ------------------------
    // API URL
    // ------------------------
    const apiUrl = `${endpoint}?${buildQueryParams().toString()}`;
    const { data, error, isLoading } = usePaginatedFetch<T>(apiUrl, fetcher);

    // ------------------------
    // Merge available_filters from API into filterFields.
    // ------------------------
    const [mergedFilterFields, setMergedFilterFields] =
        useState<FilterField[]>(filterFields);

    useEffect(() => {
        const apiFilters = data?.available_filters;
        if (apiFilters && Object.keys(apiFilters).length > 0) {
            setMergedFilterFields(
                filterFields.map((field) => {
                    const key = field.apiKey || field.name;
                    if (
                        apiFilters[key] &&
                        Array.isArray(apiFilters[key]) &&
                        apiFilters[key].length > 0
                    ) {
                        return { ...field, options: apiFilters[key] };
                    }
                    return field;
                })
            );
        }
    }, [data, filterFields]);

    // ------------------------
    // Row selection functions
    // ------------------------
    const handleRowSelect = (id: string, selected: boolean) => {
        const newSelected = selected
            ? [...selectedIds, id]
            : selectedIds.filter((sid) => sid !== id);
        setSelectedIds(newSelected);
        if (onRowSelect) {
            onRowSelect(newSelected);
        }
    };

    const results = data?.results ?? [];
    const selectAll = selectedIds.length >= results.length;
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
            setAllItemsSelected(false);
        } else {
            setSelectedIds(results.map((row) => row.id));
        }
    };

    // ------------------------
    // "Mark All" functionality.
    // ------------------------
    const markAllSelected = async () => {
        if (!data) return;
        const params = buildQueryParams();
        params.set('page', '1');
        params.set('page_size', String(data.pagination.total_items));
        const url = `${endpoint}?${params.toString()}`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error('Error fetching all posts');
                return;
            }
            const allData = await res.json();
            setSelectedIds(
                allData.results.map((row: { id: string }) => row.id)
            );
            setAllItemsSelected(true);
        } catch (error) {
            console.error('Error fetching all posts', error);
        }
    };

    const cancelAllSelection = () => {
        setSelectedIds([]);
        setAllItemsSelected(false);
    };

    // ------------------------
    // Extra content and pagination height.
    // ------------------------
    const extraContentRef = useRef<HTMLDivElement>(null);
    const [extraContentHeight, setExtraContentHeight] = useState(0);

    const paginationRef = useRef<HTMLDivElement>(null);
    const [paginationHeight, setPaginationHeight] = useState(0);

    useEffect(() => {
        if (!extraContentRef.current || !paginationRef.current) return;
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.target === extraContentRef.current) {
                    setExtraContentHeight(entry.contentRect.height);
                }
                if (entry.target === paginationRef.current) {
                    setPaginationHeight(entry.contentRect.height);
                }
            });
        });
        observer.observe(extraContentRef.current);
        observer.observe(paginationRef.current);
        const timeoutId = setTimeout(() => {
            if (extraContentRef.current)
                setExtraContentHeight(extraContentRef.current.offsetHeight);
            if (paginationRef.current)
                setPaginationHeight(paginationRef.current.offsetHeight);
        }, 200);
        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [data]);

    // ------------------------
    // Filter section content.
    // ------------------------
    const filterKeys = useMemo(
        () =>
            Object.keys(query).filter(
                (key) =>
                    !['page', 'page_size', 'sort_by', 'order'].includes(key)
            ),
        [query]
    );

    const hasActiveFilters = filterKeys.some((key) => {
        const val = query[key];
        return Array.isArray(val) ? val.length > 0 : val !== '';
    });

    const initialFiltersForBar = useMemo(() => {
        return filterKeys.reduce<Record<string, string | string[]>>(
            (acc, key) => {
                acc[key] = query[key];
                return acc;
            },
            {}
        );
    }, [filterKeys, query]);

    const filterContent = (
        <div>
            <div ref={extraContentRef} className="pt-4">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="non-sticky-wrapper">
                        <div className="sticky left-0 text-left">
                            <h1 className="text-2xl font-bold text-light_tablewind_text_primary dark:text-dark_tablewind_text_primary">
                                {pageTitle || 'Table'}
                            </h1>
                            <p className="mt-2 text-sm text-light_tablewind_text_secondary dark:text-dark_tablewind_text_secondary">
                                {pageSubtitle ||
                                    'A list of your posts with inline editing, filtering, sorting and pagination.'}
                            </p>
                        </div>
                    </div>
                    <div className="non-sticky-wrapper">
                        <div className="sticky right-0 mt-4 flex items-center space-x-4 sm:mt-0">
                            {selectedIds.length > 0 &&
                                !allItemsSelected &&
                                data &&
                                selectedIds.length <
                                    data.pagination.total_items && (
                                    <button
                                        className="mr-4 ml-2 inline-flex justify-center rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-4 py-2 text-sm font-medium text-light_tablewind_text_secondary hover:bg-light_tablewind_bg_primary_hover dark:border-dark_tablewind_border_primary dark:text-dark_tablewind_text_secondary dark:bg-dark_tablewind_bg_primary dark:hover:bg-dark_tablewind_bg_primary_hover"
                                        onClick={markAllSelected}
                                    >
                                        Mark all ({data.pagination.total_items})
                                        as selected.
                                    </button>
                                )}
                            {selectedIds.length > 0 && bulkActions && (
                                <BulkActionDropdown
                                    actions={bulkActions}
                                    selectedIds={selectedIds}
                                />
                            )}
                            <select
                                value={pageSize}
                                onChange={(e) =>
                                    handlePageSizeChange(Number(e.target.value))
                                }
                                className="rounded-md border bg-light_tablewind_bg_primary py-2 pr-8 pl-2 text-sm text-light_tablewind_text_primary hover:bg-light_tablewind_bg_primary_hover focus:outline-none dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary"
                            >
                                {[10, 25, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size} per page
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => nav('/dashboard/posts/new')}
                                className="rounded-md bg-light_tablewind_accent dark:bg-dark_tablewind_accent px-4 py-2 text-sm font-semibold text-light_tablewind_text_primary shadow-sm dark:hover:bg-dark_tablewind_accent_hover hover:light_tablewind_accent_hover"
                            >
                                Add New
                            </button>
                            <button
                                onClick={toggleFilters}
                                className="rounded-md px-3 py-2 text-sm font-medium bg-light_show_filters_bg text-light_show_filters_text hover:bg-light_show_filters_bg_hover dark:bg-dark_show_filters_bg dark:text-dark_show_filters_text dark:hover:bg-dark_show_filters_bg_hover"
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                            {hasActiveFilters && (
                                <button
                                    onClick={() => {
                                        setQuery((prev) => {
                                            const newQuery = { ...prev };
                                            filterKeys.forEach(
                                                (key) => delete newQuery[key]
                                            );
                                            return { ...newQuery, page: '1' };
                                        });
                                    }}
                                    className="rounded-md bg-light_reset_filters_bg px-3 py-2 text-sm font-medium text-light_reset_filters_text hover:bg-light_reset_filters_bg_hover dark:bg-dark_reset_filters_bg dark:text-dark_reset_filters_text dark:hover:bg-dark_reset_filters_bg_hover"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {showFilters && (
                    <FilterBar
                        fields={mergedFilterFields}
                        initialFilters={initialFiltersForBar}
                        onFilterChange={handleFilterChange}
                        autoApply={true}
                    />
                )}
                {allItemsSelected && data && (
                    <div className="mb-4 rounded bg-light_success_alert_bg p-2 text-light_success_alert_text text-center dark:bg-dark_success_alert_bg dark:text-dark_success_alert_text">
                        All {data.pagination.total_items} items are selected.
                        <button
                            onClick={cancelAllSelection}
                            className="ml-2 underline"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // ------------------------
    // Rendering the main table
    // ------------------------
    if (error) return <div>Error loading posts.</div>;
    if (isLoading) return <div>Loading posts...</div>;
    if (!data) return null;

    return (
        <div className={`${className || ''}`}>
            <div>
                <div className="sticky top-0 pb-4 bg-light_header_bg dark:bg-dark_header_bg">
                    {filterContent}
                </div>
                <div
                    className="overflow-x-auto overflow-y-auto"
                    style={{
                        maxHeight: `calc(100vh - (var(--total-subtraction) * 2) - ${extraContentHeight}px - ${paginationHeight}px)`,
                    }}
                >
                    <table className="min-w-full divide-y divide-dark_table_divider dark:divide-dark_table_divider bg-light_header_bg dark:bg-dark_header_bg">
                        <TableHeader
                            columns={columns}
                            onSort={handleSort}
                            sortBy={sortBy}
                            order={order}
                            selectAll={selectAll}
                            toggleSelectAll={toggleSelectAll}
                        />
                        <TableBody
                            columns={columns}
                            data={results}
                            onRowSelect={handleRowSelect}
                            selectedIds={selectedIds}
                            editingRowId={editingRowId}
                            editValues={editValues}
                            setEditValues={setEditValues}
                            onSaveEdit={saveEdit}
                            onCancelEdit={cancelEditing}
                            onStartEdit={startEditing}
                            handleDelete={handleDelete}
                        />
                    </table>
                </div>
            </div>
            <PaginationControls
                pagination={data.pagination}
                onPageChange={handlePageChange}
                ref={paginationRef}
            />
        </div>
    );
}

// Generic shallow equality check.
function shallowEqual<T extends Record<string, unknown>>(
    objA: T,
    objB: T
): boolean {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (objA[key] !== objB[key]) return false;
    }
    return true;
}

export default DataTable;
