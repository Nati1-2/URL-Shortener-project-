import React from "react";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Link2 className="w-6 h-6 text-blue-500" />,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`py-12 sm:py-16 text-center space-y-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
        {icon}
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>

      {actionText && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="gradient" size="sm">
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button variant="gradient" size="sm" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
