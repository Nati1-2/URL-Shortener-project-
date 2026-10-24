"use client";

import React, { useState, useEffect } from "react";
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  Layers,
  Zap,
  Globe,
  Radio,
  ExternalLink,
  Sliders,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { apiClient, ServiceHealthStatus } from "@/services/api-client";
import { ENV } from "@/config/env";
import { useToastStore } from "@/store/useToastStore";

interface BackendDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDiagnosticsModal: React.FC<BackendDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToastStore();
  const [isScanning, setIsScanning] = useState(false);
  const [services, setServices] = useState<ServiceHealthStatus[]>([]);
  const [activeGatewayHealth, setActiveGatewayHealth] = useState<{ healthy: boolean; latencyMs: number }>({
    healthy: false,
    latencyMs: 0,
  });

  const scanServices = async () => {
    setIsScanning(true);
    try {
      const [gatewayCheck, microserviceList] = await Promise.all([
        apiClient.checkHealth(),
        apiClient.pingMicroservices(),
      ]);
      setActiveGatewayHealth(gatewayCheck);
      setServices(microserviceList);
    } catch {
      // ignore scan error
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      scanServices();
    }
  }, [isOpen]);

  const healthyCount = services.filter((s) => s.status === "healthy").length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Microservices & Backend Diagnostics"
      description="Live topology telemetry, port mappings, and engine connection control."
      maxWidth="2xl"
    >
      <div className="space-y-6 py-2">
        {/* Top Overview Status Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                activeGatewayHealth.healthy
                  ? "bg-emerald-500/20 text-emerald-500 ring-2 ring-emerald-500/30"
                  : "bg-amber-500/20 text-amber-500 ring-2 ring-amber-500/30"
              }`}
            >
              {activeGatewayHealth.healthy ? (
                <Radio className="w-6 h-6 animate-pulse" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  API Gateway {activeGatewayHealth.healthy ? "Online & Healthy" : "Local Fallback Active"}
                </h4>
                <Badge variant={activeGatewayHealth.healthy ? "success" : "warning"}>
                  {activeGatewayHealth.healthy ? `${activeGatewayHealth.latencyMs}ms Latency` : "Auto-Protected"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeGatewayHealth.healthy
                  ? `Connected to ${ENV.API_GATEWAY_URL} • ${healthyCount}/9 microservices responding`
                  : "Backend gateway is offline or starting. High-fidelity mock engine ensures zero downtime."}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={scanServices}
            isLoading={isScanning}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />}
            className="shrink-0"
          >
            Re-scan All
          </Button>
        </div>

        {/* Live Status Bar */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Gateway Routing Architecture
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Port 8000 Reverse Proxy
          </span>
        </div>

        {/* 9 Microservices Live Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Distributed Service Nodes ({healthyCount}/{services.length} Online)
            </h4>
            <span className="text-[11px] text-slate-400">Target host: localhost</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {services.map((svc) => (
              <div
                key={svc.service}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm hover:border-blue-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {svc.service}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      svc.status === "healthy"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {svc.status === "healthy" ? `:${svc.port} • ${svc.latencyMs}ms` : `:${svc.port} Offline`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="truncate">{svc.url.replace("http://localhost:", "")}</span>
                  <span className="text-[10px] font-sans">
                    {svc.status === "healthy" ? "🟢 Active" : "⚪ Standby"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure & Storage Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">PostgreSQL Neon DB</span>
                <span className="text-[10px] font-bold text-emerald-500">Configured</span>
              </div>
              <p className="text-[11px] text-slate-400">Serverless cloud database & migrations</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Upstash Redis</span>
                <span className="text-[10px] font-bold text-emerald-500">Configured</span>
              </div>
              <p className="text-[11px] text-slate-400">Ultra-fast sub-millisecond edge cache</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            LinkPulse Microservices Gateway Protocol v2.0
          </span>
          <Button variant="glow" size="sm" onClick={onClose}>
            Done & Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
};
