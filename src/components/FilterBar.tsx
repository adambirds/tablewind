import React from 'react';
import { FilterField } from '../types';
import { MultiSelectDropdown } from './MultiSelectDropdown';

export interface FilterBarProps {
    fields: FilterField[];
    filters: Record<string, string | string[]>;
    onFilterChange: (filters: Record<string, string | string[]>) => void;
    className?: string;
}

export function FilterBar({
    fields,
    filters,
    onFilterChange,
    className,
}: FilterBarProps) {
    const setFilter = (key: string, value: string | string[]) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    return (
        <div className="">
            <div
                className={`grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 ${className || ''}`}
            >
                {fields.map((field) => {
                    switch (field.type) {
                        case 'text':
                            return (
                                <div key={field.name} className="flex flex-col">
                                    <input
                                        id={field.name}
                                        type="text"
                                        name={field.name}
                                        value={
                                            (filters[field.name] as string) ||
                                            ''
                                        }
                                        onChange={(e) =>
                                            setFilter(
                                                field.name,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-3 py-2 text-sm font-medium text-light_tablewind_text_secondary hover:bg-light_tablewind_bg_primary_hover focus:outline-none dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary dark:hover:bg-dark_tablewind_bg_primary_hover focus:ring-0"
                                    />
                                </div>
                            );

                        case 'select':
                            return (
                                <div key={field.name} className="flex flex-col">
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        value={
                                            (filters[field.name] as string) ||
                                            ''
                                        }
                                        onChange={(e) =>
                                            setFilter(
                                                field.name,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-3 py-2 text-sm font-medium text-light_tablewind_text_secondary hover:bg-light_tablewind_bg_primary_hover focus:outline-none dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary dark:hover:bg-dark_tablewind_bg_primary_hover focus:ring-0"
                                    >
                                        <option value="">
                                            {field.allOption}
                                        </option>
                                        {field.options?.map((option) => (
                                            <option
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );

                        case 'multi-select': {
                            const currentValue = filters[field.name];
                            const selectedValue = Array.isArray(currentValue)
                                ? currentValue
                                : typeof currentValue === 'string'
                                  ? currentValue.split(',').filter(Boolean)
                                  : [];

                            return (
                                <div key={field.name} className="flex flex-col">
                                    <MultiSelectDropdown
                                        options={field.options || []}
                                        selected={selectedValue}
                                        onChange={(selected) =>
                                            setFilter(field.name, selected)
                                        }
                                        className="w-full"
                                    />
                                </div>
                            );
                        }

                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
}
