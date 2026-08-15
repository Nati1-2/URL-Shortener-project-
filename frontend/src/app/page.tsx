"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Check, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UrlShortenerWidget } from "@/components/landing/UrlShortenerWidget";
import { UrlTransformationAnimation } from "@/components/landing/UrlTransformationAnimation";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { LogoCloud } from "@/components/landing/LogoCloud";
import { FaqSection } from "@/components/landing/FaqSection";
import { PRICING_PLANS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen pt-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-[10%] right-[20%] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] left-[40%] w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-blue-500/30 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-sm animate-pulse-subtle">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Introducing LinkPulse 2.0 — Real-Time Click Intelligence</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Large Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Shorten links. Track clicks. <br className="hidden sm:inline" />
          <span className="text-gradient">Grow faster.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The all-in-one branded URL shortener, custom domain platform, dynamic QR generator, and real-time conversion analytics engine for modern teams.
        </p>

        {/* Interactive URL Shortener Widget in Hero */}
        <div className="pt-4">
          <UrlShortenerWidget />
        </div>

        {/* Hero CTAs & Proof */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button variant="gradient" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Free 14-Day Trial
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="xl" leftIcon={<Play className="w-4 h-4 fill-current text-blue-500" />}>
              Explore Live Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> 100% Uptime SLA
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-blue-500" /> Cancel anytime
          </span>
        </div>
      </section>

      {/* URL Transformation Preview */}
      <UrlTransformationAnimation />

      {/* Customer Logo Cloud */}
      <LogoCloud />

      {/* Features Section */}
      <FeatureGrid />

      {/* Interactive Dashboard Preview */}
      <DashboardPreview />

      {/* Pricing Preview Block */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Simple & Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Predictable plans built to scale with your traffic.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 border ${
                  plan.highlight
                    ? "bg-slate-800/90 border-blue-500/50 shadow-2xl relative"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 right-6 px-3 py-1 text-[10px] font-extrabold uppercase rounded-full bg-brand-gradient text-white shadow-md">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{plan.description}</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">${plan.monthlyPrice}</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button
                    variant={plan.highlight ? "gradient" : "outline"}
                    className="w-full text-xs"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
