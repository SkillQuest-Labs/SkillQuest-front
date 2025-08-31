import { Activity, BarChart3 } from "lucide-react";
import { LevelProgressionChart, SkillExperienceChart, SkillRadarChart } from "../chart";
import type { TabItem } from "./tab-panel.type";

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
    id: "skill-radar",
    label: "Profil de Compétences",
    icon: Activity,
    content: <SkillRadarChart />,
  },
];
