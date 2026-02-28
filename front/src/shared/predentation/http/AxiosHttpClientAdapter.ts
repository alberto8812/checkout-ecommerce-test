/**
 * AxiosHttpClientAdapter
 * ─────────────────────────────────────────────────────────────
 * Concrete implementation of the HttpClient port using Axios.
 * This is the only file in the codebase that knows about Axios.
 *
 * Usage:
 *   const http = new AxiosHttpClientAdapter({ baseURL: 'https://api.example.com' });
 *   const response = await http.get<Product[]>('/products');
 */

import axios, { type AxiosInstance } from "axios";
import type { AxiosRequestConfig } from "axios";
import type { HttpClient, HttpResponse, RequestConfig } from "./HttpClient.port";

export interface AxiosAdapterConfig {
    /** Base URL prepended to every request path */
    baseURL?: string;
    /** Timeout in milliseconds (default: 10 000) */
    timeout?: number;
    /** Default headers sent on every request */
    defaultHeaders?: Record<string, string>;
}

export class AxiosHttpClientAdapter implements HttpClient {
    private readonly client: AxiosInstance;

    constructor(config: AxiosAdapterConfig = {}) {
        this.client = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout ?? 10_000,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...config.defaultHeaders,
            },
        });

        this.setupInterceptors();
    }

    // ── Public methods ─────────────────────────────────────────

    async get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
        const res = await this.client.get<T>(url, this.toAxiosConfig(config));
        return this.toHttpResponse(res);
    }

    async post<T>(url: string, body: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        const res = await this.client.post<T>(url, body, this.toAxiosConfig(config));
        return this.toHttpResponse(res);
    }

    async put<T>(url: string, body: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        const res = await this.client.put<T>(url, body, this.toAxiosConfig(config));
        return this.toHttpResponse(res);
    }

    async patch<T>(url: string, body: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        const res = await this.client.patch<T>(url, body, this.toAxiosConfig(config));
        return this.toHttpResponse(res);
    }

    async delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
        const res = await this.client.delete<T>(url, this.toAxiosConfig(config));
        return this.toHttpResponse(res);
    }

    // ── Private helpers ────────────────────────────────────────

    /**
     * Maps the generic RequestConfig to AxiosRequestConfig.
     * Keeps Axios concepts isolated inside this adapter.
     */
    private toAxiosConfig(config?: RequestConfig): AxiosRequestConfig {
        if (!config) return {};
        return {
            headers: config.headers,
            params: config.params,
            signal: config.signal,
        };
    }

    /**
     * Maps an Axios response to the generic HttpResponse.
     * Consumers never see an AxiosResponse — they get HttpResponse<T>.
     */
    private toHttpResponse<T>(res: {
        data: T;
        status: number;
        headers: unknown;
    }): HttpResponse<T> {
        return {
            data: res.data,
            status: res.status,
            headers: res.headers as Record<string, string>,
        };
    }

    /**
     * Centralised request / response interceptors.
     * Extend here for: auth tokens, global error handling, logging, etc.
     */
    private setupInterceptors(): void {
        // Request — attach auth token if available
        this.client.interceptors.request.use((axiosConfig) => {
            // Example: const token = getAuthToken();
            // if (token) axiosConfig.headers.Authorization = `Bearer ${token}`;
            return axiosConfig;
        });

        // Response — normalise errors into a consistent shape
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                const status: number = error.response?.status ?? 0;
                const message: string =
                    error.response?.data?.message ?? error.message ?? "Unknown error";
                return Promise.reject(new HttpError(message, status));
            }
        );
    }
}

// ── HttpError ──────────────────────────────────────────────────────────────
/**
 * Normalised HTTP error thrown by the adapter on non-2xx responses.
 * Consumers catch HttpError instead of AxiosError — no Axios leak.
 */
export class HttpError extends Error {
    readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "HttpError";
        this.statusCode = statusCode;
    }
}
