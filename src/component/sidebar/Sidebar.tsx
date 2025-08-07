import { SidebarHeader } from "./SidebarHeader";
import { SidebarBody } from "./SidebarBody";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

export const Sidebar = () => {
  const { isCollapsed, setCollapsed, mode } = useSidebarStore();

  const handleMouseEnter = () => {
    if (mode === "auto" && isCollapsed) setCollapsed(false);
  };

  const handleMouseLeave = () => {
    if (mode === "auto" && !isCollapsed) setCollapsed(true);
  };

  return (
    <div className="flex">
      <div
        className={`${
          isCollapsed ? "w-20" : "w-65"
        } h-screen bg-slate-900 text-white fixed transition-all duration-300`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarHeader />
        <hr className="border-gray-700 mx-6 mb-4" />
        <SidebarBody />
      </div>
    </div>
  );
};
