import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import {
  Link,
  CreateLinkDto,
  UpdateLinkDto,
  LinkFilterParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

export const linkService = {
  async getLinks(params: LinkFilterParams = {}): Promise<PaginatedResponse<Link>> {
    return apiClient.get<PaginatedResponse<Link>>(API_ROUTES.LINKS.BASE, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  async getLink(id: string): Promise<Link> {
    const res = await apiClient.get<ApiResponse<Link>>(API_ROUTES.LINKS.BY_ID(id));
    return res.data;
  },

  async createLink(dto: CreateLinkDto): Promise<Link> {
    const res = await apiClient.post<ApiResponse<Link>>(API_ROUTES.LINKS.BASE, dto);
    return res.data;
  },

  async updateLink(id: string, updates: UpdateLinkDto): Promise<Link> {
    const res = await apiClient.patch<ApiResponse<Link>>(API_ROUTES.LINKS.BY_ID(id), updates);
    return res.data;
  },

  async deleteLink(id: string): Promise<void> {
    await apiClient.delete(API_ROUTES.LINKS.BY_ID(id));
  },

  async bulkDeleteLinks(ids: string[]): Promise<void> {
    await apiClient.post(API_ROUTES.LINKS.BULK_DELETE, { ids });
  },

  async checkSlugAvailability(slug: string, domain: string): Promise<{ available: boolean }> {
    const res = await apiClient.get<ApiResponse<{ available: boolean }>>(
      API_ROUTES.LINKS.CHECK_SLUG,
      { params: { slug, domain } }
    );
    return res.data;
  },

  async resolveShortCode(shortCode: string): Promise<Link | null> {
    const res = await apiClient.get<ApiResponse<Link | null>>(API_ROUTES.REDIRECT.RESOLVE(shortCode));
    return res.data;
  },
};
