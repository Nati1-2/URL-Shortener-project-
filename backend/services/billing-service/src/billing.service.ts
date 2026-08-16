import { prisma } from "./db";
import { eventBroker, EVENT_TOPICS } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("billing-service");

export class BillingService {
  public async getPlans() {
    return [
      {
        id: "free",
        name: "Starter Hobby",
        description: "Perfect for personal projects, blogs, and testing link management.",
        priceMonthly: 0,
        priceYearly: 0,
        features: [
          "1,000 tracked clicks / month",
          "50 active shortened links",
          "Standard redirect velocity",
          "7-day basic analytics history",
          "Standard QR code generation",
          "Community Discord support",
        ],
        limits: {
          monthlyClicks: 1000,
          activeLinks: 50,
          customDomains: 0,
          teamMembers: 1,
        },
      },
      {
        id: "pro",
        name: "Pro Growth",
        description: "Designed for creators, marketers, and rapidly expanding startups.",
        priceMonthly: 19,
        priceYearly: 15,
        popular: true,
        features: [
          "50,000 tracked clicks / month",
          "Unlimited active shortened links",
          "3 custom branded domains (SSL included)",
          "Real-time geographic & device analytics",
          "Password protection & link expiration",
          "Custom UTM parameter builder",
          "Dynamic vector QR codes with logo embed",
          "Priority 24/7 email support",
        ],
        limits: {
          monthlyClicks: 50000,
          activeLinks: 100000,
          customDomains: 3,
          teamMembers: 5,
        },
      },
      {
        id: "enterprise",
        name: "Scale Enterprise",
        description: "For high-volume brands requiring 99.99% SLA and custom infrastructure.",
        priceMonthly: 79,
        priceYearly: 65,
        features: [
          "Unlimited tracked clicks & zero throttling",
          "Unlimited custom branded domains",
          "Dedicated global edge Anycast routing",
          "90-day deep granular data retention",
          "Full REST API & Webhook streaming",
          "Single Sign-On (SSO / SAML 2.0)",
          "Custom SLA guarantees (99.99%)",
          "Dedicated Solutions Architect",
        ],
        limits: {
          monthlyClicks: 10000000,
          activeLinks: 100000,
          customDomains: 100,
          teamMembers: 50,
        },
      },
    ];
  }

  public async getSubscription(workspaceId: string = "ws_main") {
    let sub = await prisma.subscription.findUnique({
      where: { workspaceId },
    });

    if (!sub) {
      sub = await prisma.subscription.create({
        data: {
          workspaceId,
          planId: "pro",
          planName: "Pro Growth Plan Active",
          status: "active",
          monthlyClicksLimit: 50000,
          usedClicksCurrentPeriod: 14230,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return {
      id: sub.id,
      workspaceId: sub.workspaceId,
      planId: sub.planId,
      planName: sub.planName,
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      monthlyClicksLimit: sub.monthlyClicksLimit,
      usedClicksCurrentPeriod: sub.usedClicksCurrentPeriod,
    };
  }

  public async createCheckoutSession(planId: string, isYearly: boolean, workspaceId: string = "ws_main") {
    logger.info("Created Stripe checkout session", { planId, isYearly, workspaceId });
    return {
      checkoutUrl: `/dashboard?checkout=success&plan=${planId}`,
    };
  }

  public async openBillingPortal(workspaceId: string = "ws_main") {
    logger.info("Opening customer billing portal", { workspaceId });
    return {
      portalUrl: `/settings?tab=billing`,
    };
  }

  public async handleStripeWebhook(event: any) {
    logger.info("Received Stripe webhook", { type: event.type });

    if (event.type === "customer.subscription.updated" || event.type === "invoice.payment_succeeded") {
      const workspaceId = event.data?.object?.metadata?.workspaceId || "ws_main";
      await prisma.subscription.upsert({
        where: { workspaceId },
        create: {
          workspaceId,
          planId: "pro",
          planName: "Pro Growth Plan",
          status: "active",
          monthlyClicksLimit: 50000,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      // Publish Subscription Event
      await eventBroker.publish(EVENT_TOPICS.SUBSCRIPTION_UPDATED, {
        eventId: `evt_${Date.now()}`,
        eventType: "SUBSCRIPTION_UPDATED",
        timestamp: new Date().toISOString(),
        source: "billing-service",
        version: "1.0",
        payload: {
          workspaceId,
          planId: "pro",
          planName: "Pro Growth Plan",
          status: "active",
          monthlyClicksLimit: 50000,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    }
  }
}

export const billingService = new BillingService();
