import { Activity, BarChart3 } from "lucide-react";
import { LevelProgressionChart, mockChartData, SkillExperienceChart } from "../chart";
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
];
