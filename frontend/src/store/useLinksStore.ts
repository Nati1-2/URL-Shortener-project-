import { create } from "zustand";
import { INITIAL_LINKS, ShortLink } from "@/mock/linksData";

interface LinksState {
  links: ShortLink[];
  searchQuery: string;
  statusFilter: string;
  sortBy: "createdAt" | "clicks" | "title";
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setSortBy: (sort: "createdAt" | "clicks" | "title") => void;
  addLink: (link: Omit<ShortLink, "id" | "shortUrl" | "shortCode" | "clicks" | "createdAt"> & { shortCode?: string }) => ShortLink;
  updateLink: (id: string, updates: Partial<ShortLink>) => void;
  deleteLink: (id: string) => void;
  bulkDeleteLinks: (ids: string[]) => void;
  getLinkById: (id: string) => ShortLink | undefined;
  getLinkByShortCode: (code: string) => ShortLink | undefined;
  recordClick: (code: string) => void;
}

export const useLinksStore = create<LinksState>((set, get) => ({
  links: INITIAL_LINKS,
  searchQuery: "",
  statusFilter: "all",
  sortBy: "createdAt",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSortBy: (sort) => set({ sortBy: sort }),
  addLink: (newLinkData) => {
    const randomSlug = Math.random().toString(36).substring(2, 8);
    const shortCode = newLinkData.shortCode || randomSlug;
    const domain = newLinkData.domain || "ly.nk";
    const newLink: ShortLink = {
      ...newLinkData,
      id: `lnk_${Date.now()}`,
      shortCode,
      shortUrl: `${domain}/${shortCode}`,
      clicks: 0,
      createdAt: new Date().toISOString(),
      status: newLinkData.status || "active",
      tags: newLinkData.tags || ["General"],
    };
    set((state) => ({ links: [newLink, ...state.links] }));
    return newLink;
  },
  updateLink: (id, updates) =>
    set((state) => ({
      links: state.links.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      ),
    })),
  deleteLink: (id) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    })),
  bulkDeleteLinks: (ids) =>
    set((state) => ({
      links: state.links.filter((link) => !ids.includes(link.id)),
    })),
  getLinkById: (id) => get().links.find((l) => l.id === id),
  getLinkByShortCode: (code) => get().links.find((l) => l.shortCode.toLowerCase() === code.toLowerCase()),
  recordClick: (code) =>
    set((state) => ({
      links: state.links.map((l) =>
        l.shortCode.toLowerCase() === code.toLowerCase()
          ? { ...l, clicks: l.clicks + 1 }
          : l
      ),
    })),
}));
