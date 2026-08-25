import { ENV } from "@/config/env";
import { ApiError, ApiResponse } from "@/types";

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ServiceHealthStatus {
  service: string;
  status: "healthy" | "unhealthy" | "checking";
  latencyMs?: number;
  url: string;
  port?: number;
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

  public async checkHealth(customUrl?: string): Promise<{ healthy: boolean; latencyMs: number }> {
    const start = performance.now();
    const target = customUrl || `${this.baseUrl.replace(/\/api\/v1$/, "")}/health`;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(target, { method: "GET", signal: controller.signal });
      clearTimeout(id);
      const latencyMs = Math.round(performance.now() - start);
      return { healthy: res.ok, latencyMs };
    } catch {
      return { healthy: false, latencyMs: 0 };
    }
  }

  public async pingMicroservices(): Promise<ServiceHealthStatus[]> {
    const services = [
      { service: "API Gateway", url: "http://localhost:8000/health", port: 8000 },
      { service: "Auth Service", url: "http://localhost:8001/health", port: 8001 },
      { service: "Link Service", url: "http://localhost:8002/health", port: 8002 },
      { service: "Redirect Service", url: "http://localhost:8003/health", port: 8003 },
      { service: "Analytics Service", url: "http://localhost:8004/health", port: 8004 },
      { service: "Workspace Service", url: "http://localhost:8005/health", port: 8005 },
      { service: "Domain Service", url: "http://localhost:8006/health", port: 8006 },
      { service: "Billing Service", url: "http://localhost:8007/health", port: 8007 },
      { service: "Notification Service", url: "http://localhost:8008/health", port: 8008 },
    ];

    const results = await Promise.all(
      services.map(async (s) => {
        const start = performance.now();
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 2000);
          const res = await fetch(s.url, { method: "GET", signal: controller.signal });
          clearTimeout(timer);
          const latencyMs = Math.round(performance.now() - start);
          return {
            service: s.service,
            url: s.url,
            port: s.port,
            status: res.ok ? ("healthy" as const) : ("unhealthy" as const),
            latencyMs,
          };
        } catch {
          return {
            service: s.service,
            url: s.url,
            port: s.port,
            status: "unhealthy" as const,
            latencyMs: 0,
          };
        }
      })
    );

    return results;
  }

  private getActiveWorkspaceId(): string | null {
    if (typeof window === "undefined") return null;
    try {
      const uiRaw = localStorage.getItem("linkpulse_ui_store");
      if (uiRaw) {
        const parsed = JSON.parse(uiRaw);
        return parsed?.state?.activeWorkspaceId || null;
      }
    } catch {
      // ignore parsing error
    }
    return null;
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = ENV.DEFAULT_TIMEOUT_MS, params, headers, ...restOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const token = this.getAuthToken();
    const workspaceId = this.getActiveWorkspaceId();
    const requestId = `req_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-request-id": requestId,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(workspaceId ? { "x-workspace-id": workspaceId } : {}),
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
          message: responseData?.error?.message || responseData?.message || response.statusText || "An unexpected error occurred",
          code: responseData?.error?.code || responseData?.code || `HTTP_${response.status}`,
          errors: responseData?.error?.details || responseData?.errors,
          requestId,
        };

        if (response.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("linkpulse_auth");
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

