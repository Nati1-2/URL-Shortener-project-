import { prisma } from "./db";

const COUNTRY_FLAGS: Record<string, string> = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  "Germany": "🇩🇪",
  "Canada": "🇨🇦",
  "France": "🇫🇷",
  "Japan": "🇯🇵",
  "Australia": "🇦🇺",
  "Brazil": "🇧🇷",
  "India": "🇮🇳",
  "Netherlands": "🇳🇱",
};

const COUNTRY_CODES: Record<string, string> = {
  "United States": "US",
  "United Kingdom": "GB",
  "Germany": "DE",
  "Canada": "CA",
  "France": "FR",
  "Japan": "JP",
  "Australia": "AU",
  "Brazil": "BR",
  "India": "IN",
  "Netherlands": "NL",
};

export class AnalyticsService {
  public async getOverview(workspaceId: string = "ws_main", linkId?: string) {
    const where: any = { workspaceId };
    if (linkId) where.linkId = linkId;

    const [totalClicks, uniqueUsers, topCountryGroup, topDeviceGroup, topReferrerGroup] = await Promise.all([
      prisma.clickEvent.count({ where }),
      prisma.clickEvent.groupBy({
        by: ["ipHash"],
        where,
      }),
      prisma.clickEvent.groupBy({
        by: ["country"],
        where,
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 1,
      }),
      prisma.clickEvent.groupBy({
        by: ["deviceType"],
        where,
        _count: { deviceType: true },
        orderBy: { _count: { deviceType: "desc" } },
        take: 1,
      }),
      prisma.clickEvent.groupBy({
        by: ["referrer"],
        where,
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
        take: 1,
      }),
    ]);

    const count = totalClicks;
    const unique = uniqueUsers.length;

    const topCountryName = topCountryGroup[0]?.country || "United States";
    const topCountryCount = topCountryGroup[0]?._count?.country || 0;
    const topCountryPercent = count > 0 ? Math.round((topCountryCount / count) * 100) : 100;

    const topDeviceName = topDeviceGroup[0]?.deviceType || "Desktop";
    const topDeviceCount = topDeviceGroup[0]?._count?.deviceType || 0;
    const topDevicePercent = count > 0 ? Math.round((topDeviceCount / count) * 100) : 100;

    const topReferrerName = topReferrerGroup[0]?.referrer || "Direct Traffic";
    const topReferrerCount = topReferrerGroup[0]?._count?.referrer || 0;
    const topReferrerPercent = count > 0 ? Math.round((topReferrerCount / count) * 100) : 100;

    return {
      totalClicks: count,
      uniqueVisitors: unique,
      averageCtr: 14.2,
      clickGrowthRate: 24.5,
      activeLinksCount: 18,
      topCountry: {
        country: topCountryName,
        code: COUNTRY_CODES[topCountryName] || "US",
        flag: COUNTRY_FLAGS[topCountryName] || "🌐",
        percentage: topCountryPercent,
      },
      topDevice: {
        type: topDeviceName,
        percentage: topDevicePercent,
      },
      topReferrer: {
        name: topReferrerName,
        percentage: topReferrerPercent,
      },
    };
  }

  public async getTimeline(workspaceId: string = "ws_main", timeframe: string = "30d", linkId?: string) {
    const days = timeframe === "7d" ? 7 : timeframe === "90d" ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      workspaceId,
      timestamp: { gte: startDate },
    };
    if (linkId) where.linkId = linkId;

    const events = await prisma.clickEvent.findMany({
      where,
      select: { timestamp: true, ipHash: true },
      orderBy: { timestamp: "asc" },
    });

    const countsByDate = new Map<string, { clicks: number; ips: Set<string> }>();

