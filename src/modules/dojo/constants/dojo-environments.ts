import type { DojoEnvironment } from "../types/dojo.types";

export const DOJO_ENVIRONMENTS: DojoEnvironment[] = [
  {
    id: "fantasy-island",
    name: "Île Fantastique",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479795/fantasy-island.mp4",
    description: "Un environnement mystique et paisible pour l'apprentissage",
    isActive: true,
  },
  {
    id: "endless-sea",
    name: "Mer infinie",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479798/endless-sea.mp4",
    description: "L'océan à perte de vue",
    isActive: true,
  },
  {
    id: "mountain-realm",
    name: "Par delà les Sommets",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479798/journey-through-the-mountains.mp4",
    description: "Vue à couper le souffle",
    isActive: true,
  },
  {
    id: "aesthetic-forest",
    name: "Forêt Dense",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479794/aesthetic-forest.mp4",
    description: "Ne vous laissez pas dérouter par les arbres",
    isActive: true,
  },
  {
    id: "purple sunset",
    name: "Purple-sunset",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479796/purple-sunset.mp4",
    description: "Les hauteur de la ville",
    isActive: true,
  },
  {
    id: "evening-beach",
    name: "Soirée en bord de mer",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758480048/evening-beach.mp4",
    description: "Les hauteur de la ville",
    isActive: true,
  },
  {
    id: "sunset-cat",
    name: "Félin nocturne",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479799/sunset-cat.mp4",
    description: "Meoow",
    isActive: true,
  },
  {
    id: "orange-train",
    name: "Train de nuit",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758480090/orange-train.mp4",
    description: "Les lumières du couché de soleil",
    isActive: true,
  },
  {
    id: "silent-snow",
    name: "Silence des neiges",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479798/silent-snow.mp4",
    description: "Point d'observation",
    isActive: true,
  },
  {
    id: "night-piltover",
    name: "Piltover",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479797/night-piltover.mp4",
    description: "Oiseaux de nuit",
    isActive: true,
  },
  {
    id: "cyberpunk-bedroom",
    name: "Chambre cyberpunk",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758479794/cyberpunk-bedroom.mp4",
    description: "Retour vers le futur",
    isActive: true,
  },
  {
    id: "boreal-valley",
    name: "Vallée boréale",
    videoUrl: "https://res.cloudinary.com/duunq6iio/video/upload/v1758483135/boreal-valley.mp4",
    description: "L'hiver est là",
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
