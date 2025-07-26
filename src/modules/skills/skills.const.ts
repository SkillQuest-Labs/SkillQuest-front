// import type { Skill } from "./skills.types";

// import img1 from "../../assets/skills/1.png";
// import img2 from "../../assets/skills/2.png";
// import img3 from "../../assets/skills/3.png";
// import img4 from "../../assets/skills/4.png";
// import img5 from "../../assets/skills/5.png";
// import img6 from "../../assets/skills/6.png";
// import img7 from "../../assets/skills/7.png";
// import img8 from "../../assets/skills/8.png";
// import img9 from "../../assets/skills/9.png";
// import img10 from "../../assets/skills/10.png";
// import img11 from "../../assets/skills/11.png";

// export const skillsMock: Skill[] = [
//   {
//     id: "1",
//     title: "Écriture",
//     description: "Améliorer ses capacités rédactionnelles et sa créativité à l'écrit.",
//     category: "Perso",
//     difficulty: "medium",
//     status: "in_progress",
//     createdAt: "2024-05-01T10:00:00Z",
//     image: img1,
//     progress: 60,
//   },
//   {
//     id: "2",
//     title: "Rigueur",
//     description: "Développer la constance et la discipline dans ses activités quotidiennes.",
//     category: "Santé",
//     difficulty: "hard",
//     status: "finished",
//     createdAt: "2024-05-02T10:00:00Z",
//     image: img2,
//     progress: 100,
//   },
//   {
//     id: "3",
//     title: "Sommeil",
//     description: "Optimiser la qualité et la régularité de son sommeil.",
//     category: "Santé",
//     difficulty: "easy",
//     status: "not_started",
//     createdAt: "2024-05-03T10:00:00Z",
//     image: img3,
//     progress: 0,
//   },
//   {
//     id: "4",
//     title: "Lecture",
//     description: "Lire régulièrement pour enrichir ses connaissances et sa curiosité.",
//     category: "Culture",
//     difficulty: "medium",
//     status: "draft",
//     createdAt: "2024-05-04T10:00:00Z",
//     image: img4,
//     progress: 30,
//   },
//   {
//     id: "5",
//     title: "Gestion des émotions",
//     description: "Apprendre à reconnaître et à gérer ses émotions efficacement.",
//     category: "Développement personnel",
//     difficulty: "hard",
//     status: "in_progress",
//     createdAt: "2024-05-05T10:00:00Z",
//     image: img5,
//     progress: 70,
//   },
//   {
//     id: "6",
//     title: "Alimentation",
//     description: "Adopter une alimentation saine et équilibrée.",
//     category: "Santé",
//     difficulty: "easy",
//     status: "not_started",
//     createdAt: "2024-05-06T10:00:00Z",
//     image: img6,
//     progress: 0,
//   },
//   {
//     id: "7",
//     title: "Art",
//     description: "Développer ses compétences artistiques et sa sensibilité.",
//     category: "Créativité",
//     difficulty: "medium",
//     status: "draft",
//     createdAt: "2024-05-07T10:00:00Z",
//     image: img7,
//     progress: 20,
//   },
//   {
//     id: "8",
//     title: "Gestion financière",
//     description: "Mieux gérer son budget et ses finances personnelles.",
//     category: "Vie pratique",
//     difficulty: "hard",
//     status: "finished",
//     createdAt: "2024-05-08T10:00:00Z",
//     image: img8,
//     progress: 100,
//   },
//   {
//     id: "9",
//     title: "Sport",
//     description: "Améliorer sa condition physique et sa santé.",
//     category: "Santé",
//     difficulty: "medium",
//     status: "in_progress",
//     createdAt: "2024-05-09T10:00:00Z",
//     image: img9,
//     progress: 50,
//   },
//   {
//     id: "10",
//     title: "Programmation",
//     description: "Développer des compétences en développement logiciel.",
//     category: "Tech",
//     difficulty: "hard",
//     status: "draft",
//     createdAt: "2024-05-10T10:00:00Z",
//     image: img10,
//     progress: 10,
//   },
//   {
//     id: "11",
//     title: "Cuisine",
//     description: "Apprendre à cuisiner des plats sains et savoureux.",
//     category: "Vie pratique",
//     difficulty: "easy",
//     status: "not_started",
//     createdAt: "2024-05-11T10:00:00Z",
//     image: img11,
//     progress: 0,
//   },
//   {
//     id: "12",
//     title: "Photographie",
//     description: "Maîtriser les bases de la photographie et de la retouche.",
//     category: "Créativité",
//     difficulty: "medium",
//     status: "in_progress",
//     createdAt: "2024-05-12T10:00:00Z",
//     image: img1,
//     progress: 40,
//   },
//   {
//     id: "13",
//     title: "Jardinage",
//     description: "Entretenir un jardin et cultiver ses propres légumes.",
//     category: "Nature",
//     difficulty: "easy",
//     status: "finished",
//     createdAt: "2024-05-13T10:00:00Z",
//     image: img2,
//     progress: 100,
//   },
//   {
//     id: "14",
//     title: "Musique",
//     description: "Apprendre à jouer d'un instrument de musique.",
//     category: "Créativité",
//     difficulty: "medium",
//     status: "draft",
//     createdAt: "2024-05-14T10:00:00Z",
//     image: img3,
//     progress: 10,
//   },
//   {
//     id: "15",
//     title: "Lecture rapide",
//     description: "Développer des techniques de lecture rapide.",
//     category: "Culture",
//     difficulty: "hard",
//     status: "not_started",
//     createdAt: "2024-05-15T10:00:00Z",
//     image: img4,
//     progress: 0,
//   },
//   {
//     id: "16",
//     title: "Méditation",
//     description: "Découvrir les bienfaits de la méditation quotidienne.",
//     category: "Santé",
//     difficulty: "easy",
//     status: "finished",
//     createdAt: "2024-05-16T10:00:00Z",
//     image: img5,
//     progress: 100,
//   },
//   {
//     id: "17",
//     title: "Langues étrangères",
//     description: "Apprendre une nouvelle langue pour voyager.",
//     category: "Culture",
//     difficulty: "medium",
//     status: "in_progress",
//     createdAt: "2024-05-17T10:00:00Z",
//     image: img6,
//     progress: 80,
//   },
//   {
//     id: "18",
//     title: "Développement web",
//     description: "Créer des sites web modernes et responsives.",
//     category: "Tech",
//     difficulty: "hard",
//     status: "draft",
//     createdAt: "2024-05-18T10:00:00Z",
//     image: img7,
//     progress: 5,
//   },
// ];

