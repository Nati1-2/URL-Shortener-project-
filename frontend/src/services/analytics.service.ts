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
    try {
      const res = await apiClient.get<ApiResponse<AnalyticsSummary>>(
        API_ROUTES.ANALYTICS.OVERVIEW,
        { params: params as Record<string, string | number | boolean | undefined> }
      );
      return res.data;
    } catch {
      return mockDataStore.getAnalyticsSummary();
    }
  },

  async getTimeline(params?: AnalyticsQueryParams): Promise<ClickPoint[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getTimelineData();
    }
    try {
      const res = await apiClient.get<ApiResponse<ClickPoint[]>>(
        API_ROUTES.ANALYTICS.TIMELINE,
        { params: params as Record<string, string | number | boolean | undefined> }
      );
      return res.data;
    } catch {
      return mockDataStore.getTimelineData();
    }
  },

  async getGeography(params?: AnalyticsQueryParams): Promise<GeoStat[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getGeoData();
    }
    try {
      const res = await apiClient.get<ApiResponse<GeoStat[]>>(
        API_ROUTES.ANALYTICS.GEOGRAPHY,
        { params: params as Record<string, string | number | boolean | undefined> }
      );
      return res.data;
    } catch {
      return mockDataStore.getGeoData();
    }
  },

  async getDevices(params?: AnalyticsQueryParams): Promise<DeviceStat[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getDeviceData();
    }
    try {
      const res = await apiClient.get<ApiResponse<DeviceStat[]>>(
        API_ROUTES.ANALYTICS.DEVICES,
        { params: params as Record<string, string | number | boolean | undefined> }
      );
      return res.data;
    } catch {
      return mockDataStore.getDeviceData();
    }
  },

  async getBrowsers(params?: AnalyticsQueryParams): Promise<BrowserStat[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getBrowserData();
    }
    try {
      const res = await apiClient.get<ApiResponse<BrowserStat[]>>(
        API_ROUTES.ANALYTICS.BROWSERS,
        { params: params as Record<string, string | number | boolean | undefined> }
      );
      return res.data;
    } catch {
      return mockDataStore.getBrowserData();
    }
  },

  async getReferrers(params?: AnalyticsQueryParams): Promise<ReferrerStat[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getReferrerData();
    }
    try {
      const res = await apiClient.get<ApiResponse<ReferrerStat[]>>(
        API_ROUTES.ANALYTICS.REFERRERS,
        { params: params as Record<string, string | number | boolean | undefined> }
      );
      return res.data;
    } catch {
      return mockDataStore.getReferrerData();
    }
  },

  async getLiveFeed(params?: AnalyticsQueryParams): Promise<LiveClick[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getLiveClicks();
    }
    try {
      const res = await apiClient.get<ApiResponse<LiveClick[]>>(
        API_ROUTES.ANALYTICS.LIVE_FEED,
        { params: params as Record<string, string | number | boolean | undefined> }
      );
      return res.data;
    } catch {
      return mockDataStore.getLiveClicks();
    }
  },
};

