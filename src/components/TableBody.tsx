// src/components/TableBody.tsx
import React from 'react';
import { ColumnConfig } from '../types';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { Switch } from '@headlessui/react';
import { CustomDatePicker } from './CustomDatePicker';
import { getValueFromPath } from '../utils/getValueFromPath';

type OptionType = { id: string | number; name: string } | null;

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
                        value={
                            typeof value === 'string' ||
                            typeof value === 'number'
                                ? value
                                : ''
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditValues &&
                            setEditValues((prev) => ({
                                ...prev,
                                [fieldKey]: e.target.value,
                            }))
                        }
                        className="w-full rounded border bg-light_tablewind_bg_primary text-light_tablewind_text_secondary p-1 text-sm dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary"
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
                        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-light_switch_bg dark:bg-dark_switch_bg transition-colors duration-200 ease-in-out data-checked:bg-light_tablewind_accent dark:data-checked:bg-dark_tablewind_accent"
                    >
                        <span className="sr-only">Toggle</span>
                        <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-light_tablewind_bg_primary shadow-sm transition duration-200 ease-in-out" />
                    </Switch>
                );
            case 'select':
                return (
                    <select
                        value={
                            typeof value === 'object' &&
                            value !== null &&
                            'id' in value
                                ? (value as { id: string | number }).id
                                : typeof value === 'string' ||
                                    typeof value === 'number'
                                  ? value
                                  : ''
                        }
                        onChange={(e) => {
                            const rawValue = e.target.value;
                            let newValue: OptionType = null;
                            if (rawValue !== '') {
                                newValue =
                                    col.options?.find(
                                        (opt) => String(opt.id) === rawValue
                                    ) ?? null;
                            }

                            if (setEditValues) {
                                setEditValues((prev) => ({
                                    ...prev,
                                    [fieldKey]: newValue,
                                }));
                            }
                        }}
                        className="w-full rounded border bg-light_tablewind_bg_primary p-1 text-sm text-light_tablewind_text_secondary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary"
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
            case 'datetime':
                return (
                    <CustomDatePicker
                        value={typeof value === 'string' ? value : null}
                        onChange={(newIso) =>
                            setEditValues?.((prev) => ({
                                ...prev,
                                [fieldKey]: newIso,
                            }))
                        }
                    />
                );
            default:
                return null;
        }
    };

    const isRowEditing = (row: T) => editingRowId === row.id;
    const anyEditable = columns.some((col) => col.editable);

    return (
        <tbody className="bg-light_tablewind_bg_primary dark:bg-dark_tablewind_bg_primary">
            {data.map((row, rowIndex) => (
                <tr
                    key={row.id}
                    className={`group hover:bg-light_tablewind_bg_primary_hover dark:hover:bg-dark_tablewind_bg_primary_hover ${
                        rowIndex !== data.length - 1
                            ? 'border-b-2 border-light_table_divider dark:border-dark_table_divider'
                            : ''
                    }`}
                >
                    <td className="lg:sticky text-center md:left-0 bg-light_tablewind_bg_primary pl-2 group-hover:bg-light_tablewind_bg_primary_hover dark:bg-dark_tablewind_bg_primary dark:group-hover:bg-dark_tablewind_bg_primary_hover">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={(e) =>
                                onRowSelect(row.id, e.target.checked)
                            }
                            className="h-6 w-6 rounded-full border-light_tablewind_border_primary text-light_tablewind_accent dark:text-dark_tablewind_accent focus:light_tablewind_accent_hover dark:focus:ring-dark_tablewind_accent_hover dark:border-dark_tablewind_border_primary dark:bg-gray-800 checked:bg-light_tablewind_accent dark:checked:bg-dark_tablewind_accent"
                        />
                    </td>
                    {columns.map((col, idx) => (
                        <td
                            key={idx}
                            className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-light_tablewind_text_primary sm:pl-6 dark:text-dark_tablewind_text_primary"
                        >
                            {isRowEditing(row) && col.editable
                                ? renderEditableCell(col, row)
                                : col.render
                                  ? col.render(row)
                                  : (() => {
                                        const cell = getValueFromPath(
                                            row,
                                            col.accessor as string
                                        );
                                        return React.isValidElement(cell) ? (
                                            cell
                                        ) : (
                                            <>{String(cell ?? '')}</>
                                        );
                                    })()}
                        </td>
                    ))}
                    {anyEditable && (
                        <td className="lg:sticky md:right-0 ml-2 bg-light_tablewind_bg_primary px-3 py-4 text-right text-sm font-medium whitespace-nowrap group-hover:bg-light_tablewind_bg_primary_hover dark:bg-dark_tablewind_bg_primary dark:group-hover:bg-dark_tablewind_bg_primary_hover">
                            {isRowEditing(row) ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            onSaveEdit && onSaveEdit(row.id)
                                        }
                                        className="mr-2 rounded bg-light_button_save_bg dark:bg-dark_button_save_bg px-2 py-1 text-sm font-semibold text-light_button_save_text hover:bg-light_button_save_bg_hover dark:hover:bg-dark_button_save_bg_hover dark:text-dark_button_save_text"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() =>
                                            onCancelEdit && onCancelEdit()
                                        }
                                        className="rounded bg-light_button_cancel_bg px-2 py-1 text-sm font-semibold text-light_button_cancel_text hover:bg-light_button_cancel_bg_hover dark:bg-dark_button_cancel_bg dark:text-dark_button_cancel_text dark:hover:dark_button_cancel_bg_hover"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                onStartEdit && (
                                    <>
                                        <button
                                            onClick={() => onStartEdit(row)}
                                            className="rounded bg-light_button_edit_bg px-2 py-1 text-sm font-semibold text-light_button_edit_text hover:bg-light_button_edit_bg_hover dark:bg-dark_button_edit_bg dark:text-dark_button_edit_text dark:hover:dark_button_edit_bg_hover"
                                        >
                                            Edit
                                        </button>
                                        {handleDelete && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(row.id)
                                                }
                                                className="ml-2 rounded bg-light_button_delete_bg px-2 py-1 text-sm font-semibold text-light_button_delete_text hover:light_button_delete_bg_hover dark:bg-dark_button_delete_bg dark:text-dark_button_delete_text dark:hover:dark_button_delete_bg_hover"
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
