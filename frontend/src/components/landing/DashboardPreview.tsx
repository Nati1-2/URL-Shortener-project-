"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import {
  BarChart3,
  Link2,
  QrCode,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/animation/ScrollReveal";

export const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");

  const chartHeights = {
    "24h": [20, 35, 45, 60, 85, 95, 70, 110, 130, 120, 150, 190],
    "7d": [55, 70, 65, 90, 105, 80, 120, 140, 135, 155, 175, 200],
    "30d": [80, 110, 95, 130, 150, 125, 160, 180, 175, 190, 210, 240],
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <RevealOnScroll direction="up" delay={0.05}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Live Environment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for clarity. Built for extreme performance.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Gain complete visibility into click velocities, campaign conversions, and visitor telemetry.
            </p>
          </div>
        </RevealOnScroll>

        {/* Tab Controls */}
        <RevealOnScroll direction="up" delay={0.12}>
          <div className="flex justify-center">
            <Tabs
              tabs={[
                { id: "analytics", label: "Real-Time Telemetry", icon: <BarChart3 className="w-4 h-4" /> },
                { id: "links", label: "Branded Links Vault", icon: <Link2 className="w-4 h-4" /> },
                { id: "qr", label: "Dynamic QR Studio", icon: <QrCode className="w-4 h-4" /> },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </RevealOnScroll>

        {/* Mock Window Container */}
        <RevealOnScroll direction="up" delay={0.18} duration={0.7}>
          <div className="rounded-3xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 sm:p-7 shadow-2xl overflow-hidden backdrop-blur-2xl relative bg-white/95 dark:bg-slate-900/85">
            {/* Mock Window Topbar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/90 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
                  https://app.linkpulse.io/dashboard
                </span>
              </div>

              <div className="flex items-center gap-3">
                {activeTab === "analytics" && (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-700/60">
                    {(["24h", "7d", "30d"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                          timeRange === r
                            ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm font-extrabold"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
                <Badge variant="success">Live Syncing</Badge>
              </div>
            </div>

            {/* Pane 1: Analytics */}
            {activeTab === "analytics" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Metric Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Tracked Clicks
                    </span>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {timeRange === "24h" ? "12,480" : timeRange === "7d" ? "142,890" : "542,100"}
                    </p>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +24.5% volume
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Unique Visitors
                    </span>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {timeRange === "24h" ? "9,120" : timeRange === "7d" ? "98,420" : "390,200"}
                    </p>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +18.2% new leads
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Average CTR
                    </span>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      14.2%
                    </p>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Top 5% Industry
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Routing Latency
                    </span>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      18ms
                    </p>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Global Edge CDN</span>
                  </div>
                </div>

                {/* Bar Graph visualization */}
                <div className="h-56 rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-5 flex items-end justify-between gap-2 border border-slate-200 dark:border-slate-800/50">
                  {chartHeights[timeRange].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div
                        style={{ height: `${(h / 250) * 100}%` }}
                        className="w-full bg-brand-gradient rounded-t-lg transition-all duration-500 group-hover:brightness-110 relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-900 text-white rounded text-[9px] font-mono whitespace-nowrap transition-opacity pointer-events-none z-20 shadow-md">
                          {h * 42} clicks
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono font-semibold">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pane 2: Links */}
            {activeTab === "links" && (
              <div className="space-y-3 animate-fadeIn text-sm">
                {[
                  { title: "Summer Global Launch Campaign", slug: "ly.nk/summer26", clicks: "14,280", tag: "Marketing" },
                  { title: "Q3 Developer Documentation Portal", slug: "ly.nk/docs-q3", clicks: "9,840", tag: "Engineering" },
                  { title: "Black Friday Early Access VIP", slug: "ly.nk/vip-pass", clicks: "24,510", tag: "Sales" },
                  { title: "Investor Pitch Deck 2026", slug: "ly.nk/deck-26", clicks: "3,120", tag: "Fundraising" },
                ].map((l, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-blue-500/40 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 dark:text-white">{l.title}</p>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {l.tag}
                        </span>
                      </div>
                      <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{l.slug}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {l.clicks} Clicks
                      </span>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pane 3: QR Studio */}
            {activeTab === "qr" && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 py-8 animate-fadeIn">
                <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-200 inline-block">
                  <QrCode className="w-36 h-36 text-slate-900" />
                </div>
                <div className="space-y-3 text-center sm:text-left max-w-sm">
                  <Badge variant="purple">Vector Studio</Badge>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xl">
                    Ultra High-Res Dynamic QR
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Customize center brand logos, foreground gradients, frame templates, and download vector SVG for billboards and print media.
                  </p>
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
