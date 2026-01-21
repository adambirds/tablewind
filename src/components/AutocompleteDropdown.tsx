import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Option {
    id: string;
    name: string;
}

interface AutocompleteDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function AutocompleteDropdown({
    options,
    value,
    onChange,
    placeholder = 'Type to search...',
    className,
}: AutocompleteDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Get the display name for the currently selected value
    const selectedOption = options.find((opt) => opt.id === value);

    // Filter options based on input
    const filteredOptions = options.filter((opt) =>
        opt.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Sync input value with selected option name when value changes externally
    useEffect(() => {
        if (selectedOption) {
            setInputValue(selectedOption.name);
        } else if (!value) {
            setInputValue('');
        }
    }, [value, selectedOption]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsOpen(true);

        // If input is cleared, clear the selection
        if (newValue === '') {
            onChange('');
        }
    };

    const handleOptionClick = (option: Option) => {
        onChange(option.id);
        setInputValue(option.name);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setInputValue('');
        setIsOpen(false);
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleBlur = () => {
        // Delay closing to allow click events on options to fire
        setTimeout(() => {
            setIsOpen(false);
            // Reset input to selected option name if user didn't select anything
            if (selectedOption) {
                setInputValue(selectedOption.name);
            } else if (!value) {
                setInputValue('');
            }
        }, 150);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        } else if (e.key === 'Enter' && filteredOptions.length > 0) {
            e.preventDefault();
            handleOptionClick(filteredOptions[0]);
        }
    };

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setTimeout(() => setIsOpen(false), 0);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    const dropdown = isOpen && filteredOptions.length > 0 && (
        <ul
            style={{
                ...dropdownStyle,
                maxHeight: '300px',
                overflowY: 'auto',
            }}
            className="z-50 rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary text-sm shadow-sm dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_primary text-light_tablewind_text_primary"
        >
            {filteredOptions.map((opt) => (
                <li
                    key={opt.id}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleOptionClick(opt);
                    }}
                    className={`cursor-pointer px-3 py-2 hover:bg-light_tablewind_bg_primary_hover dark:hover:bg-dark_tablewind_bg_primary_hover ${
                        opt.id === value
                            ? 'bg-light_tablewind_bg_primary_hover dark:bg-dark_tablewind_bg_primary_hover'
                            : ''
                    }`}
                >
                    {opt.name}
                </li>
            ))}
        </ul>
    );

    return (
        <div
            ref={containerRef}
            className={`relative w-full ${className || ''}`}
        >
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-3 py-2 pr-8 text-sm font-medium text-light_tablewind_text_secondary hover:bg-light_tablewind_bg_primary_hover focus:outline-none dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary dark:hover:bg-dark_tablewind_bg_primary_hover focus:ring-0"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-light_tablewind_text_secondary hover:text-light_tablewind_text_primary dark:text-dark_tablewind_text_secondary dark:hover:text-dark_tablewind_text_primary focus:outline-none"
                    >
                        <svg
                            className="h-4 w-4"
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
            {isOpen && createPortal(dropdown, document.body)}
        </div>
    );
}
