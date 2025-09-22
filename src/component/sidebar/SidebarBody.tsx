import { Home, Star, User, CalendarRange, BarChart3, Swords, Bot } from "lucide-react";
import { NavLink } from "react-router-dom";
import React from "react";

interface SidebarBodyProps {
  isCollapsed: boolean;
}

const SidebarBody: React.FC<SidebarBodyProps> = ({ isCollapsed }) => {
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

        {/* Bouton Revoir l’intro */}
        <li>
          <button
            type="button"
            onClick={() => document.dispatchEvent(new CustomEvent("skq:replay-intro"))}
            className={`w-full text-left px-4 py-2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-96 ${
              isCollapsed ? "justify-center" : "gap-3"
            } hover:bg-gray-700 hover:shadow-lg rounded-l-xl`}
            aria-label="Revoir l’intro"
          >
            <Bot size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Revoir l’intro</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarBody;
