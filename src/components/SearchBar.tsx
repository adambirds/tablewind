import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
    /** Current search value */
    value: string;
    /** Callback when search value changes */
    onChange: (value: string) => void;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** Optional className for custom styling */
    className?: string;
}

/**
 * SearchBar component that can be used internally by DataTable or externally in a navbar.
 * Debounces input to avoid excessive API calls.
 */
export function SearchBar({
    value,
    onChange,
    placeholder = 'Search...',
    className = '',
}: SearchBarProps) {
    const [localValue, setLocalValue] = useState(value);
    const onChangeRef = useRef(onChange);

    // Keep ref up to date
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Sync with external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounce the onChange callback
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localValue !== value) {
                onChangeRef.current(localValue);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [localValue, value]);

    const handleClear = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-4 py-2 pr-10 text-sm text-light_tablewind_text_primary placeholder-light_tablewind_text_secondary focus:border-light_tablewind_accent focus:outline-none focus:ring-1 focus:ring-light_tablewind_accent dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_primary dark:placeholder-dark_tablewind_text_secondary dark:focus:border-dark_tablewind_accent dark:focus:ring-dark_tablewind_accent"
                />
                {localValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-light_tablewind_text_secondary hover:text-light_tablewind_text_primary dark:text-dark_tablewind_text_secondary dark:hover:text-dark_tablewind_text_primary"
                        aria-label="Clear search"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
