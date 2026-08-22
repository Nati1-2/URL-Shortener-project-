/**
 * Application environment configuration.
 * Safely exposes environment variables with fallbacks and runtime override.
 */

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",

  get USE_MOCK_API(): boolean {
    if (typeof window !== "undefined") {
      const override = localStorage.getItem("linkpulse_engine_mode");
      if (override === "mock") return true;
      if (override === "live") return false;
    }
    return process.env.NEXT_PUBLIC_USE_MOCK_API === "true" || !process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  },

  setEngineMode(mode: "live" | "mock" | "auto") {
    if (typeof window !== "undefined") {
      if (mode === "auto") {
        localStorage.removeItem("linkpulse_engine_mode");
      } else {
        localStorage.setItem("linkpulse_engine_mode", mode);
      }
      window.dispatchEvent(new CustomEvent("linkpulse:engine_mode_changed", { detail: mode }));
    }
  },

  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000/api/v1",

  // Specific microservice endpoints (conceptual or direct override if bypassed)
  AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8001/api/v1/auth",
  LINK_SERVICE_URL: process.env.NEXT_PUBLIC_LINK_SERVICE_URL || "http://localhost:8002/api/v1/links",
  REDIRECT_SERVICE_URL: process.env.NEXT_PUBLIC_REDIRECT_SERVICE_URL || "http://localhost:8003/api/v1/redirect",
  ANALYTICS_SERVICE_URL: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || "http://localhost:8004/api/v1/analytics",
  WORKSPACE_SERVICE_URL: process.env.NEXT_PUBLIC_WORKSPACE_SERVICE_URL || "http://localhost:8005/api/v1/workspaces",
  DOMAIN_SERVICE_URL: process.env.NEXT_PUBLIC_DOMAIN_SERVICE_URL || "http://localhost:8006/api/v1/domains",
  BILLING_SERVICE_URL: process.env.NEXT_PUBLIC_BILLING_SERVICE_URL || "http://localhost:8007/api/v1/billing",
  NOTIFICATION_SERVICE_URL: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || "http://localhost:8008/api/v1/notifications",

  DEFAULT_TIMEOUT_MS: 15000,
} as const;

