import Stripe from "stripe";
import { prisma } from "./db";
import { eventBroker, EVENT_TOPICS } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";
import { BadRequestError } from "@linkpulse/common";

const logger = createLogger("billing-service");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const APP_URL = process.env.APP_URL || "http://localhost:3000";
const PRICE_IDS: Record<string, string | undefined> = {
  "pro:monthly": process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  "pro:yearly": process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  "enterprise:monthly": process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
  "enterprise:yearly": process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
};

function requireStripe(): Stripe {
  if (!stripe) throw new BadRequestError("Billing is not configured. Set STRIPE_SECRET_KEY on the server.");
  return stripe;
}

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" as any })
  : null;

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
          planId: "free",
          planName: "Starter Hobby",
          status: "active",
          monthlyClicksLimit: 1000,
          usedClicksCurrentPeriod: 0,
          currentPeriodEnd: new Date(),
        },
      });
    }

    return {
      id: sub.id,
      workspaceId: sub.workspaceId,
      planId: sub.planId,
      planName: sub.planName,
      status: sub.status,
      stripeCustomerId: sub.stripeCustomerId,
      stripeSubscriptionId: sub.stripeSubscriptionId,
      currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      monthlyClicksLimit: sub.monthlyClicksLimit,
      usedClicksCurrentPeriod: sub.usedClicksCurrentPeriod,
    };
  }

  public async createCheckoutSession(planId: string, isYearly: boolean, workspaceId: string = "ws_main") {
    if (!["pro", "enterprise"].includes(planId)) throw new BadRequestError("Select a paid plan.");
    const priceId = PRICE_IDS[`${planId}:${isYearly ? "yearly" : "monthly"}`];
    if (!priceId) throw new BadRequestError("The selected Stripe price is not configured.");

    const session = await requireStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { workspaceId, planId, interval: isYearly ? "yearly" : "monthly" },
      subscription_data: { metadata: { workspaceId, planId } },
      success_url: `${APP_URL}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing?checkout=canceled`,
    });
    if (!session.url) throw new BadRequestError("Stripe did not return a checkout URL.");
    return { checkoutUrl: session.url };
  }
  public async openBillingPortal(workspaceId: string = "ws_main") {
    const sub = await prisma.subscription.findUnique({ where: { workspaceId } });
    if (!sub?.stripeCustomerId) throw new BadRequestError("No Stripe customer exists for this workspace.");
    const portal = await requireStripe().billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${APP_URL}/settings?tab=billing`,
    });
    return { portalUrl: portal.url };
  }
  public async handleStripeWebhook(rawBody: Buffer | string, signature?: string) {
    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      throw new BadRequestError("Stripe webhook signature configuration is missing.");
    }
    let event: Stripe.Event;
    try {
      event = requireStripe().webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      logger.error("Stripe webhook signature verification failed", err);
      throw new BadRequestError("Webhook signature verification failed.");
    }

    const previous = await prisma.webhookEvent.findUnique({ where: { stripeEventId: event.id } });
    if (previous) return { received: true, duplicate: true };
    await prisma.webhookEvent.create({ data: { stripeEventId: event.id, type: event.type } });

    logger.info("Processing Stripe webhook event", { type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      const workspaceId = session?.metadata?.workspaceId || "ws_main";
      const planId = session?.metadata?.planId || "pro";

      const subId = session?.subscription ? String(session.subscription) : undefined;
      const custId = session?.customer ? String(session.customer) : undefined;

      await prisma.subscription.upsert({
        where: { workspaceId },
        create: {
          workspaceId,
          planId,
          planName: planId === "enterprise" ? "Scale Enterprise Plan" : "Pro Growth Plan",
          status: "active",
          stripeCustomerId: custId,
          stripeSubscriptionId: subId,
          stripeCheckoutSessionId: session.id,
          monthlyClicksLimit: planId === "enterprise" ? 10000000 : 50000,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          planId,
          planName: planId === "enterprise" ? "Scale Enterprise Plan" : "Pro Growth Plan",
          status: "active",
          stripeCustomerId: custId,
          stripeSubscriptionId: subId,
          stripeCheckoutSessionId: session.id,
          monthlyClicksLimit: planId === "enterprise" ? 10000000 : 50000,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      await eventBroker.publish(EVENT_TOPICS.SUBSCRIPTION_UPDATED, {
        eventId: `evt_${Date.now()}`,
        eventType: "SUBSCRIPTION_UPDATED",
        timestamp: new Date().toISOString(),
        source: "billing-service",
        version: "1.0",
        payload: {
          workspaceId,
          planId,
          planName: planId === "enterprise" ? "Scale Enterprise Plan" : "Pro Growth Plan",
          status: "active",
          monthlyClicksLimit: planId === "enterprise" ? 10000000 : 50000,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    } else if (event.type === "customer.subscription.deleted") {
      const subObj = event.data?.object;
      const custId = subObj?.customer ? String(subObj.customer) : null;
      if (custId) {
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: custId },
          data: { status: "canceled", planId: "free", planName: "Starter Hobby" },
        });
      }
    }

    return { received: true };
  }
}

export const billingService = new BillingService();

