"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, Sparkles, Copy, Check, Globe, ShieldCheck, ArrowRight } from "lucide-react";

export const UrlTransformationAnimation: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://link.pulse/summer26");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6">
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-blue-500/40 via-indigo-500/50 to-purple-500/40 shadow-2xl shadow-blue-500/10">
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-[23px] p-5 sm:p-7 md:p-8 text-white">
          {/* Header indicator */}
          <div className="flex items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold tracking-wide uppercase text-[11px] text-slate-300">
                Live URL Compression Engine
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                81% Reduction
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold">
                &lt; 5ms Telemetry
              </span>
            </div>
          </div>

          {/* Transformation Row */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-4 sm:gap-6">
            {/* 1. Raw URL Card */}
            <div className="min-w-0 w-full p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5 text-left transition-all">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Raw Destination URL
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300">
                  84 Chars
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
                <p className="text-xs font-mono text-slate-300 truncate" title="https://acme.inc/blog/product-release-summer-2026-announcement-v2?utm_source=twitter&utm_medium=social">
                  <span className="text-slate-500">https://</span>acme.inc/blog/product-release-summer-2026...
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Unbranded</span>
                <span>•</span>
                <span>No click analytics</span>
              </div>
            </div>

            {/* 2. Center Animated Zap Connector */}
            <div className="flex flex-col items-center justify-center py-1 sm:py-0">
              {shouldReduceMotion ? (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/20">
                  <Zap className="w-5 h-5 fill-current text-white" />
                </div>
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-60 blur-sm group-hover:opacity-100 transition duration-300" />
                  <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 border border-white/25">
                    <Zap className="w-5 h-5 fill-current text-white" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* 3. Shortened Smart URL Card */}
            <div className="min-w-0 w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-blue-950/70 to-indigo-950/60 border border-blue-500/40 space-y-2.5 text-left shadow-lg shadow-blue-950/40 relative">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Branded Short Link
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  16 Chars (-81%)
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-blue-500/30 overflow-hidden">
                <p className="text-xs sm:text-sm font-mono font-bold text-white truncate">
                  <span className="text-blue-400">https://</span>
                  <span className="text-white">link.pulse/</span>
                  <span className="text-cyan-300">summer26</span>
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 hover:text-white border border-blue-400/30 transition-all shrink-0 cursor-pointer"
                  title="Copy smart link"
                  aria-label="Copy smart link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-blue-300/80 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> SSL Active
                </span>
                <span>•</span>
                <span>Geo Telemetry</span>
                <span>•</span>
                <span>QR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

