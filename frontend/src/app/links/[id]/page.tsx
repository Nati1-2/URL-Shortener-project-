"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Link2,
  Copy,
  Check,
  QrCode,
  Share2,
  Lock,
  Clock,
  Globe,
  ExternalLink,
  ShieldCheck,
  Trash2,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Download,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useLink, useDeleteLink } from "@/hooks/useLinks";
import { useClickTimeline, useGeographyAnalytics } from "@/hooks/useAnalytics";
import { useToastStore } from "@/store/useToastStore";
import { formatNumber, formatDate, truncateUrl } from "@/lib/utils";

// Recharts components
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function LinkDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: linkId } = use(params);
  const router = useRouter();
  const { addToast } = useToastStore();

  const { data: link, isLoading, isError, refetch } = useLink(linkId);
  const deleteMutation = useDeleteLink();
  const { data: timelineData, isLoading: isTimelineLoading } = useClickTimeline({ linkId });
  const { data: geoData } = useGeographyAnalytics({ linkId });

  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCopy = () => {
    if (link) {
      navigator.clipboard.writeText(`https://${link.shortUrl}`);
      setCopied(true);
      addToast({ type: "success", title: "Copied URL to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    if (link) {
      deleteMutation.mutate(link.id, {
        onSuccess: () => router.push("/links"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
        <Sidebar />
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-44 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !link) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
        <Sidebar />
        <div className="flex-1 p-8 max-w-xl mx-auto my-auto">
          <ErrorState
            title="Link Not Found"
            message="The requested link could not be loaded from the links microservice."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/links"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Links Library</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(true)}
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share Link
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Link
              </Button>
            </div>
          </div>

          {/* Top Banner Card */}
          <Card className="p-6 sm:p-8 space-y-6 border-2 border-blue-500/30 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={link.status === "active" ? "success" : "purple"}>
                    {link.status}
                  </Badge>
                  <span className="text-xs text-slate-400">Created on {formatDate(link.createdAt)}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {link.title}
                </h1>
                <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  https://{link.shortUrl}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-xl">
                  Destination: {link.originalUrl}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  onClick={handleCopy}
                  variant={copied ? "primary" : "secondary"}
                  size="lg"
                  leftIcon={copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? "Copied!" : "Copy Short URL"}
                </Button>
                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" rightIcon={<ExternalLink className="w-4 h-4" />}>
                    Visit Destination
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Card className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Clicks</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {formatNumber(link.clicks)}
              </p>
              <span className="text-xs text-emerald-500 font-bold">+18.4% velocity</span>
            </Card>

            <Card className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Health & SSL</span>
              <p className="text-3xl font-black text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="w-7 h-7" /> 100% OK
              </p>
              <span className="text-xs text-slate-400">HTTP 200 • Edge Anycast</span>
            </Card>

            <Card className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Security Rule</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {link.password ? <Lock className="w-6 h-6 text-purple-500" /> : <ShieldCheck className="w-6 h-6 text-blue-500" />}
                {link.password ? "Protected" : "Public"}
              </p>
              <span className="text-xs text-slate-400">
                {link.password ? "Passcode Active" : "Open Routing"}
              </span>
            </Card>
          </div>

          {/* Details & Dedicated Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: QR Studio & Metadata */}
            <div className="space-y-6">
              <Card className="space-y-4 text-center">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-500" />
                  <span>Dynamic QR Code Studio</span>
                </h3>

                <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-md inline-block">
                  <QRCodeSVG value={`https://${link.shortUrl}`} size={160} level="H" />
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download PNG
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download SVG
                  </Button>
                </div>
              </Card>

              <Card className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Metadata & Routing Rules
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-semibold">Short Code:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{link.shortCode}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-semibold">Domain:</span>
                    <span className="font-bold text-blue-500">{link.domain}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-semibold">Tags:</span>
                    <span className="text-slate-900 dark:text-white">{link.tags?.join(", ") || "None"}</span>
                  </div>
                  {link.utmSource && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-semibold">UTM Source:</span>
                      <span className="font-mono text-slate-900 dark:text-white">{link.utmSource}</span>
                    </div>
                  )}
                  {link.utmCampaign && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-semibold">UTM Campaign:</span>
                      <span className="font-mono text-slate-900 dark:text-white">{link.utmCampaign}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right: Timeline Chart & Locations */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    <span>Click Performance Velocity</span>
                  </h3>
                  <Badge variant="info">ID: {link.id}</Badge>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData || []}>
                      <defs>
                        <linearGradient id="linkClickGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0e1526",
                          borderColor: "#1e293b",
                          borderRadius: "1rem",
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
                        fill="url(#linkClickGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Geographic Breakdown */}
              <Card className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span>Top Locations for this Link</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {geoData?.slice(0, 4).map((geo) => (
                    <div key={geo.country} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{geo.flag}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{geo.country}</span>
                      </div>
                      <span className="font-semibold text-slate-500 dark:text-slate-400">{geo.clicks} clicks</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Short Link"
        description="Are you sure you want to permanently delete this short link? All click data will be erased."
      >
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Permanently Delete
          </Button>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Short Link"
        description="Share your shortened URL directly across social networks and platforms."
      >
        <div className="space-y-4 py-2">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-blue-500">https://{link.shortUrl}</span>
            <Button variant="primary" size="sm" onClick={handleCopy}>
              Copy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
