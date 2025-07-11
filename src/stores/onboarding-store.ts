import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CanvasOnboardingState {
  completed: boolean;
  setCompleted: (completed: boolean) => void;
}

export const useCanvasOnboardingStore = create<CanvasOnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      setCompleted: (completed: boolean) => set({ completed }),
    }),
    { name: "canvas-onboarding" },
  ),
);
