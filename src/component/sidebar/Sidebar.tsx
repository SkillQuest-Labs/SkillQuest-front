import { SidebarHeader } from "./SidebarHeader";
import { SidebarBody } from "./SidebarBody";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

export const Sidebar = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex">
      <div
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } h-screen bg-slate-900 text-white fixed shadow-lg transition-all duration-300`}
      >
        <SidebarHeader />
        <hr className="border-gray-700 mx-6 mb-4" />
        <SidebarBody />
      </div>
    </div>
  );
};
