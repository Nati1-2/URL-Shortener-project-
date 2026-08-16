"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";

export const UrlTransformationAnimation: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 sm:px-6">
      <div className="p-1 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
          {/* Animated beam background */}
          <div className="absolute inset-0 bg-mesh-pattern opacity-20 pointer-events-none" />

          {/* Long URL representation */}
          <div className="flex-1 w-full p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1.5 text-left shadow-inner">
            <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
              Raw Destination URL (84 Chars)
            </span>
            <p className="text-xs font-mono text-slate-300 truncate">
              https://acme.inc/blog/product-release-summer-2026-announcement-v2?utm_source=twitter
            </p>
          </div>

          {/* Sparkle Connector */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-xl shadow-blue-500/40 shrink-0 z-10 border border-white/30"
          >
            <Zap className="w-6 h-6 fill-current text-white" />
          </motion.div>

          {/* Short URL representation */}
          <div className="flex-1 w-full p-4 rounded-2xl bg-blue-950/80 border border-blue-500/50 space-y-1.5 text-left shadow-inner">
            <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Shortened & Branded (14 Chars)
            </span>
            <p className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
              https://<span className="text-blue-400">ly.nk/summer26</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
