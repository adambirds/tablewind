import React from 'react';
import { useRouter } from 'next/navigation';
import DataTableBase, { DataTableComponentProps } from './components/DataTable';

export function DataTable<T extends { id: string }>(
    props: DataTableComponentProps<T>
): React.ReactElement {
    const router = useRouter();

    // Function to navigate using Next.js router
    const nextNavigate = (url: string) => {
        router.push(url);
    };

    // Let TypeScript infer the type for DataTableComponent.
    const DataTableComponent = DataTableBase;

    // Pass the navigate function and other props to the DataTableBase component.
    return <DataTableComponent {...props} navigate={nextNavigate} />;
}
