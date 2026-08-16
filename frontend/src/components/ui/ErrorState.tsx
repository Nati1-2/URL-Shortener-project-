import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message = "A microservice communication error occurred. Please try again.",
  onRetry,
  isRetrying = false,
  className = "",
}) => {
  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border border-red-500/30 bg-red-500/5 text-center space-y-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />}
        >
          {isRetrying ? "Retrying..." : "Retry Connection"}
        </Button>
      )}
    </div>
  );
};
