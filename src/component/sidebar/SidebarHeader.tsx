import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

export type SidebarHeaderProps = {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarHeader = ({
  isCollapsed,
  setIsCollapsed,
}: SidebarHeaderProps) => {
  return (
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
          isCollapsed ? "flex flex-col items-center" : "flex items-center gap-2"
        } w-full`}
      >
        <div className="w-10 h-10 min-w-10 shrink-0">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
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
  );
};