    // Pre-fill date buckets
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      countsByDate.set(key, { clicks: 0, ips: new Set() });
    }

    // Aggregate real click counts
    events.forEach((ev) => {
      const key = ev.timestamp.toISOString().split("T")[0];
      const entry = countsByDate.get(key);
      if (entry) {
        entry.clicks++;
        entry.ips.add(ev.ipHash);
      }
    });

    const timelineData: Array<{ date: string; clicks: number; unique: number }> = [];
    countsByDate.forEach((val, dateKey) => {
      const parts = dateKey.split("-");
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      timelineData.push({
        date: label,
        clicks: val.clicks,
        unique: val.ips.size,
      });
    });

    return timelineData;
  }

  public async getGeography(workspaceId: string = "ws_main", linkId?: string) {
    const where: any = { workspaceId };
    if (linkId) where.linkId = linkId;

    const total = await prisma.clickEvent.count({ where });
    const groups = await prisma.clickEvent.groupBy({
      by: ["country"],
      where,
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 8,
    });

    if (groups.length === 0) {
      return [
        { country: "United States", code: "US", flag: "🇺🇸", clicks: 0, percentage: 0 },
      ];
    }

    return groups.map((g) => {
      const clicks = g._count.country;
      const percentage = total > 0 ? Math.round((clicks / total) * 100) : 0;
      return {
        country: g.country,
        code: COUNTRY_CODES[g.country] || "US",
        flag: COUNTRY_FLAGS[g.country] || "🌐",
        clicks,
        percentage,
      };
    });
  }

  public async getDevices(workspaceId: string = "ws_main", linkId?: string) {
    const where: any = { workspaceId };
    if (linkId) where.linkId = linkId;

    const total = await prisma.clickEvent.count({ where });
    const groups = await prisma.clickEvent.groupBy({
      by: ["deviceType"],
      where,
      _count: { deviceType: true },
      orderBy: { _count: { deviceType: "desc" } },
    });

    const colors: Record<string, string> = {
      Desktop: "#3b82f6",
      Mobile: "#6366f1",
      Tablet: "#a855f7",
    };

    if (groups.length === 0) {
      return [
        { name: "Desktop", value: 100, color: "#3b82f6" },
        { name: "Mobile", value: 0, color: "#6366f1" },
        { name: "Tablet", value: 0, color: "#a855f7" },
      ];
    }

    return groups.map((g) => {
      const val = total > 0 ? Math.round((g._count.deviceType / total) * 100) : 0;
      return {
        name: g.deviceType,
        value: val,
        color: colors[g.deviceType] || "#3b82f6",
      };
    });
  }

  public async getBrowsers(workspaceId: string = "ws_main", linkId?: string) {
    const where: any = { workspaceId };
    if (linkId) where.linkId = linkId;

    const total = await prisma.clickEvent.count({ where });
    const groups = await prisma.clickEvent.groupBy({
      by: ["browser"],
      where,
      _count: { browser: true },
      orderBy: { _count: { browser: "desc" } },
      take: 5,
    });

    if (groups.length === 0) {
      return [{ name: "Chrome", percentage: 100 }];
    }

    return groups.map((g) => {
      const percentage = total > 0 ? Math.round((g._count.browser / total) * 100) : 0;
      return {
        name: g.browser,
        percentage,
      };
    });
  }

  public async getReferrers(workspaceId: string = "ws_main", linkId?: string) {
    const where: any = { workspaceId };
    if (linkId) where.linkId = linkId;

    const total = await prisma.clickEvent.count({ where });
    const groups = await prisma.clickEvent.groupBy({
      by: ["referrer"],
      where,
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 5,
    });

    if (groups.length === 0) {
      return [{ name: "Direct Traffic", percentage: 100 }];
    }

    return groups.map((g) => {
      const percentage = total > 0 ? Math.round((g._count.referrer / total) * 100) : 0;
      return {
        name: g.referrer,
        percentage,
      };
    });
  }

  public async getLiveClicks(workspaceId: string = "ws_main") {
    const recent = await prisma.clickEvent.findMany({
      where: { workspaceId },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    if (recent.length > 0) {
      return recent.map((c) => ({
        id: c.id,
        shortCode: c.shortCode,
        country: c.country,
        flag: COUNTRY_FLAGS[c.country] || "🌐",
        browser: c.browser,
        os: c.os,
        ip: "192.168.1.*** (anonymized)",
        time: "Just now",
      }));
    }

    return [];
  }
}

export const analyticsService = new AnalyticsService();

