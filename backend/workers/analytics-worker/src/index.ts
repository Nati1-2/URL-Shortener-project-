import "dotenv/config";
import { PrismaClient } from "../../../services/analytics-service/node_modules/@prisma/client";
import Redis from "ioredis";
import {
  eventBroker,
  EVENT_QUEUES,
  EVENT_TOPICS,
  ClickRecordedEvent,
} from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("analytics-worker");

function getDatabaseUrl(): string {
  const baseDbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/linkpulse";
  if (baseDbUrl.includes("schema=")) {
    return baseDbUrl;
  }
  const isSsl = baseDbUrl.includes("sslmode=require");
  const baseUrl = baseDbUrl.split("?")[0];
  return `${baseUrl}?schema=analytics${isSsl ? "&sslmode=require" : ""}`;
}

const prisma = new PrismaClient({ datasources: { db: { url: getDatabaseUrl() } } });
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(REDIS_URL, { lazyConnect: true });


async function processClickEvent(event: ClickRecordedEvent) {
  const { payload } = event;
  logger.info("Processing click event", {
    eventId: event.eventId,
    shortCode: payload.shortCode,
    country: payload.country,
  });

  // 1. Insert into raw partitioned ClickEvents
  await prisma.clickEvent.create({
    data: {
      linkId: payload.linkId,
      workspaceId: payload.workspaceId,
      shortCode: payload.shortCode,
      ipHash: payload.ipHash || "anonymized",
      country: payload.country || "United States",
      region: payload.region,
      city: payload.city,
      deviceType: payload.deviceType || "Desktop",
      browser: payload.browser || "Chrome",
      os: payload.os || "macOS",
      referrer: payload.referrer || "Direct Traffic",
      userAgent: payload.userAgent,
      utmSource: payload.utmSource,
      utmMedium: payload.utmMedium,
      utmCampaign: payload.utmCampaign,
      timestamp: new Date(payload.timestamp),
    },
  });

  // 2. Broadcast to Redis Pub/Sub for real-time frontend streaming
  try {
    const liveClickItem = {
      id: event.eventId,
      shortCode: payload.shortCode,
      country: payload.country || "United States",
      flag: payload.country === "United States" ? "🇺🇸" : "🌐",
      browser: payload.browser || "Chrome",
      os: payload.os || "macOS",
      ip: "192.168.1.*** (anonymized)",
      time: "Just now",
    };
    await redis.publish(`live_clicks:${payload.workspaceId}`, JSON.stringify(liveClickItem));
  } catch {
    // ignore pub/sub error in offline dev
  }
}

async function startWorker() {
  logger.info("Starting Analytics Worker...");
  await eventBroker.connect();

  await eventBroker.subscribe<ClickRecordedEvent["payload"]>(
    EVENT_QUEUES.ANALYTICS_QUEUE,
    [EVENT_TOPICS.CLICK_RECORDED],
    async (event) => {
      await processClickEvent(event as ClickRecordedEvent);
    }
  );

  logger.info("Analytics Worker active and listening to RabbitMQ queue.");
}

startWorker().catch((err) => {
  logger.error("Fatal error in Analytics Worker:", err);
});
