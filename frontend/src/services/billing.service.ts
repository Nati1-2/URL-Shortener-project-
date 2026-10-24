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

  async getInvoices(workspaceId: string = "ws_main"): Promise<Invoice[]> {
    if (ENV.USE_MOCK_API) {
      return [
        { id: "inv_101", date: "Aug 01, 2026", amount: "$19.00", status: "Paid" },
        { id: "inv_100", date: "Jul 01, 2026", amount: "$19.00", status: "Paid" },
      ];
    }
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

  async createCheckoutSession(
    planId: string,
    isYearly: boolean,
    customerEmail?: string
  ): Promise<{ checkoutUrl: string }> {
    if (ENV.USE_MOCK_API) {
      return { checkoutUrl: `/dashboard?checkout=success&plan=${planId}` };
    }
    const res = await apiClient.post<ApiResponse<{ checkoutUrl: string }>>(
      API_ROUTES.BILLING.CHECKOUT,
      { planId, isYearly, customerEmail }
    );
    return res.data;
  },

  async validateCheckout(sessionId: string, planId: string): Promise<{ validated: boolean; subscription: Subscription }> {
    if (ENV.USE_MOCK_API) {
      return {
        validated: true,
        subscription: {
          id: "sub_101",
          workspaceId: "ws_main",
          planId,
          planName: planId === "enterprise" ? "Scale Enterprise Plan" : "Pro Growth Plan",
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          monthlyClicksLimit: planId === "enterprise" ? 10000000 : 50000,
          usedClicksCurrentPeriod: 0,
        },
      };
    }
    const res = await apiClient.post<ApiResponse<{ validated: boolean; subscription: Subscription }>>(
      API_ROUTES.BILLING.VALIDATE,
      { sessionId, planId }
    );
    return res.data;
  },

  async openBillingPortal(customerEmail?: string): Promise<{ portalUrl: string }> {
    if (ENV.USE_MOCK_API) {
      return { portalUrl: "/settings?tab=billing" };
    }
    const res = await apiClient.post<ApiResponse<{ portalUrl: string }>>(
      API_ROUTES.BILLING.PORTAL,
      { customerEmail }
    );
    return res.data;
  },
};


