import { Loader2 } from "lucide-react";

export const CanvasLoader = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(12,8,33,0.8)] backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6 p-8 bg-[rgba(12,8,33,0.85)] rounded-2xl shadow-2xl border border-[rgba(255,255,255,0.08)] backdrop-blur-md">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[rgba(255,255,255,0.08)] rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[rgba(255,255,255,0.7)] rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">Chargement du canvas...</h3>
          <p className="text-sm text-[rgba(255,255,255,0.8)]">Récupération des quêtes et relations</p>
        </div>

        <div className="w-48 h-1 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full animate-pulse">
            <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
