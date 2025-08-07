import { create } from "zustand";

type LoadingType = "spinner" | "overlay" | "skeleton" | "progress";

type LoadingStore = {
  isLoading: boolean;
  loadingType: LoadingType;
  setLoading: (isLoading: boolean, loadingType?: LoadingType) => void;
  resetLoading: () => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  loadingType: "spinner",
  setLoading: (isLoading, loadingType = "spinner") =>
    set({
      isLoading,
      loadingType,
    }),
  resetLoading: () => set({ isLoading: false, loadingType: "spinner" }),
}));
