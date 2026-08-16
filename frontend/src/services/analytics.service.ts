import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { ENV } from "@/config/env";
import { mockDataStore } from "./mock/mockDataStore";
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

export const analyticsService = {
  async getOverview(params?: AnalyticsQueryParams): Promise<AnalyticsSummary> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getAnalyticsSummary();
    }
    const res = await apiClient.get<ApiResponse<AnalyticsSummary>>(
      API_ROUTES.ANALYTICS.OVERVIEW,
      { params: params as Record<string, string | number | boolean | undefined> }
    );
    return res.data;
  },

  async getTimeline(params?: AnalyticsQueryParams): Promise<ClickPoint[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getTimelineData();
    }
    const res = await apiClient.get<ApiResponse<ClickPoint[]>>(
      API_ROUTES.ANALYTICS.TIMELINE,
      { params: params as Record<string, string | number | boolean | undefined> }
    );
    return res.data;
  },

  async getGeography(params?: AnalyticsQueryParams): Promise<GeoStat[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getGeoData();
    }
    const res = await apiClient.get<ApiResponse<GeoStat[]>>(
      API_ROUTES.ANALYTICS.GEOGRAPHY,
      { params: params as Record<string, string | number | boolean | undefined> }
    );
    return res.data;
  },

  async getDevices(params?: AnalyticsQueryParams): Promise<DeviceStat[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getDeviceData();
    }
    const res = await apiClient.get<ApiResponse<DeviceStat[]>>(
      API_ROUTES.ANALYTICS.DEVICES,
      { params: params as Record<string, string | number | boolean | undefined> }
    );
    return res.data;
  },

  async getBrowsers(params?: AnalyticsQueryParams): Promise<BrowserStat[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getBrowserData();
    }
    const res = await apiClient.get<ApiResponse<BrowserStat[]>>(
      API_ROUTES.ANALYTICS.BROWSERS,
      { params: params as Record<string, string | number | boolean | undefined> }
    );
    return res.data;
  },

  async getReferrers(params?: AnalyticsQueryParams): Promise<ReferrerStat[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getReferrerData();
    }
    const res = await apiClient.get<ApiResponse<ReferrerStat[]>>(
      API_ROUTES.ANALYTICS.REFERRERS,
      { params: params as Record<string, string | number | boolean | undefined> }
    );
    return res.data;
  },

  async getLiveFeed(params?: AnalyticsQueryParams): Promise<LiveClick[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getLiveClicks();
    }
    const res = await apiClient.get<ApiResponse<LiveClick[]>>(
      API_ROUTES.ANALYTICS.LIVE_FEED,
      { params: params as Record<string, string | number | boolean | undefined> }
    );
    return res.data;
  },
};
