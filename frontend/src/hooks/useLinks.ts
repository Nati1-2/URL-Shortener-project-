import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { linkService } from "@/services/link.service";
import { CreateLinkDto, UpdateLinkDto, LinkFilterParams, Link } from "@/types";
import { useToastStore } from "@/store/useToastStore";

export const LINK_QUERY_KEYS = {
  all: ["links"] as const,
  lists: () => [...LINK_QUERY_KEYS.all, "list"] as const,
  list: (params: LinkFilterParams) => [...LINK_QUERY_KEYS.lists(), params] as const,
  details: () => [...LINK_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...LINK_QUERY_KEYS.details(), id] as const,
};

export function useLinks(params: LinkFilterParams = {}) {
  return useQuery({
    queryKey: LINK_QUERY_KEYS.list(params),
    queryFn: () => linkService.getLinks(params),
  });
}

export function useLink(id: string) {
  return useQuery({
    queryKey: LINK_QUERY_KEYS.detail(id),
    queryFn: () => linkService.getLink(id),
    enabled: Boolean(id),
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (dto: CreateLinkDto) => linkService.createLink(dto),
    onSuccess: (newLink) => {
      queryClient.invalidateQueries({ queryKey: LINK_QUERY_KEYS.all });
      addToast({
        type: "success",
        title: "Short Link Created!",
        message: `https://${newLink.shortUrl}`,
      });
    },
    onError: (err: any) => {
      addToast({
        type: "error",
        title: "Failed to create short link",
        message: err?.message || "An unexpected error occurred.",
      });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateLinkDto }) =>
      linkService.updateLink(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: LINK_QUERY_KEYS.all });
      addToast({
        type: "success",
        title: "Link updated successfully",
      });
    },
    onError: (err: any) => {
      addToast({
        type: "error",
        title: "Update failed",
        message: err?.message || "Could not update link.",
      });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (id: string) => linkService.deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINK_QUERY_KEYS.all });
      addToast({
        type: "success",
        title: "Short link deleted",
      });
    },
    onError: (err: any) => {
      addToast({
        type: "error",
        title: "Delete failed",
        message: err?.message || "Could not delete short link.",
      });
    },
  });
}

export function useBulkDeleteLinks() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (ids: string[]) => linkService.bulkDeleteLinks(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: LINK_QUERY_KEYS.all });
      addToast({
        type: "success",
        title: `Deleted ${ids.length} links`,
      });
    },
    onError: (err: any) => {
      addToast({
        type: "error",
        title: "Bulk delete failed",
        message: err?.message || "Could not delete selected links.",
      });
    },
  });
}
