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
  QrCode,
  ExternalLink,
  MoreVertical,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLinksStore } from "@/store/useLinksStore";
import { useToastStore } from "@/store/useToastStore";
import {
  CLICK_TIMELINE_DATA,
  GEO_LOCATION_DATA,
  DEVICE_DATA,
  TRAFFIC_SOURCES_DATA,
} from "@/mock/linksData";
import { formatNumber, formatDate, truncateUrl } from "@/lib/utils";

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
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const { links, deleteLink } = useLinksStore();
  const { addToast } = useToastStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);

  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0);
  const activeLinksCount = links.filter((l) => l.status === "active").length;

  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopiedId(id);
    addToast({ type: "success", title: "Copied!", message: `https://${shortUrl}` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = () => {
    setIsLoadingState(true);
    setTimeout(() => setIsLoadingState(false), 700);
  };

  const displayedLinks = isEmptyState ? [] : links.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090d16]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Top Welcome Title Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Enterprise Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Overview of link velocity, click engagement, and traffic intelligence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingState ? "animate-spin" : ""}`} />}
              >
                Refresh Data
              </Button>

              {/* Demo Mode Toggles */}
              <button
                onClick={() => setIsEmptyState(!isEmptyState)}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              >
                Toggle Empty State
              </button>

              <Link href="/create">
                <Button variant="gradient" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  New Short Link
                </Button>
              </Link>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1 */}
            <Card hoverEffect className="space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Short Links</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Link2 className="w-5 h-5" />
                </div>
              </div>
              {isLoadingState ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {formatNumber(links.length)}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold pt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.4% vs last month</span>
              </div>
            </Card>

            {/* Metric 2 */}
            <Card hoverEffect className="space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Tracked Clicks</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <MousePointerClick className="w-5 h-5" />
                </div>
              </div>
              {isLoadingState ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {formatNumber(totalClicks)}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold pt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+24.5% click volume</span>
              </div>
            </Card>

            {/* Metric 3 */}
            <Card hoverEffect className="space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Links</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              {isLoadingState ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {activeLinksCount}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs text-blue-500 font-semibold pt-1">
                <span>100% Healthy Routing</span>
              </div>
            </Card>

            {/* Metric 4 */}
            <Card hoverEffect className="space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Avg CTR Growth Rate</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              {isLoadingState ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  18.6%
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold pt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+4.2% conversion score</span>
              </div>
            </Card>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Click Activity Area Chart (Spans 2 cols) */}
            <Card className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Click Activity History
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Daily total clicks vs unique visitors over the past 14 days.
                  </p>
                </div>
                <Badge variant="info">Live Sync</Badge>
              </div>

              {isLoadingState ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CLICK_TIMELINE_DATA}>
                      <defs>
                        <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "0.75rem",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#clickGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Traffic Sources Donut Chart */}
            <Card className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Traffic Sources
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Referrer origin distribution breakdown.
                </p>
              </div>

              {isLoadingState ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="space-y-4">
                  <div className="h-44 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DEVICE_DATA}
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {DEVICE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {DEVICE_DATA.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-slate-700 dark:text-slate-300">{d.name}</span>
                        </div>
                        <span className="text-slate-900 dark:text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Short Links Table */}
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
                  View All Links Library
                </Button>
              </Link>
            </div>

            {isLoadingState ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : displayedLinks.length === 0 ? (
              <div className="py-12 text-center space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                  <Link2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  No short links created yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Start shortening destination URLs to track clicks, generate QR codes, and boost CTR.
                </p>
                <Link href="/create">
                  <Button variant="gradient" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Create Your First Short Link
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Title & Short URL</th>
                      <th className="py-3 px-4">Original Destination</th>
                      <th className="py-3 px-4">Clicks</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {displayedLinks.map((link) => (
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
        </main>
      </div>
    </div>
  );
}
