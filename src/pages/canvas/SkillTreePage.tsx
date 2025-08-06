import { useEffect } from "react";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { SkillTree } from "@/modules/skill-tree/component/SkillTree";

export const SkillTreePage = () => {
  const setViewMode = useCanvasStore((state) => state.setViewMode);

  useEffect(() => {
    setViewMode("skillTree");
  }, [setViewMode]);

  return <SkillTree />;
};
