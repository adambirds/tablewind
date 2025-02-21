import React, { forwardRef } from 'react';
import { Pagination } from '../types';

interface PaginationControlsProps {
    pagination?: Pagination;
    onPageChange: (page: number) => void;
    className?: string;
}

export const PaginationControls = forwardRef<
    HTMLDivElement,
    PaginationControlsProps
>(({ pagination, onPageChange, className }, ref) => {
    const safePagination: Pagination = pagination ?? {
        page: 1,
        page_size: 25,
        total_items: 0,
        total_pages: 1,
        has_previous_page: false,
        has_next_page: false,
        previous_page: 1,
        next_page: 1,
    };

    return (
        <div
            className={`flex items-center justify-between mt-4 ${className || ''}`}
            ref={ref}
        >
            <button
                onClick={() =>
                    onPageChange(
                        safePagination.previous_page ?? safePagination.page
                    )
                }
                disabled={!safePagination.has_previous_page}
                className="rounded px-4 py-2 bg-light_tablewind_accent dark:bg-dark_tablewind_accent text-light_button_pagination_text dark:text-dark_button_pagination_text hover:light_tablewind_accent_hover dark:hover:dark_tablewind_accent_hover disabled:cursor-not-allowed disabled:bg-light_button_pagination_disabled_bg disabled:text-light_button_pagination_disabled_text dark:disabled:bg-dark_button_pagination_disabled_bg dark:disabled:text-dark_button_pagination_disabled_text"
            >
                Previous
            </button>
            <span className="text-sm text-light_pagination_text dark:text-dark_pagination_text">
                Page {safePagination.page} of {safePagination.total_pages}
            </span>
            <button
                onClick={() =>
                    onPageChange(
                        safePagination.next_page ?? safePagination.page
                    )
                }
                disabled={!safePagination.has_next_page}
                className="rounded px-4 py-2 bg-light_tablewind_accent dark:bg-dark_tablewind_accent text-light_button_pagination_text dark:text-dark_button_pagination_text hover:light_tablewind_accent_hover dark:hover:dark_tablewind_accent_hover disabled:cursor-not-allowed disabled:bg-light_button_pagination_disabled_bg disabled:text-light_button_pagination_disabled_text dark:disabled:bg-dark_button_pagination_disabled_bg dark:disabled:text-dark_button_pagination_disabled_text"
            >
                Next
            </button>
        </div>
    );
});

// Set a display name for better debugging.
PaginationControls.displayName = 'PaginationControls';
