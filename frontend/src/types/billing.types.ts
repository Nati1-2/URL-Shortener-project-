export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  highlight?: boolean;
  badge?: string | null;
  features: string[];
  cta: string;
  limits: {
    monthlyClicks: number;
    activeLinks: number;
    customDomains: number;
    teamMembers: number;
  };
}

export interface Subscription {
  id: string;
  workspaceId: string;
  planId: string;
  planName: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  monthlyClicksLimit: number;
  usedClicksCurrentPeriod: number;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  pdfUrl?: string;
}
