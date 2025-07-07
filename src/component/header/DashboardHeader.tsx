import { Coins, Store, Pencil } from "lucide-react";
import type { DashboardHeaderProps } from "./dashboardHeader.type";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export const DashboardHeader = ({ coins }: DashboardHeaderProps) => {
  return (
    <header className="flex justify-end items-center px-6 py-4 border-b border-slate-700 shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="flex items-center gap-4">
        <div className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 hover:scale-105 text-black text-sm font-semibold rounded-lg transition-all duration-200 transform shadow-md">
          <Coins size={18} color="black" />
          <span className="text-black font-bold">{coins}</span>
        </div>
        <Link
          to="/dashboard/store"
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 hover:scale-105 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 transform"
        >
          <Store size={18} />
          Store
        </Link>
        <Button
          variant="ghost"
          type="button"
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 hover:scale-105 text-white hover:text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 transform"
        >
          <Pencil size={18} color="white" />
          Edit Dashboard
        </Button>
      </nav>
    </header>
  );
};
