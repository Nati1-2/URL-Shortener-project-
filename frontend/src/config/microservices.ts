/**
 * Microservices routing contracts and path helpers.
 * When communicating with an API Gateway / BFF, these map to standard resource paths.
 */

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  LINKS: {
    BASE: "/links",
    BY_ID: (id: string) => `/links/${id}`,
    CHECK_SLUG: "/links/check-slug",
    STATS: (id: string) => `/links/${id}/stats`,
    BULK_DELETE: "/links/bulk-delete",
  },
  REDIRECT: {
    RESOLVE: (shortCode: string) => `/redirect/${shortCode}`,
  },
  ANALYTICS: {
    OVERVIEW: "/analytics/overview",
    TIMELINE: "/analytics/timeline",
    GEOGRAPHY: "/analytics/geography",
    DEVICES: "/analytics/devices",
    BROWSERS: "/analytics/browsers",
    REFERRERS: "/analytics/referrers",
    LIVE_FEED: "/analytics/live-feed",
  },
  WORKSPACES: {
    BASE: "/workspaces",
    BY_ID: (id: string) => `/workspaces/${id}`,
    MEMBERS: (workspaceId: string) => `/workspaces/${workspaceId}/members`,
    INVITE: (workspaceId: string) => `/workspaces/${workspaceId}/invitations`,
    UPDATE_ROLE: (workspaceId: string, memberId: string) => `/workspaces/${workspaceId}/members/${memberId}`,
  },
  DOMAINS: {
    BASE: "/domains",
    BY_ID: (id: string) => `/domains/${id}`,
    VERIFY: (id: string) => `/domains/${id}/verify`,
  },
  BILLING: {
    PLANS: "/billing/plans",
    SUBSCRIPTION: "/billing/subscription",
    CHECKOUT: "/billing/checkout",
    PORTAL: "/billing/portal",
    USAGE: "/billing/usage",
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
  },
} as const;
