import { create } from "zustand";

interface ThemeState {
  theme: "dark";
  toggleTheme: () => void;
  setTheme: (theme: "dark") => void;
}

export const useThemeStore = create<ThemeState>(() => ({
  theme: "dark",
  toggleTheme: () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark");
    }
  },
  setTheme: () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark");
    }
  },
}));
