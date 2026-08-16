import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { ENV } from "@/config/env";
import { mockDataStore } from "./mock/mockDataStore";
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
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getLinks(params);
    }
    return apiClient.get<PaginatedResponse<Link>>(API_ROUTES.LINKS.BASE, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  async getLink(id: string): Promise<Link> {
    if (ENV.USE_MOCK_API) {
      const link = mockDataStore.getLinkById(id) || mockDataStore.getLinks().data[0];
      if (!link) throw { status: 404, message: "Link not found" };
      return link;
    }
    const res = await apiClient.get<ApiResponse<Link>>(API_ROUTES.LINKS.BY_ID(id));
    return res.data;
  },

  async createLink(dto: CreateLinkDto): Promise<Link> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.createLink(dto);
    }
    const res = await apiClient.post<ApiResponse<Link>>(API_ROUTES.LINKS.BASE, dto);
    return res.data;
  },

  async updateLink(id: string, updates: UpdateLinkDto): Promise<Link> {
    if (ENV.USE_MOCK_API) {
      const updated = mockDataStore.updateLink(id, updates);
      if (!updated) throw { status: 404, message: "Link not found" };
      return updated;
    }
    const res = await apiClient.patch<ApiResponse<Link>>(API_ROUTES.LINKS.BY_ID(id), updates);
    return res.data;
  },

  async deleteLink(id: string): Promise<void> {
    if (ENV.USE_MOCK_API) {
      mockDataStore.deleteLink(id);
      return;
    }
    await apiClient.delete(API_ROUTES.LINKS.BY_ID(id));
  },

  async bulkDeleteLinks(ids: string[]): Promise<void> {
    if (ENV.USE_MOCK_API) {
      mockDataStore.bulkDeleteLinks(ids);
      return;
    }
    await apiClient.post(API_ROUTES.LINKS.BULK_DELETE, { ids });
  },

  async checkSlugAvailability(slug: string, domain: string): Promise<{ available: boolean }> {
    if (ENV.USE_MOCK_API) {
      const existing = mockDataStore.getLinkByShortCode(slug);
      return { available: !existing };
    }
    const res = await apiClient.get<ApiResponse<{ available: boolean }>>(
      API_ROUTES.LINKS.CHECK_SLUG,
      { params: { slug, domain } }
    );
    return res.data;
  },

  async resolveShortCode(shortCode: string): Promise<Link | null> {
    if (ENV.USE_MOCK_API) {
      const link = mockDataStore.getLinkByShortCode(shortCode);
      if (link) mockDataStore.recordClick(shortCode);
      return link || null;
    }
    try {
      const res = await apiClient.get<ApiResponse<Link>>(API_ROUTES.REDIRECT.RESOLVE(shortCode));
      return res.data;
    } catch {
      return null;
    }
  },
};
