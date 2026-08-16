import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  activeWorkspaceId: string;
  theme: "dark" | "light";
  searchModalOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveWorkspaceId: (workspaceId: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
  setSearchModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeWorkspaceId: "ws_main",
      theme: "dark",
      searchModalOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setActiveWorkspaceId: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === "dark" ? "light" : "dark";
          if (typeof document !== "undefined") {
            if (next === "dark") {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
          return { theme: next };
        }),
      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        set({ theme });
      },
      setSearchModalOpen: (open) => set({ searchModalOpen: open }),
    }),
    {
      name: "linkpulse_ui_prefs",
    }
  )
);
