export interface AnalyticsSummary {
  totalClicks: number;
  uniqueVisitors: number;
  averageCtr: number;
  activeLinksCount: number;
  clickGrowthRate: number;
  topCountry: {
    country: string;
    flag: string;
    percentage: number;
  };
  topReferrer: {
    name: string;
    percentage: number;
  };
}

export interface ClickPoint {
  date: string;
  clicks: number;
  unique: number;
}

export interface GeoStat {
  country: string;
  flag: string;
  clicks: number;
  percentage: number;
}

export interface DeviceStat {
  name: string;
  value: number;
  color: string;
}

export interface BrowserStat {
  name: string;
  percentage: number;
}

export interface ReferrerStat {
  name: string;
  clicks: number;
  percentage: number;
}

export interface LiveClick {
  id: string;
  linkId: string;
  shortCode: string;
  country: string;
  flag: string;
  browser: string;
  os: string;
  ip: string;
  time: string;
}

export interface AnalyticsQueryParams {
  timeframe?: "24h" | "7d" | "30d" | "90d" | "ytd" | "custom";
  from?: string;
  to?: string;
  linkId?: string;
  workspaceId?: string;
  timezone?: string;
}
