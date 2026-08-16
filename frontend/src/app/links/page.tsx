"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Grid,
  List,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLinks, useDeleteLink, useBulkDeleteLinks } from "@/hooks/useLinks";
import { useToastStore } from "@/store/useToastStore";
import { formatNumber, formatDate, truncateUrl } from "@/lib/utils";
import {
  RevealOnScroll,
  StaggerGroup,
  StaggerItem,
} from "@/components/animation/ScrollReveal";

export default function LinksPage() {
  const { addToast } = useToastStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "clicks" | "title">("createdAt");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  // TanStack Query Hooks
  const { data, isLoading, isError, refetch } = useLinks({
    page,
    limit: 10,
    search,
    status,
    sortBy,
    sortOrder: "desc",
  });

  const deleteLinkMutation = useDeleteLink();
  const bulkDeleteMutation = useBulkDeleteLinks();

  const links = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopiedId(id);
    addToast({ type: "success", title: "Copied URL to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(links.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteModalId) {
      deleteLinkMutation.mutate(deleteModalId);
      setDeleteModalId(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      bulkDeleteMutation.mutate(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Title */}
          <RevealOnScroll direction="up" delay={0.02}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Links Library Vault
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Filter, search, organize, and manage your entire short link inventory.
                </p>
              </div>

              <Link href="/create">
                <Button variant="glow" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Create Short Link
                </Button>
              </Link>
            </div>
          </RevealOnScroll>

          {/* Search, Filter & Bulk Toolbar Card */}
          <RevealOnScroll direction="up" delay={0.06}>
            <Card className="space-y-4 p-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title, code, or destination URL..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-10 pl-10 pr-4 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                {/* Filters & View Switcher */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                      }}
                      className="h-9 px-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active Only</option>
                      <option value="password_protected">Password Protected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value as any);
                        setPage(1);
                      }}
                      className="h-9 px-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="clicks">Most Clicks</option>
                      <option value="title">Title (A-Z)</option>
                    </select>
                  </div>

                  {/* View Mode Switcher */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "table"
                          ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm"
                          : "text-slate-400"
                      }`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm"
                          : "text-slate-400"
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Action Bar */}
              {selectedIds.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-600 dark:text-blue-400 animate-fadeIn">
                  <span>{selectedIds.length} link(s) selected</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleBulkDelete}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Bulk Delete Selected
                  </Button>
                </div>
              )}
            </Card>
          </RevealOnScroll>

          {/* Links Data Display */}
          {isLoading ? (
            <Card className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </Card>
          ) : isError ? (
            <ErrorState
              title="Failed to fetch links library"
              message="Link microservice error. Please retry."
              onRetry={() => refetch()}
            />
          ) : links.length === 0 ? (
            <EmptyState
              title="No short links found"
              description="No links matched your search filter criteria."
              actionText="Create New Short Link"
              actionHref="/create"
            />
          ) : viewMode === "table" ? (
            <RevealOnScroll direction="up" delay={0.08}>
              <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                        <th className="py-3.5 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedIds.length === links.length && links.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-blue-600"
                          />
                        </th>
                        <th className="py-3.5 px-4">Title & Short URL</th>
                        <th className="py-3.5 px-4">Original Destination</th>
                        <th className="py-3.5 px-4">Clicks</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Created Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {links.map((link) => {
                        const isSelected = selectedIds.includes(link.id);
                        return (
                          <tr
                            key={link.id}
                            className={`hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors ${
                              isSelected ? "bg-blue-500/5" : ""
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelect(link.id)}
                                className="rounded border-slate-300 text-blue-600"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <Link
                                  href={`/links/${link.id}`}
                                  className="font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors block"
                                >
                                  {link.title}
                                </Link>
                                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                                  https://{link.shortUrl}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 dark:text-slate-400 font-mono">
                              {truncateUrl(link.originalUrl, 38)}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                              {formatNumber(link.clicks)}
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge
                                variant={
                                  link.status === "active"
                                    ? "success"
                                    : link.status === "password_protected"
                                    ? "purple"
                                    : "warning"
                                }
                              >
                                {link.status}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                              {formatDate(link.createdAt)}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(link.shortUrl, link.id)}
                                  title="Copy Short URL"
                                >
                                  {copiedId === link.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </Button>
                                <Link href={`/links/${link.id}`}>
                                  <Button variant="ghost" size="sm" title="Analytics Detail">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteModalId(link.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                                  title="Delete Link"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </RevealOnScroll>
          ) : (
            <StaggerGroup staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link) => (
                <StaggerItem key={link.id}>
                  <Card hoverEffect className="space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant={
                            link.status === "active"
                              ? "success"
                              : link.status === "password_protected"
                              ? "purple"
                              : "warning"
                          }
                        >
                          {link.status}
                        </Badge>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {formatNumber(link.clicks)} Clicks
                        </span>
                      </div>

                      <Link
                        href={`/links/${link.id}`}
                        className="font-bold text-base text-slate-900 dark:text-white hover:text-blue-500 transition-colors block line-clamp-2"
                      >
                        {link.title}
                      </Link>

                      <p className="font-mono text-xs text-blue-500 font-bold">
                        https://{link.shortUrl}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono line-clamp-1">
                        {link.originalUrl}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{formatDate(link.createdAt)}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(link.shortUrl, link.id)}
                        >
                          {copiedId === link.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Link href={`/links/${link.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}

          {/* Server-Side Pagination Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {links.length} of {pagination.total} total links
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        title="Confirm Delete Link"
        description="Are you sure you want to delete this short link? All routing and click data will be permanently removed."
      >
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={() => setDeleteModalId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
            Delete Short Link
          </Button>
        </div>
      </Modal>
    </div>
  );
}
