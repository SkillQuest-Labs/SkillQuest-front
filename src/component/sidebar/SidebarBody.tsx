import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { Home, LayoutTemplate, Star, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export const SidebarBody = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <nav className="mt-6">
      <ul className="flex flex-col gap-1">
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96  ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${isActive ? "bg-gray-700 shadow-lg scale-100" : ""}`
            }
          >
            <Home size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Accueil</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/skills"
            className={({ isActive }) =>
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${isActive ? "bg-gray-700 shadow-lg scale-100" : ""}`
            }
          >
            <Star size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Skills</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/profil"
            className={({ isActive }) =>
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${isActive ? "bg-gray-700 shadow-lg scale-100" : ""}`
            }
          >
            <User size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Profil</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/canvas"
            className={({ isActive }) =>
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${isActive ? "bg-gray-700 shadow-lg scale-100" : ""}`
            }
          >
            <LayoutTemplate size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Canvas</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
