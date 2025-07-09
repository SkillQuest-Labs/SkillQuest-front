import { Sidebar } from "@/component/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

export const DashboardLayout = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className={`transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
        <Sidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
