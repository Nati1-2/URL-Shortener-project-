import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { ENV } from "@/config/env";
import { mockDataStore } from "./mock/mockDataStore";
import {
  Workspace,
  WorkspaceMember,
  InviteMemberDto,
  Role,
  ApiResponse,
} from "@/types";

export const workspaceService = {
  async getWorkspaces(): Promise<Workspace[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getWorkspaces();
    }
    const res = await apiClient.get<ApiResponse<Workspace[]>>(API_ROUTES.WORKSPACES.BASE);
    return res.data;
  },

  async getWorkspace(id: string): Promise<Workspace> {
    if (ENV.USE_MOCK_API) {
      const ws = mockDataStore.getWorkspaces().find((w) => w.id === id) || mockDataStore.getWorkspaces()[0];
      return ws;
    }
    const res = await apiClient.get<ApiResponse<Workspace>>(API_ROUTES.WORKSPACES.BY_ID(id));
    return res.data;
  },

  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getMembers(workspaceId);
    }
    const res = await apiClient.get<ApiResponse<WorkspaceMember[]>>(
      API_ROUTES.WORKSPACES.MEMBERS(workspaceId)
    );
    return res.data;
  },

  async inviteMember(workspaceId: string, dto: InviteMemberDto): Promise<void> {
    if (ENV.USE_MOCK_API) return;
    await apiClient.post(API_ROUTES.WORKSPACES.INVITE(workspaceId), dto);
  },

  async updateMemberRole(workspaceId: string, memberId: string, role: Role): Promise<void> {
    if (ENV.USE_MOCK_API) return;
    await apiClient.patch(API_ROUTES.WORKSPACES.UPDATE_ROLE(workspaceId, memberId), { role });
  },
};
