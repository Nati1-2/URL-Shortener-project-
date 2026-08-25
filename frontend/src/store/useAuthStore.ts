import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthSession } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setSession: (session) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("linkpulse_auth", JSON.stringify(session));
        }
        set({ user: session.user, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("linkpulse_auth");
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "linkpulse_auth_store",
    }
  )
);
