import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Menu, X, MousePointerClick } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { Button } from "@/shared/components/ui/button";

export const SidebarHeader = () => {
  const { isCollapsed, toggleCollapse, mode, setMode } = useSidebarStore();
  const isAuto = mode === "auto";

  return (
    <div className={`flex ${isCollapsed ? "flex-col items-center gap-4" : "items-center justify-between"} p-6`}>
      <Link
        to="/dashboard"
        className={`${isCollapsed ? "flex flex-col items-center" : "flex items-center gap-2"} w-full`}
      >
        <div className="w-10 h-10 min-w-10 shrink-0">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && <span className="text-xl font-semibold">SkillQuest</span>}
      </Link>

      <div
        className={`${
          isCollapsed ? "flex flex-col items-center gap-2 mt-2" : "flex flex-col items-center gap-2 ml-auto"
        }`}
      >
        <Button
          variant="ghost"
          onClick={toggleCollapse}
          className="hover:bg-gray-700 p-2 rounded"
          title={`${isCollapsed ? "Ouvrir menu" : "Fermer menu"}`}
        >
          {!isCollapsed ? <X size={20} color="white" /> : <Menu size={20} color="white" />}
        </Button>

        <Button
          variant="ghost"
          onClick={() => setMode(isAuto ? "manual" : "auto")}
          className="hover:bg-gray-700 p-2 rounded"
          title="Mode auto"
        >
          <MousePointerClick size={20} color={isAuto ? "orange" : "white"} />
        </Button>
      </div>
    </div>
  );
};
