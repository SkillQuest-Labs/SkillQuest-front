import { Home, User, LogOut, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-800 text-white fixed shadow-lg">
        <div className="p-6 text-2xl font-bold">SkillQuest</div>
        <nav className="mt-6">
          <ul>
            <li className="px-6 py-3 hover:bg-gray-700 flex items-center">
              <Home className="mr-3" size={20} />
              <Link to="/" className="text-sm font-medium">
                Accueil
              </Link>
            </li>
            <li className="px-6 py-3 hover:bg-gray-700 flex items-center">
              <Star className="mr-3" size={20} />
              <Link to="/skills" className="text-sm font-medium">
                Skills
              </Link>
            </li>
            <li className="px-6 py-3 hover:bg-gray-700 flex items-center">
              <User className="mr-3" size={20} />
              <Link to="/profil" className="text-sm font-medium">
                Profil
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 w-full px-6">
          <button className="w-full flex items-center px-4 py-2 hover:bg-red-500 rounded text-sm font-medium">
            <LogOut className="mr-3" size={20} />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};
