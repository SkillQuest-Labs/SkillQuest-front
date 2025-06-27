import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { Home, Star, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export const SidebarBody = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <nav className="mt-6">
      <ul className="flex flex-col gap-1">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-6 py-3 flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 ${isActive ? "bg-gray-700 font-bold" : ""}`
            }
          >
            <Home size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Accueil</span>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/skills"
            className={({ isActive }) =>
              `px-6 py-3 flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 ${isActive ? "bg-gray-700 font-bold" : ""}`
            }
          >
            <Star size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Skills</span>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              `px-6 py-3 flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 ${isActive ? "bg-gray-700 font-bold" : ""}`
            }
          >
            <User size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Profil</span>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
