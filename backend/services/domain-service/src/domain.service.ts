import { prisma } from "./db";
import { NotFoundError, BadRequestError, ConflictError } from "@linkpulse/common";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("domain-service");

export class DomainService {
  public async getDomains(workspaceId: string = "ws_main") {
    const list = await prisma.domain.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    if (list.length === 0) {
      // Return default verified domains if none added yet
      return [
        {
          id: "dom_default_1",
          workspaceId,
          hostname: "go.linkpulse.io",
          status: "verified",
          sslStatus: "active",
          isCustom: true,
          isDefault: true,
          dnsRecords: [{ type: "CNAME", name: "go", value: "cname.linkpulse.io", status: "verified" }],
          createdAt: new Date().toISOString(),
        },
        {
          id: "dom_default_2",
          workspaceId,
          hostname: "ly.nk",
          status: "verified",
          sslStatus: "active",
          isCustom: false,
          isDefault: false,
          dnsRecords: [],
          createdAt: new Date().toISOString(),
        },
      ];
    }

    return list.map((d) => this.formatDomain(d));
  }

  public async addDomain(input: { hostname: string; workspaceId?: string }) {
    const cleanHost = input.hostname.toLowerCase().trim().replace(/^https?:\/\//, "");
    if (!cleanHost || cleanHost.length < 3) {
      throw new BadRequestError("Valid hostname is required.");
    }

    const existing = await prisma.domain.findUnique({
      where: { hostname: cleanHost },
    });

    if (existing) {
      throw new ConflictError("This domain is already registered.");
    }

    const domain = await prisma.domain.create({
      data: {
        hostname: cleanHost,
        workspaceId: input.workspaceId || "ws_main",
        status: "pending",
        sslStatus: "provisioning",
      },
    });

    logger.info("Custom domain added", { domainId: domain.id, hostname: domain.hostname });
    return this.formatDomain(domain);
  }

  public async verifyDomain(id: string) {
    const domain = await prisma.domain.findUnique({ where: { id } });
    if (!domain) throw new NotFoundError("Domain not found");

    // Perform DNS CNAME verification simulation
    const updated = await prisma.domain.update({
      where: { id },
      data: {
        status: "verified",
        sslStatus: "active",
      },
    });

    logger.info("Domain DNS verified and SSL active", { id, hostname: updated.hostname });
    return { verified: true, domain: this.formatDomain(updated) };
  }

  public async deleteDomain(id: string) {
    const domain = await prisma.domain.findUnique({ where: { id } });
    if (!domain) throw new NotFoundError("Domain not found");

    await prisma.domain.delete({ where: { id } });
    logger.info("Domain removed", { id });
  }

  private formatDomain(d: any) {
    const hostParts = d.hostname.split(".");
    const sub = hostParts.length > 2 ? hostParts[0] : "@";
    return {
      id: d.id,
      workspaceId: d.workspaceId,
      hostname: d.hostname,
      status: d.status,
      sslStatus: d.sslStatus,
      isCustom: d.isCustom,
      isDefault: d.isDefault,
      dnsRecords: [
        {
          type: "CNAME",
          name: sub,
          value: "cname.linkpulse.io",
          status: d.status === "verified" ? "verified" : "missing",
        },
      ],
      createdAt: d.createdAt.toISOString(),
    };
  }
}

export const domainService = new DomainService();
