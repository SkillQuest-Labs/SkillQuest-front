import type { Skill } from "./skills.types";

import img1 from "../../assets/skills/1.png";
import img2 from "../../assets/skills/2.png";
import img3 from "../../assets/skills/3.png";
import img4 from "../../assets/skills/4.png";
import img5 from "../../assets/skills/5.png";
import img6 from "../../assets/skills/6.png";
import img7 from "../../assets/skills/7.png";
import img8 from "../../assets/skills/8.png";
import img9 from "../../assets/skills/9.png";
import img10 from "../../assets/skills/10.png";
import img11 from "../../assets/skills/11.png";

export const skillsMock: Skill[] = [
  {
    id: "1",
    title: "Écriture",
    description: "Améliorer ses capacités rédactionnelles et sa créativité à l'écrit.",
    category: "Développement personnel",
    difficulty: "medium",
    status: "in_progress",
    createdAt: "2024-05-01T10:00:00Z",
    image: img1,
  },
  {
    id: "2",
    title: "Rigueur",
    description: "Développer la constance et la discipline dans ses activités quotidiennes.",
    category: "Développement personnel",
    difficulty: "hard",
    status: "finished",
    createdAt: "2024-05-02T10:00:00Z",
    image: img2,
  },
  {
    id: "3",
    title: "Sommeil",
    description: "Optimiser la qualité et la régularité de son sommeil.",
    category: "Santé",
    difficulty: "easy",
    status: "not_started",
    createdAt: "2024-05-03T10:00:00Z",
    image: img3,
  },
  {
    id: "4",
    title: "Lecture",
    description: "Lire régulièrement pour enrichir ses connaissances et sa curiosité.",
    category: "Culture",
    difficulty: "medium",
    status: "draft",
    createdAt: "2024-05-04T10:00:00Z",
    image: img4,
  },
  {
    id: "5",
    title: "Gestion des émotions",
    description: "Apprendre à reconnaître et à gérer ses émotions efficacement.",
    category: "Développement personnel",
    difficulty: "hard",
    status: "in_progress",
    createdAt: "2024-05-05T10:00:00Z",
    image: img5,
  },
  {
    id: "6",
    title: "Alimentation",
    description: "Adopter une alimentation saine et équilibrée.",
    category: "Santé",
    difficulty: "easy",
    status: "not_started",
    createdAt: "2024-05-06T10:00:00Z",
    image: img6,
  },
  {
    id: "7",
    title: "Art",
    description: "Développer ses compétences artistiques et sa sensibilité.",
    category: "Créativité",
    difficulty: "medium",
    status: "draft",
    createdAt: "2024-05-07T10:00:00Z",
    image: img7,
  },
  {
    id: "8",
    title: "Gestion financière",
    description: "Mieux gérer son budget et ses finances personnelles.",
    category: "Vie pratique",
    difficulty: "hard",
    status: "finished",
    createdAt: "2024-05-08T10:00:00Z",
    image: img8,
  },
  {
    id: "9",
    title: "Sport",
    description: "Améliorer sa condition physique et sa santé.",
    category: "Santé",
    difficulty: "medium",
    status: "in_progress",
    createdAt: "2024-05-09T10:00:00Z",
    image: img9,
  },
  {
    id: "10",
    title: "Programmation",
    description: "Développer des compétences en développement logiciel.",
    category: "Tech",
    difficulty: "hard",
    status: "draft",
    createdAt: "2024-05-10T10:00:00Z",
    image: img10,
  },
  {
    id: "11",
    title: "Cuisine",
    description: "Apprendre à cuisiner des plats sains et savoureux.",
    category: "Vie pratique",
    difficulty: "easy",
    status: "not_started",
    createdAt: "2024-05-11T10:00:00Z",
    image: img11,
  },
  {
    id: "12",
    title: "Photographie",
    description: "Maîtriser les bases de la photographie et de la retouche.",
    category: "Créativité",
    difficulty: "medium",
    status: "in_progress",
    createdAt: "2024-05-12T10:00:00Z",
    image: img1,
  },
  {
    id: "13",
    title: "Jardinage",
    description: "Entretenir un jardin et cultiver ses propres légumes.",
    category: "Nature",
    difficulty: "easy",
    status: "finished",
    createdAt: "2024-05-13T10:00:00Z",
    image: img2,
  },
  {
    id: "14",
    title: "Musique",
    description: "Apprendre à jouer d’un instrument de musique.",
    category: "Créativité",
    difficulty: "medium",
    status: "draft",
    createdAt: "2024-05-14T10:00:00Z",
    image: img3,
  },
  {
    id: "15",
    title: "Lecture rapide",
    description: "Développer des techniques de lecture rapide.",
    category: "Culture",
    difficulty: "hard",
    status: "not_started",
    createdAt: "2024-05-15T10:00:00Z",
    image: img4,
  },
  {
    id: "16",
    title: "Méditation",
    description: "Découvrir les bienfaits de la méditation quotidienne.",
    category: "Développement personnel",
    difficulty: "easy",
    status: "finished",
    createdAt: "2024-05-16T10:00:00Z",
    image: img5,
  },
  {
    id: "17",
    title: "Langues étrangères",
    description: "Apprendre une nouvelle langue pour voyager.",
    category: "Culture",
    difficulty: "medium",
    status: "in_progress",
    createdAt: "2024-05-17T10:00:00Z",
    image: img6,
  },
  {
    id: "18",
    title: "Développement web",
    description: "Créer des sites web modernes et responsives.",
    category: "Tech",
    difficulty: "hard",
    status: "draft",
    createdAt: "2024-05-18T10:00:00Z",
    image: img7,
  },
];

export const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export const statusColors = {
  draft: "bg-gray-200 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  not_started: "bg-yellow-100 text-yellow-700",
  finished: "bg-green-100 text-green-700",
};

export const statusLabels = {
  draft: "Draft",
  in_progress: "In progress",
  not_started: "Not started",
  finished: "Finished",
};
