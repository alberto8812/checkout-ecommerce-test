import { useMutation } from "@tanstack/react-query";

/**
 * Generic PUT hook.
 * @param mutationFn - Async function that receives the payload and sends a PUT request
 *
 * @example
 * const { mutate, isPending } = usePut<Product>(
 *   (payload) => httpClient.put(`/products/${payload.id}`, payload)
 * );
 */
export const usePut = <TVariables, TData = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>
) => {
    return useMutation<TData, Error, TVariables>({ mutationFn });
};
