import React, { forwardRef } from 'react';
import { Pagination } from '../types';

interface PaginationControlsProps {
  pagination?: Pagination; // Pagination might be undefined.
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationControls = forwardRef<HTMLDivElement, PaginationControlsProps>(
  ({ pagination, onPageChange, className }, ref) => {
    // Provide fallback defaults so the component always renders.
    const safePagination: Pagination = pagination ?? {
      page: 1,
      page_size: 25,       // Default page size.
      total_items: 0,      // Default total items.
      total_pages: 1,
      has_previous_page: false,
      has_next_page: false,
      previous_page: 1,     // Fallback value.
      next_page: 1,         // Fallback value.
    };

    return (
      <div className={`flex items-center justify-between mt-4 ${className || ''}`} ref={ref}>
        <button
          onClick={() => onPageChange(safePagination.previous_page ?? safePagination.page)}
          disabled={!safePagination.has_previous_page}
          className="rounded px-4 py-2 bg-sky-300 text-slate-900 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          Previous
        </button>
        <span className="text-sm text-slate-700">
          Page {safePagination.page} of {safePagination.total_pages}
        </span>
        <button
          onClick={() => onPageChange(safePagination.next_page ?? safePagination.page)}
          disabled={!safePagination.has_next_page}
          className="rounded px-4 py-2 bg-sky-300 text-slate-900 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          Next
        </button>
      </div>
    );
  }
);
