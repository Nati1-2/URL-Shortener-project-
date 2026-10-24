import { billingService } from "../src/billing.service";
import assert from "assert";

async function runStripeBillingTests() {
  console.log("==================================================");
  console.log(" Starting LinkPulse Stripe Billing Integration Tests");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Test Get Pricing Plans
  await test("1. billingService.getPlans() returns complete plan definitions", async () => {
    const plans = await billingService.getPlans();
    assert.strictEqual(plans.length, 3, "Should return 3 pricing plans");
    
    const freePlan = plans.find((p) => p.id === "free");
    assert.ok(freePlan, "Free plan should exist");
    assert.strictEqual(freePlan?.limits.monthlyClicks, 1000);
    assert.strictEqual(freePlan?.limits.customDomains, 0);

    const proPlan = plans.find((p) => p.id === "pro");
    assert.ok(proPlan, "Pro plan should exist");
    assert.strictEqual(proPlan?.priceMonthly, 19);
    assert.strictEqual(proPlan?.priceYearly, 15);
    assert.strictEqual(proPlan?.limits.monthlyClicks, 50000);
    assert.strictEqual(proPlan?.limits.customDomains, 3);

    const entPlan = plans.find((p) => p.id === "enterprise");
    assert.ok(entPlan, "Enterprise plan should exist");
    assert.strictEqual(entPlan?.priceMonthly, 79);
    assert.strictEqual(entPlan?.priceYearly, 65);
    assert.strictEqual(entPlan?.limits.monthlyClicks, 10000000);
    assert.strictEqual(entPlan?.limits.customDomains, 100);
  });

  // 2. Test Checkout Session Generation
  await test("2. billingService.createCheckoutSession() generates valid checkout URLs", async () => {
    const proMonthly = await billingService.createCheckoutSession("pro", false, "ws_test_123", "user@example.com");
    assert.ok(proMonthly.checkoutUrl, "Pro monthly should return checkout URL");

    const entYearly = await billingService.createCheckoutSession("enterprise", true, "ws_test_123", "user@example.com");
    assert.ok(entYearly.checkoutUrl, "Enterprise yearly should return checkout URL");

    // Free plan should throw error
    let freeErrorThrown = false;
    try {
      await billingService.createCheckoutSession("free", false, "ws_test_123");
    } catch {
      freeErrorThrown = true;
    }
    assert.ok(freeErrorThrown, "Free plan checkout should throw BadRequestError");
  });

  // 3. Test Billing Customer Portal Session
  await test("3. billingService.openBillingPortal() generates customer portal session", async () => {
    const portal = await billingService.openBillingPortal("ws_test_123", "customer@linkpulse.io");
    assert.ok(portal.portalUrl, "Should return portal URL");
  });

  // 4. Test Webhook: checkout.session.completed
  await test("4. billingService.handleStripeWebhook() processes checkout.session.completed", async () => {
    const mockCheckoutPayload = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_999",
          customer: "cus_test_abc123",
          subscription: "sub_test_xyz789",
          amount_total: 1900,
          metadata: {
            workspaceId: "ws_test_webhook",
            planId: "pro",
            isYearly: "false",
          },
        },
      },
    };

    const result = await billingService.handleStripeWebhook(mockCheckoutPayload);
    assert.strictEqual(result.received, true);
    assert.strictEqual(result.eventType, "checkout.session.completed");
  });

  // 5. Test Webhook: invoice.payment_succeeded
  await test("5. billingService.handleStripeWebhook() processes invoice.payment_succeeded", async () => {
    const mockInvoicePayload = {
      type: "invoice.payment_succeeded",
      data: {
        object: {
          id: "in_test_111",
          customer: "cus_test_abc123",
          amount_paid: 1900,
          currency: "usd",
          hosted_invoice_url: "https://stripe.com/invoice/test",
        },
      },
    };

    const result = await billingService.handleStripeWebhook(mockInvoicePayload);
    assert.strictEqual(result.received, true);
    assert.strictEqual(result.eventType, "invoice.payment_succeeded");
  });

  // 6. Test Webhook: customer.subscription.updated
  await test("6. billingService.handleStripeWebhook() processes customer.subscription.updated", async () => {
    const mockUpdatePayload = {
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_test_xyz789",
          customer: "cus_test_abc123",
          status: "active",
          cancel_at_period_end: false,
        },
      },
    };

    const result = await billingService.handleStripeWebhook(mockUpdatePayload);
    assert.strictEqual(result.received, true);
    assert.strictEqual(result.eventType, "customer.subscription.updated");
  });

  // 7. Test Webhook: customer.subscription.deleted
  await test("7. billingService.handleStripeWebhook() processes customer.subscription.deleted", async () => {
    const mockDeletedPayload = {
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_test_xyz789",
          customer: "cus_test_abc123",
          status: "canceled",
        },
      },
    };

    const result = await billingService.handleStripeWebhook(mockDeletedPayload);
    assert.strictEqual(result.received, true);
    assert.strictEqual(result.eventType, "customer.subscription.deleted");
  });

  // 8. Test Validate Checkout Session
  await test("8. billingService.validateCheckoutSession() validates and syncs subscription", async () => {
    const result = await billingService.validateCheckoutSession("cs_mock_123", "enterprise", "ws_test_webhook");
    assert.strictEqual(result.validated, true);
    assert.strictEqual(result.subscription.planId, "enterprise");
    assert.strictEqual(result.subscription.monthlyClicksLimit, 10000000);
  });

  // 9. Test Invoices Query
  await test("9. billingService.getInvoices() returns workspace invoices", async () => {
    const invoices = await billingService.getInvoices("ws_test_webhook");
    assert.ok(Array.isArray(invoices), "Invoices should be an array");
    assert.ok(invoices.length > 0, "Should contain at least 1 invoice");
    assert.ok(invoices[0].amount !== undefined, "Invoice should have amount");
    assert.ok(invoices[0].status, "Invoice should have status");
  });

  console.log("\n==================================================");
  console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runStripeBillingTests().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
