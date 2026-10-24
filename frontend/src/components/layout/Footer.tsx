"use client";

import React from "react";
import Link from "next/link";
import { Link2, Github, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100/90 dark:bg-[#05080f] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800/60">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-lg border border-white/20">
                <Link2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Enterprise-grade link shortening, custom domain management, dynamic QR code studio, and real-time conversion telemetry platform.
            </p>
            <div className="pt-2 flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <a
                href="#"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-white hover:scale-105 transition-all shadow-sm"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-white hover:scale-105 transition-all shadow-sm"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-white hover:scale-105 transition-all shadow-sm"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link href="/register" className="hover:text-blue-600 dark:hover:text-white transition-colors">URL Shortener</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">QR Code Generator</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Click Telemetry</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Custom Domains</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Resources & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform & Access
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link href="/login" className="hover:text-blue-600 dark:hover:text-white transition-colors">Sign In to Dashboard</Link></li>
              <li><Link href="/register" className="hover:text-blue-600 dark:hover:text-white transition-colors">Create Free Account</Link></li>
              <li><a href="/#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Platform Features</a></li>
              <li><a href="/#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Enterprise SLA</Link></li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Subscribe to get product updates and telemetry growth insights.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full h-10 px-3.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <Button variant="glow" size="sm" className="w-full text-xs font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {APP_NAME} SaaS Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/pricing" className="hover:text-slate-900 dark:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/pricing" className="hover:text-slate-900 dark:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/pricing" className="hover:text-slate-900 dark:text-slate-300 transition-colors">Security Overview</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
