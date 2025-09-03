import { Activity, BarChart3, CheckSquare } from "lucide-react";
import { QuestCompletionChart, SkillExperienceChart, SkillRadarChart } from "../chart";
import type { TabItem } from "./tab-panel.type";
import { LevelProgressionChart } from "../chart/level-progression-chart/LevelProgressionChart";

export const chartTabs: TabItem[] = [
  {
    id: "skill-experience",
    label: "XP par Compétence",
    icon: BarChart3,
    content: <SkillExperienceChart />,
  },
  {
    id: "level-progression",
    label: "Progression Niveaux",
    icon: Activity,
    content: <LevelProgressionChart />,
  },
  {
    id: "quest-completion",
    label: "Quêtes par Skill",
    icon: CheckSquare,
    content: <QuestCompletionChart />,
  },
  {
    id: "skill-radar",
    label: "Profil de Compétences",
    icon: Activity,
    content: <SkillRadarChart />,
  },
];
