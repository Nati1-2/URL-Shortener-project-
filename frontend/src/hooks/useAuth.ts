import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginCredentials, RegisterInput } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export const AUTH_QUERY_KEYS = {
  me: ["auth", "me"] as const,
};

export function useCurrentUser() {
  const { setUser, setIsAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        }
        return user;
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (session) => {
      setUser(session.user);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
      router.push("/dashboard");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (session) => {
      setUser(session.user);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
      router.push("/dashboard");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push("/login");
    },
  });
}
