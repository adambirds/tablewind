import React from "react";
import { ColumnConfig } from "../types";

interface TableHeaderProps<T> {
  columns: ColumnConfig<T>[];
  onSort: (column: ColumnConfig<T>) => void;
  sortBy: string;
  order: "asc" | "desc";
  className?: string;
  selectAll: boolean;
  toggleSelectAll: () => void;
}

export function TableHeader<T>({
  columns,
  onSort,
  sortBy,
  order,
  className = "sticky top-0 z-20",
  selectAll,
  toggleSelectAll,
}: TableHeaderProps<T>) {
  const anyEditable = columns.some((col) => (col as any).editable);
  return (
    <thead className={className}>
      <tr className="bg-gray-50 ring-1 shadow ring-black/5 dark:bg-slate-700">
        <th className="sticky left-0 rounded-tl-lg bg-gray-50 pl-2 dark:bg-slate-700">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
            className="h-6 w-6 rounded-full border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-sky-300"
          />
        </th>
        {columns.map((col, idx) => (
          <th
            key={idx}
            onClick={() => onSort(col)}
            style={{ cursor: col.sortable ? "pointer" : "default" }}
            className="cursor-pointer py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-gray-100"
          >
            {col.label}
            {col.sortable && sortBy === (col.sortKey || col.accessor) && (
              <span>{order === "asc" ? " ↑" : " ↓"}</span>
            )}
          </th>
        ))}
        {anyEditable && (
          <th className="sticky right-0 rounded-tr-lg bg-gray-50 py-3.5 pr-4 pl-3 sm:pr-6 dark:bg-slate-700">
            <span className="sr-only">Actions</span>
          </th>
        )}
      </tr>
    </thead>
  );
}
