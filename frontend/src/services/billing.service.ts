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

  async getInvoices(workspaceId: string = "ws_main"): Promise<any[]> {
    const res = await apiClient.get<ApiResponse<any[]>>(API_ROUTES.BILLING.INVOICES, {
      params: { workspaceId },
    });
    return (res.data || []).map((inv: any) => ({
      id: inv.id,
      date: new Date(inv.periodStart || inv.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      amount: typeof inv.amount === "number" ? `$${inv.amount.toFixed(2)}` : String(inv.amount),
      status: inv.status === "paid" ? "Paid" : inv.status === "pending" ? "Pending" : "Failed",
      pdfUrl: inv.invoiceUrl,
    }));
  },

  async createCheckoutSession(planId: string, isYearly: boolean, customerEmail?: string): Promise<{ checkoutUrl: string }> {
    const res = await apiClient.post<ApiResponse<{ checkoutUrl: string }>>(
      API_ROUTES.BILLING.CHECKOUT,
      { planId, isYearly, customerEmail }
    );
    return res.data;
  },

  async validateCheckout(sessionId: string, planId: string): Promise<{ validated: boolean; subscription: Subscription }> {
    const res = await apiClient.post<ApiResponse<{ validated: boolean; subscription: Subscription }>>(
      API_ROUTES.BILLING.VALIDATE,
      { sessionId, planId }
    );
    return res.data;
  },

  async openBillingPortal(customerEmail?: string): Promise<{ portalUrl: string }> {
    const res = await apiClient.post<ApiResponse<{ portalUrl: string }>>(API_ROUTES.BILLING.PORTAL, { customerEmail });
    return res.data;
  },
};
