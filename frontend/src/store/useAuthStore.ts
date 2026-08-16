import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

const defaultUser: User = {
  id: "usr_1",
  name: "Alex Vance",
  email: "alex.vance@acme.inc",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Growth Lead & Marketing Engineer at Acme Inc.",
  role: "OWNER",
  twoFactorEnabled: true,
  createdAt: "2026-01-10T00:00:00.000Z",
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  login: (email: string, pass?: string) => Promise<boolean>;
  register: (name: string, email: string, pass?: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: defaultUser,
      isAuthenticated: true,
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      login: async (email) => {
        set({
          user: { ...defaultUser, email },
          isAuthenticated: true,
        });
        return true;
      },
      register: async (name, email) => {
        set({
          user: { ...defaultUser, name, email },
          isAuthenticated: true,
        });
        return true;
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
