import "dotenv/config";
import {
  eventBroker,
  EVENT_QUEUES,
  EVENT_TOPICS,
  WebhookReceivedEvent,
} from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("webhook-worker");

// In-memory idempotency cache for deduplicating webhook events
const processedEvents = new Set<string>();

async function processWebhookEvent(event: WebhookReceivedEvent) {
  const { payload } = event;

  if (processedEvents.has(payload.id)) {
    logger.warn("Duplicate webhook event skipped", { webhookId: payload.id });
    return;
  }

  logger.info("Processing Stripe webhook event", {
    eventId: event.eventId,
    webhookId: payload.id,
    type: payload.event,
  });

  processedEvents.add(payload.id);
  // Keep set memory bounded
  if (processedEvents.size > 10000) {
    const [first] = processedEvents;
    processedEvents.delete(first);
  }
}

async function startWorker() {
  logger.info("Starting Webhook Worker...");
  await eventBroker.connect();

  await eventBroker.subscribe<WebhookReceivedEvent["payload"]>(
    EVENT_QUEUES.WEBHOOK_QUEUE,
    [EVENT_TOPICS.WEBHOOK_RECEIVED],
    async (event) => {
      await processWebhookEvent(event as WebhookReceivedEvent);
    }
  );

  logger.info("Webhook Worker active and listening to RabbitMQ queue.");
}

startWorker().catch((err) => {
  logger.error("Fatal error in Webhook Worker:", err);
});
