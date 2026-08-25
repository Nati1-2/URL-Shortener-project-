/**
 * Application environment configuration.
 * Safely exposes client-safe environment variables. Mock mode is intentionally disabled.
 */

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",

  // Production builds never substitute fake data for failed API calls.
  USE_MOCK_API: false,

  setEngineMode(_mode: "live" | "mock" | "auto") {
    // Retained for backward compatibility with the diagnostics UI. Mock mode is disabled.
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

