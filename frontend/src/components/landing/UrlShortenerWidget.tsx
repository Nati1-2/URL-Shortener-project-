"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Copy, Check, Sparkles, QrCode, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToastStore } from "@/store/useToastStore";
import { DOMAINS } from "@/lib/constants";

export const UrlShortenerWidget: React.FC = () => {
  const { addToast } = useToastStore();
  const [longUrl, setLongUrl] = useState("");
  const [domain, setDomain] = useState("ly.nk");
  const [alias, setAlias] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; originalUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) {
      addToast({ type: "warning", title: "Please enter a valid URL", message: "Paste a destination URL to shorten." });
      return;
    }
    setIsShortening(true);
    setTimeout(() => {
      const slug = alias.trim() || Math.random().toString(36).substring(2, 8);
      const generatedShort = `${domain}/${slug}`;
      setResult({ shortUrl: generatedShort, originalUrl: longUrl });
      setIsShortening(false);
      addToast({ type: "success", title: "URL Shortened!", message: `Created ${generatedShort}` });
    }, 900);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(`https://${result.shortUrl}`);
      setCopied(true);
      addToast({ type: "success", title: "Copied to Clipboard", message: `https://${result.shortUrl}` });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl bg-white/90 dark:bg-slate-900/90 relative overflow-hidden backdrop-blur-xl">
        {/* Glow backdrop accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleShorten} className="space-y-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Paste your long destination link here (e.g. https://mycompany.com/campaign)..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                leftIcon={<Link2 className="w-5 h-5 text-blue-500" />}
                className="h-13 text-base shadow-inner"
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isShortening}
              rightIcon={<Sparkles className="w-4 h-4" />}
              className="sm:w-auto h-13 px-7 text-base font-semibold shrink-0"
            >
              Shorten URL
            </Button>
          </div>

          {/* Optional Alias & Domain Selector */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Domain:</span>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                {DOMAINS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Alias (Optional):</span>
              <input
                type="text"
                placeholder="custom-slug"
                value={alias}
                onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              />
            </div>
          </div>
        </form>

        {/* Shortened Result Box */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 15 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      Shortened Ready
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-[220px]">
                      {result.originalUrl}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    https://<span className="text-blue-500">{result.shortUrl}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    onClick={handleCopy}
                    variant={copied ? "primary" : "secondary"}
                    size="md"
                    leftIcon={copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
