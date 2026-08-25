"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "@/components/ui/Toast";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes
            retry: (failureCount, error: any) => {
              // Don't retry on 404 or 401
              if (error?.status === 404 || error?.status === 401 || error?.status === 403) {
                return false;
              }
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const isProtectedRoute = [
          "/dashboard",
          "/links",
          "/create",
          "/analytics",
          "/settings",
        ].some((p) => pathname.startsWith(p));

        if (isProtectedRoute) {
          window.location.href = `/login?next=${encodeURIComponent(pathname)}`;
        }
      }
    };

    window.addEventListener("linkpulse:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("linkpulse:unauthorized", handleUnauthorized);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
    </QueryClientProvider>
  );
};
