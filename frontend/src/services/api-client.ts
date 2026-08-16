import { ENV } from "@/config/env";
import { ApiError, ApiResponse } from "@/types";

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = ENV.API_GATEWAY_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      const authRaw = localStorage.getItem("linkpulse_auth");
      if (authRaw) {
        const parsed = JSON.parse(authRaw);
        return parsed?.tokens?.accessToken || null;
      }
    } catch {
      // ignore parsing error
    }
    return null;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = ENV.DEFAULT_TIMEOUT_MS, params, headers, ...restOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const token = this.getAuthToken();
    const requestId = `req_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-request-id": requestId,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    };

    try {
      const fullUrl = this.buildUrl(path, params);
      const response = await fetch(fullUrl, {
        ...restOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const apiError: ApiError = {
          status: response.status,
          message: responseData?.message || response.statusText || "An unexpected error occurred",
          code: responseData?.code || `HTTP_${response.status}`,
          errors: responseData?.errors,
          requestId,
        };

        if (response.status === 401 && typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("linkpulse:unauthorized", { detail: apiError }));
        }

        throw apiError;
      }

      // If backend returns enveloped ApiResponse<T>, unwrap data or return responseData directly
      if (responseData && typeof responseData === "object" && "data" in responseData) {
        return responseData as T;
      }

      return responseData as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof DOMException && err.name === "AbortError") {
        throw {
          status: 408,
          message: `Request timed out after ${timeoutMs}ms`,
          code: "TIMEOUT",
          requestId,
        } as ApiError;
      }

      // Re-throw formatted ApiError
      if (err && typeof err === "object" && "status" in err) {
        throw err;
      }

      throw {
        status: 500,
        message: err instanceof Error ? err.message : "Failed to communicate with API Gateway",
        code: "NETWORK_ERROR",
        requestId,
      } as ApiError;
    }
  }

  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  public post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
