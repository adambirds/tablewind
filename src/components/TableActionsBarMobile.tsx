import React, { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import { FilterBar } from './FilterBar';
import { FilterField, BulkAction } from '../types';
import { BulkActionDropdown } from './BulkActionDropdown';

interface Props {
    pageTitle?: string;
    pageSubtitle?: string;
    dateRangeFilter?: { queryParamBase: string };
    query: Record<string, string | string[]>;
    setQuery: React.Dispatch<
        React.SetStateAction<Record<string, string | string[]>>
    >;
    filterFields: FilterField[];
    initialFilters: Record<string, string | string[]>;
    onFilterChange: (filters: Record<string, string | string[]>) => void;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
    onResetFilters: () => void;
    selectedIds: string[];
    allItemsSelected: boolean;
    data?: { pagination: { total_items: number } };
    markAllSelected: () => void;
    bulkActions?: BulkAction[];
    hasActiveFilters: boolean;
    showFilters: boolean;
    setShowFilters: (open: boolean) => void;
    isMobile: boolean;
}

const TableActionsBarMobile: React.FC<Props> = ({
    pageTitle,
    pageSubtitle,
    dateRangeFilter,
    query,
    setQuery,
    filterFields,
    initialFilters,
    onFilterChange,
    pageSize,
    onPageSizeChange,
    onResetFilters,
    selectedIds,
    allItemsSelected,
    data,
    markAllSelected,
    bulkActions,
    hasActiveFilters,
    showFilters,
    setShowFilters,
    isMobile,
}) => {
    return (
        <div className="block md:hidden mb-4">
            {/* Title + Show Filters Button Inline */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-light_tablewind_text_primary dark:text-dark_tablewind_text_primary">
                        {pageTitle}
                    </h1>
                    {pageSubtitle && (
                        <p className="mt-1 text-sm text-light_tablewind_text_secondary dark:text-dark_tablewind_text_secondary">
                            {pageSubtitle}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="shrink-0 rounded-md bg-light_show_filters_bg px-3 py-2 text-sm font-medium text-light_show_filters_text hover:bg-light_show_filters_bg_hover dark:bg-dark_show_filters_bg dark:text-dark_show_filters_text dark:hover:bg-dark_show_filters_bg_hover"
                >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {/* Filters Panel (toggleable) */}
            {showFilters && (
                <div className="mt-4 flex flex-col gap-4">
                    {hasActiveFilters && (
                        <button
                            onClick={onResetFilters}
                            className="w-full rounded-md bg-light_reset_filters_bg px-3 py-2 text-sm font-medium text-light_reset_filters_text hover:bg-light_reset_filters_bg_hover dark:bg-dark_reset_filters_bg dark:text-dark_reset_filters_text dark:hover:bg-dark_reset_filters_bg_hover"
                        >
                            Reset Filters
                        </button>
                    )}
                    {/* Date Range Filter */}

                    <div className="grid grid-cols-1 gap-4">
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
                                onReset={onResetFilters}
                            />
                        )}

                        <select
                            value={pageSize}
                            onChange={(e) =>
                                onPageSizeChange(Number(e.target.value))
                            }
                            className="w-full rounded-md border bg-light_tablewind_bg_primary py-2 pr-8 pl-2 text-sm text-light_tablewind_text_primary hover:bg-light_tablewind_bg_primary_hover dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary"
                        >
                            {[10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size} per page
                                </option>
                            ))}
                        </select>
                    </div>

                    {isMobile && (
                        <FilterBar
                            fields={filterFields}
                            initialFilters={initialFilters}
                            onFilterChange={onFilterChange}
                            autoApply={true}
                        />
                    )}
                </div>
            )}

            {/* Mark All + Bulk Actions (ALWAYS visible below filters) */}
            <div className="mt-4 space-y-2">
                {selectedIds.length > 0 &&
                    !allItemsSelected &&
                    data &&
                    selectedIds.length < data.pagination.total_items && (
                        <button
                            onClick={markAllSelected}
                            className="w-full rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-4 py-2 text-sm font-medium text-light_tablewind_text_secondary hover:bg-light_tablewind_bg_primary_hover dark:border-dark_tablewind_border_primary dark:text-dark_tablewind_text_secondary dark:bg-dark_tablewind_bg_primary dark:hover:bg-dark_tablewind_bg_primary_hover"
                        >
                            Mark all ({data.pagination.total_items}) as selected
                        </button>
                    )}

                {selectedIds.length > 0 && bulkActions && (
                    <div className="w-full">
                        <BulkActionDropdown
                            actions={bulkActions}
                            selectedIds={selectedIds}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableActionsBarMobile;
