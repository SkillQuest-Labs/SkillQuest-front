import { Home, Star, User } from "lucide-react";
import { Link } from "react-router-dom";

type SidebarBodyProps = {
  isCollapsed: boolean;
};

export const SidebarBody = ({ isCollapsed }: SidebarBodyProps) => {
  return (
    <nav className="mt-6">
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            to="/"
            className={`px-6 py-3 hover:bg-gray-700 flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <Home size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Accueil</span>
            )}
          </Link>
        </li>
        <li>
          <Link
            to="/skills"
            className={`px-6 py-3 hover:bg-gray-700 flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <Star size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Skills</span>
            )}
          </Link>
        </li>
        <li>
          <Link
            to="/profil"
            className={`px-6 py-3 hover:bg-gray-700 flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <User size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Profil</span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
};
