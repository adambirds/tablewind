import React from 'react';
import { useRouter } from 'next/navigation';
import DataTableBase, { DataTableComponentProps } from './components/DataTable';

interface DataTablePropsWithRouter<T extends { id: string }>
    extends DataTableComponentProps<T> {
    router: ReturnType<typeof useRouter>; // Expect router to be passed as a prop
}

export function DataTable<T extends { id: string }>({
    router,
    ...props
}: DataTablePropsWithRouter<T>): React.ReactElement {
    // Function to navigate using Next.js router
    const nextNavigate = (url: string) => {
        router.push(url);
    };

    // Let TypeScript infer the type for DataTableComponent.
    const DataTableComponent = DataTableBase;

    // Pass the navigate function and other props to the DataTableBase component.
    return <DataTableComponent {...props} navigate={nextNavigate} />;
}
