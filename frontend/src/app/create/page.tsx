"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import {
  Link2,
  Sparkles,
  Copy,
  Check,
  QrCode,
  Lock,
  Clock,
  Globe,
  Sliders,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useCreateLink } from "@/hooks/useLinks";
import { useDomains } from "@/hooks/useDomains";
import { useToastStore } from "@/store/useToastStore";
import { linkService } from "@/services/link.service";
import { DOMAINS } from "@/lib/constants";
import { Link as LinkType } from "@/types";
import { RevealOnScroll } from "@/components/animation/ScrollReveal";

export default function CreateUrlPage() {
  const router = useRouter();
  const createMutation = useCreateLink();
  const { data: customDomains } = useDomains();
  const { addToast } = useToastStore();

  // Form State
  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [domain, setDomain] = useState("ly.nk");
  const [customSlug, setCustomSlug] = useState("");
  const [tags, setTags] = useState("Marketing, Campaign");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  // Advanced Options State
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");

  // QR Studio Customization
  const [qrFgColor, setQrFgColor] = useState("#0f172a");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");

  // Created State
  const [createdLink, setCreatedLink] = useState<LinkType | null>(null);
  const [copied, setCopied] = useState(false);

  // Live Slug Check
  useEffect(() => {
    if (!customSlug.trim()) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const timeoutId = setTimeout(async () => {
      try {
        const res = await linkService.checkSlugAvailability(customSlug.trim(), domain);
        setSlugStatus(res.available ? "available" : "taken");
      } catch {
        setSlugStatus("available");
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [customSlug, domain]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith("http://") || text.startsWith("https://")) {
        setOriginalUrl(text);
        addToast({ type: "info", title: "Pasted from clipboard" });
      }
    } catch {
      // ignore clipboard error
    }
  };

  // Build full destination URL with UTM params
  const computeFinalDestinationUrl = (): string => {
    if (!originalUrl) return "";
    try {
      const url = new URL(originalUrl.startsWith("http") ? originalUrl : `https://${originalUrl}`);
      if (utmSource) url.searchParams.set("utm_source", utmSource);
      if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
      if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
      return url.toString();
    } catch {
      return originalUrl;
    }
  };

  const handleDownloadQrSvg = () => {
    const svgElement = document.getElementById("qr-preview-svg");
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qrcode-${customSlug || "shortlink"}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({ type: "success", title: "QR Code Vector SVG Downloaded" });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) {
      addToast({ type: "warning", title: "Please enter a destination URL" });
      return;
    }

    let finalTitle = title.trim();
    if (!finalTitle) {
      try {
        finalTitle = new URL(originalUrl).hostname;
      } catch {
        finalTitle = "Shortened Link";
      }
    }

    const finalOriginalUrl = computeFinalDestinationUrl();

    createMutation.mutate(
      {
        title: finalTitle,
        originalUrl: finalOriginalUrl,
        shortCode: customSlug.trim() || undefined,
        domain: domain || "ly.nk",
        status: isPasswordProtected ? "password_protected" : "active",
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        password: isPasswordProtected ? password : undefined,
        expiresAt: hasExpiration ? expirationDate : undefined,
        utmSource,
        utmMedium,
        utmCampaign,
        qrSettings: {
          fgColor: qrFgColor,
          bgColor: qrBgColor,
        },
      },
      {
        onSuccess: (newLink) => {
          setCreatedLink(newLink);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        },
      }
    );
  };

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(`https://${createdLink.shortUrl}`);
      setCopied(true);
      addToast({ type: "success", title: "Copied link to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const domainOptions = [
    ...DOMAINS,
    ...(customDomains?.filter((d) => d.status === "verified").map((d) => ({ value: d.hostname, label: d.hostname })) || []),
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Header Title */}
          <RevealOnScroll direction="up" delay={0.02}>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Create New Short URL
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Shorten links, attach custom domains, configure redirect logic, and generate vector QR codes.
              </p>
            </div>
          </RevealOnScroll>

          {/* Creation Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Creation Inputs */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleCreate} className="space-y-6">
                {/* Destination URL Input Card */}
                <RevealOnScroll direction="up" delay={0.06}>
                  <Card className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-blue-500" />
                      <span>Destination Link Details</span>
                    </h3>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Destination URL *
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="https://yourbrand.com/long-landing-page-url..."
                          value={originalUrl}
                          onChange={(e) => setOriginalUrl(e.target.value)}
                          required
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={handlePaste}>
                          Paste
                        </Button>
                      </div>
                    </div>

                    <Input
                      label="Link Title (Optional)"
                      type="text"
                      placeholder="e.g. Summer Campaign 2026 Promo"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      helperText="Human-readable label for internal dashboard identification."
                    />
                  </Card>
                </RevealOnScroll>

                {/* Domain & Custom Slug Card */}
                <RevealOnScroll direction="up" delay={0.1}>
                  <Card className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-500" />
                      <span>Domain & Custom Alias</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Domain
                        </label>
                        <select
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          className="w-full h-11 px-3.5 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                        >
                          {domainOptions.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Custom Slug / Alias
                          </label>
                          {slugStatus === "checking" && (
                            <span className="text-[10px] text-slate-400">Checking...</span>
                          )}
                          {slugStatus === "available" && (
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Available
                            </span>
                          )}
                          {slugStatus === "taken" && (
                            <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3" /> Taken
                            </span>
                          )}
                        </div>
                        <Input
                          placeholder="e.g. summer-sale"
                          value={customSlug}
                          onChange={(e) =>
                            setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                          }
                          helperText="Leave empty for auto-generated short code."
                        />
                      </div>
                    </div>

                    <Input
                      label="Tags (Comma separated)"
                      type="text"
                      placeholder="Marketing, Promo, Twitter"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </Card>
                </RevealOnScroll>

                {/* Advanced Security & Targeting Rules */}
                <RevealOnScroll direction="up" delay={0.14}>
                  <Card className="space-y-5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-purple-500" />
                      <span>Security & UTM Builder</span>
                    </h3>

                    {/* Password Protection */}
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Switch
                        checked={isPasswordProtected}
                        onChange={setIsPasswordProtected}
                        label="Password Protection"
                        description="Require visitors to enter a passcode before redirecting."
                      />
                      {isPasswordProtected && (
                        <Input
                          type="password"
                          placeholder="Set access password..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                        />
                      )}
                    </div>

                    {/* Expiration Date */}
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Switch
                        checked={hasExpiration}
                        onChange={setHasExpiration}
                        label="Link Expiration Date"
                        description="Set automatic link shutdown timestamp."
                      />
                      {hasExpiration && (
                        <Input
                          type="datetime-local"
                          value={expirationDate}
                          onChange={(e) => setExpirationDate(e.target.value)}
                          leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
                        />
                      )}
                    </div>

                    {/* UTM Builder */}
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        UTM Campaign Builder
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input
                          placeholder="Source (e.g. twitter)"
                          value={utmSource}
                          onChange={(e) => setUtmSource(e.target.value)}
                        />
                        <Input
                          placeholder="Medium (e.g. social)"
                          value={utmMedium}
                          onChange={(e) => setUtmMedium(e.target.value)}
                        />
                        <Input
                          placeholder="Campaign (e.g. summer26)"
                          value={utmCampaign}
                          onChange={(e) => setUtmCampaign(e.target.value)}
                        />
                      </div>

                      {/* Live Full URL Preview */}
                      {(utmSource || utmMedium || utmCampaign) && (
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all">
                          <span className="text-blue-500 font-bold block mb-1">Target with UTMs:</span>
                          {computeFinalDestinationUrl()}
                        </div>
                      )}
                    </div>
                  </Card>
                </RevealOnScroll>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="glow"
                  size="xl"
                  isLoading={createMutation.isPending}
                  className="w-full font-bold text-lg shadow-xl cursor-pointer"
                  rightIcon={<Sparkles className="w-5 h-5" />}
                >
                  Create & Generate Link
                </Button>
              </form>
            </div>

            {/* Right Col: Live Preview & QR Studio */}
            <div className="space-y-6">
              {/* QR Code Customizer */}
              <RevealOnScroll direction="up" delay={0.08}>
                <Card className="space-y-4 text-center">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-500" />
                    <span>Dynamic QR Code Preview</span>
                  </h3>

                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md inline-block">
                    <QRCodeSVG
                      id="qr-preview-svg"
                      value={`https://${domain}/${customSlug || "preview-slug"}`}
                      size={160}
                      fgColor={qrFgColor}
                      bgColor={qrBgColor}
                      level="H"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400">Foreground</label>
                      <input
                        type="color"
                        value={qrFgColor}
                        onChange={(e) => setQrFgColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400">Background</label>
                      <input
                        type="color"
                        value={qrBgColor}
                        onChange={(e) => setQrBgColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadQrSvg}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      className="w-full text-xs font-semibold"
                    >
                      Download Vector SVG
                    </Button>
                  </div>
                </Card>
              </RevealOnScroll>

              {/* Created Success Box */}
              {createdLink && (
                <Card className="space-y-4 border-2 border-blue-500/40 bg-blue-500/5 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Link Active & Live
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                      https://{createdLink.shortUrl}
                    </h4>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopy}
                      variant={copied ? "primary" : "secondary"}
                      size="sm"
                      className="flex-1"
                      leftIcon={copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    >
                      {copied ? "Copied!" : "Copy Short Link"}
                    </Button>
                    <Link href={`/links/${createdLink.id}`}>
                      <Button variant="glow" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

