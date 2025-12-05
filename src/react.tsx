// src/react.tsx
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import DataTableBase, { DataTableComponentProps } from './components/DataTable';

export interface DataTablePropsWithRouter<T extends { id: string }>
  extends DataTableComponentProps<T> {
  navigate: NavigateFunction; // Expect the navigate function to be passed in as a prop
}

export function DataTable<T extends { id: string }>({
  navigate,
  ...props
}: DataTablePropsWithRouter<T>): React.ReactElement {
  // Use the passed-in navigate function
  const reactNavigate = (url: string) => {
    navigate(url);
  };

  return <DataTableBase {...props} navigate={reactNavigate} />;
}

// Export SearchBar for external use (e.g., in navbars)
export { SearchBar } from './components/SearchBar';

// Export types
export * from './types';
