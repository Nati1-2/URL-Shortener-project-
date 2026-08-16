import crypto from "crypto";
import { redis } from "./redis";
import { prisma } from "./db";
import { parseVisitorTelemetry } from "./user-agent-parser";
import { eventBroker, EVENT_TOPICS } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";
import { NotFoundError, BadRequestError } from "@linkpulse/common";

const logger = createLogger("redirect-service");
const CACHE_TTL_SECONDS = 3600; // 1 hour Redis cache

export class RedirectService {
  public async resolveLink(shortCode: string, headers: Record<string, any>, ip: string) {
    const cacheKey = `link:${shortCode}`;
    let linkData: any = null;

    // 1. Redis Cache Lookup
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        linkData = JSON.parse(cached);
      }
    } catch {
      // Redis unavailable fallback
    }

    // 2. Database Lookup on Cache Miss
    if (!linkData) {
      const link = await prisma.link.findUnique({
        where: { shortCode },
      });

      if (!link) {
        throw new NotFoundError("Short link destination not found.");
      }

      linkData = {
        id: link.id,
        workspaceId: link.workspaceId,
        shortCode: link.shortCode,
        domain: link.domain,
        shortUrl: link.shortUrl,
        title: link.title,
        originalUrl: link.originalUrl,
        status: link.status,
        passwordHash: link.passwordHash,
        expiresAt: link.expiresAt ? link.expiresAt.toISOString() : null,
        utmSource: link.utmSource,
        utmMedium: link.utmMedium,
        utmCampaign: link.utmCampaign,
      };

      // Set Redis cache
      try {
        await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(linkData));
      } catch {
        // ignore
      }
    }

    // 3. Status and Expiration Checks
    if (linkData.status === "archived" || linkData.status === "expired") {
      throw new BadRequestError("This short link is no longer active.");
    }

    if (linkData.expiresAt && new Date(linkData.expiresAt) < new Date()) {
      throw new BadRequestError("This short link has expired.");
    }

    // 4. Construct Final Destination URL with UTM Parameters
    let destinationUrl = linkData.originalUrl;
    if (linkData.utmSource || linkData.utmMedium || linkData.utmCampaign) {
      try {
        const parsedUrl = new URL(destinationUrl);
        if (linkData.utmSource && !parsedUrl.searchParams.has("utm_source")) {
          parsedUrl.searchParams.set("utm_source", linkData.utmSource);
        }
        if (linkData.utmMedium && !parsedUrl.searchParams.has("utm_medium")) {
          parsedUrl.searchParams.set("utm_medium", linkData.utmMedium);
        }
        if (linkData.utmCampaign && !parsedUrl.searchParams.has("utm_campaign")) {
          parsedUrl.searchParams.set("utm_campaign", linkData.utmCampaign);
        }
        destinationUrl = parsedUrl.toString();
      } catch {
        // Keep original if parse fails
      }
    }

    // 5. Asynchronously Emit ClickRecorded Event to RabbitMQ (Non-blocking)
    const telemetry = parseVisitorTelemetry(headers, ip);
    const clickEvent = {
      eventId: `evt_${crypto.randomUUID()}`,
      eventType: "CLICK_RECORDED",
      timestamp: new Date().toISOString(),
      source: "redirect-service",
      version: "1.0",
      payload: {
        linkId: linkData.id,
        workspaceId: linkData.workspaceId,
        shortCode: linkData.shortCode,
        destinationUrl: linkData.originalUrl,
        ipHash: telemetry.ipHash,
        country: telemetry.country,
        deviceType: telemetry.deviceType,
        browser: telemetry.browser,
        os: telemetry.os,
        referrer: telemetry.referrer,
        userAgent: telemetry.userAgent,
        utmSource: linkData.utmSource,
        utmMedium: linkData.utmMedium,
        utmCampaign: linkData.utmCampaign,
        timestamp: new Date().toISOString(),
      },
    };

    // Non-blocking fire and forget
    eventBroker.publish(EVENT_TOPICS.CLICK_RECORDED, clickEvent).catch((e) => {
      logger.warn("Failed to publish ClickRecorded event:", { error: e.message });
    });

    return {
      destinationUrl,
      isPasswordProtected: linkData.status === "password_protected",
      link: linkData,
    };
  }
}

export const redirectService = new RedirectService();
