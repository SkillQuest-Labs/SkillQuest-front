export const difficultyConfig = {
  Facile: {
    icon: "🟢",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  Moyen: {
    icon: "🟡",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  },
  Difficile: {
    icon: "🔴",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

export const statusConfig = {
  not_started: {
    icon: "⏳",
    label: "Non commencé",
    className:
      "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  },
  in_progress: {
    icon: "🚀",
    label: "En cours",
    className:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  completed: {
    icon: "✅",
    label: "Terminé",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  draft: {
    icon: "📝",
    label: "Brouillon",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  },
};

export const statCards = [
  {
    key: "total",
    title: "Total",
    icon: "🎯",
    color: "text-blue-600",
  },
  {
    key: "completed",
    title: "Terminés",
    icon: "✅",
    color: "text-green-600",
  },
  {
    key: "inProgress",
    title: "En cours",
    icon: "🚀",
    color: "text-purple-600",
  },
  {
    key: "notStarted",
    title: "Non commencés",
    icon: "⏳",
    color: "text-gray-600",
  },
  {
    key: "draft",
    title: "Brouillons",
    icon: "📝",
    color: "text-orange-600",
  },
  {
    key: "averageProgress",
    title: "Progression moy.",
    icon: "📊",
    color: "text-indigo-600",
  },
];

export const COLORS = ["#fff", "#facc15", "#a78bfa"];
