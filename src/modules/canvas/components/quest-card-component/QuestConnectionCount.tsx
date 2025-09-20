import { Gem } from "lucide-react";

export const QuestConnectionCount = ({ count = 0 }: { count?: number }) => (
  <div className="bg-gradient-to-r from-purple-700/30 via-yellow-100/20 to-purple-900/30 rounded-xl p-4 border-2 border-yellow-300/40 backdrop-blur-md mb-5 shadow-[0_2px_12px_2px_rgba(128,0,255,0.10)] flex items-center gap-4 relative z-10">
    <Gem className="w-7 h-7 text-purple-400 drop-shadow-[0_1px_2px_rgba(128,0,255,0.25)]" />
    <span className="text-yellow-200 font-bold text-2xl tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
      {count} connections
    </span>
  </div>
);
