import { useState } from "react";
import {
  Home,
  User,
  Star,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="flex">
      <div
        className={`${
          isCollapsed ? "w-20" : "w-65"
        } h-screen bg-slate-900 text-white fixed shadow-lg transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex ${
            isCollapsed
              ? "flex-col items-center gap-4"
              : "items-center justify-between"
          } p-6`}
        >
          <Link
            to="/"
            className={`${
              isCollapsed
                ? "flex flex-col items-center"
                : "flex items-center gap-2"
            } w-full`}
          >
            <div className="w-10 h-10 min-w-10 shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-semibold">SkillQuest</span>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`${
              isCollapsed ? "" : "ml-auto"
            } hover:bg-gray-700 p-2 rounded`}
          >
            {isCollapsed ? (
              <PanelRightClose size={20} />
            ) : (
              <PanelRightOpen size={20} />
            )}
          </button>
        </div>

        <hr className="border-gray-700 mx-6 mb-4" />

        {/* Navigation */}
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
      </div>
    </div>
  );
};
