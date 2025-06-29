import { Coins, Store, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import type { DashboardHeaderProps } from "./dashboardHeader.type";
import { userButtonAppearance } from "@/shared/constants/auth.const";

const buttonBaseClasses =
  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-105";

export const DashboardHeader = ({ coins }: DashboardHeaderProps) => {
  return (
    <header className="ml-20 flex justify-end items-center px-6 py-4 border-b border-slate-700 shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="flex items-center gap-4">
        {/* Coins Display */}
        <div
          className={`${buttonBaseClasses} bg-yellow-500 hover:bg-yellow-400 text-black font-semibold cursor-pointer`}
        >
          <Coins size={18} className="text-white" />
          <span className="text-white font-bold">{coins}</span>
        </div>

        {/* Store Link */}
        <Link
          to="/dashboard/store"
          className={`${buttonBaseClasses} bg-slate-700 hover:bg-slate-600 text-white`}
        >
          <Store size={18} />
          Store
        </Link>

        {/* Edit Dashboard Button */}
        <Button
          variant="ghost"
          type="button"
          className={`${buttonBaseClasses} bg-slate-700 hover:bg-slate-600 text-white hover:text-white`}
        >
          <Pencil size={18} className="text-white" />
          Edit Dashboard
        </Button>

        {/* User Profile Button */}
        <UserButton appearance={userButtonAppearance} />
      </nav>
    </header>
  );
};
