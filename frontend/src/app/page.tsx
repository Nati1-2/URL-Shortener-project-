"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  QrCode,
  Link2,
  BarChart3,
  Users,
  Check,
  Lock,
} from "lucide-react";
import { UrlTransformationAnimation } from "@/components/landing/UrlTransformationAnimation";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { LogoCloud } from "@/components/landing/LogoCloud";
import { Testimonials } from "@/components/landing/Testimonials";
import { FaqSection } from "@/components/landing/FaqSection";
import { PRICING_PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import {
  RevealOnScroll,
  StaggerGroup,
  StaggerItem,
  HoverLift,
} from "@/components/animation/ScrollReveal";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Ambient Radial Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] overflow-hidden pointer-events-none -z-10 select-none">
        <div className="absolute top-[-15%] left-[20%] w-[650px] h-[650px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[12%] right-[15%] w-[600px] h-[600px] bg-indigo-500/10 dark:bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[8%] left-[-12%] w-[520px] h-[520px] rounded-full border border-slate-200/50 dark:border-slate-800/40 pointer-events-none opacity-40" />
        <div className="absolute top-[4%] right-[-12%] w-[620px] h-[620px] rounded-full border border-slate-200/50 dark:border-slate-800/40 pointer-events-none opacity-40" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-16 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Pill Badge */}
        <RevealOnScroll direction="down" delay={0.05} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-800/70 text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-sm backdrop-blur-md hover:border-purple-400 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Introducing LinkPulse 2.0 — Real-Time Click Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
          </div>
        </RevealOnScroll>

        {/* Large Hero Headline */}
        <RevealOnScroll direction="up" delay={0.12} duration={0.65}>
          <h1 className="text-4xl sm:text-6xl md:text-[72px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Shorten links. Track clicks. <br />
            <span className="text-gradient">Grow exponentially.</span>
          </h1>
        </RevealOnScroll>

        {/* Subtitle */}
        <RevealOnScroll direction="up" delay={0.18} duration={0.65}>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            The enterprise URL shortener, custom branded domain platform, vector QR generator, and real-time conversion telemetry engine for modern teams.
          </p>
        </RevealOnScroll>

        {/* Hero Call to Action Buttons */}
        <RevealOnScroll direction="up" delay={0.24} duration={0.65}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button variant="glow" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="xl" leftIcon={<Lock className="w-4 h-4" />}>
                Sign In to Workspace
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="xl" className="text-slate-600 dark:text-slate-300">
                View Pricing Plans →
              </Button>
            </Link>
          </div>
        </RevealOnScroll>

        {/* 4 Feature Badges Row (Staggered Animation) */}
        <StaggerGroup
          staggerDelay={0.08}
          delayChildren={0.22}
          className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto pt-6 text-left"
        >
          {/* Feature 1 */}
          <StaggerItem>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-blue-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Real-time Analytics</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Live clicks & CTR</p>
              </div>
            </div>
          </StaggerItem>

          {/* Feature 2 */}
          <StaggerItem>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-indigo-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Custom Domains</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Your brand, your links</p>
              </div>
            </div>
          </StaggerItem>

          {/* Feature 3 */}
          <StaggerItem>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dynamic QR Studio</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">High-res & trackable</p>
              </div>
            </div>
          </StaggerItem>

          {/* Feature 4 */}
          <StaggerItem>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-amber-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enterprise Ready</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Secure & 99.99% SLA</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerGroup>

        {/* Social Proof Metrics Bar */}
        <RevealOnScroll direction="up" delay={0.35} duration={0.7}>
          <div className="max-w-4xl mx-auto pt-4">
            <div className="rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xl shadow-slate-200/40 dark:shadow-black/40 backdrop-blur-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              {/* Stat 1 */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Link2 className="w-6 h-6 rotate-[-45deg]" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
                    12.4M+
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                    Links Shortened
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
                    359M+
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                    Total Clicks
                  </p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
                    98K+
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                    Active Teams
                  </p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
                    190+
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                    Countries Reached
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* URL Transformation Visual Animation */}
      <RevealOnScroll direction="up" delay={0.1} duration={0.65}>
        <UrlTransformationAnimation />
      </RevealOnScroll>

      {/* Customer Logo Cloud */}
      <RevealOnScroll direction="none" delay={0.1} duration={0.6}>
        <LogoCloud />
      </RevealOnScroll>

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Interactive Dashboard Preview */}
      <DashboardPreview />

      {/* Customer Testimonials & Reviews */}
      <Testimonials />

      {/* Pricing Preview Section */}
      <section className="py-24 bg-slate-100/70 dark:bg-slate-900/90 text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-center">
          <RevealOnScroll direction="up" delay={0.1}>
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Simple & Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Predictable plans built to scale with your traffic.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No hidden fees, no limits on growth. Switch or cancel anytime.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerGroup staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {PRICING_PLANS.map((plan) => (
              <StaggerItem key={plan.id}>
                <div
                  className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between h-full ${
                    plan.highlight
                      ? "bg-white dark:bg-slate-800/95 border-blue-500/80 shadow-2xl relative md:-translate-y-2"
                      : "bg-white/80 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3.5 right-6 px-3.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-brand-gradient text-white shadow-lg">
                      {plan.badge}
                    </span>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[36px]">{plan.description}</p>
                    <div className="my-6">
                      <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${plan.monthlyPrice}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400"> / month</span>
                    </div>
                    <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 mb-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-blue-500 shrink-0" />
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
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* Final Call to Action Section */}
      <section className="py-24 relative overflow-hidden text-center">
        <RevealOnScroll direction="up" delay={0.1}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 glass-card rounded-3xl p-8 sm:p-14 border border-blue-500/30 shadow-2xl relative">
            <div className="w-16 h-16 rounded-3xl bg-brand-gradient flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/30 border border-white/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Ready to superpower your links?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
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
        </RevealOnScroll>
      </section>
    </div>
  );
}
