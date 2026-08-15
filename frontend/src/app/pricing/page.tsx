"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PRICING_PLANS, FAQS } from "@/lib/constants";
import { FaqSection } from "@/components/landing/FaqSection";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  const comparisonFeatures = [
    { name: "Monthly Tracked Clicks", free: "1,000", pro: "100,000", enterprise: "Unlimited" },
    { name: "Active Short Links", free: "50", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Branded Custom Domains", free: "—", pro: "3 Domains", enterprise: "Unlimited" },
    { name: "Password Protected Links", free: "—", pro: "✓ Included", enterprise: "✓ Included" },
    { name: "Link Expiration & Click Limits", free: "—", pro: "✓ Included", enterprise: "✓ Included" },
    { name: "Custom Vector QR Code Studio", free: "Basic", pro: "Custom Colors & Logo", enterprise: "Vector SVG & High-Res" },
    { name: "Real-Time Click Analytics History", free: "7 Days", pro: "365 Days", enterprise: "Unlimited History" },
    { name: "REST API Access & Webhooks", free: "—", pro: "✓ Included", enterprise: "Priority 100k req/min" },
    { name: "SAML Single Sign-On (SSO)", free: "—", pro: "—", enterprise: "✓ Okta / Azure AD" },
    { name: "Uptime SLA Guarantee", free: "Standard", pro: "99.9%", enterprise: "99.99% Enterprise SLA" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[30%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="purple">Simple Transparent Plans</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Predictable pricing for links that scale.
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Start free, scale as your click volume grows. No hidden fees or surprise charges.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${!isYearly ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-300 dark:bg-slate-700 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isYearly ? "translate-x-7 bg-blue-600" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isYearly ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
              Yearly Billing
              <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 glass-card border transition-all relative flex flex-col justify-between ${
                  plan.highlight
                    ? "border-blue-500/60 bg-white/95 dark:bg-slate-900/95 shadow-2xl scale-105 z-10"
                    : "border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 right-6 px-3.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-brand-gradient text-white shadow-lg">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px]">{plan.description}</p>
                  <div className="my-4">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${price}</span>
                    <span className="text-xs text-slate-400"> / month</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link href="/register">
                    <Button
                      variant={plan.highlight ? "gradient" : "outline"}
                      className="w-full text-sm font-semibold"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <Card className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Detailed Feature Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compare features across Free Starter, Pro Growth, and Enterprise tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">Feature Name</th>
                  <th className="py-4 px-4">Starter (Free)</th>
                  <th className="py-4 px-4 text-blue-500 font-bold">Pro Growth</th>
                  <th className="py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/60">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{row.free}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{row.pro}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* FAQ Section */}
        <FaqSection />
      </div>
    </div>
  );
}
