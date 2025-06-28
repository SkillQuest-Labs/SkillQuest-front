import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Menu, X } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { Button } from "@/shared/components/ui/button";

export const SidebarHeader = () => {
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <div
      className={`flex ${
        isCollapsed
          ? "flex-col items-center gap-4"
          : "items-center justify-between"
      } p-6`}
    >
      <Link
        to="/"
        className={`${
          isCollapsed ? "flex flex-col items-center" : "flex items-center gap-2"
        } w-full`}
      >
        <div className="w-10 h-10 min-w-10 shrink-0">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-semibold">SkillQuest</span>
        )}
      </Link>

      <Button
        variant="ghost"
        onClick={() => toggleCollapse()}
        className={`cursor-pointer ${
          isCollapsed ? "" : "ml-auto"
        } hover:bg-gray-700 p-2 rounded`}
      >
        {!isCollapsed ? (
          <X size={20} color="white" />
        ) : (
          <Menu size={20} color="white" />
        )}
      </Button>
    </div>
  );
};
