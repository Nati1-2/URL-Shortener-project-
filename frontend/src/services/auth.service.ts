import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { User, AuthSession, LoginCredentials, RegisterInput, ApiResponse } from "@/types";

function persist(session: AuthSession): AuthSession {
  if (typeof window !== "undefined") localStorage.setItem("linkpulse_auth", JSON.stringify(session));
  return session;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const res = await apiClient.post<ApiResponse<AuthSession>>(API_ROUTES.AUTH.LOGIN, credentials);
    return persist(res.data);
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    const res = await apiClient.post<ApiResponse<AuthSession>>(API_ROUTES.AUTH.REGISTER, input);
    return persist(res.data);
  },

  async logout(): Promise<void> {
    const raw = typeof window !== "undefined" ? localStorage.getItem("linkpulse_auth") : null;
    const refreshToken = raw ? JSON.parse(raw)?.tokens?.refreshToken : undefined;
    try { await apiClient.post(API_ROUTES.AUTH.LOGOUT, { refreshToken }); }
    finally { if (typeof window !== "undefined") localStorage.removeItem("linkpulse_auth"); }
  },

  async getCurrentUser(): Promise<User | null> {
    const res = await apiClient.get<ApiResponse<User>>(API_ROUTES.AUTH.ME);
    return res.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD, { token, newPassword });
  },
};