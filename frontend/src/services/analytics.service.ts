import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import {
  AnalyticsSummary,
  ClickPoint,
  GeoStat,
  DeviceStat,
  BrowserStat,
  ReferrerStat,
  LiveClick,
  AnalyticsQueryParams,
  ApiResponse,
} from "@/types";

const paramsFor = (params?: AnalyticsQueryParams) =>
  params as Record<string, string | number | boolean | undefined> | undefined;

export const analyticsService = {
  async getOverview(params?: AnalyticsQueryParams): Promise<AnalyticsSummary> {
    const res = await apiClient.get<ApiResponse<AnalyticsSummary>>(API_ROUTES.ANALYTICS.OVERVIEW, {
      params: paramsFor(params),
    });
    return res.data;
  },

  async getTimeline(params?: AnalyticsQueryParams): Promise<ClickPoint[]> {
    const res = await apiClient.get<ApiResponse<ClickPoint[]>>(API_ROUTES.ANALYTICS.TIMELINE, {
      params: paramsFor(params),
    });
    return res.data;
  },

  async getGeography(params?: AnalyticsQueryParams): Promise<GeoStat[]> {
    const res = await apiClient.get<ApiResponse<GeoStat[]>>(API_ROUTES.ANALYTICS.GEOGRAPHY, {
      params: paramsFor(params),
    });
    return res.data;
  },

  async getDevices(params?: AnalyticsQueryParams): Promise<DeviceStat[]> {
    const res = await apiClient.get<ApiResponse<DeviceStat[]>>(API_ROUTES.ANALYTICS.DEVICES, {
      params: paramsFor(params),
    });
    return res.data;
  },

  async getBrowsers(params?: AnalyticsQueryParams): Promise<BrowserStat[]> {
    const res = await apiClient.get<ApiResponse<BrowserStat[]>>(API_ROUTES.ANALYTICS.BROWSERS, {
      params: paramsFor(params),
    });
    return res.data;
  },

  async getReferrers(params?: AnalyticsQueryParams): Promise<ReferrerStat[]> {
    const res = await apiClient.get<ApiResponse<ReferrerStat[]>>(API_ROUTES.ANALYTICS.REFERRERS, {
      params: paramsFor(params),
    });
    return res.data;
  },

  async getLiveFeed(params?: AnalyticsQueryParams): Promise<LiveClick[]> {
    const res = await apiClient.get<ApiResponse<LiveClick[]>>(API_ROUTES.ANALYTICS.LIVE_FEED, {
      params: paramsFor(params),
    });
    return res.data;
  },
};
