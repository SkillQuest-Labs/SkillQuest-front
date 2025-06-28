import { Avatar } from "@/component/avatar/Avatar";
import { DashboardHeader } from "@/component/header/DashboardHeader";
import { Sidebar } from "@/component/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import avatarImage from "@/assets/avatar.svg";

export const DashboardLayout = () => {
  return (
    <div>
      <Sidebar />
      <DashboardHeader coins="500" />
      <Avatar
        username="Sora"
        role="Aventurier"
        avatarUrl={avatarImage}
        level={15}
        xpUser={300}
        xpMax={500}
      />
      <Outlet />
    </div>
  );
};
