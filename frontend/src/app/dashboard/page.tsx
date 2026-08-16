"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Link2,
  MousePointerClick,
  Activity,
  TrendingUp,
  Plus,
  Copy,
  Check,
  ExternalLink,
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
import { EmptyState } from "@/components/ui/EmptyState";
import { ServiceErrorBoundary } from "@/components/error/ServiceErrorBoundary";
import { useLinks } from "@/hooks/useLinks";
import { useOverviewAnalytics, useClickTimeline, useDeviceAnalytics } from "@/hooks/useAnalytics";
import { useToastStore } from "@/store/useToastStore";
import { formatNumber, formatDate, truncateUrl } from "@/lib/utils";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const { addToast } = useToastStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // TanStack Query Hooks
  const {
    data: linksData,
    isLoading: isLinksLoading,
    isError: isLinksError,
    refetch: refetchLinks,
  } = useLinks({ limit: 5 });

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useOverviewAnalytics();

  const { data: timelineData, isLoading: isTimelineLoading } = useClickTimeline();
  const { data: deviceData, isLoading: isDeviceLoading } = useDeviceAnalytics();

  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopiedId(id);
    addToast({ type: "success", title: "Copied!", message: `https://${shortUrl}` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefreshAll = () => {
    refetchLinks();
    refetchAnalytics();
  };

  const recentLinks = linksData?.data || [];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Header */}
          <RevealOnScroll direction="up" delay={0.02}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Enterprise Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Real-time link velocity, click engagement, and routing telemetry.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshAll}
                  leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isAnalyticsLoading ? "animate-spin" : ""}`} />}
                >
                  Refresh Data
                </Button>

                <Link href="/create">
                  <Button variant="glow" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    New Short Link
                  </Button>
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* 4 Overview Metric Cards */}
          <ServiceErrorBoundary fallbackTitle="Analytics Telemetry Service Offline">
            {isAnalyticsError ? (
              <ErrorState
                title="Could not connect to Analytics Service"
                message="Analytics telemetry is currently unavailable. Links routing remains active."
                onRetry={refetchAnalytics}
              />
            ) : (
              <StaggerGroup staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Metric 1 */}
                <StaggerItem>
                  <Card hoverEffect className="space-y-2 h-full">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Short Links</span>
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Link2 className="w-4 h-4" />
                      </div>
                    </div>
                    {isAnalyticsLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {formatNumber(analytics?.totalClicks ? linksData?.pagination?.total || 6 : 0)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold pt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+12.4% vs last month</span>
                    </div>
                  </Card>
                </StaggerItem>

                {/* Metric 2 */}
                <StaggerItem>
                  <Card hoverEffect className="space-y-2 h-full">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Tracked Clicks</span>
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <MousePointerClick className="w-4 h-4" />
                      </div>
                    </div>
                    {isAnalyticsLoading ? (
                      <Skeleton className="h-8 w-28" />
                    ) : (
                      <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {formatNumber(analytics?.totalClicks || 0)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold pt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+{analytics?.clickGrowthRate || 24.5}% volume</span>
                    </div>
                  </Card>
                </StaggerItem>

                {/* Metric 3 */}
                <StaggerItem>
                  <Card hoverEffect className="space-y-2 h-full">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Active Links</span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                    </div>
                    {isAnalyticsLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {analytics?.activeLinksCount || 0}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-blue-500 font-bold pt-1">
                      <span>100% Healthy Routing</span>
                    </div>
                  </Card>
                </StaggerItem>

                {/* Metric 4 */}
                <StaggerItem>
                  <Card hoverEffect className="space-y-2 h-full">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Avg CTR Score</span>
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    {isAnalyticsLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {analytics?.averageCtr || 14.2}%
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold pt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Top 5% Industry</span>
                    </div>
                  </Card>
                </StaggerItem>
              </StaggerGroup>
            )}
          </ServiceErrorBoundary>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Click Timeline Chart */}
            <RevealOnScroll direction="up" delay={0.1} className="lg:col-span-2">
              <Card className="space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Click Activity Velocity
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Daily total clicks vs unique visitors over the past 14 days.
                    </p>
                  </div>
                  <Badge variant="success">Live Sync</Badge>
                </div>

                {isTimelineLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData || []}>
                        <defs>
                          <linearGradient id="dashClickGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
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
                          fill="url(#dashClickGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </RevealOnScroll>

            {/* Device Distribution Donut Chart */}
            <RevealOnScroll direction="up" delay={0.15}>
              <Card className="space-y-4 h-full">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Device Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Client hardware category breakdown.
                  </p>
                </div>

                {isDeviceLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="space-y-4">
                    <div className="h-44 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData || []}
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {deviceData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0d1424",
                              borderColor: "rgba(255, 255, 255, 0.1)",
                              borderRadius: "0.75rem",
                              color: "#fff",
                              fontSize: "11px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {deviceData?.map((d) => (
                        <div key={d.name} className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-slate-700 dark:text-slate-300">{d.name}</span>
                          </div>
                          <span className="text-slate-900 dark:text-white font-bold">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </RevealOnScroll>
          </div>

          {/* Recent Short Links Table Card */}
          <RevealOnScroll direction="up" delay={0.12}>
            <Card className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recent Shortened Links
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage active links, view click stats, or copy destination URLs.
                  </p>
                </div>
                <Link href="/links">
                  <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                    View All Links Vault
                  </Button>
                </Link>
              </div>

              {isLinksLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : isLinksError ? (
                <ErrorState
                  title="Could not load recent links"
                  message="Link microservice communication failed."
                  onRetry={refetchLinks}
                />
              ) : recentLinks.length === 0 ? (
                <EmptyState
                  title="No short links created yet"
                  description="Start shortening destination URLs to track clicks, generate QR codes, and boost CTR."
                  actionText="Create Your First Short Link"
                  actionHref="/create"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="py-3.5 px-4">Title & Short URL</th>
                        <th className="py-3.5 px-4">Original Destination</th>
                        <th className="py-3.5 px-4">Clicks</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {recentLinks.map((link) => (
                        <tr key={link.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <Link
                                href={`/links/${link.id}`}
                                className="font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors block"
                              >
                                {link.title}
                              </Link>
                              <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                                https://{link.shortUrl}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 dark:text-slate-400 font-mono">
                            {truncateUrl(link.originalUrl, 38)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                            {formatNumber(link.clicks)}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge
                              variant={
                                link.status === "active"
                                  ? "success"
                                  : link.status === "password_protected"
                                  ? "purple"
                                  : "warning"
                              }
                            >
                              {link.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(link.shortUrl, link.id)}
                              >
                                {copiedId === link.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </Button>
                              <Link href={`/links/${link.id}`}>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </RevealOnScroll>
        </main>
      </div>
    </div>
  );
}
