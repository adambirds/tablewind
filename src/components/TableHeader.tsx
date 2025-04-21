import React from 'react';
import { ColumnConfig } from '../types';

interface TableHeaderProps<T> {
    columns: ColumnConfig<T>[];
    onSort: (column: ColumnConfig<T>) => void;
    sortBy: string;
    order: 'asc' | 'desc';
    className?: string;
    selectAll: boolean;
    toggleSelectAll: () => void;
}

export function TableHeader<T>({
    columns,
    onSort,
    sortBy,
    order,
    className = 'sticky top-0 z-20 bg-light_header_bg dark:bg-dark_header_bg',
    selectAll,
    toggleSelectAll,
}: TableHeaderProps<T>) {
    const anyEditable = columns.some((col) => col.editable);
    return (
        <thead className={className}>
            <tr className="ring-1 shadow ring-light_header_ring/5 bg-light_table_header_bg dark:bg-dark_table_header_bg dark:ring-dark_header_ring/5">
                <th className="md:sticky md:left-0 rounded-tl-lg pl-2 bg-light_table_header_bg dark:bg-dark_table_header_bg">
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="h-6 w-6 rounded-full border-light_tablewind_border_primary text-light_tablewind_accent dark:text-dark_tablewind_accent focus:ring-light_tablewind_accent_hover dark:focus:ring-dark_tablewind_accent_hover dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary checked:bg-light_tablewind_accent dark:checked:bg-dark_tablewind_accent"
                    />
                </th>
                {columns.map((col, idx) => (
                    <th
                        key={idx}
                        onClick={() => onSort(col)}
                        style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                        className="cursor-pointer py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-light_tablewind_text_primary sm:pl-6 dark:text-dark_tablewind_text_primary"
                    >
                        {col.label}
                        {col.sortable &&
                            sortBy === (col.sortKey || col.accessor) && (
                                <span>{order === 'asc' ? ' ↑' : ' ↓'}</span>
                            )}
                    </th>
                ))}
                {anyEditable && (
                    <th className="md:sticky md:right-0 rounded-tr-lg py-3.5 pr-4 pl-3 sm:pr-6 bg-light_table_header_bg dark:bg-dark_table_header_bg">
                        <span className="sr-only">Actions</span>
                    </th>
                )}
            </tr>
        </thead>
    );
}
