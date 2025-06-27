import { Sidebar } from "@/component/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
};
