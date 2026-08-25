ALTER TABLE "Subscription" ADD COLUMN "stripePriceId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "stripeCheckoutSessionId" TEXT;
CREATE INDEX "Subscription_stripeSubscriptionId_idx" ON "Subscription"("stripeSubscriptionId");
ALTER TABLE "Invoice" ADD COLUMN "stripeInvoiceId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "stripePaymentIntentId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "hostedInvoiceUrl" TEXT;
CREATE UNIQUE INDEX "Invoice_stripeInvoiceId_key" ON "Invoice"("stripeInvoiceId");
CREATE TABLE "WebhookEvent" (
  "id" TEXT NOT NULL,
  "stripeEventId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WebhookEvent_stripeEventId_key" ON "WebhookEvent"("stripeEventId");