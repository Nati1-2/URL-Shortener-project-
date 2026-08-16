"use client";

import React, { useState } from "react";
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
  Share2,
  Lock,
  Clock,
  Globe,
  Settings,
  ArrowRight,
  Download,
  ShieldAlert,
  Sliders,
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
import { DOMAINS } from "@/lib/constants";
import { Link as LinkType } from "@/types";

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

    createMutation.mutate(
      {
        title: finalTitle,
        originalUrl,
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
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Create New Short URL
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Shorten links, attach custom domains, configure redirect logic, and generate vector QR codes.
            </p>
          </div>

          {/* Creation Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Creation Inputs */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleCreate} className="space-y-6">
                {/* Destination URL Input Card */}
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

                {/* Domain & Custom Slug Card */}
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
                        className="w-full h-11 px-3.5 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      >
                        {domainOptions.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Custom Slug / Alias"
                      type="text"
                      placeholder="e.g. summer-sale"
                      value={customSlug}
                      onChange={(e) =>
                        setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                      }
                      helperText="Leave empty for auto-generated short code."
                    />
                  </div>

                  <Input
                    label="Tags (Comma separated)"
                    type="text"
                    placeholder="Marketing, Promo, Twitter"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </Card>

                {/* Advanced Security & Targeting Rules */}
                <Card className="space-y-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-purple-500" />
                    <span>Security & Targeting Rules</span>
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
                      UTM Parameter Builder
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
                  </div>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="glow"
                  size="xl"
                  isLoading={createMutation.isPending}
                  className="w-full font-bold text-lg shadow-xl"
                  rightIcon={<Sparkles className="w-5 h-5" />}
                >
                  Create & Generate Link
                </Button>
              </form>
            </div>

            {/* Right Col: Live Preview & QR Studio */}
            <div className="space-y-6">
              {/* QR Code Customizer */}
              <Card className="space-y-4 text-center">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-500" />
                  <span>Dynamic QR Code Preview</span>
                </h3>

                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md inline-block">
                  <QRCodeSVG
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
              </Card>

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
