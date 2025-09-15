import { SidebarHeader } from "./SidebarHeader";
import { SidebarBody } from "./SidebarBody";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@/shared/components/ui/button";

export const Sidebar = () => {
  const { isCollapsed, setCollapsed, mode } = useSidebarStore();
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    navigate("/sign-in");
  };

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
        } h-screen bg-slate-900 text-white fixed transition-all duration-300 relative`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarHeader />
        <hr className="border-gray-700 mx-6 mb-4" />
        <SidebarBody />

        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-start">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`cursor-pointer px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
              isCollapsed ? "justify-center" : "gap-3"
            } hover:bg-gray-700 hover:shadow-lg hover:text-white rounded-lg`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Déconnexion</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};
