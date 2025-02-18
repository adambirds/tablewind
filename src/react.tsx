// src/react.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTableBase, { DataTableComponentProps } from './components/DataTable';

export function DataTable<T extends { id: string }>(
    props: DataTableComponentProps<T>
): React.ReactElement {
    const navigateHook = useNavigate();
    const reactNavigate = (url: string) => {
        navigateHook(url);
    };

    return <DataTableBase {...props} navigate={reactNavigate} />;
}

export default DataTable;
