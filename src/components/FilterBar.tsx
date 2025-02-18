import React, { useState, useEffect, useRef } from "react";
import { FilterField } from "../types";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

// A simple shallow equality check.
const shallowEqual = (objA: any, objB: any) => {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
};

export interface FilterBarProps {
  fields: FilterField[];
  initialFilters?: Record<string, string | string[]>;
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  className?: string;
  autoApply?: boolean;
}

export function FilterBar({
  fields,
  initialFilters = {},
  onFilterChange,
  className,
  autoApply = true,
}: FilterBarProps) {
  const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);
  // Skip the very first auto-apply.
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Only update if the incoming initialFilters differ.
    if (!shallowEqual(filters, initialFilters)) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Only auto-apply if filters differ from the initial (to avoid re‑applying identical values)
    if (autoApply && !shallowEqual(filters, initialFilters)) {
      onFilterChange(filters);
    }
  }, [filters, autoApply, onFilterChange, initialFilters]);

  const handleChange = (field: FilterField, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [field.name]: value }));
  };

  return (
    <div className="pt-4">
      <div className={`grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 ${className || ""}`}>
        {fields.map((field) => {
          switch (field.type) {
            case "text":
              return (
                <div key={field.name} className="flex flex-col">
                  <input
                    id={field.name}
                    type="text"
                    name={field.name}
                    value={(filters[field.name] as string) || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>
              );
            case "select":
              return (
                <div key={field.name} className="flex flex-col">
                  <select
                    id={field.name}
                    name={field.name}
                    value={(filters[field.name] as string) || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-0"
                  >
                    <option value="">{field.allOption}</option>
                    {field.options?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            case "multi-select": {
              const currentValue = filters[field.name];
              const selectedValue = Array.isArray(currentValue)
                ? currentValue
                : typeof currentValue === "string"
                ? (currentValue as string).split(",").filter(Boolean)
                : [];
              return (
                <div key={field.name} className="flex flex-col">
                  <MultiSelectDropdown
                    options={field.options || []}
                    selected={selectedValue}
                    onChange={(selected) => handleChange(field, selected)}
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
