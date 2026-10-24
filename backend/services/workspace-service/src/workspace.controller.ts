import { Request, Response, NextFunction } from "express";
import { workspaceService } from "./workspace.service";
import { successResponse, BadRequestError } from "@linkpulse/common";

export class WorkspaceController {
  public async getWorkspaces(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.headers["x-user-id"] || "");
      if (!userId) {
        return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
      }
      const userName = String(req.headers["x-user-name"] || "User");
      const userEmail = String(req.headers["x-user-email"] || "");
      const list = await workspaceService.getWorkspaces(userId, { userName, userEmail });
      return res.status(200).json(successResponse(list));
    } catch (err) {
      next(err);
    }
  }

  public async getWorkspaceById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const ws = await workspaceService.getWorkspaceById(id);
      return res.status(200).json(successResponse(ws));
    } catch (err) {
      next(err);
    }
  }

  public async createWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const userId = String(req.headers["x-user-id"] || "usr_alex_vance");
      const userName = String(req.headers["x-user-name"] || "Alex Vance");
      const userEmail = String(req.headers["x-user-email"] || "alex@acme.inc");

      if (!name) throw new BadRequestError("Workspace name is required.");
      const ws = await workspaceService.createWorkspace({
        name,
        ownerId: userId,
        userName,
        userEmail,
      });
      return res.status(201).json(successResponse(ws, "Workspace created"));
    } catch (err) {
      next(err);
    }
  }

  public async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId as string;
      const members = await workspaceService.getMembers(workspaceId);
      return res.status(200).json(successResponse(members));
    } catch (err) {
      next(err);
    }
  }

  public async inviteMember(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId as string;
      const { email, role } = req.body;
      if (!email || !role) throw new BadRequestError("Email and role are required.");

      await workspaceService.inviteMember({
        workspaceId,
        email,
        role,
        inviterId: req.headers["x-user-id"] as string,
      });
      return res.status(200).json(successResponse(null, "Invitation sent successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async updateMemberRole(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId as string;
      const memberId = req.params.memberId as string;
      const { role } = req.body;
      if (!role) throw new BadRequestError("Role is required.");

      await workspaceService.updateMemberRole(workspaceId, memberId, role);
      return res.status(200).json(successResponse(null, "Member role updated"));
    } catch (err) {
      next(err);
    }
  }

  public async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId as string;
      const memberId = req.params.memberId as string;
      await workspaceService.removeMember(workspaceId, memberId);
      return res.status(200).json(successResponse(null, "Member removed from workspace"));
    } catch (err) {
      next(err);
    }
  }

}

export const workspaceController = new WorkspaceController();
