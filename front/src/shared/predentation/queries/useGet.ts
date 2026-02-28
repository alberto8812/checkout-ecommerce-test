import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

/**
 * Generic GET hook.
 * @param queryKey - Unique key for the query cache (e.g. ['products', id])
 * @param queryFn  - Async function that fetches the data and returns T
 *
 * @example
 * const { data, isLoading } = useGet<Product[]>(['products'], getProduct);
 */
export const useGet = <T>(queryKey: QueryKey, queryFn: () => Promise<T>) => {
    return useQuery<T>({ queryKey, queryFn });
};
