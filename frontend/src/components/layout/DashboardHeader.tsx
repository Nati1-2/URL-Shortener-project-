"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";

export const DashboardHeader: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="relative max-w-md w-full hidden sm:block">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search links, aliases, domains or tags... (Ctrl+K)"
          className="w-full h-9 pl-10 pr-12 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Create CTA */}
        <Link href="/create">
          <Button variant="gradient" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create Link
          </Button>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xl z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Notifications
                </h4>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Link <code className="text-blue-500">ly.nk/summer26</code> hit 14k clicks!
                    </p>
                    <span className="text-[10px] text-slate-400">10 minutes ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <ExternalLink className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Custom domain SSL Certificate renewed.
                    </p>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/30"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline-block">
              {user?.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Link
                href="/settings"
                onClick={() => setShowUserMenu(false)}
                className="block px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Profile & Settings
              </Link>
              <Link
                href="/pricing"
                onClick={() => setShowUserMenu(false)}
                className="block px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Upgrade to Pro
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              <Link
                href="/login"
                onClick={() => setShowUserMenu(false)}
                className="block px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
