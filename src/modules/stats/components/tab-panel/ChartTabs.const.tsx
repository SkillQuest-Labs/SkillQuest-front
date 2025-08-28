import { Activity, BarChart3, CheckSquare, Radar } from "lucide-react";
import {
  LevelProgressionChart,
  mockChartData,
  QuestCompletionChart,
  SkillExperienceChart,
  SkillRadarChart,
} from "../chart";
import type { TabItem } from "./tab-panel.type";

export const chartTabs: TabItem[] = [
  {
    id: "skill-experience",
    label: "XP par Compétence",
    icon: BarChart3,
    content: <SkillExperienceChart data={mockChartData} height={400} />,
  },
  {
    id: "level-progression",
    label: "Progression Niveaux",
    icon: Activity,
    content: <LevelProgressionChart data={mockChartData} height={400} />,
  },
  {
    id: "quest-completion",
    label: "Quêtes par Skill",
    icon: CheckSquare,
    content: <QuestCompletionChart data={mockChartData} height={400} />,
  },
  {
    id: "skill-radar",
    label: "Profil Compétences",
    icon: Radar,
    content: <SkillRadarChart data={mockChartData} height={400} />,
  },
];
