"use client";

import React from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  RevealOnScroll,
  StaggerGroup,
  StaggerItem,
} from "@/components/animation/ScrollReveal";

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Alex Rivera",
      role: "VP of Growth",
      company: "HyperScale Inc.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      content:
        "LinkPulse transformed our marketing attribution. We manage over 2 million clicks monthly across 18 custom domains with zero downtime. The real-time geolocation telemetry is incredible.",
      rating: 5,
      metric: "+310% Click Engagement",
    },
    {
      name: "Sarah Chen",
      role: "Head of Marketing",
      company: "FintechWave",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      content:
        "The dynamic QR Studio combined with branded custom slugs increased our event conversion rates dramatically. Super clean UI, blazing fast redirects, and rock-solid reliability.",
      rating: 5,
      metric: "4.2x Event Signups",
    },
    {
      name: "Marcus Vance",
      role: "Lead DevOps Architect",
      company: "CloudSync Labs",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      content:
        "We migrated from Bitly in an afternoon. The sub-20ms global edge Anycast routing ensures our international users never experience latency when clicking short links.",
      rating: 5,
      metric: "<18ms Edge Latency",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <RevealOnScroll direction="up" delay={0.05}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trusted by fast-growing growth teams & enterprises.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              See how forward-thinking marketing and engineering teams scale their link workflows.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerGroup staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <StaggerItem key={idx}>
              <Card hoverEffect className="flex flex-col justify-between space-y-6 p-8 border h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.metric}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.role} • {item.company}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
};
