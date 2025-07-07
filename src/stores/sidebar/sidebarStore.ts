import { create } from "zustand";

type SidebarMode = "auto" | "manual";

interface SidebarState {
  isCollapsed: boolean;
  mode: SidebarMode;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMode: (mode: SidebarMode) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  mode: "auto",
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set(() => ({ isCollapsed: collapsed })),
  setMode: (mode) => set(() => ({ mode })),
}));
