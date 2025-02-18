import React from 'react';
import { ColumnConfig } from '../types';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { Switch } from '@headlessui/react';

interface TableBodyProps<T> {
    data?: T[];
    columns: ColumnConfig<T>[];
    onRowSelect: (id: string, selected: boolean) => void;
    selectedIds: string[];
    editingRowId?: string | null;
    editValues?: Record<string, unknown>;
    setEditValues?: React.Dispatch<
        React.SetStateAction<Record<string, unknown>>
    >;
    onSaveEdit?: (id: string) => void;
    onCancelEdit?: () => void;
    onStartEdit?: (row: T) => void;
    className?: string;
    handleDelete?: (id: string) => void;
}

export function TableBody<T extends { id: string } & Record<string, unknown>>({
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
    className = 'divide-y divide-gray-200 bg-white dark:bg-slate-800',
    handleDelete,
}: TableBodyProps<T>) {
    const renderEditableCell = (col: ColumnConfig<T>, _row: T) => {
        const fieldKey = col.accessor as string;
        const value = editValues ? editValues[fieldKey] : '';
        switch (col.inputType) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={typeof value === 'string' ? value : ''}
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
            case 'checkbox':
                return (
                    <Switch
                        checked={Boolean(editValues?.[fieldKey])}
                        onChange={(value) =>
                            setEditValues &&
                            setEditValues((prev) => ({
                                ...prev,
                                [fieldKey]: value,
                            }))
                        }
                        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out data-checked:bg-sky-300"
                    >
                        <span className="sr-only">Toggle</span>
                        <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out" />
                    </Switch>
                );
            case 'select':
                return (
                    <select
                        value={typeof value === 'string' ? value : ''}
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
            case 'multi-select':
                return (
                    <MultiSelectDropdown
                        options={col.options || []}
                        selected={
                            Array.isArray(value) ? (value as string[]) : []
                        }
                        onChange={(selected) => {
                            if (setEditValues) {
                                setEditValues((prev) => ({
                                    ...prev,
                                    [fieldKey]: selected.filter(
                                        (x) => x !== null && x !== undefined
                                    ),
                                }));
                            }
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
                <tr
                    key={row.id}
                    className="group hover:bg-gray-50 dark:hover:bg-slate-600"
                >
                    <td className="sticky left-0 bg-white pl-3 group-hover:bg-gray-50 dark:bg-slate-800 dark:group-hover:bg-slate-600">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={(e) =>
                                onRowSelect(row.id, e.target.checked)
                            }
                            className="h-6 w-6 rounded-full border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-sky-300"
                        />
                    </td>
                    {columns.map((col, idx) => (
                        <td
                            key={idx}
                            className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 dark:text-gray-100"
                        >
                            {isRowEditing(row) && col.editable
                                ? renderEditableCell(col, row)
                                : col.render
                                  ? col.render(row)
                                  : (() => {
                                        const cell =
                                            row[col.accessor as keyof T];
                                        return React.isValidElement(cell) ? (
                                            cell
                                        ) : (
                                            <>{String(cell ?? '')}</>
                                        );
                                    })()}
                        </td>
                    ))}
                    {anyEditable && (
                        <td className="sticky right-0 ml-2 bg-white px-3 py-4 text-right text-sm font-medium whitespace-nowrap group-hover:bg-gray-50 dark:bg-slate-800 dark:group-hover:bg-slate-600">
                            {isRowEditing(row) ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            onSaveEdit && onSaveEdit(row.id)
                                        }
                                        className="mr-2 rounded bg-sky-300 px-2 py-1 text-sm font-semibold text-gray-900 hover:bg-sky-400"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() =>
                                            onCancelEdit && onCancelEdit()
                                        }
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
                                        {handleDelete && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(row.id)
                                                }
                                                className="ml-2 rounded bg-red-500 px-2 py-1 text-sm font-semibold text-white hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        )}
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
