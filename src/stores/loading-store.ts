import { create } from "zustand";

type LoadingType = "spinner" | "overlay" | "skeleton" | "progress";

type LoadingStore = {
  isLoading: boolean;
  loadingType: LoadingType;
  setLoading: (isLoading: boolean, type?: LoadingType) => void;
  resetLoading: () => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  loadingType: "spinner",
  setLoading: (isLoading, type = "spinner") => set({ isLoading, loadingType: type }),
  resetLoading: () => set({ isLoading: false, loadingType: "spinner" }),
}));
