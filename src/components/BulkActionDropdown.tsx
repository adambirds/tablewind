import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface BulkAction {
    key: string;
    label: string;
    onClick: (selectedIds: string[]) => void;
}

interface BulkActionDropdownProps {
    actions: BulkAction[];
    selectedIds: string[];
    buttonLabel?: string;
}

export function BulkActionDropdown({
    actions,
    selectedIds,
    buttonLabel = 'Bulk Actions',
}: BulkActionDropdownProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setMenuOpen((prev) => !prev);

    useEffect(() => {
        if (menuOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();

            if (window.innerWidth < 768) {
                // Mobile: full width dropdown pinned under the button
                setDropdownStyle({
                    position: 'fixed',
                    top: rect.bottom,
                    left: 0,
                    right: 0,
                    width: '100%',
                    zIndex: 9999,
                });
            } else {
                // Desktop: use exact position and width of button
                setDropdownStyle({
                    position: 'absolute',
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    minWidth: rect.width,
                    width: 'max-content',
                    zIndex: 9999,
                });
            }
        }
    }, [menuOpen]);

    const handleActionClick = (action: BulkAction) => {
        action.onClick(selectedIds);
        setMenuOpen(false);
    };

    return (
        <div className="relative w-full md:w-auto" ref={containerRef}>
            <button
                onClick={toggleDropdown}
                className="w-full md:w-auto inline-flex justify-center rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-4 py-2 text-sm font-medium text-light_tablewind_text_secondary hover:bg-light_tablewind_bg_primary_hover dark:border-dark_tablewind_border_primary dark:bg-gray-800 dark:text-dark_tablewind_text_secondary"
            >
                {buttonLabel}
            </button>
            {menuOpen &&
                createPortal(
                    <div
                        style={dropdownStyle}
                        className="rounded-md shadow-lg ring-1 ring-opacity-5 bg-light_bulk_dropdown_bg dark:bg-dark_bulk_dropdown_bg ring-light_bulk_dropdown_ring dark:ring-dark_bulk_dropdown_ring"
                    >
                        <ul className="divide-y divide-light_bulk_dropdown_divider dark:divide-dark_bulk_dropdown_divider">
                            {actions.map((action) => (
                                <li key={action.key}>
                                    <button
                                        onClick={() =>
                                            handleActionClick(action)
                                        }
                                        className="group flex w-full items-center rounded-md px-4 py-3 text-left text-sm text-light_bulk_dropdown_text dark:text-dark_bulk_dropdown_text hover:bg-light_bulk_dropdown_bg_hover dark:hover:bg-dark_bulk_dropdown_bg_hover"
                                    >
                                        {action.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>,
                    document.body
                )}
        </div>
    );
}
