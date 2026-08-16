import crypto from "crypto";
import { prisma } from "./db";
import { redis } from "./redis";
import {
  generateShortCode,
  isValidSlug,
  isValidUrl,
  hashPassword,
  NotFoundError,
  BadRequestError,
  ConflictError,
} from "@linkpulse/common";
import { eventBroker, EVENT_TOPICS } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("link-service");

export class LinkService {
  public async getLinks(params: {
    workspaceId?: string;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.max(Number(params.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.workspaceId) where.workspaceId = params.workspaceId;
    if (params.status && params.status !== "all") where.status = params.status;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { originalUrl: { contains: params.search, mode: "insensitive" } },
        { shortCode: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    const sortField = params.sortBy || "createdAt";
    const orderDirection = params.sortOrder || "desc";
    orderBy[sortField] = orderDirection;

    const [total, links] = await Promise.all([
      prisma.link.count({ where }),
      prisma.link.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    return {
      links: links.map((l) => this.formatLink(l)),
      total,
      page,
      limit,
    };
  }

  public async getLinkById(id: string) {
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    return this.formatLink(link);
  }

  public async createLink(dto: {
    title?: string;
    originalUrl: string;
    shortCode?: string;
    domain?: string;
    status?: string;
    tags?: string[];
    password?: string;
    expiresAt?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    qrSettings?: { fgColor?: string; bgColor?: string };
    workspaceId?: string;
    createdBy?: string;
  }) {
    if (!dto.originalUrl || !isValidUrl(dto.originalUrl)) {
      throw new BadRequestError("A valid HTTP or HTTPS destination URL is required.");
    }

    const domain = dto.domain || "ly.nk";
    let finalCode = dto.shortCode?.trim();

    if (finalCode) {
      if (!isValidSlug(finalCode)) {
        throw new BadRequestError("Custom slug may only contain alphanumeric characters, underscores, and hyphens.");
      }
      const existing = await prisma.link.findUnique({ where: { shortCode: finalCode } });
      if (existing) {
        throw new ConflictError("This custom short code is already in use.");
      }
    } else {
      // Collision-resistant generator with retries
      let attempts = 0;
      let generated = "";
      while (attempts < 5) {
        generated = generateShortCode(7);
        const existing = await prisma.link.findUnique({ where: { shortCode: generated } });
        if (!existing) break;
        attempts++;
      }
      finalCode = generated;
    }

    let passwordHash: string | undefined = undefined;
    let initialStatus = dto.status || "active";

    if (dto.password && dto.password.trim()) {
      passwordHash = await hashPassword(dto.password.trim());
      initialStatus = "password_protected";
    }

    let title = dto.title?.trim();
    if (!title) {
      try {
        title = new URL(dto.originalUrl).hostname;
      } catch {
        title = "Short Link";
      }
    }

    const shortUrl = `${domain}/${finalCode}`;

    const link = await prisma.link.create({
      data: {
        title,
        originalUrl: dto.originalUrl,
        shortCode: finalCode,
        domain,
        shortUrl,
        status: initialStatus,
        passwordHash,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        tags: dto.tags || [],
        utmSource: dto.utmSource,
        utmMedium: dto.utmMedium,
        utmCampaign: dto.utmCampaign,
        qrFgColor: dto.qrSettings?.fgColor || "#0f172a",
        qrBgColor: dto.qrSettings?.bgColor || "#ffffff",
        workspaceId: dto.workspaceId || "ws_main",
        createdBy: dto.createdBy || "usr_alex_vance",
      },
    });

    // Invalidate Redis cache if any
    try {
      await redis.del(`link:${finalCode}`);
    } catch {
      // ignore
    }

    // Publish Link Created Event
    await eventBroker.publish(EVENT_TOPICS.LINK_CREATED, {
      eventId: `evt_${crypto.randomUUID()}`,
      eventType: "LINK_CREATED",
      timestamp: new Date().toISOString(),
      source: "link-service",
      version: "1.0",
      payload: {
        linkId: link.id,
        workspaceId: link.workspaceId,
        createdBy: link.createdBy,
        shortCode: link.shortCode,
        destinationUrl: link.originalUrl,
        title: link.title,
        createdAt: link.createdAt.toISOString(),
      },
    });

    logger.info("Short link created", { linkId: link.id, shortCode: link.shortCode });

    return this.formatLink(link);
  }

  public async updateLink(id: string, updates: any) {
    const existing = await prisma.link.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Link not found");

    const data: any = {};
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.originalUrl !== undefined) {
      if (!isValidUrl(updates.originalUrl)) throw new BadRequestError("Invalid destination URL");
      data.originalUrl = updates.originalUrl;
    }
    if (updates.status !== undefined) data.status = updates.status;
    if (updates.tags !== undefined) data.tags = updates.tags;
    if (updates.utmSource !== undefined) data.utmSource = updates.utmSource;
    if (updates.utmMedium !== undefined) data.utmMedium = updates.utmMedium;
    if (updates.utmCampaign !== undefined) data.utmCampaign = updates.utmCampaign;

    if (updates.password) {
      data.passwordHash = await hashPassword(updates.password);
      data.status = "password_protected";
    }

    const updated = await prisma.link.update({
      where: { id },
      data,
    });

    // Invalidate Cache
    try {
      await redis.del(`link:${existing.shortCode}`);
    } catch {
      // ignore
    }

    return this.formatLink(updated);
  }

  public async deleteLink(id: string) {
    const existing = await prisma.link.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Link not found");

    await prisma.link.delete({ where: { id } });

    // Invalidate Cache
    try {
      await redis.del(`link:${existing.shortCode}`);
    } catch {
      // ignore
    }

    // Publish Link Deleted Event
    await eventBroker.publish(EVENT_TOPICS.LINK_DELETED, {
      eventId: `evt_${crypto.randomUUID()}`,
      eventType: "LINK_DELETED",
      timestamp: new Date().toISOString(),
      source: "link-service",
      version: "1.0",
      payload: {
        linkId: existing.id,
        workspaceId: existing.workspaceId,
        shortCode: existing.shortCode,
      },
    });

    logger.info("Short link deleted", { linkId: id, shortCode: existing.shortCode });
  }

  public async bulkDeleteLinks(ids: string[]) {
    const links = await prisma.link.findMany({
      where: { id: { in: ids } },
    });

    await prisma.link.deleteMany({
      where: { id: { in: ids } },
    });

    // Invalidate Caches
    for (const link of links) {
      try {
        await redis.del(`link:${link.shortCode}`);
      } catch {
        // ignore
      }
    }
  }

  public async checkSlugAvailability(slug: string, domain: string = "ly.nk") {
    const existing = await prisma.link.findFirst({
      where: { shortCode: slug, domain },
    });
    return { available: !existing };
  }

  public async getLinkStats(id: string) {
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) throw new NotFoundError("Link not found");

    return {
      linkId: link.id,
      clicks: link.clicks,
      createdAt: link.createdAt.toISOString(),
      title: link.title,
      shortUrl: link.shortUrl,
      originalUrl: link.originalUrl,
    };
  }

  private formatLink(l: any) {
    return {
      id: l.id,
      title: l.title,
      originalUrl: l.originalUrl,
      shortUrl: l.shortUrl,
      shortCode: l.shortCode,
      domain: l.domain,
      status: l.status,
      clicks: l.clicks,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
      expiresAt: l.expiresAt ? l.expiresAt.toISOString() : undefined,
      tags: l.tags || [],
      utmSource: l.utmSource || undefined,
      utmMedium: l.utmMedium || undefined,
      utmCampaign: l.utmCampaign || undefined,
      qrSettings: {
        fgColor: l.qrFgColor,
        bgColor: l.qrBgColor,
      },
    };
  }
}

export const linkService = new LinkService();
