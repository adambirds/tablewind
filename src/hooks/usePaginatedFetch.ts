import useSWR from 'swr';
import { PaginatedResponse } from '../types';

export function usePaginatedFetch<T>(url: string, fetcher?: (url: string) => Promise<any>) {
  const defaultFetcher = (url: string) => fetch(url).then(res => res.json());
  const { data, error, mutate } = useSWR<PaginatedResponse<T>>(url, fetcher || defaultFetcher);
  return { data, error, mutate, isLoading: !data && !error };
}
