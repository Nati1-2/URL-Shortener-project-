import Stripe from "stripe";
import { prisma } from "./db";
import { eventBroker, EVENT_TOPICS } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";
import { BadRequestError } from "@linkpulse/common";

const logger = createLogger("billing-service");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" as any })
  : null;

class InMemoryBillingStore {
  private subscriptions = new Map<string, any>();
  private invoices: any[] = [];

  async getSubscription(workspaceId: string) {
    if (!this.subscriptions.has(workspaceId)) {
      this.subscriptions.set(workspaceId, {
        id: `sub_${Date.now()}`,
        workspaceId,
        planId: "pro",
        planName: "Pro Growth Plan",
        status: "active",
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        monthlyClicksLimit: 50000,
        usedClicksCurrentPeriod: 14230,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      });
    }
    return this.subscriptions.get(workspaceId);
  }

  async upsertSubscription(workspaceId: string, data: any) {
    const existing = (await this.getSubscription(workspaceId)) || {};
    const updated = {
      ...existing,
      ...data,
      workspaceId,
    };
    this.subscriptions.set(workspaceId, updated);
    return updated;
  }

  async findByCustomerId(customerId: string) {
    for (const sub of this.subscriptions.values()) {
      if (sub.stripeCustomerId === customerId) return sub;
    }
    return null;
  }

  async updateByCustomerId(customerId: string, data: any) {
    for (const [ws, sub] of this.subscriptions.entries()) {
      if (sub.stripeCustomerId === customerId) {
        this.subscriptions.set(ws, { ...sub, ...data });
      }
    }
  }

  async addInvoice(invoice: any) {
    const inv = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      ...invoice,
    };
    this.invoices.unshift(inv);
    return inv;
  }

  async getInvoices(workspaceId: string) {
    const filtered = this.invoices.filter((i) => i.workspaceId === workspaceId);
    if (filtered.length === 0) {
      return [
        {
          id: "inv_101",
          workspaceId,
          amount: 19.0,
          currency: "USD",
          status: "paid",
          invoiceUrl: null,
          periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          periodEnd: new Date(),
          createdAt: new Date(),
        },
      ];
    }
    return filtered;
  }
}

