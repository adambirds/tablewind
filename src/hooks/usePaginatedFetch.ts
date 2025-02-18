import useSWR, { BareFetcher } from 'swr';
import { PaginatedResponse } from '../types';

export function usePaginatedFetch<T>(
  url: string,
  fetcher?: BareFetcher<PaginatedResponse<T>>
) {
  const defaultFetcher: BareFetcher<PaginatedResponse<T>> = (url: string) =>
    fetch(url).then((res) => res.json() as Promise<PaginatedResponse<T>>);

  const effectiveFetcher = fetcher ?? defaultFetcher;

  const { data, error, mutate } = useSWR<PaginatedResponse<T>>(url, effectiveFetcher);
  return { data, error, mutate, isLoading: !data && !error };
}
