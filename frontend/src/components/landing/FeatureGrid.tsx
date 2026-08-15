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
  Layers,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Click Analytics",
      description:
        "Track total clicks, geographic location, referrers, devices, browsers, and user conversion paths in real time.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Globe,
      title: "Branded Custom Domains",
      description:
        "Connect your own domains (e.g. go.brand.com) with automatic HTTPS SSL certificate provisioning.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      icon: QrCode,
      title: "Dynamic QR Code Studio",
      description:
        "Generate custom vectors QR codes with your brand colors, custom logo center overlay, and high-res vector exports.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: Lock,
      title: "Password Protection",
      description:
        "Secure sensitive links behind secret passwords, requiring authorized passcodes before redirecting users.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Clock,
      title: "Link Expiration & Click Limits",
      description:
        "Schedule links to automatically expire on specific dates or after reaching a specified total click count threshold.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security & SLA",
      description:
        "99.99% uptime SLA, SOC2 compliant infrastructure, automated DDoS protection, and SAML SSO single sign-on.",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 rounded-full border border-blue-200 dark:border-blue-800">
            Enterprise Feature Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything you need to manage & optimize every click.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Built for modern growth marketers, developers, and enterprise teams who demand reliable infrastructure and deep insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} hoverEffect className="space-y-4 p-7">
                <div
                  className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
