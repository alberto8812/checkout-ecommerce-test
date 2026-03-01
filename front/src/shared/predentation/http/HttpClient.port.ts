/**
 * HttpClient Port
 * ─────────────────────────────────────────────────────────────
 * Defines the contract that any HTTP adapter must fulfill.
 * Business logic depends ONLY on this interface — never on
 * a concrete library (Axios, Fetch, etc.).
 */

export interface RequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    signal?: AbortSignal;
}

export interface HttpResponse<T> {
    data: T;
    status: number;
    headers: Record<string, string>;
}

export interface HttpClient {
    get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;
    post<T>(url: string, body: unknown, config?: RequestConfig): Promise<HttpResponse<T>>;
    put<T>(url: string, body: unknown, config?: RequestConfig): Promise<HttpResponse<T>>;
    patch<T>(url: string, body: unknown, config?: RequestConfig): Promise<HttpResponse<T>>;
    delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;
}