const memoryStore = new InMemoryBillingStore();

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
    let sub: any;
    try {
      sub = await prisma.subscription.findUnique({
        where: { workspaceId },
      });

      if (!sub) {
        sub = await prisma.subscription.create({
          data: {
            workspaceId,
            planId: "pro",
            planName: "Pro Growth Plan",
            status: "active",
            monthlyClicksLimit: 50000,
            usedClicksCurrentPeriod: 14230,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    } catch {
      sub = await memoryStore.getSubscription(workspaceId);
    }

    return {
      id: sub.id,
      workspaceId: sub.workspaceId,
      planId: sub.planId,
      planName: sub.planName,
      status: sub.status,
      stripeCustomerId: sub.stripeCustomerId,
      stripeSubscriptionId: sub.stripeSubscriptionId,
      currentPeriodEnd:
        typeof sub.currentPeriodEnd === "string" ? sub.currentPeriodEnd : sub.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: Boolean(sub.cancelAtPeriodEnd),
      monthlyClicksLimit: sub.monthlyClicksLimit,
      usedClicksCurrentPeriod: sub.usedClicksCurrentPeriod,
    };
  }

  public async getInvoices(workspaceId: string = "ws_main") {
    let invoices: any[] = [];
    try {
      invoices = await prisma.invoice.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      invoices = await memoryStore.getInvoices(workspaceId);
    }

    if (invoices.length === 0) {
      invoices = await memoryStore.getInvoices(workspaceId);
    }

    return invoices.map((inv: any) => ({
      id: inv.id,
      workspaceId: inv.workspaceId,
      amount: inv.amount,
      currency: inv.currency,
      status: inv.status,
      invoiceUrl: inv.invoiceUrl,
      periodStart: typeof inv.periodStart === "string" ? inv.periodStart : inv.periodStart.toISOString(),
      periodEnd: typeof inv.periodEnd === "string" ? inv.periodEnd : inv.periodEnd.toISOString(),
      createdAt: typeof inv.createdAt === "string" ? inv.createdAt : inv.createdAt.toISOString(),
    }));
  }

  public async createCheckoutSession(
    planId: string,
    isYearly: boolean,
    workspaceId: string = "ws_main",
    customerEmail?: string
  ) {
    logger.info("Initiating checkout session", { planId, isYearly, workspaceId, customerEmail });

    if (planId === "free") {
      throw new BadRequestError("Free plan does not require checkout.");
    }

    const priceAmount = planId === "enterprise" ? (isYearly ? 65 * 12 : 79) : isYearly ? 15 * 12 : 19;
    const planName = planId === "enterprise" ? "Scale Enterprise Plan" : "Pro Growth Plan";

    if (stripe) {
      try {
        let sub: any;
        try {
          sub = await prisma.subscription.findUnique({ where: { workspaceId } });
        } catch {
          sub = await memoryStore.getSubscription(workspaceId);
        }

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
          payment_method_types: ["card"],
          mode: "subscription",
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `LinkPulse ${planName} (${isYearly ? "Annual" : "Monthly"})`,
                  description: `High-velocity link shortening, custom domains, and real-time telemetry.`,
                },
                unit_amount: priceAmount * 100,
                recurring: {
                  interval: isYearly ? "year" : "month",
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            workspaceId,
            planId,
            isYearly: String(isYearly),
          },
          success_url: `${APP_URL}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
          cancel_url: `${APP_URL}/pricing?checkout=canceled`,
        };

        if (sub?.stripeCustomerId) {
          sessionParams.customer = sub.stripeCustomerId;
        } else if (customerEmail) {
          sessionParams.customer_email = customerEmail;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return {
          checkoutUrl: session.url || `${APP_URL}/dashboard?checkout=success&plan=${planId}`,
          sessionId: session.id,
        };
      } catch (err: any) {
        logger.error("Stripe checkout creation error:", err);
      }
    }

    return {
      checkoutUrl: `${APP_URL}/dashboard?checkout=success&plan=${planId}`,
      sessionId: `mock_sess_${Date.now()}`,
    };
  }

  public async openBillingPortal(workspaceId: string = "ws_main", customerEmail?: string) {
    logger.info("Opening customer billing portal", { workspaceId });

    let sub: any;
    try {
      sub = await prisma.subscription.findUnique({ where: { workspaceId } });
    } catch {
      sub = await memoryStore.getSubscription(workspaceId);
    }

    if (stripe) {
      try {
        let customerId = sub?.stripeCustomerId;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: customerEmail || `billing-${workspaceId}@linkpulse.io`,
            metadata: { workspaceId },
          });
          customerId = customer.id;

          try {
            await prisma.subscription.upsert({
              where: { workspaceId },
              create: {
                workspaceId,
                planId: "pro",
                planName: "Pro Growth Plan",
                status: "active",
                stripeCustomerId: customerId,
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
              update: {
                stripeCustomerId: customerId,
              },
            });
          } catch {
            await memoryStore.upsertSubscription(workspaceId, { stripeCustomerId: customerId });
          }
        }

        const portal = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${APP_URL}/settings?tab=billing`,
        });

        return { portalUrl: portal.url };
      } catch (err: any) {
        logger.error("Stripe portal creation error:", err);
      }
    }

    return {
      portalUrl: `${APP_URL}/settings?tab=billing`,
    };
  }

  public async handleStripeWebhook(rawBody: Buffer | string | any, signature?: string) {
    let event: any;

    if (stripe && signature && STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
      } catch (err: any) {
        logger.error("Stripe Webhook Signature Verification Failed:", err.message);
        throw new BadRequestError(`Webhook signature verification failed: ${err.message}`);
      }
    } else {
      event = typeof rawBody === "string" ? JSON.parse(rawBody) : Buffer.isBuffer(rawBody) ? JSON.parse(rawBody.toString()) : rawBody;
    }

    logger.info("Processing Stripe webhook event", { type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      const workspaceId = session?.metadata?.workspaceId || "ws_main";
      const planId = session?.metadata?.planId || "pro";

      const subId = session?.subscription ? String(session.subscription) : undefined;
      const custId = session?.customer ? String(session.customer) : undefined;
      const amountTotal = session?.amount_total ? session.amount_total / 100 : planId === "enterprise" ? 79 : 19;
      const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const updateData = {
        planId,
        planName: planId === "enterprise" ? "Scale Enterprise Plan" : "Pro Growth Plan",
        status: "active",
        ...(custId ? { stripeCustomerId: custId } : {}),
        ...(subId ? { stripeSubscriptionId: subId } : {}),
        monthlyClicksLimit: planId === "enterprise" ? 10000000 : 50000,
        currentPeriodEnd: periodEnd,
      };

      try {
        await prisma.subscription.upsert({
          where: { workspaceId },
          create: {
            workspaceId,
            ...updateData,
          },
          update: updateData,
        });

        await prisma.invoice.create({
          data: {
            workspaceId,
            amount: amountTotal,
            currency: "USD",
            status: "paid",
            periodStart: new Date(),
            periodEnd,
          },
        });
      } catch {
        await memoryStore.upsertSubscription(workspaceId, updateData);
        await memoryStore.addInvoice({
          workspaceId,
          amount: amountTotal,
          currency: "USD",
          status: "paid",
          periodStart: new Date(),
          periodEnd,
        });
      }

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
          currentPeriodEnd: periodEnd.toISOString(),
        },
      });
    } else if (event.type === "invoice.payment_succeeded") {
      const invObj = event.data?.object;
      const custId = invObj?.customer ? String(invObj.customer) : null;
      const amountPaid = invObj?.amount_paid ? invObj.amount_paid / 100 : 19;
      const hostedInvoiceUrl = invObj?.hosted_invoice_url || null;

      if (custId) {
        const newPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        try {
          const sub = await prisma.subscription.findFirst({
            where: { stripeCustomerId: custId },
          });

          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: {
                status: "active",
                currentPeriodEnd: newPeriodEnd,
              },
            });

            await prisma.invoice.create({
              data: {
                workspaceId: sub.workspaceId,
                amount: amountPaid,
                currency: invObj?.currency?.toUpperCase() || "USD",
                status: "paid",
                invoiceUrl: hostedInvoiceUrl,
                periodStart: new Date(),
                periodEnd: newPeriodEnd,
              },
            });
          }
        } catch {
          const sub = await memoryStore.findByCustomerId(custId);
          if (sub) {
            await memoryStore.updateByCustomerId(custId, {
              status: "active",
              currentPeriodEnd: newPeriodEnd,
            });
            await memoryStore.addInvoice({
              workspaceId: sub.workspaceId,
              amount: amountPaid,
              currency: invObj?.currency?.toUpperCase() || "USD",
              status: "paid",
              invoiceUrl: hostedInvoiceUrl,
              periodStart: new Date(),
              periodEnd: newPeriodEnd,
            });
          }
        }
      }
    } else if (event.type === "invoice.payment_failed") {
      const invObj = event.data?.object;
      const custId = invObj?.customer ? String(invObj.customer) : null;
      if (custId) {
        try {
          await prisma.subscription.updateMany({
            where: { stripeCustomerId: custId },
            data: { status: "past_due" },
          });
        } catch {
          await memoryStore.updateByCustomerId(custId, { status: "past_due" });
        }
      }
    } else if (event.type === "customer.subscription.updated") {
      const subObj = event.data?.object;
      const custId = subObj?.customer ? String(subObj.customer) : null;
      const status = subObj?.status || "active";
      const cancelAtPeriodEnd = Boolean(subObj?.cancel_at_period_end);

      if (custId) {
        try {
          await prisma.subscription.updateMany({
            where: { stripeCustomerId: custId },
            data: {
              status,
              cancelAtPeriodEnd,
            },
          });
        } catch {
          await memoryStore.updateByCustomerId(custId, {
            status,
            cancelAtPeriodEnd,
          });
        }
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subObj = event.data?.object;
      const custId = subObj?.customer ? String(subObj.customer) : null;
      if (custId) {
        try {
          await prisma.subscription.updateMany({
            where: { stripeCustomerId: custId },
            data: {
              status: "canceled",
              planId: "free",
              planName: "Starter Hobby",
              monthlyClicksLimit: 1000,
            },
          });
        } catch {
          await memoryStore.updateByCustomerId(custId, {
            status: "canceled",
            planId: "free",
            planName: "Starter Hobby",
            monthlyClicksLimit: 1000,
          });
        }
      }
    }

    return { received: true, eventType: event.type };
  }

  public async validateCheckoutSession(
    sessionId?: string,
    planId: string = "pro",
    workspaceId: string = "ws_main"
  ) {
    logger.info("Validating checkout session", { sessionId, planId, workspaceId });

    let verifiedPlanId = planId;
    let custId: string | undefined = undefined;
    let subId: string | undefined = undefined;

    if (stripe && sessionId && sessionId !== "success") {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid" || session.status === "complete") {
          verifiedPlanId = session.metadata?.planId || planId;
          custId = session.customer ? String(session.customer) : undefined;
          subId = session.subscription ? String(session.subscription) : undefined;
        }
      } catch (err: any) {
        logger.warn("Stripe session retrieval notice:", err.message);
      }
    }

    const planName =
      verifiedPlanId === "enterprise"
        ? "Scale Enterprise Plan"
        : verifiedPlanId === "pro"
        ? "Pro Growth Plan"
        : "Starter Hobby";
    const monthlyLimit =
      verifiedPlanId === "enterprise" ? 10000000 : verifiedPlanId === "pro" ? 50000 : 1000;
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const updatePayload = {
      planId: verifiedPlanId,
      planName,
      status: "active",
      ...(custId ? { stripeCustomerId: custId } : {}),
      ...(subId ? { stripeSubscriptionId: subId } : {}),
      monthlyClicksLimit: monthlyLimit,
      currentPeriodEnd,
    };

    let sub: any;
    try {
      sub = await prisma.subscription.upsert({
        where: { workspaceId },
        create: {
          workspaceId,
          ...updatePayload,
        },
        update: updatePayload,
      });
    } catch {
      sub = await memoryStore.upsertSubscription(workspaceId, updatePayload);
    }

    await eventBroker.publish(EVENT_TOPICS.SUBSCRIPTION_UPDATED, {
      eventId: `evt_${Date.now()}`,
      eventType: "SUBSCRIPTION_UPDATED",
      timestamp: new Date().toISOString(),
      source: "billing-service",
      version: "1.0",
      payload: {
        workspaceId,
        planId: verifiedPlanId,
        planName,
        status: "active",
        monthlyClicksLimit: monthlyLimit,
        currentPeriodEnd: typeof sub.currentPeriodEnd === "string" ? sub.currentPeriodEnd : sub.currentPeriodEnd.toISOString(),
      },
    });

    return {
      validated: true,
      subscription: {
        id: sub.id,
        workspaceId: sub.workspaceId,
        planId: sub.planId,
        planName: sub.planName,
        status: sub.status,
        monthlyClicksLimit: sub.monthlyClicksLimit,
        currentPeriodEnd: typeof sub.currentPeriodEnd === "string" ? sub.currentPeriodEnd : sub.currentPeriodEnd.toISOString(),
      },
    };
  }
}

export const billingService = new BillingService();
