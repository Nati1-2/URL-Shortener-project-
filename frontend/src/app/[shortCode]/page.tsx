"use client";

import { useEffect, useState, use } from "react";
import { linkService } from "@/services/link.service";
import Link from "next/link";
import { ExternalLink, Link2Off, ArrowLeft, Loader2 } from "lucide-react";
import { Link as LinkType } from "@/types";

export default function DynamicShortLinkPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = use(params);
  const [status, setStatus] = useState<"loading" | "redirecting" | "not_found" | "inactive">("loading");
  const [targetUrl, setTargetUrl] = useState<string>("");

  useEffect(() => {
    if (!shortCode) return;

    async function resolve() {
      try {
        const link = await linkService.resolveShortCode(shortCode);
        if (!link) {
          setStatus("not_found");
          return;
        }

        if (link.status !== "active") {
          setStatus("inactive");
          return;
        }

        let dest = link.originalUrl;
        if (!dest.startsWith("http://") && !dest.startsWith("https://")) {
          dest = "https://" + dest;
        }

        setTargetUrl(dest);
        setStatus("redirecting");

        const timer = setTimeout(() => {
          window.location.href = dest;
        }, 1000);

        return () => clearTimeout(timer);
      } catch {
        setStatus("not_found");
      }
    }

    resolve();
  }, [shortCode]);

  if (status === "loading" || status === "redirecting") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl flex flex-col items-center gap-4 glass-card">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold">Redirecting...</h1>
          <p className="text-slate-400 text-xs">
            Routing to <span className="text-blue-400 font-mono break-all">{targetUrl || shortCode}</span>
          </p>
          {targetUrl && (
            <a
              href={targetUrl}
              className="mt-2 inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              Click here if not redirected automatically <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl flex flex-col items-center gap-4 glass-card">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <Link2Off className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">
          {status === "not_found" ? "Short Link Not Found" : "Link Disabled or Expired"}
        </h1>
        <p className="text-slate-400 text-xs">
          The link <span className="font-mono text-slate-200">/{shortCode}</span> {status === "not_found" ? "does not exist or was deleted." : "is currently inactive."}
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/25"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
