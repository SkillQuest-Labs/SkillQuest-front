import { DashboardHeader } from "@/component/header/DashboardHeader";
import { Sidebar } from "@/component/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div>
      <Sidebar />
      <DashboardHeader coins="500" />
      <Outlet />
    </div>
  );
};
