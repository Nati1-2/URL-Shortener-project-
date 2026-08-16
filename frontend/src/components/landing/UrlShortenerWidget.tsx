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
  ArrowRight,
  ExternalLink,
  Sliders,
  Download,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToastStore } from "@/store/useToastStore";
import { DOMAINS } from "@/lib/constants";

export const UrlShortenerWidget: React.FC = () => {
  const { addToast } = useToastStore();
  const [longUrl, setLongUrl] = useState("");
  const [domain, setDomain] = useState("ly.nk");
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
          // ignore parsing error
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
    }, 700);
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
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Glow ambient background accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleShorten} className="space-y-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Paste your long link (e.g. https://github.com/my-project)..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                leftIcon={<Link2 className="w-5 h-5 text-blue-500" />}
                className="h-13 text-base shadow-inner bg-white/70 dark:bg-slate-900/70"
              />
            </div>
            <Button
              type="submit"
              variant="glow"
              size="lg"
              isLoading={isShortening}
              rightIcon={<Sparkles className="w-4 h-4" />}
              className="sm:w-auto h-13 px-8 text-base font-bold shrink-0"
            >
              Shorten URL
            </Button>
          </div>

          {/* Quick Domain, Alias & UTM Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Domain:</span>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  {DOMAINS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Custom Slug:</span>
                <input
                  type="text"
                  placeholder="e.g. launch26"
                  value={alias}
                  onChange={(e) =>
                    setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  }
                  className="w-32 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? "Hide UTM Tags" : "+ Add UTM Campaign"}</span>
            </button>
          </div>

          {/* Advanced UTM Drawer */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 animate-fadeIn">
              <input
                type="text"
                placeholder="UTM Source (e.g. twitter, newsletter)"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
              <input
                type="text"
                placeholder="UTM Campaign (e.g. q3-launch)"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          )}
        </form>

        {/* Shortened Result Box */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 15 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Shortened & Ready
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-[220px]">
                      {result.originalUrl}
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                    https://<span className="text-blue-500">{result.shortUrl}</span>
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
                    variant={copied ? "primary" : "gradient"}
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
              value={result ? `https://${result.shortUrl}` : "https://ly.nk/demo"}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-xs font-mono text-slate-400">
            {result ? `https://${result.shortUrl}` : "https://ly.nk/demo"}
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
