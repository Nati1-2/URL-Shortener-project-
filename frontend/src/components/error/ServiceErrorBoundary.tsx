"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ServiceErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ServiceErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title={this.props.fallbackTitle || "Service Temporarily Unavailable"}
          message={
            this.props.fallbackMessage ||
            this.state.error?.message ||
            "Failed to load this module. Other parts of the platform remain fully operational."
          }
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
