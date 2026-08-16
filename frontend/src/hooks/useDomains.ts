import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { domainService } from "@/services/domain.service";
import { AddDomainDto } from "@/types";
import { useToastStore } from "@/store/useToastStore";

export const DOMAIN_QUERY_KEYS = {
  all: ["domains"] as const,
  list: (workspaceId?: string) => [...DOMAIN_QUERY_KEYS.all, "list", workspaceId] as const,
};

export function useDomains(workspaceId?: string) {
  return useQuery({
    queryKey: DOMAIN_QUERY_KEYS.list(workspaceId),
    queryFn: () => domainService.getDomains(workspaceId),
  });
}

export function useAddDomain() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (dto: AddDomainDto) => domainService.addDomain(dto),
    onSuccess: (domain) => {
      queryClient.invalidateQueries({ queryKey: DOMAIN_QUERY_KEYS.all });
      addToast({
        type: "success",
        title: "Domain added",
        message: `Configure DNS records for ${domain.hostname}`,
      });
    },
    onError: (err: any) => {
      addToast({
        type: "error",
        title: "Failed to add domain",
        message: err?.message,
      });
    },
  });
}

export function useVerifyDomain() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (id: string) => domainService.verifyDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOMAIN_QUERY_KEYS.all });
      addToast({
        type: "success",
        title: "Domain verified and SSL active!",
      });
    },
  });
}
