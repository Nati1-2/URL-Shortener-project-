import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import {
  Workspace,
  WorkspaceMember,
  InviteMemberDto,
  Role,
  ApiResponse,
} from "@/types";

export const workspaceService = {
  async getWorkspaces(): Promise<Workspace[]> {
    const res = await apiClient.get<ApiResponse<Workspace[]>>(API_ROUTES.WORKSPACES.BASE);
    return res.data;
  },

  async getWorkspace(id: string): Promise<Workspace> {
    const res = await apiClient.get<ApiResponse<Workspace>>(API_ROUTES.WORKSPACES.BY_ID(id));
    return res.data;
  },

  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const res = await apiClient.get<ApiResponse<WorkspaceMember[]>>(
      API_ROUTES.WORKSPACES.MEMBERS(workspaceId)
    );
    return res.data;
  },

  async inviteMember(workspaceId: string, dto: InviteMemberDto): Promise<void> {
    await apiClient.post(API_ROUTES.WORKSPACES.INVITE(workspaceId), dto);
  },

  async updateMemberRole(workspaceId: string, memberId: string, role: Role): Promise<void> {
    await apiClient.patch(API_ROUTES.WORKSPACES.UPDATE_ROLE(workspaceId, memberId), { role });
  },
};
