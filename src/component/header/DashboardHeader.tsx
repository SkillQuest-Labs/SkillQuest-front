import { Coins, Store, Pencil } from "lucide-react";
import type { DashboardHeaderProps } from "./dashboardHeader.type";
import { Link } from "react-router-dom";

export const DashboardHeader = ({ coins }: DashboardHeaderProps) => {
  return (
    <div className="ml-20 flex justify-end items-center px-6 py-4 border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-sm font-semibold rounded-lg">
          <Coins size={18} />
          <span>{coins}</span>
        </span>
        <Link
          to={"/store"}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition"
        >
          <Store size={18} />
          Store
        </Link>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow transition">
          <Pencil size={18} />
          Edit Dashboard
        </button>
      </div>
    </div>
  );
};
