"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Check, Zap, Play, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UrlShortenerWidget } from "@/components/landing/UrlShortenerWidget";
import { UrlTransformationAnimation } from "@/components/landing/UrlTransformationAnimation";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { LogoCloud } from "@/components/landing/LogoCloud";
import { Testimonials } from "@/components/landing/Testimonials";
import { FaqSection } from "@/components/landing/FaqSection";
import { PRICING_PLANS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen pt-24 overflow-hidden">
      {/* Background Ambient Glow & Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-25%] left-[20%] w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] left-[35%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-blue-500/30 text-xs font-bold text-blue-600 dark:text-blue-400 shadow-sm animate-pulse-subtle">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Introducing LinkPulse 2.0 — Real-Time Click Intelligence</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Large Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Shorten links. Track clicks. <br className="hidden sm:inline" />
          <span className="text-gradient">Grow exponentially.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The enterprise URL shortener, custom branded domain platform, vector QR generator, and real-time conversion telemetry engine for modern teams.
        </p>

        {/* Interactive URL Shortener Widget */}
        <div className="pt-4">
          <UrlShortenerWidget />
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button variant="glow" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Free 14-Day Trial
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="xl" leftIcon={<Play className="w-4 h-4 fill-current text-blue-500" />}>
              Explore Live Dashboard
            </Button>
          </Link>
        </div>

        {/* Proof Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> 99.99% Uptime SLA
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-blue-500" /> Cancel anytime
          </span>
        </div>
      </section>

      {/* URL Transformation Visual Animation */}
      <UrlTransformationAnimation />

      {/* Customer Logo Cloud */}
      <LogoCloud />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Interactive Dashboard Preview */}
      <DashboardPreview />

      {/* Customer Testimonials & Reviews */}
      <Testimonials />

      {/* Pricing Preview Section */}
      <section className="py-24 bg-slate-900/90 text-white relative overflow-hidden border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
              Simple & Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Predictable plans built to scale with your traffic.
            </h2>
            <p className="text-sm text-slate-400">
              No hidden fees, no limits on growth. Switch or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between ${
                  plan.highlight
                    ? "bg-slate-800/95 border-blue-500/70 shadow-2xl relative scale-105"
                    : "bg-slate-950/70 border-slate-800"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 right-6 px-3.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-brand-gradient text-white shadow-lg">
                    {plan.badge}
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{plan.description}</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold">${plan.monthlyPrice}</span>
                    <span className="text-xs text-slate-400"> / month</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300 mb-8 pt-4 border-t border-slate-800">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/pricing">
                  <Button
                    variant={plan.highlight ? "glow" : "outline"}
                    className="w-full text-xs font-bold"
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

      {/* Final Call to Action Section */}
      <section className="py-24 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 glass-card rounded-3xl p-12 border border-blue-500/30 shadow-2xl relative">
          <div className="w-16 h-16 rounded-3xl bg-brand-gradient flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Ready to superpower your links?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join over 50,000+ creators, marketers, and developers shortening billions of clicks.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button variant="glow" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Get Started Free Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
