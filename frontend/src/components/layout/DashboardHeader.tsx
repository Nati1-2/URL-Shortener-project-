"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Check,
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { WorkspaceSwitcher } from "@/features/workspaces/WorkspaceSwitcher";
import { Button } from "@/components/ui/Button";

export const DashboardHeader: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();
  const { user, logout } = useAuthStore();
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-6 bg-white/80 dark:bg-[#080c14]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Multi-Tenant Workspace Switcher */}
      <div className="flex items-center gap-4">
        <WorkspaceSwitcher />

        {/* Global Search Input */}
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search links, aliases, domains... (Ctrl+K)"
            className="w-72 h-9 pl-10 pr-10 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Create CTA */}
        <Link href="/create">
          <Button variant="glow" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create Link
          </Button>
        </Link>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950" />
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 shadow-2xl z-50 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-[10px] font-semibold text-blue-500 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
                {notifications?.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markRead.mutate(notif.id)}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer flex items-start gap-2.5 ${
                      !notif.read
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex-1 space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{notif.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{notif.message}</p>
                      <span className="text-[9px] text-slate-400 font-mono">{notif.createdAt}</span>
                    </div>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                  </div>
                ))}
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
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Pill */}
        <div className="relative" ref={userMenuRef}>
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
            <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-card bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-2 shadow-2xl z-50 space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300 animate-fadeIn">
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
                Manage Subscription
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
