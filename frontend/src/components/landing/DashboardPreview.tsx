"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { BarChart3, Link2, QrCode, TrendingUp, Users, Globe, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Designed for clarity, built for extreme performance.
          </h2>
        </div>

        {/* Tab Control */}
        <div className="flex justify-center">
          <Tabs
            tabs={[
              { id: "analytics", label: "Analytics Overview", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "links", label: "Links Management", icon: <Link2 className="w-4 h-4" /> },
              { id: "qr", label: "QR Code Studio", icon: <QrCode className="w-4 h-4" /> },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Mock Dashboard Screen Card */}
        <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-6 shadow-2xl bg-white/95 dark:bg-slate-900/95 overflow-hidden">
          {/* Top Mock Window Chrome */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">app.linkpulse.io/dashboard</span>
            </div>
            <Badge variant="info">Live Demo Environment</Badge>
          </div>

          {/* Content Pane depending on tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total Tracked Clicks</span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">142,890</p>
                  <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +24.5% vs last month
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Unique Visitors</span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">98,420</p>
                  <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +18.2%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Avg CTR</span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">12.4%</p>
                  <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +3.1%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Active Links</span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">1,480</p>
                  <span className="text-[11px] font-semibold text-blue-500">100% Uptime</span>
                </div>
              </div>

              {/* Graphic Representation */}
              <div className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800/40 p-4 flex items-end justify-between gap-2 border border-slate-200/50 dark:border-slate-800/50">
                {[45, 62, 58, 84, 90, 75, 110, 130, 125, 140, 160, 185].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      style={{ height: `${(h / 200) * 100}%` }}
                      className="w-full bg-brand-gradient rounded-t-lg transition-all duration-500 hover:opacity-80"
                    />
                    <span className="text-[9px] text-slate-400 font-mono">
                      Aug {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "links" && (
            <div className="space-y-3 animate-fadeIn text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white">Summer Product Launch 2026</p>
                  <p className="text-xs font-mono text-blue-500">ly.nk/summer26</p>
                </div>
                <Badge variant="success">14,280 Clicks</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white">Q3 Developer Docs Portal</p>
                  <p className="text-xs font-mono text-blue-500">ly.nk/docs-q3</p>
                </div>
                <Badge variant="success">9,840 Clicks</Badge>
              </div>
            </div>
          )}

          {activeTab === "qr" && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6 animate-fadeIn">
              <div className="w-40 h-40 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="space-y-2 text-center sm:text-left max-w-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Vector QR Studio</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Custom foreground colors, branded logos, error correction, and instant high-resolution PNG or SVG vector export.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
