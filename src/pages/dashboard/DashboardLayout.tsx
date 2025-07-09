import { Sidebar } from "@/component/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

export const DashboardLayout = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 overflow-hidden ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <Outlet />
      </div>
    </div>
  );
};
