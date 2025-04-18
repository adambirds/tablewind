import React from 'react';

interface CustomDatePickerProps {
    value: string | null;
    onChange: (isoString: string | null) => void;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
}) => {
    const localDate = value ? new Date(value) : null;

    const getLocalDateString = () => {
        if (!localDate) return '';
        return localDate.toISOString().slice(0, 10); // YYYY-MM-DD
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const datePart = e.target.value;
        if (!datePart) {
            onChange(null);
            return;
        }

        // Create ISO string with 00:00:00 UTC
        const isoUtcMidnight = new Date(`${datePart}T00:00:00Z`).toISOString();
        onChange(isoUtcMidnight);
    };

    return (
        <input
            type="date"
            value={getLocalDateString()}
            onChange={handleChange}
            className="w-full rounded border bg-light_tablewind_bg_primary text-light_tablewind_text_secondary p-1 text-sm dark:bg-dark_tablewind_bg_primary dark:text-dark_tablewind_text_secondary"
        />
    );
};
