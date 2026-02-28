/**
 * HTTP Adapter — Barrel export
 * ─────────────────────────────────────────────────────────────
 * Single entry point for the HTTP adapter layer.
 *
 * @example
 *   // Use the shared singleton (recommended):
 *   import { httpClient } from '@/shared/predentation/http';
 *
 *   // Or create a custom instance:
 *   import { AxiosHttpClientAdapter } from '@/shared/predentation/http';
 *   const myClient = new AxiosHttpClientAdapter({ baseURL: '...' });
 *
 *   // Type-only imports for port/error types:
 *   import type { HttpClient, HttpResponse, HttpError } from '@/shared/predentation/http';
 */

export type { HttpClient, HttpResponse, RequestConfig } from "./HttpClient.port";
export { AxiosHttpClientAdapter, HttpError } from "./AxiosHttpClientAdapter";
export { httpClient } from "./httpClient.instance";
