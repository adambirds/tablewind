import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  buttonLabel = "Bulk Actions",
}: BulkActionDropdownProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    if (menuOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [menuOpen]);

  const handleActionClick = (action: BulkAction) => {
    action.onClick(selectedIds);
    setMenuOpen(false);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        {buttonLabel}
      </button>
      {menuOpen &&
        createPortal(
          <div
            style={dropdownStyle}
            className="rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700"
          >
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {actions.map((action) => (
                <li key={action.key}>
                  <button
                    onClick={() => handleActionClick(action)}
                    className="group flex w-full items-center rounded-md px-2 py-2 text-left text-sm text-gray-900 hover:bg-sky-400  dark:text-gray-300 dark:hover:bg-sky-400 hover:text-gray-900 dark:hover:text-gray-900"
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
