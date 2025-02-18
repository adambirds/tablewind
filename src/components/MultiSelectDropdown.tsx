import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Option {
    id: string;
    name: string;
}

interface MultiSelectDropdownProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    className?: string;
}

export function MultiSelectDropdown({
    options,
    selected,
    onChange,
    className,
}: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleOptionClick = (id: string) => {
        console.log('Clicked option id:', id);
        const currentSelected = Array.isArray(selected) ? selected : [];
        // Only add if id is truthy and not already included.
        if (id && !currentSelected.includes(id)) {
            const newSelection = [
                ...currentSelected.filter((x) => x !== null),
                id,
            ];
            console.log('New selection array:', newSelection);
            onChange(newSelection);
        }
        setIsOpen(false);
    };

    const handleRemove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selected.filter((s) => s !== id));
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

    const dropdown = isOpen && (
        <ul
            style={dropdownStyle}
            className="z-50 rounded-md border border-gray-300 bg-white text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
            {options
                .filter((opt) => !selected.includes(opt.id))
                .map((opt) => (
                    <li
                        key={opt.id}
                        onClick={() => {
                            handleOptionClick(opt.id);
                            setIsOpen(false);
                        }}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <div
                onClick={toggleDropdown}
                className="flex w-full cursor-pointer flex-wrap items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
                {selected.length === 0 ? (
                    <span className="text-gray-400">Select Tags...</span>
                ) : (
                    selected.map((id) => {
                        const option = options.find((opt) => opt.id === id);
                        return option ? (
                            <span
                                key={id}
                                className="flex items-center rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800"
                            >
                                {option.name}
                                <button
                                    onClick={(e) => handleRemove(id, e)}
                                    className="ml-1 text-sky-600 hover:text-sky-800 focus:outline-none"
                                >
                                    &times;
                                </button>
                            </span>
                        ) : null;
                    })
                )}
            </div>
            {isOpen && createPortal(dropdown, document.body)}
        </div>
    );
}
