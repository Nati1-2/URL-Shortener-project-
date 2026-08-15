import { create } from "zustand";
import { MOCK_USER } from "@/lib/constants";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USER,
  isAuthenticated: true,
  login: async (email, pass) => {
    await new Promise((res) => setTimeout(res, 800));
    set({
      user: { ...MOCK_USER, email },
      isAuthenticated: true,
    });
    return true;
  },
  register: async (name, email, pass) => {
    await new Promise((res) => setTimeout(res, 800));
    set({
      user: { ...MOCK_USER, name, email },
      isAuthenticated: true,
    });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
