import type { DojoEnvironment } from "../types/dojo.types";

export const DOJO_ENVIRONMENTS: DojoEnvironment[] = [
  {
    id: "fantasy-island",
    name: "Île Fantastique",
    videoUrl: "/src/assets/images/fantasy-island.1920x1080.mp4",
    description: "Un environnement mystique et paisible pour l'apprentissage",
    isActive: true,
  },
];

export const POMODORO_DEFAULTS = {
  workDuration: 25, // minutes
  shortBreakDuration: 5, // minutes
  longBreakDuration: 15, // minutes
  longBreakInterval: 4, // après 4 pomodoros
};

export const DOJO_ANIMATIONS = {
  cardTransition: "transition-all duration-300 ease-in-out",
  backgroundTransition: "transition-opacity duration-500 ease-in-out",
  collapseTransition: "transition-all duration-200 ease-in-out",
};
