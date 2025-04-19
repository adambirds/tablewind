import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { format, parseISO, startOfDay, endOfDay, isValid } from 'date-fns';

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

const formatDateDisplay = (date: string) =>
    format(parseISO(date), 'dd/MM/yyyy');

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    initialStartDate,
    initialEndDate,
    onApply,
    onReset,
    queryParamBase,
}) => {
    console.log('[DateRangeFilter] Component rendered');

    const [startDate, setStartDate] = useState<string>(
        initialStartDate ? format(parseISO(initialStartDate), 'yyyy-MM-dd') : ''
    );
    const [endDate, setEndDate] = useState<string>(
        initialEndDate ? format(parseISO(initialEndDate), 'yyyy-MM-dd') : ''
    );
    const [appliedStartDate, setAppliedStartDate] = useState<string>(
        initialStartDate
            ? startOfDay(parseISO(initialStartDate)).toISOString()
            : ''
    );
    const [appliedEndDate, setAppliedEndDate] = useState<string>(
        initialEndDate ? endOfDay(parseISO(initialEndDate)).toISOString() : ''
    );
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const now = useMemo(() => new Date(), []);
    const presets = useMemo<Preset[]>(() => {
        const today = now;
        const subtractDays = (days: number) => {
            const date = new Date(today);
            date.setDate(date.getDate() - days);
            return date;
        };
        const subtractMonths = (months: number) => {
            const date = new Date(today);
            date.setMonth(date.getMonth() - months);
            return date;
        };
        return [
            { label: 'Today', start: startOfDay(today), end: endOfDay(today) },
            {
                label: 'Yesterday',
                start: startOfDay(subtractDays(1)),
                end: endOfDay(subtractDays(1)),
            },
            {
                label: 'Last 7 Days',
                start: startOfDay(subtractDays(7)),
                end: endOfDay(today),
            },
            {
                label: 'Last 30 Days',
                start: startOfDay(subtractDays(30)),
                end: endOfDay(today),
            },
            {
                label: 'Last 3 Months',
                start: startOfDay(subtractMonths(3)),
                end: endOfDay(today),
            },
            {
                label: 'Last 6 Months',
                start: startOfDay(subtractMonths(6)),
                end: endOfDay(today),
            },
            {
                label: 'This Month',
                start: startOfDay(
                    new Date(today.getFullYear(), today.getMonth(), 1)
                ),
                end: endOfDay(today),
            },
            {
                label: 'Last Month',
                start: startOfDay(
                    new Date(today.getFullYear(), today.getMonth() - 1, 1)
                ),
                end: endOfDay(
                    new Date(today.getFullYear(), today.getMonth(), 0)
                ),
            },
            {
                label: 'This Year',
                start: startOfDay(new Date(today.getFullYear(), 0, 1)),
                end: endOfDay(today),
            },
            {
                label: 'Last Year',
                start: startOfDay(new Date(today.getFullYear() - 1, 0, 1)),
                end: endOfDay(new Date(today.getFullYear() - 1, 11, 31)),
            },
            {
                label: 'Last 5 Years',
                start: startOfDay(new Date(today.getFullYear() - 5, 0, 1)),
                end: endOfDay(today),
            },
            {
                label: 'All Time',
                start: startOfDay(new Date(1970, 0, 1)),
                end: endOfDay(today),
            },
        ];
    }, [now]);

    const matchPreset = useCallback(
        (startISO: string, endISO: string): string | null => {
            for (const preset of presets) {
                const presetStartISO = startOfDay(preset.start).toISOString();
                const presetEndISO = endOfDay(preset.end).toISOString();
                const match =
                    startISO === presetStartISO && endISO === presetEndISO;
                console.log(`[MATCH PRESET] ${preset.label} → Match? ${match}`);
                if (match) return preset.label;
            }
            return null;
        },
        [presets]
    );

    const displayLabel = useMemo(() => {
        if (appliedStartDate && appliedEndDate) {
            const matched = matchPreset(appliedStartDate, appliedEndDate);
            const label = matched
                ? matched
                : `${formatDateDisplay(appliedStartDate)} - ${formatDateDisplay(appliedEndDate)}`;
            console.log('[DISPLAY LABEL]', {
                appliedStartDate,
                appliedEndDate,
                label,
            });
            return label;
        }
        return 'Filter by Date';
    }, [appliedStartDate, appliedEndDate, matchPreset]);

    // Sync only inputs from props, don't override applied state
    useEffect(() => {
        if (initialStartDate) {
            setStartDate(format(parseISO(initialStartDate), 'yyyy-MM-dd'));
        }
        if (initialEndDate) {
            setEndDate(format(parseISO(initialEndDate), 'yyyy-MM-dd'));
        }
    }, [initialStartDate, initialEndDate]);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                zIndex: 1000,
                minWidth: rect.width < 350 ? 350 : rect.width,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (
                !containerRef.current?.contains(event.target as Node) &&
                !dropdownRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () =>
            document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const apply = () => {
        const parsedStart = parseISO(startDate);
        const parsedEnd = parseISO(endDate);
        if (!isValid(parsedStart) || !isValid(parsedEnd)) {
            console.warn('Invalid date selection', { startDate, endDate });
            return;
        }
        const appliedStart = startOfDay(parsedStart).toISOString();
        const appliedEnd = endOfDay(parsedEnd).toISOString();
        console.log('[APPLY]', { appliedStart, appliedEnd });
        setAppliedStartDate(appliedStart);
        setAppliedEndDate(appliedEnd);
        onApply({
            [`${queryParamBase}_gte`]: appliedStart,
            [`${queryParamBase}_lte`]: appliedEnd,
        });
        setIsOpen(false);
    };

    const reset = () => {
        setStartDate('');
        setEndDate('');
        setAppliedStartDate('');
        setAppliedEndDate('');
        onReset();
        setIsOpen(false);
    };

    const handlePresetClick = (preset: Preset) => {
        setStartDate(format(startOfDay(preset.start), 'yyyy-MM-dd'));
        setEndDate(format(endOfDay(preset.end), 'yyyy-MM-dd'));
    };

    const dropdown = (
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="rounded-md border bg-light_tablewind_bg_primary shadow-lg ring-1 ring-black ring-opacity-5 dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary p-4 text-sm"
        >
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold mb-1 text-light_tablewind_text_primary dark:text-dark_tablewind_text_primary">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1 text-light_tablewind_text_primary dark:text-dark_tablewind_text_primary">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2 text-sm"
                    />
                </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset.label}
                        onClick={() => handlePresetClick(preset)}
                        className="rounded px-2 py-1 text-left text-sm hover:font-semibold text-light_tablewind_text_primary dark:text-dark_tablewind_text_primary hover:bg-light_tablewind_bg_primary_hover dark:hover:bg-dark_tablewind_bg_primary_hover"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
            <div className="flex justify-between">
                <button
                    onClick={reset}
                    className="rounded-md bg-light_reset_filters_bg px-3 py-2 text-sm font-medium text-light_reset_filters_text hover:bg-light_reset_filters_bg_hover dark:bg-dark_reset_filters_bg dark:text-dark_reset_filters_text dark:hover:bg-dark_reset_filters_bg_hover"
                >
                    Reset
                </button>
                <button
                    onClick={apply}
                    className="rounded-md bg-light_tablewind_accent dark:bg-dark_tablewind_accent px-3 py-2 text-sm font-medium text-white hover:bg-light_tablewind_accent_hover dark:hover:bg-dark_tablewind_accent_hover"
                >
                    Apply
                </button>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-md border border-light_tablewind_border_primary bg-light_tablewind_bg_primary px-4 py-2 text-sm font-medium text-light_tablewind_text_secondary hover:bg-light_tablewind_bg_primary_hover dark:border-dark_tablewind_border_primary dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary dark:hover:bg-dark_tablewind_bg_primary_hover"
            >
                {displayLabel}
            </button>
            {isOpen && createPortal(dropdown, document.body)}
        </div>
    );
};

export default DateRangeFilter;
