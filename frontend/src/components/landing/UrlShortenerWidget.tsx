"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import {
  Link2,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Sliders,
  Download,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToastStore } from "@/store/useToastStore";

export const UrlShortenerWidget: React.FC = () => {
  const { addToast } = useToastStore();
  const [longUrl, setLongUrl] = useState("");
  const [domain, setDomain] = useState("lynk.link");
  const [alias, setAlias] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; originalUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) {
      addToast({
        type: "warning",
        title: "Please enter a destination URL",
        message: "Paste your link to create a short branded URL.",
      });
      return;
    }

    setIsShortening(true);

    setTimeout(() => {
      let finalLongUrl = longUrl.trim();
      if (!finalLongUrl.startsWith("http://") && !finalLongUrl.startsWith("https://")) {
        finalLongUrl = "https://" + finalLongUrl;
      }

      if (utmSource || utmCampaign) {
        try {
          const urlObj = new URL(finalLongUrl);
          if (utmSource) urlObj.searchParams.set("utm_source", utmSource);
          if (utmCampaign) urlObj.searchParams.set("utm_campaign", utmCampaign);
          finalLongUrl = urlObj.toString();
        } catch {
          // ignore
        }
      }

      const slug = alias.trim() || Math.random().toString(36).substring(2, 8);
      const generatedShort = `${domain}/${slug}`;
      setResult({ shortUrl: generatedShort, originalUrl: finalLongUrl });
      setIsShortening(false);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      addToast({
        type: "success",
        title: "URL Shortened Successfully!",
        message: `https://${generatedShort}`,
      });
    }, 500);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(`https://${result.shortUrl}`);
      setCopied(true);
      addToast({
        type: "success",
        title: "Copied to Clipboard",
        message: `https://${result.shortUrl}`,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Container */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 relative backdrop-blur-2xl transition-all duration-300">
        <form onSubmit={handleShorten} className="space-y-6">
          {/* Row 1: Long URL Input + Shorten Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none">
                <Link2 className="w-5 h-5 rotate-[-45deg]" />
              </div>
              <input
                type="url"
                placeholder="Paste your destination URL (e.g. https://mybrand.com/launch)..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-sm sm:text-base bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="glow"
              size="lg"
              isLoading={isShortening}
              rightIcon={<Sparkles className="w-4 h-4" />}
              className="h-14 px-8 text-base font-bold shrink-0 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              Shorten URL
            </Button>
          </div>

          {/* Row 2: 3 Columns (Domain, Custom Slug, Add UTM Campaign) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-1">
            {/* Domain Dropdown */}
            <div className="sm:col-span-4 space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Domain
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none">
                  <Globe className="w-4 h-4" />
                </div>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full h-12 pl-10 pr-10 text-xs sm:text-sm font-semibold bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm cursor-pointer"
                >
                  <option value="lynk.link">lynk.link (Default)</option>
                  <option value="ly.nk">ly.nk (Fast Edge)</option>
                  <option value="link.dev">link.dev (Developer)</option>
                  <option value="go.bio">go.bio (Social Bio)</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Custom Slug Input */}
            <div className="sm:col-span-4 space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Custom Slug <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. launch26"
                value={alias}
                onChange={(e) =>
                  setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                className="w-full h-12 px-4 text-xs sm:text-sm font-semibold bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Add UTM Campaign Button */}
            <div className="sm:col-span-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full h-12 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50/70 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span>{showAdvanced ? "Hide UTM Tags" : "Add UTM Campaign"}</span>
              </button>
            </div>
          </div>

          {/* Advanced UTM Drawer */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-left"
              >
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">UTM Source</label>
                  <input
                    type="text"
                    placeholder="e.g. twitter, newsletter"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">UTM Campaign</label>
                  <input
                    type="text"
                    placeholder="e.g. q3-launch"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Shortened Result Box */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 15 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Shortened & Ready
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                      {result.originalUrl}
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                    https://<span className="text-blue-600 dark:text-blue-400">{result.shortUrl}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    onClick={() => setShowQrModal(true)}
                    variant="outline"
                    size="sm"
                    leftIcon={<QrCode className="w-4 h-4" />}
                  >
                    QR Code
                  </Button>

                  <Button
                    onClick={handleCopy}
                    variant={copied ? "primary" : "glow"}
                    size="sm"
                    leftIcon={
                      copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />
                    }
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Code Modal Preview */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title="Dynamic QR Code"
        description="Scan with any phone camera to visit the destination URL instantly."
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl inline-block">
            <QRCodeSVG
              value={result ? `https://${result.shortUrl}` : "https://lynk.link/demo"}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-xs font-mono text-slate-500">
            {result ? `https://${result.shortUrl}` : "https://lynk.link/demo"}
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addToast({ type: "success", title: "Vector QR Code downloaded" });
                setShowQrModal(false);
              }}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Save Vector Image
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
