"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { QRCodeSVG } from "qrcode.react";
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
  Share2,
  QrCode,
  Download,
  Zap,
  Radio,
  Sliders,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ServiceErrorBoundary } from "@/components/error/ServiceErrorBoundary";
import { useLinks, useCreateLink } from "@/hooks/useLinks";
import { useCurrentUser } from "@/hooks/useAuth";
import { useOverviewAnalytics, useClickTimeline, useDeviceAnalytics } from "@/hooks/useAnalytics";
import { useToastStore } from "@/store/useToastStore";
import { formatNumber, formatDate, truncateUrl } from "@/lib/utils";
import { Link as LinkType } from "@/types";
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

function DashboardContent() {
  const { addToast } = useToastStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Shorten Bar state
  const [quickUrl, setQuickUrl] = useState("");
  const [quickAlias, setQuickAlias] = useState("");
  const createLinkMutation = useCreateLink();

  // Share & QR Modal State
  const [selectedLinkForShare, setSelectedLinkForShare] = useState<LinkType | null>(null);
  const [copiedModalUrl, setCopiedModalUrl] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      addToast({
        type: "info",
        title: "Checkout received",
        message: "Your plan will update after Stripe sends a verified webhook.",
      });
    }
  }, [searchParams, addToast]);

  const {
    isLoading: isAuthLoading,
    isError: isAuthError,
  } = useCurrentUser();

  useEffect(() => {
    if (isAuthError) {
      router.replace("/login?next=/dashboard");
    }
  }, [isAuthError, router]);

  // TanStack Query Hooks
  const {
    data: linksData,
    isLoading: isLinksLoading,
    isError: isLinksError,
    refetch: refetchLinks,
  } = useLinks({ limit: 6 });

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

  const handleQuickShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl) {
      addToast({ type: "warning", title: "Please enter a destination URL" });
      return;
    }

    let parsedTitle = "Shortened Link";
    try {
      parsedTitle = new URL(quickUrl).hostname;
    } catch {
      // fallback
    }

    createLinkMutation.mutate(
      {
        originalUrl: quickUrl,
        shortCode: quickAlias.trim() || undefined,
        title: parsedTitle,
        domain: "ly.nk",
        status: "active",
      },
      {
        onSuccess: (newLink) => {
          setQuickUrl("");
          setQuickAlias("");
          setSelectedLinkForShare(newLink);
          addToast({
            type: "success",
            title: "Link Created Instantly!",
            message: `https://${newLink.shortUrl}`,
          });
        },
      }
    );
  };

  const handleRefreshAll = () => {
    refetchLinks();
    refetchAnalytics();
    addToast({ type: "info", title: "Data Synced", message: "Refreshed analytics & short links." });
  };

  const recentLinks = linksData?.data || [];

  if (isAuthLoading || isAuthError) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Checking your session...</p>
        </div>
      </div>
    );
  }

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
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Enterprise Dashboard
                  </h1>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                    LIVE TELEMETRY
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Real-time link velocity, click engagement, geographic heatmap, and routing telemetry.
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

          {/* Quick Shortener Action Card */}
          <RevealOnScroll direction="up" delay={0.05}>
            <Card className="p-4 sm:p-5 border border-blue-500/30 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 shadow-xl shadow-blue-500/5">
              <form onSubmit={handleQuickShorten} className="flex flex-col md:flex-row items-center gap-3">
                <div className="flex-1 w-full relative">
                  <Link2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
                  <input
                    type="url"
                    placeholder="Paste a long destination URL (e.g. https://domain.com/landing)..."
                    value={quickUrl}
                    onChange={(e) => setQuickUrl(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 text-xs font-medium bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="w-full md:w-48 relative">
                  <input
                    type="text"
                    placeholder="Custom alias (optional)"
                    value={quickAlias}
                    onChange={(e) => setQuickAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="w-full h-11 px-3.5 text-xs font-medium bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-mono"
                  />
                </div>

                <Button
                  type="submit"
                  variant="glow"
                  size="md"
                  isLoading={createLinkMutation.isPending}
                  className="w-full md:w-auto shrink-0 h-11 font-bold cursor-pointer"
                  rightIcon={<Zap className="w-4 h-4" />}
                >
                  Shorten Link
                </Button>
              </form>
            </Card>
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
                        {formatNumber(linksData?.pagination?.total ?? recentLinks.length)}
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
                        {formatNumber(analytics?.totalClicks ?? 0)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold pt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+{analytics?.clickGrowthRate ?? 0}% volume</span>
                    </div>
                  </Card>
                </StaggerItem>

                {/* Metric 3 */}
                <StaggerItem>
                  <Card hoverEffect className="space-y-2 h-full">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Active Routing Links</span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                    </div>
                    {isAnalyticsLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <p className="text-3xl font-black text-slate-900 dark:text-white">
                        {analytics?.activeLinksCount ?? recentLinks.length}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold pt-1">
                      <span>100% Edge Node Uptime</span>
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
                        {analytics?.averageCtr ?? 0}%
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
                                title="Copy Short URL"
                              >
                                {copiedId === link.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedLinkForShare(link)}
                                title="Share & QR Code"
                              >
                                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                              </Button>

                              <Link href={`/links/${link.id}`}>
                                <Button variant="ghost" size="sm" title="Detailed Analytics">
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

      {/* Share & QR Code Export Modal */}
      {selectedLinkForShare && (
        <Modal
          isOpen={!!selectedLinkForShare}
          onClose={() => setSelectedLinkForShare(null)}
          title="Share Short Link & Vector QR"
          description={selectedLinkForShare.title}
        >
          <div className="space-y-5 py-2 text-center">
            {/* Dynamic QR SVG */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md inline-block">
              <QRCodeSVG
                value={`https://${selectedLinkForShare.shortUrl}`}
                size={160}
                level="H"
                fgColor={selectedLinkForShare.qrSettings?.fgColor || "#0f172a"}
                bgColor={selectedLinkForShare.qrSettings?.bgColor || "#ffffff"}
              />
            </div>

            {/* URL Box */}
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 truncate mr-2">
                https://{selectedLinkForShare.shortUrl}
              </span>
              <Button
                variant={copiedModalUrl ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`https://${selectedLinkForShare.shortUrl}`);
                  setCopiedModalUrl(true);
                  setTimeout(() => setCopiedModalUrl(false), 2000);
                  addToast({ type: "success", title: "Copied URL!" });
                }}
                leftIcon={copiedModalUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedModalUrl ? "Copied" : "Copy"}
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20link:&url=${encodeURIComponent(`https://${selectedLinkForShare.shortUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" leftIcon={<Twitter className="w-3.5 h-3.5 text-sky-500" />}>
                  Tweet
                </Button>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://${selectedLinkForShare.shortUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" leftIcon={<Linkedin className="w-3.5 h-3.5 text-blue-600" />}>
                  LinkedIn
                </Button>
              </a>
              <Link href={`/links/${selectedLinkForShare.id}`}>
                <Button variant="glow" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Open Full Studio
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}


