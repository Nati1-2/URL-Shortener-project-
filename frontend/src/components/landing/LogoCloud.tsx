"use client";

import React from "react";

export const LogoCloud: React.FC = () => {
  const logos = [
    { name: "VERCEL", font: "font-black tracking-widest" },
    { name: "STRIPE", font: "font-extrabold tracking-wider" },
    { name: "LINEAR", font: "font-bold tracking-tight" },
    { name: "NOTION", font: "font-extrabold tracking-normal" },
    { name: "SUPABASE", font: "font-black tracking-wider" },
    { name: "OPENAI", font: "font-bold tracking-widest" },
  ];

  return (
    <section className="py-16 border-y border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Trusted by growth teams at world-class companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          {logos.map((logo, idx) => (
            <span
              key={idx}
              className={`text-xl sm:text-2xl text-slate-700 dark:text-slate-300 ${logo.font}`}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
