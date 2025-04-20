import React from 'react';

const DataTableLoading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-light_tablewind_accent dark:border-dark_tablewind_accent"></div>
        </div>
    );
};

export default DataTableLoading;
