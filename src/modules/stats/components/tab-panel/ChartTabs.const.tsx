import { BarChart3 } from "lucide-react";
import { SkillExperienceChart } from "../chart";
import type { TabItem } from "./tab-panel.type";

export const chartTabs: TabItem[] = [
  {
    id: "skill-experience",
    label: "XP par Compétence",
    icon: BarChart3,
    content: <SkillExperienceChart />,
  },
];
