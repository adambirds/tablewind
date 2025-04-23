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
        const currentSelected = Array.isArray(selected) ? selected : [];
        // Only add if id is truthy and not already included.
        if (id && !currentSelected.includes(id)) {
            const newSelection = [
                ...currentSelected.filter((x) => x !== null),
                id,
            ];
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

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
    
        if (isOpen) {
            document.addEventListener('pointerdown', handlePointerDown);
        }
    
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [isOpen]);
    

    const dropdown = isOpen && (
        <ul
            style={{
                ...dropdownStyle,
                maxHeight: '300px',
                overflowY: 'auto',
            }}
            className="z-50 rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary text-sm shadow-sm dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_primary text-light_tablewind_text_primary"
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
                        className="cursor-pointer px-3 py-2 hover:bg-light_tablewind_bg_primary_hover dark:hover:bg-dark_tablewind_bg_primary_hover"
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
                className="flex w-full cursor-pointer flex-wrap items-center gap-1 rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-3 py-2 text-sm text-light_tablewind_text_secondary shadow-sm focus:outline-none dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:dark_tablewind_text_secondary"
            >
                {selected.length === 0 ? (
                    <span className="text-light_tablewind_text_primary dark:text-dark_tablewind_text_primary">
                        Select Tags...
                    </span>
                ) : (
                    selected.map((id) => {
                        const option = options.find((opt) => opt.id === id);
                        return option ? (
                            <span
                                key={id}
                                className="flex items-center rounded px-2 py-0.5 text-xs bg-light_multi_select_item_bg dark:bg-dark_multi_select_item_bg text-light_multi_select_item_text dark:text-dark_multi_select_item_text"
                            >
                                {option.name}
                                <button
                                    onClick={(e) => handleRemove(id, e)}
                                    className="ml-1 focus:outline-none text-light_multi_select_item_text dark:text-dark_multi_select_item_text"
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
