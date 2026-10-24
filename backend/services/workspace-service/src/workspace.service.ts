import crypto from "crypto";
import { prisma } from "./db";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  Role,
} from "@linkpulse/common";
import { eventBroker, EVENT_TOPICS } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("workspace-service");

export class WorkspaceService {
  public async getWorkspaces(userId: string, userInfo?: { userName?: string; userEmail?: string }) {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    if (memberships.length === 0) {
      // Auto-provision personal workspace if user has none
      const name = userInfo?.userName ? `${userInfo.userName}'s Workspace` : "Personal Workspace";
      const personalWs = await this.createWorkspace({
        name,
        ownerId: userId,
        userName: userInfo?.userName || "User",
        userEmail: userInfo?.userEmail || "",
      });
      return [personalWs];
    }

    return memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      plan: m.workspace.plan,
      role: m.role as Role,
      membersCount: m.workspace._count.members,
      createdAt: m.workspace.createdAt.toISOString(),
    }));
  }

  public async getWorkspaceById(id: string, userId?: string) {
    const ws = await prisma.workspace.findUnique({
      where: { id },
      include: {
        _count: { select: { members: true } },
      },
    });

    if (!ws) {
      throw new NotFoundError("Workspace not found");
    }

    return {
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      plan: ws.plan,
      role: "OWNER" as Role,
      membersCount: ws._count.members,
      createdAt: ws.createdAt.toISOString(),
    };
  }

  public async createWorkspace(input: {
    name: string;
    ownerId: string;
    userName: string;
    userEmail: string;
  }) {
    const baseSlug = input.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const slug = `${baseSlug}-${crypto.randomBytes(3).toString("hex")}`;

    const ws = await prisma.workspace.create({
      data: {
        name: input.name,
        slug,
        ownerId: input.ownerId,
        members: {
          create: {
            userId: input.ownerId,
            userName: input.userName,
            userEmail: input.userEmail,
            role: "OWNER",
          },
        },
      },
    });

    logger.info("Workspace created", { workspaceId: ws.id, name: ws.name });

    return {
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      plan: ws.plan,
      role: "OWNER" as Role,
      membersCount: 1,
      createdAt: ws.createdAt.toISOString(),
    };
  }

  public async getMembers(workspaceId: string) {
    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      orderBy: { joinedAt: "asc" },
    });

    return members.map((m) => ({
      id: m.id,
      workspaceId: m.workspaceId,
      role: m.role as Role,
      joinedAt: m.joinedAt.toISOString(),
      user: {
        id: m.userId,
        name: m.userName,
        email: m.userEmail,
        avatar: m.userAvatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      },
    }));
  }

  public async inviteMember(input: {
    workspaceId: string;
    email: string;
    role: Role;
    inviterId?: string;
  }) {
    const ws = await prisma.workspace.findUnique({
      where: { id: input.workspaceId },
    });

    if (!ws) throw new NotFoundError("Workspace not found");

    const token = crypto.randomBytes(24).toString("hex");

    const invitation = await prisma.invitation.create({
      data: {
        workspaceId: input.workspaceId,
        email: input.email.toLowerCase(),
        role: input.role,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Also auto-add user into workspace member table for prototype experience
    await prisma.workspaceMember.create({
      data: {
        workspaceId: input.workspaceId,
        userId: `usr_${crypto.randomBytes(4).toString("hex")}`,
        userName: input.email.split("@")[0],
        userEmail: input.email.toLowerCase(),
        role: input.role,
        userAvatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80`,
      },
    });

    // Publish Notification Event
    await eventBroker.publish(EVENT_TOPICS.NOTIFICATION_REQUESTED, {
      eventId: `evt_${crypto.randomUUID()}`,
      eventType: "NOTIFICATION_REQUESTED",
      timestamp: new Date().toISOString(),
      source: "workspace-service",
      version: "1.0",
      payload: {
        workspaceId: input.workspaceId,
        title: "Team Member Invited",
        message: `${input.email} was invited as a ${input.role} to workspace "${ws.name}".`,
        type: "info",
      },
    });

    logger.info("Member invited", { workspaceId: input.workspaceId, email: input.email });
    return invitation;
  }

  public async updateMemberRole(workspaceId: string, memberId: string, role: Role) {
    const member = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });

    if (!member) throw new NotFoundError("Member not found in workspace");
    if (member.role === "OWNER") throw new ForbiddenError("Cannot modify primary owner role");

    await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role },
    });

    logger.info("Member role updated", { workspaceId, memberId, role });
  }

  public async removeMember(workspaceId: string, memberId: string) {
    const member = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });

    if (!member) throw new NotFoundError("Member not found in workspace");
    if (member.role === "OWNER") throw new ForbiddenError("Cannot remove primary owner");

    await prisma.workspaceMember.delete({
      where: { id: memberId },
    });

    logger.info("Member removed", { workspaceId, memberId });
  }
}

export const workspaceService = new WorkspaceService();
