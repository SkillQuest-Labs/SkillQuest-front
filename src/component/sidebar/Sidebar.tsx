import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarBody } from "./SidebarBody";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="flex">
      <div
        className={`${
          isCollapsed ? "w-20" : "w-65"
        } h-screen bg-slate-900 text-white fixed shadow-lg transition-all duration-300`}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <hr className="border-gray-700 mx-6 mb-4" />
        <SidebarBody isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};
