import { useMutation } from "@tanstack/react-query";

/**
 * Generic PATCH hook.
 * @param mutationFn - Async function that receives the payload and sends a PATCH request
 *
 * @example
 * const { mutate, isPending } = usePatch<{ id: string; name: string }>(
 *   (payload) => httpClient.patch(`/products/${payload.id}`, payload)
 * );
 */
export const usePatch = <TVariables, TData = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>
) => {
    return useMutation<TData, Error, TVariables>({ mutationFn });
};
