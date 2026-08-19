"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Link2, Eye, EyeOff, Lock, Mail, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLogin } from "@/hooks/useAuth";
import { useToastStore } from "@/store/useToastStore";
import { RevealOnScroll } from "@/components/animation/ScrollReveal";

export default function LoginPage() {
  const loginMutation = useLogin();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState("alex.vance@acme.inc");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }
    setErrorMsg("");

    loginMutation.mutate(
      { email, password, rememberMe },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Welcome back!",
            message: "Signed in to LinkPulse dashboard.",
          });
        },
        onError: (err: any) => {
          setErrorMsg(err?.message || "Invalid credentials. Please try again.");
        },
      }
    );
  };

  const handleForgotPassword = () => {
    addToast({
      type: "info",
      title: "Password Reset Link Sent",
      message: `Instructions were sent to ${email}`,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        <RevealOnScroll direction="down" delay={0.05} duration={0.6}>
          {/* Header Logo */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lg border border-white/20">
                <Link2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
                Link<span className="text-gradient">Pulse</span>
              </span>
            </Link>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign in to your workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your short link vault and real-time telemetry.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={0.1} duration={0.65}>
          {/* Card Form */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl bg-white/95 dark:bg-slate-900/95 space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Work Email Address"
                type="email"
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="glow"
                size="lg"
                isLoading={loginMutation.isPending}
                className="w-full text-base font-bold cursor-pointer"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Dashboard
              </Button>
            </form>

            {/* Social Sign-in Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400 shrink-0">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                className="text-xs"
              >
                Google SSO
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                leftIcon={<Github className="w-4 h-4" />}
                className="text-xs"
              >
                GitHub
              </Button>
            </div>
          </div>
        </RevealOnScroll>

        {/* Footer Link */}
        <RevealOnScroll direction="up" delay={0.15}>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Create a free account
            </Link>
          </p>
        </RevealOnScroll>
      </div>
    </div>
  );
}
