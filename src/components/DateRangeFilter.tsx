import React, { useState, useRef, useEffect } from "react";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";

interface Preset {
  label: string;
  start: Date;
  end: Date;
}

interface DateRangeFilterProps {
  initialStartDate?: string;
  initialEndDate?: string;
  onApply: (filters: Record<string, string>) => void;
  onReset: () => void;
  queryParamBase: string;
}

const presets: Preset[] = [
  { label: "Today", start: startOfDay(new Date()), end: endOfDay(new Date()) },
  { label: "Yesterday", start: startOfDay(new Date(Date.now() - 86400000)), end: endOfDay(new Date(Date.now() - 86400000)) },
  { label: "Last 7 Days", start: startOfDay(new Date(Date.now() - 86400000 * 7)), end: endOfDay(new Date()) },
  { label: "Last 30 Days", start: startOfDay(new Date(Date.now() - 86400000 * 30)), end: endOfDay(new Date()) },
  { label: "Last 3 Months", start: startOfDay(new Date(new Date().setMonth(new Date().getMonth() - 3))), end: endOfDay(new Date()) },
  { label: "Last 6 Months", start: startOfDay(new Date(new Date().setMonth(new Date().getMonth() - 6))), end: endOfDay(new Date()) },
  { label: "This Month", start: startOfDay(new Date(new Date().setDate(1))), end: endOfDay(new Date()) },
  { label: "Last Month", start: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)), end: endOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 0)) },
  { label: "This Year", start: startOfDay(new Date(new Date().getFullYear(), 0, 1)), end: endOfDay(new Date()) },
  { label: "Last Year", start: startOfDay(new Date(new Date().getFullYear() - 1, 0, 1)), end: endOfDay(new Date(new Date().getFullYear() - 1, 11, 31)) },
  { label: "Last 5 Years", start: startOfDay(new Date(new Date().getFullYear() - 5, 0, 1)), end: endOfDay(new Date()) },
  { label: "All Time", start: startOfDay(new Date(1970, 0, 1)), end: endOfDay(new Date()) },
];

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  initialStartDate,
  initialEndDate,
  onApply,
  onReset,
  queryParamBase,
}) => {
  const [startDate, setStartDate] = useState<string>(
    initialStartDate ? format(parseISO(initialStartDate), "yyyy-MM-dd") : ""
  );
  const [endDate, setEndDate] = useState<string>(
    initialEndDate ? format(parseISO(initialEndDate), "yyyy-MM-dd") : ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const apply = () => {
    const filters: Record<string, string> = {};
    if (startDate) filters[`${queryParamBase}_gte`] = startOfDay(parseISO(startDate)).toISOString();
    if (endDate) filters[`${queryParamBase}_lte`] = endOfDay(parseISO(endDate)).toISOString();
    onApply(filters);
    setIsOpen(false);
  };

  const handlePresetClick = (preset: Preset) => {
    setStartDate(format(preset.start, "yyyy-MM-dd"));
    setEndDate(format(preset.end, "yyyy-MM-dd"));
  };

  const reset = () => {
    setStartDate("");
    setEndDate("");
    onReset();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md border px-4 py-2 text-sm bg-light_tablewind_bg_primary text-light_tablewind_text_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_primary"
      >
        {startDate && endDate
          ? `${startDate} - ${endDate}`
          : "Filter by Date"}
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-2 w-max rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 p-4">
          <div className="mb-2 grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className="rounded bg-slate-100 px-2 py-1 text-sm hover:font-semibold dark:bg-slate-700 dark:text-white"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={reset}
              className="rounded bg-slate-200 px-4 py-1 text-sm dark:bg-slate-600 dark:text-white"
            >
              Reset
            </button>
            <button
              onClick={apply}
              className="rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;