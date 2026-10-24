"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Link2,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useSubscription } from "@/hooks/useBilling";
import { useLogout } from "@/hooks/useAuth";
import { APP_NAME } from "@/lib/constants";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { data: subscription } = useSubscription();

  const mainNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Short URL", href: "/create", icon: PlusCircle },
    { name: "Links Library", href: "/links", icon: Link2 },
    { name: "Click Analytics", href: "/analytics", icon: BarChart3 },
  ];

  const secondaryNav = [
    { name: "Pricing & Plans", href: "/pricing", icon: CreditCard },
    { name: "Workspace Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const usedClicks = subscription?.usedClicksCurrentPeriod || 14230;
  const limitClicks = subscription?.monthlyClicksLimit || 50000;
  const usagePercentage = Math.min(Math.round((usedClicks / limitClicks) * 100), 100);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen sticky top-0 bg-white dark:bg-[#080c14] border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 z-40 shrink-0 select-none",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-md z-50"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Sidebar Header Brand */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-900">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-md shrink-0 border border-white/20">
            <Link2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-tight">
                {APP_NAME}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">
                Enterprise SaaS
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Section */}
      <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {/* Main Section */}
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Main Menu
            </p>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                    )}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                  {isActive && (
                    <div className="absolute right-0 top-2 bottom-2 w-1 bg-blue-600 dark:bg-blue-400 rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System & Account */}
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Management
            </p>
          )}
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                    )}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Pro Card (if not collapsed) */}
        {!sidebarCollapsed && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 text-slate-800 dark:text-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>{subscription?.planName || "Pro Growth Plan"}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {usedClicks.toLocaleString()} / {limitClicks.toLocaleString()} monthly clicks used.
            </p>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
            >
              <span>Manage Limits</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-900">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50",
            sidebarCollapsed && "justify-center p-1.5"
          )}
        >
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/20 shrink-0"
          />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.name}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-blue-500 font-bold uppercase">{user?.role || "OWNER"}</span>
              </div>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
