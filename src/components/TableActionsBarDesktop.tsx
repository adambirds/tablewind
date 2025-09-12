import React from 'react';
import DateRangeFilter from './DateRangeFilter';
import { BulkAction } from '../types';
import { BulkActionDropdown } from './BulkActionDropdown';

interface TableActionsBarDesktopProps<T> {
    pageTitle?: string;
    pageSubtitle?: string;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
    onToggleFilters: () => void;
    showFilters: boolean;
    hasActiveFilters: boolean;
    onResetFilters: () => void;
    dateRangeFilter?: {
        queryParamBase: string;
    };
    query: Record<string, string | string[]>;
    setQuery: React.Dispatch<
        React.SetStateAction<Record<string, string | string[]>>
    >;
    addNewUrl?: string;
    nav: (url: string) => void;
    selectedIds: string[];
    allItemsSelected: boolean;
    data?: {
        pagination: {
            total_items: number;
        };
    };
    markAllSelected: () => void;
    bulkActions?: BulkAction<T>[];
    selectedRows?: T[];
    clearSelectionsAfterAction?: () => void;
}

function TableActionsBarDesktop<T>({
    pageTitle,
    pageSubtitle,
    pageSize,
    onPageSizeChange,
    onToggleFilters,
    showFilters,
    hasActiveFilters,
    onResetFilters,
    dateRangeFilter,
    query,
    setQuery,
    addNewUrl,
    nav,
    selectedIds,
    allItemsSelected,
    data,
    markAllSelected,
    bulkActions,
    selectedRows,
    clearSelectionsAfterAction,
}: TableActionsBarDesktopProps<T>) {
    return (
        <div className="hidden mb-4 sm:flex sm:flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="non-sticky-wrapper">
                <div className="sticky left-0 text-left">
                    <h1 className="text-2xl font-bold text-light_tablewind_text_primary dark:text-dark_tablewind_text_primary">
                        {pageTitle || 'Table'}
                    </h1>
                    <p className="mt-2 text-sm text-light_tablewind_text_secondary dark:text-dark_tablewind_text_secondary">
                        {pageSubtitle ||
                            'A list of your records with inline editing, filtering, sorting and pagination.'}
                    </p>
                </div>
            </div>
            <div className="non-sticky-wrapper">
                <div className="sticky right-0 mt-4 flex items-center space-x-4 sm:mt-0">
                    {dateRangeFilter && (
                        <DateRangeFilter
                            queryParamBase={dateRangeFilter.queryParamBase}
                            initialStartDate={
                                query[
                                    `${dateRangeFilter.queryParamBase}_gte`
                                ] as string
                            }
                            initialEndDate={
                                query[
                                    `${dateRangeFilter.queryParamBase}_lte`
                                ] as string
                            }
                            onApply={(filters) =>
                                setQuery((prev) => ({
                                    ...prev,
                                    ...filters,
                                    page: '1',
                                }))
                            }
                            onReset={() =>
                                setQuery((prev) => {
                                    const updated = { ...prev };
                                    delete updated[
                                        `${dateRangeFilter.queryParamBase}_gte`
                                    ];
                                    delete updated[
                                        `${dateRangeFilter.queryParamBase}_lte`
                                    ];
                                    return { ...updated, page: '1' };
                                })
                            }
                        />
                    )}

                    {selectedIds.length > 0 &&
                        !allItemsSelected &&
                        data &&
                        selectedIds.length < data.pagination.total_items && (
                            <button
                                className="mr-4 ml-2 inline-flex justify-center rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-4 py-2 text-sm font-medium text-light_tablewind_text_secondary hover:bg-light_tablewind_bg_primary_hover dark:border-dark_tablewind_border_primary dark:text-dark_tablewind_text_secondary dark:bg-dark_tablewind_bg_primary dark:hover:bg-dark_tablewind_bg_primary_hover"
                                onClick={markAllSelected}
                            >
                                Mark all ({data.pagination.total_items}) as
                                selected.
                            </button>
                        )}

                    {selectedIds.length > 0 && bulkActions && (
                        <BulkActionDropdown<T>
                            actions={bulkActions}
                            selectedIds={selectedIds}
                            selectedRows={selectedRows}
                            clearSelectionsAfterAction={clearSelectionsAfterAction}
                        />
                    )}

                    <select
                        value={pageSize}
                        onChange={(e) =>
                            onPageSizeChange(Number(e.target.value))
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
                        onClick={onToggleFilters}
                        className="rounded-md px-3 py-2 text-sm font-medium bg-light_show_filters_bg text-light_show_filters_text hover:bg-light_show_filters_bg_hover dark:bg-dark_show_filters_bg dark:text-dark_show_filters_text dark:hover:bg-dark_show_filters_bg_hover"
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={onResetFilters}
                            className="rounded-md bg-light_reset_filters_bg px-3 py-2 text-sm font-medium text-light_reset_filters_text hover:bg-light_reset_filters_bg_hover dark:bg-dark_reset_filters_bg dark:text-dark_reset_filters_text dark:hover:bg-dark_reset_filters_bg_hover"
                        >
                            Reset Filters
                        </button>
                    )}
                    
                    {addNewUrl && (
                        <button
                            onClick={() => nav(addNewUrl)}
                            className="rounded-md bg-light_tablewind_accent dark:bg-dark_tablewind_accent px-4 py-2 text-sm font-semibold text-light_tablewind_text_primary shadow-sm dark:hover:bg-dark_tablewind_accent_hover hover:light_tablewind_accent_hover"
                        >
                            Add New
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TableActionsBarDesktop;
