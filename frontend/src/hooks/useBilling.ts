import { useQuery, useMutation } from "@tanstack/react-query";
import { billingService } from "@/services/billing.service";

export const BILLING_QUERY_KEYS = {
  all: ["billing"] as const,
  plans: () => [...BILLING_QUERY_KEYS.all, "plans"] as const,
  subscription: (workspaceId?: string) => [...BILLING_QUERY_KEYS.all, "subscription", workspaceId] as const,
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

export function useCheckout() {
  return useMutation({
    mutationFn: ({ planId, isYearly }: { planId: string; isYearly: boolean }) =>
      billingService.createCheckoutSession(planId, isYearly),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
  });
}
