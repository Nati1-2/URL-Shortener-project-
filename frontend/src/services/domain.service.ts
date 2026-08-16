import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { ENV } from "@/config/env";
import { mockDataStore } from "./mock/mockDataStore";
import { Domain, AddDomainDto, ApiResponse } from "@/types";

export const domainService = {
  async getDomains(workspaceId: string = "ws_main"): Promise<Domain[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getDomains(workspaceId);
    }
    const res = await apiClient.get<ApiResponse<Domain[]>>(API_ROUTES.DOMAINS.BASE, {
      params: { workspaceId },
    });
    return res.data;
  },

  async addDomain(dto: AddDomainDto): Promise<Domain> {
    if (ENV.USE_MOCK_API) {
      const newDomain: Domain = {
        id: `dom_${Date.now()}`,
        workspaceId: dto.workspaceId,
        hostname: dto.hostname,
        status: "pending",
        sslStatus: "provisioning",
        isCustom: true,
        isDefault: false,
        dnsRecords: [
          { type: "CNAME", name: dto.hostname.split(".")[0] || "@", value: "cname.linkpulse.io", status: "missing" },
        ],
        createdAt: new Date().toISOString(),
      };
      return newDomain;
    }
    const res = await apiClient.post<ApiResponse<Domain>>(API_ROUTES.DOMAINS.BASE, dto);
    return res.data;
  },

  async verifyDomain(id: string): Promise<{ verified: boolean }> {
    if (ENV.USE_MOCK_API) {
      return { verified: true };
    }
    const res = await apiClient.post<ApiResponse<{ verified: boolean }>>(API_ROUTES.DOMAINS.VERIFY(id));
    return res.data;
  },

  async deleteDomain(id: string): Promise<void> {
    if (ENV.USE_MOCK_API) return;
    await apiClient.delete(API_ROUTES.DOMAINS.BY_ID(id));
  },
};
