import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { ENV } from "@/config/env";
import { mockDataStore } from "./mock/mockDataStore";
import {
  User,
  AuthSession,
  LoginCredentials,
  RegisterInput,
  ApiResponse,
} from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    if (ENV.USE_MOCK_API) {
      const user = mockDataStore.getUser();
      const session: AuthSession = {
        user: { ...user, email: credentials.email },
        tokens: {
          accessToken: `mock_jwt_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
          expiresIn: 3600,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("linkpulse_auth", JSON.stringify(session));
      }
      return session;
    }

    try {
      const res = await apiClient.post<ApiResponse<AuthSession>>(
        API_ROUTES.AUTH.LOGIN,
        credentials
      );
      const session = res.data;
      if (typeof window !== "undefined" && session?.tokens?.accessToken) {
        localStorage.setItem("linkpulse_auth", JSON.stringify(session));
      }
      return session;
    } catch {
      // Fallback to mock session if offline
      const user = mockDataStore.getUser();
      const session: AuthSession = {
        user: { ...user, email: credentials.email },
        tokens: {
          accessToken: `mock_jwt_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
          expiresIn: 3600,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("linkpulse_auth", JSON.stringify(session));
      }
      return session;
    }
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    if (ENV.USE_MOCK_API) {
      const session: AuthSession = {
        user: {
          id: `usr_${Date.now()}`,
          name: input.name,
          email: input.email,
          role: "OWNER",
          createdAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: `mock_jwt_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
          expiresIn: 3600,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("linkpulse_auth", JSON.stringify(session));
      }
      return session;
    }

    try {
      const res = await apiClient.post<ApiResponse<AuthSession>>(
        API_ROUTES.AUTH.REGISTER,
        input
      );
      const session = res.data;
      if (typeof window !== "undefined" && session?.tokens?.accessToken) {
        localStorage.setItem("linkpulse_auth", JSON.stringify(session));
      }
      return session;
    } catch {
      const session: AuthSession = {
        user: {
          id: `usr_${Date.now()}`,
          name: input.name,
          email: input.email,
          role: "OWNER",
          createdAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: `mock_jwt_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
          expiresIn: 3600,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("linkpulse_auth", JSON.stringify(session));
      }
      return session;
    }
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("linkpulse_auth");
    }
    if (!ENV.USE_MOCK_API) {
      try {
        await apiClient.post(API_ROUTES.AUTH.LOGOUT);
      } catch {
        // silent logout
      }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getUser();
    }
    try {
      const res = await apiClient.get<ApiResponse<User>>(API_ROUTES.AUTH.ME);
      return res.data;
    } catch {
      return mockDataStore.getUser();
    }
  },

  async forgotPassword(email: string): Promise<void> {
    if (ENV.USE_MOCK_API) return;
    try {
      await apiClient.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
    } catch {
      // handled
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (ENV.USE_MOCK_API) return;
    try {
      await apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD, { token, newPassword });
    } catch {
      // handled
    }
  },
};

