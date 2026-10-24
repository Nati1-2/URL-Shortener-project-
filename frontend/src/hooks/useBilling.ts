import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billing.service";

export const BILLING_QUERY_KEYS = {
  all: ["billing"] as const,
  plans: () => [...BILLING_QUERY_KEYS.all, "plans"] as const,
  subscription: (workspaceId?: string) => [...BILLING_QUERY_KEYS.all, "subscription", workspaceId] as const,
  invoices: (workspaceId?: string) => [...BILLING_QUERY_KEYS.all, "invoices", workspaceId] as const,
};

export function usePricingPlans() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.plans(),
    queryFn: () => billingService.getPlans(),
  });
}

export function useSubscription(workspaceId?: string) {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.subscription(workspaceId),
    queryFn: () => billingService.getSubscription(workspaceId),
  });
}

export function useInvoices(workspaceId?: string) {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.invoices(workspaceId),
    queryFn: () => billingService.getInvoices(workspaceId),
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: ({
      planId,
      isYearly,
      customerEmail,
    }: {
      planId: string;
      isYearly: boolean;
      customerEmail?: string;
    }) => billingService.createCheckoutSession(planId, isYearly, customerEmail),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
  });
}

export function useValidateCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, planId }: { sessionId: string; planId: string }) =>
      billingService.validateCheckout(sessionId, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.all });
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: (customerEmail?: string) => billingService.openBillingPortal(customerEmail),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && data.portalUrl) {
        window.location.href = data.portalUrl;
      }
    },
  });
}