export const difficultyColors = {
  EASY: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HARD: "bg-red-100 text-red-800",
  ALL: "bg-gray-100 text-gray-800",
};

export const statusColors = {
  DRAFT: "bg-gray-200 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  NOT_STARTED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  ALL: "bg-gray-100 text-gray-800",
};

export const statusLabels = {
  DRAFT: "DRAFT",
  IN_PROGRESS: "IN PROGRESS",
  NOT_STARTED: "NOT STARTED",
  COMPLETED: "COMPLETED",
  ALL: "ALL",
};

// Constantes pour la page de détail (sans ALL)
export const difficultyDetailColors = {
  EASY: "bg-green-500",
  MEDIUM: "bg-yellow-500",
  HARD: "bg-red-500",
} as const;

export const statusDetailColors = {
  DRAFT: "bg-gray-500",
  NOT_STARTED: "bg-blue-500",
  IN_PROGRESS: "bg-yellow-500",
  COMPLETED: "bg-green-500",
} as const;

export const statusDetailLabels = {
  DRAFT: "Brouillon",
  NOT_STARTED: "Non commencé",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
} as const;

export const difficultyDetailLabels = {
  EASY: "Facile",
  MEDIUM: "Moyen",
  HARD: "Difficile",
} as const;

export const SKILLS_PER_PAGE = 12;
