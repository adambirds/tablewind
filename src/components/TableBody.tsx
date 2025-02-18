import React from "react";
import { ColumnConfig } from "../types";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { Switch } from "@headlessui/react";

interface TableBodyProps<T> {
  data?: T[];
  columns: ColumnConfig<T>[];
  onRowSelect: (id: string, selected: boolean) => void;
  selectedIds: string[];
  editingRowId?: string | null;
  editValues?: Record<string, any>;
  setEditValues?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onSaveEdit?: (id: string) => void;
  onCancelEdit?: () => void;
  onStartEdit?: (row: T) => void;
  className?: string;
  handleDelete?: (id: string) => void;
}

export function TableBody<T extends { id: string }>({
  data = [],
  columns,
  onRowSelect,
  selectedIds,
  editingRowId,
  editValues,
  setEditValues,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  className = "divide-y divide-gray-200 bg-white dark:bg-slate-800",
  handleDelete,
}: TableBodyProps<T>) {
  const renderEditableCell = (
    col: ColumnConfig<T> & {
      editable?: boolean;
      inputType?: string;
      options?: any[];
    },
    row: T
  ) => {
    const fieldKey = col.accessor as string;
    const value = editValues ? editValues[fieldKey] : "";
    switch (col.inputType) {
      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditValues &&
              setEditValues((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            className="w-full rounded border bg-white p-1 text-sm dark:bg-gray-800 dark:text-gray-300"
          />
        );
      case "checkbox":
        return (
          <>
            <Switch
              checked={editValues?.published}
              onChange={(value) =>
                setEditValues &&
                setEditValues((prev) => ({
                  ...prev,
                  published: value,
                }))
              }
              className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out data-checked:bg-sky-300"
            >
              <span className="sr-only">Published</span>
              <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out group-data-checked:translate-x-5">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in group-data-checked:opacity-0 group-data-checked:duration-100 group-data-checked:ease-out"
                >
                  <svg fill="none" viewBox="0 0 12 12" className="h-3 w-3 text-gray-400">
                    <path
                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-checked:opacity-100 group-data-checked:duration-200 group-data-checked:ease-in"
                >
                  <svg fill="currentColor" viewBox="0 0 12 12" className="h-3 w-3">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </>
        );
      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) =>
              setEditValues &&
              setEditValues((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            className="w-full rounded border bg-white p-1 text-sm dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">Select...</option>
            {col.options?.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        );
      case "multi-select":
        return (
            <MultiSelectDropdown
            options={col.options || []}
            selected={Array.isArray(value) ? value : []}
            onChange={(selected) => {
                console.log("Multi-select onChange for", fieldKey, selected);
                setEditValues?.((prev) => ({
                  ...prev,
                  [fieldKey]: selected.filter((x) => x !== null && x !== undefined),
                }));
              }}
              
          />
          
        );
      default:
        return null;
    }
  };

  const isRowEditing = (row: T) => editingRowId === row.id;
  const anyEditable = columns.some((col) => col.editable);

  return (
    <tbody className={className}>
      {data.map((row) => (
        <tr key={row.id} className="group hover:bg-gray-50 dark:hover:bg-slate-600">
          <td className="sticky left-0 bg-white pl-3 group-hover:bg-gray-50 dark:bg-slate-800 dark:group-hover:bg-slate-600">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.id)}
              onChange={(e) => onRowSelect(row.id, e.target.checked)}
              className="h-6 w-6 rounded-full border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-sky-300"
            />
          </td>
          {columns.map((col, idx) => (
            <td
              key={idx}
              className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 dark:text-gray-100"
            >
              {isRowEditing(row) && col.editable
                ? renderEditableCell(col as any, row)
                : col.render
                ? col.render(row)
                : (row as any)[col.accessor as string]}
            </td>
          ))}
          {anyEditable && (
            <td className="sticky right-0 ml-2 bg-white px-3 py-4 text-right text-sm font-medium whitespace-nowrap group-hover:bg-gray-50 dark:bg-slate-800 dark:group-hover:bg-slate-600">
              {isRowEditing(row) ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onSaveEdit && onSaveEdit(row.id)}
                    className="mr-2 rounded bg-sky-300 px-2 py-1 text-sm font-semibold text-gray-900 hover:bg-sky-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => onCancelEdit && onCancelEdit()}
                    className="rounded bg-gray-300 px-2 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                onStartEdit && (
                  <>
                    <button
                      onClick={() => onStartEdit(row)}
                      className="rounded bg-gray-300 px-2 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-400"
                    >
                      Edit
                    </button>
                    {handleDelete && 
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="ml-2 rounded bg-red-500 px-2 py-1 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                    }
                  </>
                )
              )}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
}
