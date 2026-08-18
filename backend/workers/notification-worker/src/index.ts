import "dotenv/config";
import { PrismaClient } from "../../../services/notification-service/node_modules/@prisma/client";
import {
  eventBroker,
  EVENT_QUEUES,
  EVENT_TOPICS,
  NotificationRequestedEvent,
} from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("notification-worker");

function getDatabaseUrl(): string {
  const baseDbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/linkpulse";
  if (baseDbUrl.includes("schema=")) {
    return baseDbUrl;
  }
  const isSsl = baseDbUrl.includes("sslmode=require");
  const baseUrl = baseDbUrl.split("?")[0];
  return `${baseUrl}?schema=notification${isSsl ? "&sslmode=require" : ""}`;
}

const prisma = new PrismaClient({ datasources: { db: { url: getDatabaseUrl() } } });


async function processNotificationEvent(event: NotificationRequestedEvent) {
  const { payload } = event;
  logger.info("Processing notification event", {
    eventId: event.eventId,
    title: payload.title,
    workspaceId: payload.workspaceId,
  });

  await prisma.notification.create({
    data: {
      workspaceId: payload.workspaceId || "ws_main",
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || "info",
    },
  });
}

async function startWorker() {
  logger.info("Starting Notification Worker...");
  await eventBroker.connect();

  await eventBroker.subscribe<NotificationRequestedEvent["payload"]>(
    EVENT_QUEUES.NOTIFICATION_QUEUE,
    [EVENT_TOPICS.NOTIFICATION_REQUESTED],
    async (event) => {
      await processNotificationEvent(event as NotificationRequestedEvent);
    }
  );

  logger.info("Notification Worker active and listening to RabbitMQ queue.");
}

startWorker().catch((err) => {
  logger.error("Fatal error in Notification Worker:", err);
});
