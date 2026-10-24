import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  activeWorkspaceId: string;
  theme: "dark";
  searchModalOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveWorkspaceId: (workspaceId: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark") => void;
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
      toggleTheme: () => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
        }
      },
      setTheme: () => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
        }
      },
      setSearchModalOpen: (open) => set({ searchModalOpen: open }),
    }),
    {
      name: "linkpulse_ui_prefs",
    }
  )
);
