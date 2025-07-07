import { DashboardHeader } from "@/component/header/DashboardHeader";
import { Sidebar } from "@/component/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

export const DashboardLayout = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div>
      <Sidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <DashboardHeader coins="500" />
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
