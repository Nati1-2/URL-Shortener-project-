import { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authGuard } from "./middleware/auth-guard";
import { authRateLimiter } from "./middleware/rate-limiter";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:8001";
const LINK_SERVICE_URL = process.env.LINK_SERVICE_URL || "http://localhost:8002";
const REDIRECT_SERVICE_URL = process.env.REDIRECT_SERVICE_URL || "http://localhost:8003";
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || "http://localhost:8004";
const WORKSPACE_SERVICE_URL = process.env.WORKSPACE_SERVICE_URL || "http://localhost:8005";
const DOMAIN_SERVICE_URL = process.env.DOMAIN_SERVICE_URL || "http://localhost:8006";
const BILLING_SERVICE_URL = process.env.BILLING_SERVICE_URL || "http://localhost:8007";
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:8008";

export function setupProxyRoutes(app: Express) {
  // 1. Auth Service Routes
  app.use(
    ["/api/v1/auth", "/auth"],
    authRateLimiter,
    createProxyMiddleware({
      target: AUTH_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => (path.startsWith("/api/v1/auth") ? path : `/api/v1${path}`),
    })
  );

  // 2. Link Management Service Routes
  app.use(
    ["/api/v1/links", "/links"],
    authGuard,
    createProxyMiddleware({
      target: LINK_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => (path.startsWith("/api/v1/links") ? path : `/api/v1${path}`),
    })
  );

  // 3. Redirect Resolution Routes
  app.use(
    ["/api/v1/redirect", "/redirect"],
    createProxyMiddleware({
      target: REDIRECT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => (path.startsWith("/api/v1/redirect") ? path : `/api/v1${path}`),
    })
  );

  // 4. Analytics Telemetry Routes
  app.use(
    ["/api/v1/analytics", "/analytics"],
    authGuard,
    createProxyMiddleware({
      target: ANALYTICS_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => (path.startsWith("/api/v1/analytics") ? path : `/api/v1${path}`),
    })
  );

  // 5. Workspace Multi-tenancy Routes
  app.use(
    ["/api/v1/workspaces", "/workspaces"],
    authGuard,
    createProxyMiddleware({
      target: WORKSPACE_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => (path.startsWith("/api/v1/workspaces") ? path : `/api/v1${path}`),
    })
  );

  // 6. Custom Domain Service Routes
  app.use(
    ["/api/v1/domains", "/domains"],
    authGuard,
    createProxyMiddleware({
      target: DOMAIN_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => (path.startsWith("/api/v1/domains") ? path : `/api/v1${path}`),
    })
  );

  // 7. Billing & Stripe Subscription Routes
  app.use(
    ["/api/v1/billing", "/billing"],
    authGuard,
    createProxyMiddleware({
      target: BILLING_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => (path.startsWith("/api/v1/billing") ? path : `/api/v1${path}`),
    })
  );

  // 8. Notification Vault Routes
  app.use(
    ["/api/v1/notifications", "/notifications"],
    authGuard,
    createProxyMiddleware({
      target: NOTIFICATION_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => (path.startsWith("/api/v1/notifications") ? path : `/api/v1${path}`),
    })
  );
}
