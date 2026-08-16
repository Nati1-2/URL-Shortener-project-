import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";
import { AnalyticsQueryParams } from "@/types";

export const ANALYTICS_QUERY_KEYS = {
  all: ["analytics"] as const,
  overview: (params?: AnalyticsQueryParams) => [...ANALYTICS_QUERY_KEYS.all, "overview", params] as const,
  timeline: (params?: AnalyticsQueryParams) => [...ANALYTICS_QUERY_KEYS.all, "timeline", params] as const,
  geography: (params?: AnalyticsQueryParams) => [...ANALYTICS_QUERY_KEYS.all, "geography", params] as const,
  devices: (params?: AnalyticsQueryParams) => [...ANALYTICS_QUERY_KEYS.all, "devices", params] as const,
  browsers: (params?: AnalyticsQueryParams) => [...ANALYTICS_QUERY_KEYS.all, "browsers", params] as const,
  referrers: (params?: AnalyticsQueryParams) => [...ANALYTICS_QUERY_KEYS.all, "referrers", params] as const,
  liveFeed: (params?: AnalyticsQueryParams) => [...ANALYTICS_QUERY_KEYS.all, "liveFeed", params] as const,
};

export function useOverviewAnalytics(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(params),
    queryFn: () => analyticsService.getOverview(params),
  });
}

export function useClickTimeline(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.timeline(params),
    queryFn: () => analyticsService.getTimeline(params),
  });
}

export function useGeographyAnalytics(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.geography(params),
    queryFn: () => analyticsService.getGeography(params),
  });
}

export function useDeviceAnalytics(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.devices(params),
    queryFn: () => analyticsService.getDevices(params),
  });
}

export function useBrowserAnalytics(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.browsers(params),
    queryFn: () => analyticsService.getBrowsers(params),
  });
}

export function useReferrerAnalytics(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.referrers(params),
    queryFn: () => analyticsService.getReferrers(params),
  });
}

export function useLiveClickFeed(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.liveFeed(params),
    queryFn: () => analyticsService.getLiveFeed(params),
    refetchInterval: 5000, // Poll every 5 seconds for live click stream simulation
  });
}
