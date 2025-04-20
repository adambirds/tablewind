import React from 'react';

const DataTableError: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-64 px-4">
            <div className="rounded-lg bg-light_tablewind_bg_primary dark:bg-dark_tablewind_bg_primary p-6 shadow-md max-w-md w-full text-center border border-light_tablewind_border_primary dark:border-dark_tablewind_border_primary">
                <h2 className="text-lg font-semibold text-light_tablewind_text_primary dark:text-dark_tablewind_text_primary mb-2">
                    Oops! Something went wrong.
                </h2>
                <p className="text-sm text-light_tablewind_text_secondary dark:text-dark_tablewind_text_secondary">
                    There was a problem loading this data. Please try again later.
                </p>
            </div>
        </div>
    );
};

export default DataTableError;
