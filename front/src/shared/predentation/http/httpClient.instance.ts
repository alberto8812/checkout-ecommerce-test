/**
 * Pre-configured Axios HTTP client instance.
 * ─────────────────────────────────────────────────────────────
 * Import this singleton anywhere in the app that needs HTTP calls.
 *
 * @example
 *   import { httpClient } from '@/shared/predentation/http';
 *   const { data } = await httpClient.get<Product[]>('/products');
 */

import { AxiosHttpClientAdapter } from "./AxiosHttpClientAdapter";

export const httpClient = new AxiosHttpClientAdapter({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15_000,
});
