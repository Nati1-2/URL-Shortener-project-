import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient" | "glow";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98] select-none cursor-pointer overflow-hidden";

    const variants = {
      primary:
        "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 border border-blue-400/20 hover:-translate-y-0.5",
      secondary:
        "bg-slate-100 hover:bg-slate-200/90 text-slate-900 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 hover:-translate-y-0.5 shadow-sm",
      outline:
        "border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:-translate-y-0.5",
      ghost:
        "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60",
      danger:
        "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 border border-rose-400/20 hover:-translate-y-0.5",
      gradient:
        "bg-brand-gradient hover:opacity-95 text-white shadow-lg shadow-blue-600/25 hover:shadow-indigo-500/35 border border-white/20 hover:-translate-y-0.5",
      glow:
        "bg-brand-gradient text-white shadow-lg shadow-blue-500/30 hover:shadow-indigo-500/40 border border-white/20 hover:-translate-y-0.5 hover:brightness-105",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
      md: "h-10 px-4 text-xs sm:text-sm gap-2 rounded-xl",
      lg: "h-12 px-6 text-sm sm:text-base gap-2.5 rounded-xl font-bold",
      xl: "h-14 px-8 text-base sm:text-lg font-extrabold gap-3 rounded-2xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
