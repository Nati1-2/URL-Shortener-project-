import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { ENV } from "@/config/env";
import { PRICING_PLANS } from "@/lib/constants";
import {
  PricingPlan,
  Subscription,
  Invoice,
  ApiResponse,
} from "@/types";

export const billingService = {
  async getPlans(): Promise<PricingPlan[]> {
    if (ENV.USE_MOCK_API) {
      return PRICING_PLANS.map((p) => ({
        ...p,
        limits: {
          monthlyClicks: p.id === "free" ? 1000 : p.id === "pro" ? 100000 : 10000000,
          activeLinks: p.id === "free" ? 50 : 100000,
          customDomains: p.id === "free" ? 0 : p.id === "pro" ? 3 : 100,
          teamMembers: p.id === "free" ? 1 : p.id === "pro" ? 5 : 50,
        },
      }));
    }
    const res = await apiClient.get<ApiResponse<PricingPlan[]>>(API_ROUTES.BILLING.PLANS);
    return res.data;
  },

  async getSubscription(workspaceId: string = "ws_main"): Promise<Subscription> {
    if (ENV.USE_MOCK_API) {
      return {
        id: "sub_101",
        workspaceId,
        planId: "pro",
        planName: "Pro Growth Plan",
        status: "active",
        currentPeriodEnd: "2026-09-14T00:00:00.000Z",
        cancelAtPeriodEnd: false,
        monthlyClicksLimit: 50000,
        usedClicksCurrentPeriod: 14230,
      };
    }
    const res = await apiClient.get<ApiResponse<Subscription>>(API_ROUTES.BILLING.SUBSCRIPTION, {
      params: { workspaceId },
    });
    return res.data;
  },

  async createCheckoutSession(planId: string, isYearly: boolean): Promise<{ checkoutUrl: string }> {
    if (ENV.USE_MOCK_API) {
      return { checkoutUrl: "/dashboard?checkout=success" };
    }
    const res = await apiClient.post<ApiResponse<{ checkoutUrl: string }>>(
      API_ROUTES.BILLING.CHECKOUT,
      { planId, isYearly }
    );
    return res.data;
  },

  async openBillingPortal(): Promise<{ portalUrl: string }> {
    if (ENV.USE_MOCK_API) {
      return { portalUrl: "/settings" };
    }
    const res = await apiClient.post<ApiResponse<{ portalUrl: string }>>(API_ROUTES.BILLING.PORTAL);
    return res.data;
  },
};
