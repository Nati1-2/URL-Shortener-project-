"use client";

import React from "react";
import {
  BarChart3,
  Globe,
  QrCode,
  Lock,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  RevealOnScroll,
  StaggerGroup,
  StaggerItem,
} from "@/components/animation/ScrollReveal";

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      badge: "Real-Time",
      title: "Granular Click Intelligence",
      description:
        "Track total clicks, geographic location, referrers, devices, browsers, and user conversion paths in sub-second real time.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/40",
    },
    {
      icon: Globe,
      badge: "Custom Domains",
      title: "Branded URL Infrastructure",
      description:
        "Connect your custom domains (e.g. go.brand.com) with automatic HTTPS SSL certificate provisioning and global edge Anycast routing.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "hover:border-indigo-500/40",
    },
    {
      icon: QrCode,
      badge: "Vector Studio",
      title: "Dynamic QR Code Studio",
      description:
        "Generate custom vector QR codes with your brand palette, custom logo center overlay, error correction, and instant high-res vector exports.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/40",
    },
    {
      icon: Lock,
      badge: "Security",
      title: "Password Protected Links",
      description:
        "Secure sensitive files, decks, or internal staging previews behind encrypted passcodes before granting redirect access.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/40",
    },
    {
      icon: Clock,
      badge: "Automation",
      title: "Expiration & Click Limits",
      description:
        "Schedule links to automatically expire on specific calendar dates or after reaching a specified total click threshold.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/40",
    },
    {
      icon: ShieldCheck,
      badge: "Enterprise SLA",
      title: "99.99% Guaranteed Uptime",
      description:
        "Enterprise-grade infrastructure backed by multi-region edge cloud networks, DDoS mitigation, and sub-20ms global redirect speeds.",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/40",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <RevealOnScroll direction="up" delay={0.05}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Enterprise Feature Engine</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Engineered to optimize <br className="hidden sm:inline" />
              every single link interaction.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Built for modern growth marketers, developers, and enterprise teams who demand reliable infrastructure and deep insights.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerGroup staggerDelay={0.09} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={idx}>
                <Card
                  hoverEffect
                  className={`space-y-4 p-8 border transition-all duration-300 h-full flex flex-col justify-between group ${feature.border}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
};
