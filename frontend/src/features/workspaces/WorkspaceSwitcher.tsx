"use client";

import React, { useState, useRef, useEffect } from "react";
import { Building2, Check, ChevronDown, Plus, Shield } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useUIStore } from "@/store/useUIStore";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export const WorkspaceSwitcher: React.FC = () => {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { activeWorkspaceId, setActiveWorkspaceId } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeWorkspace =
    workspaces?.find((w) => w.id === activeWorkspaceId) || workspaces?.[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
          <Building2 className="w-3.5 h-3.5" />
        </div>
        <span className="max-w-[120px] truncate">{activeWorkspace?.name || "Workspace"}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 p-2 shadow-2xl bg-white/95 dark:bg-slate-900/95 z-50 animate-fadeIn">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Switch Workspace
            </p>
          </div>

          <div className="py-1 space-y-1">
            {workspaces?.map((ws) => {
              const isSelected = ws.id === activeWorkspace?.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspaceId(ws.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      {ws.name.charAt(0)}
                    </div>
                    <span className="truncate">{ws.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                      {ws.currentUserRole}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Workspace</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
