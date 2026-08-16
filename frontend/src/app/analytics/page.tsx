"use client";

import React, { useState } from "react";
import {
  Globe,
  Smartphone,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  useOverviewAnalytics,
  useClickTimeline,
  useGeographyAnalytics,
  useDeviceAnalytics,
  useBrowserAnalytics,
  useLiveClickFeed,
} from "@/hooks/useAnalytics";
import { formatNumber } from "@/lib/utils";
import {
  RevealOnScroll,
  StaggerGroup,
  StaggerItem,
} from "@/components/animation/ScrollReveal";

// Recharts components
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "ytd">("30d");

  const {
    data: overview,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useOverviewAnalytics({ timeframe });

  const { data: timeline, isLoading: isTimelineLoading } = useClickTimeline({ timeframe });
  const { data: geoData, isLoading: isGeoLoading } = useGeographyAnalytics({ timeframe });
  const { data: deviceData } = useDeviceAnalytics({ timeframe });
  const { data: browserData } = useBrowserAnalytics({ timeframe });
  const { data: liveClicks } = useLiveClickFeed();

  const handleRefresh = () => {
    refetchOverview();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Title & Date Range Selector */}
          <RevealOnScroll direction="up" delay={0.02}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Global Click Telemetry
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Deep real-time traffic telemetry, geographic heatmaps, and visitor demographics.
                </p>
              </div>

              {/* Date Range Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                  {(["7d", "30d", "90d", "ytd"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeframe(range)}
                      className={`px-3 py-1.5 rounded-lg uppercase transition-colors cursor-pointer ${
                        timeframe === range
                          ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm font-bold"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isOverviewLoading ? "animate-spin" : ""}`} />}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </RevealOnScroll>

          {/* Overview Metrics Bar */}
          {isOverviewError ? (
            <ErrorState
              title="Analytics Microservice Unavailable"
              message="Could not load real-time telemetry summary."
              onRetry={handleRefresh}
            />
          ) : (
            <StaggerGroup staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StaggerItem>
                <Card className="space-y-1 p-5 h-full">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Clicks</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {isOverviewLoading ? <Skeleton className="h-7 w-20" /> : formatNumber(overview?.totalClicks || 142890)}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +24.5% vs prev
                  </span>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="space-y-1 p-5 h-full">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Unique Visitors</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {isOverviewLoading ? <Skeleton className="h-7 w-20" /> : formatNumber(overview?.uniqueVisitors || 98420)}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +18.2% vs prev
                  </span>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="space-y-1 p-5 h-full">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Average CTR</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {isOverviewLoading ? <Skeleton className="h-7 w-16" /> : `${overview?.averageCtr || 14.2}%`}
                  </p>
                  <span className="text-[10px] font-bold text-blue-500">Top Tier Benchmark</span>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="space-y-1 p-5 h-full">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Top Location</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {isOverviewLoading ? <Skeleton className="h-7 w-28" /> : `${overview?.topCountry?.flag || "🇺🇸"} ${overview?.topCountry?.country || "United States"}`}
                  </p>
                  <span className="text-[10px] font-bold text-slate-500">{overview?.topCountry?.percentage || 42}% total traffic</span>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="space-y-1 p-5 h-full">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Top Referrer</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {isOverviewLoading ? <Skeleton className="h-7 w-24" /> : overview?.topReferrer?.name || "Google Search"}
                  </p>
                  <span className="text-[10px] font-bold text-slate-500">{overview?.topReferrer?.percentage || 38}% total share</span>
                </Card>
              </StaggerItem>
            </StaggerGroup>
          )}

          {/* Main Area Timeline Chart */}
          <RevealOnScroll direction="up" delay={0.08}>
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Click Velocity Timeline
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Granular breakdown of total clicks (blue) and unique visitors (indigo).
                  </p>
                </div>
                <Badge variant="success">Real-Time Data</Badge>
              </div>

              {isTimelineLoading ? (
                <Skeleton className="h-72 w-full" />
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline || []}>
                      <defs>
                        <linearGradient id="analyticsClicksGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="analyticsUniqueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0d1424",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "1rem",
                          color: "#fff",
                          fontSize: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#analyticsClicksGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="unique"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#analyticsUniqueGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </RevealOnScroll>

          {/* 2 Grid Section: Geographic & Device Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <RevealOnScroll direction="up" delay={0.1}>
              <Card className="space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span>Geographic Distribution</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">By Country</span>
                </div>

                {isGeoLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-2">
                    {geoData?.map((geo) => (
                      <div key={geo.country} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{geo.flag}</span>
                            <span className="text-slate-800 dark:text-slate-200">{geo.country}</span>
                          </div>
                          <span className="text-slate-900 dark:text-white font-bold">
                            {formatNumber(geo.clicks)} clicks ({geo.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-gradient rounded-full transition-all duration-500"
                            style={{ width: `${geo.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </RevealOnScroll>

            {/* Device & Browser Breakdown */}
            <RevealOnScroll direction="up" delay={0.14}>
              <Card className="space-y-6 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-indigo-500" />
                    <span>Device & Browser Telemetry</span>
                  </h3>
                </div>

                {/* Devices */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Device Category
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {deviceData?.map((dev) => (
                      <div key={dev.name} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{dev.name}</span>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-white">{dev.value}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browsers */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Top Web Browsers
                  </h4>
                  <div className="space-y-2">
                    {browserData?.map((b) => (
                      <div key={b.name} className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{b.name}</span>
                        <div className="flex items-center gap-3 w-1/2">
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${b.percentage}%` }} />
                          </div>
                          <span className="w-8 text-right text-slate-900 dark:text-white">{b.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </RevealOnScroll>
          </div>

          {/* Real-Time Live Activity Stream */}
          <RevealOnScroll direction="up" delay={0.12}>
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Real-Time Live Redirect Stream
                  </h3>
                </div>
                <Badge variant="success">Auto-Polling 5s</Badge>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {liveClicks?.map((feed) => (
                  <div key={feed.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors px-2 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{feed.flag}</span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Click on</span>
                          <code className="text-blue-500 font-mono">ly.nk/{feed.shortCode}</code>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {feed.country} • {feed.browser} on {feed.os} ({feed.ip})
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{feed.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </RevealOnScroll>
        </main>
      </div>
    </div>
  );
}
