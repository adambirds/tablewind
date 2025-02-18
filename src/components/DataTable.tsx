// src/components/DataTable.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { ColumnConfig, DataTableProps, FilterField } from "../types";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { PaginationControls } from "./PaginationControls";
import { FilterBar } from "./FilterBar";
import { BulkActionModal } from "./BulkActionModal";
import { BulkActionDropdown } from "./BulkActionDropdown";

interface InlineEditCallbacks {
  onEditSave?: (id: string, newValues: Record<string, any>) => void;
  onEditCancel?: () => void;
}

export type DataTableComponentProps<T extends { id: string }> = DataTableProps<T> &
  InlineEditCallbacks & {
    navigate?: (url: string) => void;
  };

/**
 * Updated DataTable now accepts an optional `navigate` function.
 * If not provided, it defaults to using window.location.assign.
 */
export function DataTable<T extends { id: string }>({
  pageTitle,
  pageSubtitle,
  endpoint,
  columns,
  initialQuery = {},
  fetcher,
  onRowSelect,
  filterFields = [], // default to empty array if undefined
  bulkActions,
  className,
  onEditSave,
  onEditCancel,
  handleDelete,
  // NEW: Optional navigation function
  navigate,
}: DataTableProps<T> & InlineEditCallbacks & { navigate?: (url: string) => void }) {
  // Define a default navigation function (fallback for plain React apps)
  const defaultNavigate = (url: string) => {
    if (typeof window !== "undefined") {
      window.location.assign(url);
    }
  };

  // Use the provided navigate prop or fall back to defaultNavigate.
  const nav = navigate || defaultNavigate;

  // Use a single state to hold all query params.
  const [query, setQuery] = useState<Record<string, string | string[]>>(initialQuery);

  // Derive pagination and sorting values from query.
  const page = Number(query.page || "1");
  const pageSize = Number(query.page_size || "25");
  const sortBy = typeof query.sort_by === "string" ? query.sort_by : "";
  const order = query.order === "desc" ? "desc" : "asc";

  // Bulk selection state.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [allItemsSelected, setAllItemsSelected] = useState(false);

  // Bulk action modal state.
  const [selectedBulkAction, setSelectedBulkAction] = useState<string | null>(null);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);

  // Inline editing state.
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});

  // Filter visibility state.
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  // ------------------------
  // Inline editing functions
  // ------------------------
  const startEditing = (row: T) => {
    setEditingRowId(row.id);
    const newValues: Record<string, any> = {};
    columns.forEach((col) => {
      if (col.editable) {
        const fieldValue = (row as any)[col.accessor as string];
        if (col.inputType === "multi-select") {
          const arr = Array.isArray(fieldValue) ? fieldValue : [];
          newValues[col.accessor as string] = arr
            .filter((item) => item !== null && item !== undefined)
            .map((item) => (typeof item === "object" ? item.id : item));
        } else {
          newValues[col.accessor as string] = fieldValue;
        }
      }
    });
    setEditValues(newValues);
  };

  const saveEdit = (id: string) => {
    const payload = { ...editValues };
    columns.forEach((col) => {
      if (col.inputType === "multi-select") {
        const key = (col as any).saveKey || col.accessor;
        const currentValue = editValues[col.accessor as string];
        payload[key] = Array.isArray(currentValue)
          ? currentValue.filter((item) => item !== null && item !== undefined)
          : [];
        if ((col as any).saveKey) {
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
    const newOrder = sortBy === newSortKey ? (order === "asc" ? "desc" : "asc") : "asc";
    setQuery((prev) => ({
      ...prev,
      sort_by: newSortKey,
      order: newOrder,
      page: "1",
    }));
  };

  // ------------------------
  // Filtering function
  // ------------------------
  const handleFilterChange = (newFilters: Record<string, string | string[]>) => {
    setQuery((prev) => {
      const merged = { ...prev, ...newFilters, page: "1" };
      return shallowEqual(prev, merged) ? prev : merged;
    });
  };

  // ------------------------
  // Pagination functions
  // ------------------------
  const handlePageChange = (newPage: number) =>
    setQuery((prev) => ({ ...prev, page: String(newPage) }));
  const handlePageSizeChange = (newSize: number) =>
    setQuery((prev) => ({ ...prev, page_size: String(newSize), page: "1" }));

  // ------------------------
  // URL Sync
  // ------------------------
  useEffect(() => {
    const params = buildQueryParams();
    const currentQueryString = new URLSearchParams(window.location.search).toString();
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
  const [mergedFilterFields, setMergedFilterFields] = useState<FilterField[]>(filterFields);

  useEffect(() => {
    const apiFilters = (data as any)?.available_filters || {};
    // Only update if apiFilters is non-empty
    if (Object.keys(apiFilters).length > 0) {
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
    params.set("page", "1");
    params.set("page_size", String(data.pagination.total_items));
    const url = `${endpoint}?${params.toString()}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Error fetching all posts");
        return;
      }
      const allData = await res.json();
      setSelectedIds(allData.results.map((row: any) => row.id));
      setAllItemsSelected(true);
    } catch (error) {
      console.error("Error fetching all posts", error);
    }
  };

  const cancelAllSelection = () => {
    setSelectedIds([]);
    setAllItemsSelected(false);
  };

  // ------------------------
  // Extra content and pagination height.
  // ------------------------
  // Use useRef to obtain a reference to DOM elements.
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

  console.log("extraContentHeight", extraContentHeight);
  console.log("paginationHeight", paginationHeight);

  // ------------------------
  // Filter section content.
  // ------------------------
  const filterKeys = useMemo(
    () =>
      Object.keys(query).filter(
        (key) => !["page", "page_size", "sort_by", "order"].includes(key)
      ),
    [query]
  );

  const hasActiveFilters = filterKeys.some((key) => {
    const val = query[key];
    return Array.isArray(val) ? val.length > 0 : val !== "";
  });

  const initialFiltersForBar = useMemo(() => {
    return filterKeys.reduce<Record<string, string | string[]>>((acc, key) => {
      acc[key] = query[key];
      return acc;
    }, {});
  }, [filterKeys, query]);

  const filterContent = (
    <div>
      <div ref={extraContentRef} className="pt-4">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="non-sticky-wrapper">
            <div className="sticky left-0 text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pageTitle || "Table"}
              </h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {pageSubtitle ||
                  "A list of your posts with inline editing, filtering, sorting and pagination."}
              </p>
            </div>
          </div>
          <div className="non-sticky-wrapper">
            <div className="sticky right-0 mt-4 flex items-center space-x-4 sm:mt-0">
              {selectedIds.length > 0 &&
                !allItemsSelected &&
                data &&
                selectedIds.length < data.pagination.total_items && (
                  <button
                    className="mr-4 ml-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    onClick={markAllSelected}
                  >
                    Mark all ({data.pagination.total_items}) as selected.
                  </button>
                )}
              {selectedIds.length > 0 && bulkActions && (
                <BulkActionDropdown actions={bulkActions} selectedIds={selectedIds} />
              )}
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="rounded-md border bg-white py-2 pr-8 pl-2 text-sm text-gray-900 hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
              <button
                onClick={() => nav("/dashboard/posts/new")}
                className="rounded-md bg-sky-300 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-sky-400"
              >
                Add New
              </button>
              <button
                onClick={toggleFilters}
                className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setQuery((prev) => {
                      const newQuery = { ...prev };
                      filterKeys.forEach((key) => delete newQuery[key]);
                      return { ...newQuery, page: "1" };
                    });
                  }}
                  className="rounded-md bg-red-200 px-3 py-2 text-sm font-medium text-red-900 hover:bg-red-300"
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
          <div className="mb-4 rounded bg-green-100 p-2 text-green-800 text-center">
            All {data.pagination.total_items} items are selected.
            <button onClick={cancelAllSelection} className="ml-2 underline">
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
    <div className={`px-6 ${className || ""}`}>
      <div>
        <div className="sticky top-0 bg-slate-900 pb-4">{filterContent}</div>
        <div
          className="overflow-x-auto overflow-y-auto"
          style={{
            maxHeight: `calc(100vh - (var(--total-subtraction) * 2) - ${extraContentHeight}px - ${paginationHeight}px)`,
          }}
        >
          <table className="min-w-full divide-y divide-gray-300">
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
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        ref={paginationRef}
      />
      {bulkActions && bulkActions.length > 0 && (
        <BulkActionModal
          isOpen={showBulkActionModal}
          title={`Confirm Bulk ${selectedBulkAction}`}
          message={`Are you sure you want to perform bulk ${selectedBulkAction} on the selected posts?`}
          onConfirm={() => setShowBulkActionModal(false)}
          onCancel={() => setShowBulkActionModal(false)}
        />
      )}
    </div>
  );
}

// Simple shallow equality check for objects.
const shallowEqual = (objA: any, objB: any) => {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
};

export default DataTable;
