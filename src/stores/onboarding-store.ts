import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CanvasOnboardingState {
  completed: boolean;
  setCompleted: (completed: boolean) => void;
  reset: () => void;
}

export const useCanvasOnboardingStore = create<CanvasOnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      setCompleted: (completed: boolean) => set({ completed }),
      reset: () => set({ completed: false }),
    }),
    { name: "canvas-onboarding" },
  ),
);
