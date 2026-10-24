import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { Domain, AddDomainDto, ApiResponse } from "@/types";

export const domainService = {
  async getDomains(workspaceId: string = "ws_main"): Promise<Domain[]> {
    const res = await apiClient.get<ApiResponse<Domain[]>>(API_ROUTES.DOMAINS.BASE, {
      params: { workspaceId },
    });
    return res.data;
  },

  async addDomain(dto: AddDomainDto): Promise<Domain> {
    const res = await apiClient.post<ApiResponse<Domain>>(API_ROUTES.DOMAINS.BASE, dto);
    return res.data;
  },

  async verifyDomain(id: string): Promise<{ verified: boolean }> {
    const res = await apiClient.post<ApiResponse<{ verified: boolean }>>(API_ROUTES.DOMAINS.VERIFY(id));
    return res.data;
  },

  async deleteDomain(id: string): Promise<void> {
    await apiClient.delete(API_ROUTES.DOMAINS.BY_ID(id));
  },
};
