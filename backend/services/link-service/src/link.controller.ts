import { Request, Response, NextFunction } from "express";
import { linkService } from "./link.service";
import { successResponse, paginatedResponse, BadRequestError } from "@linkpulse/common";

export class LinkController {
  public async getLinks(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || (req.headers["x-workspace-id"] as string);
      const search = req.query.search as string;
      const status = req.query.status as string;
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as "asc" | "desc";
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await linkService.getLinks({
        workspaceId,
        search,
        status,
        sortBy,
        sortOrder,
        page,
        limit,
      });

      return res.status(200).json(
        paginatedResponse(result.links, result.page, result.limit, result.total)
      );
    } catch (err) {
      next(err);
    }
  }

  public async getLinkById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const link = await linkService.getLinkById(id);
      return res.status(200).json(successResponse(link));
    } catch (err) {
      next(err);
    }
  }

  public async createLink(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        originalUrl,
        shortCode,
        domain,
        status,
        tags,
        password,
        expiresAt,
        utmSource,
        utmMedium,
        utmCampaign,
        qrSettings,
      } = req.body;

      const workspaceId = (req.headers["x-workspace-id"] as string) || "ws_main";
      const createdBy = (req.headers["x-user-id"] as string) || "usr_alex_vance";

      const link = await linkService.createLink({
        title,
        originalUrl,
        shortCode,
        domain,
        status,
        tags,
        password,
        expiresAt,
        utmSource,
        utmMedium,
        utmCampaign,
        qrSettings,
        workspaceId,
        createdBy,
      });

      return res.status(201).json(successResponse(link, "Short link created successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async updateLink(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = await linkService.updateLink(id, req.body);
      return res.status(200).json(successResponse(updated, "Link updated successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async deleteLink(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await linkService.deleteLink(id);
      return res.status(200).json(successResponse(null, "Link deleted successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new BadRequestError("Array of link IDs is required.");
      }
      await linkService.bulkDeleteLinks(ids);
      return res.status(200).json(successResponse(null, "Links deleted successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async checkSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = (req.query.slug as string) || (req.body.slug as string);
      const domain = (req.query.domain as string) || (req.body.domain as string) || "ly.nk";
      if (!slug) throw new BadRequestError("Slug is required.");

      const result = await linkService.checkSlugAvailability(slug, domain);
      return res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  public async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const stats = await linkService.getLinkStats(id);
      return res.status(200).json(successResponse(stats));
    } catch (err) {
      next(err);
    }
  }

}

export const linkController = new LinkController();
