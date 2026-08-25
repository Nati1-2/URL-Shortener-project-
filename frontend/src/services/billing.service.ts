import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { PricingPlan, Subscription, ApiResponse } from "@/types";

/** Billing data always comes from the authenticated API; failures are surfaced to the UI. */
export const billingService = {
  async getPlans(): Promise<PricingPlan[]> {
    const res = await apiClient.get<ApiResponse<PricingPlan[]>>(API_ROUTES.BILLING.PLANS);
    return res.data;
  },

  async getSubscription(workspaceId: string = "ws_main"): Promise<Subscription> {
    const res = await apiClient.get<ApiResponse<Subscription>>(API_ROUTES.BILLING.SUBSCRIPTION, {
      params: { workspaceId },
    });
    return res.data;
  },

  async createCheckoutSession(planId: string, isYearly: boolean): Promise<{ checkoutUrl: string }> {
    const res = await apiClient.post<ApiResponse<{ checkoutUrl: string }>>(
      API_ROUTES.BILLING.CHECKOUT,
      { planId, isYearly }
    );
    return res.data;
  },

  async openBillingPortal(): Promise<{ portalUrl: string }> {
    const res = await apiClient.post<ApiResponse<{ portalUrl: string }>>(API_ROUTES.BILLING.PORTAL);
    return res.data;
  },
};