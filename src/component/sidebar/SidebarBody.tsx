import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { Home, Star, User, CalendarRange, BarChart3, Swords } from "lucide-react";
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
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${
                isActive ? "bg-gradient-to-r from-[#334155] to-[#141e32] rounded-l-xl shadow-md" : ""
              }`
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
              } hover:bg-gray-700 hover:shadow-lg ${
                isActive ? "bg-gradient-to-r from-[#334155] to-[#141e32] rounded-l-xl shadow-md" : ""
              }`
            }
          >
            <Star size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Skills</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/work-session"
            className={({ isActive }) =>
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${
                isActive ? "bg-gradient-to-r from-[#334155] to-[#141e32] rounded-l-xl shadow-md" : ""
              }`
            }
          >
            <CalendarRange size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Session de travail</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/dojo"
            className={({ isActive }) =>
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${
                isActive ? "bg-gradient-to-r from-[#334155] to-[#141e32] rounded-l-xl shadow-md" : ""
              }`
            }
          >
            <Swords size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Dojo</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/stats"
            className={({ isActive }) =>
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${
                isActive ? "bg-gradient-to-r from-[#334155] to-[#141e32] rounded-l-xl shadow-md" : ""
              }`
            }
          >
            <BarChart3 size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Statistiques</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/profil"
            className={({ isActive }) =>
              `px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
                isCollapsed ? "justify-center" : "gap-3"
              } hover:bg-gray-700 hover:shadow-lg ${
                isActive ? "bg-gradient-to-r from-[#334155] to-[#141e32] rounded-l-xl shadow-md" : ""
              }`
            }
          >
            <User size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Profil</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
