import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { InviteMemberDto, Role } from "@/types";
import { useToastStore } from "@/store/useToastStore";

export const WORKSPACE_QUERY_KEYS = {
  all: ["workspaces"] as const,
  list: () => [...WORKSPACE_QUERY_KEYS.all, "list"] as const,
  detail: (id: string) => [...WORKSPACE_QUERY_KEYS.all, "detail", id] as const,
  members: (id: string) => [...WORKSPACE_QUERY_KEYS.all, "members", id] as const,
};

export function useWorkspaces() {
  return useQuery({
    queryKey: WORKSPACE_QUERY_KEYS.list(),
    queryFn: () => workspaceService.getWorkspaces(),
  });
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: WORKSPACE_QUERY_KEYS.detail(id),
    queryFn: () => workspaceService.getWorkspace(id),
    enabled: Boolean(id),
  });
}

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: WORKSPACE_QUERY_KEYS.members(workspaceId),
    queryFn: () => workspaceService.getMembers(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useInviteMember(workspaceId: string) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (dto: InviteMemberDto) => workspaceService.inviteMember(workspaceId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_QUERY_KEYS.members(workspaceId) });
      addToast({
        type: "success",
        title: "Invitation sent",
      });
    },
    onError: (err: any) => {
      addToast({
        type: "error",
        title: "Invitation failed",
        message: err?.message,
      });
    },
  });
}
