import { Loader2 } from "lucide-react";

type SkillTreeLoaderProps = {
  title?: string;
  description?: string;
};

export const SkillTreeLoader = ({ title, description }: SkillTreeLoaderProps) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
    <div className="relative">
      <div className="w-32 h-32 relative">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
        <div className="absolute inset-2 rounded-full border-4 border-blue-400/30 animate-spin"></div>
        <div className="absolute inset-4 rounded-full border-4 border-blue-300/40 animate-pulse"></div>
        <div className="absolute inset-6 rounded-full border-4 border-blue-200/50"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    </div>

    <div className="mt-6 text-center">
      <h3 className="text-xl font-semibold text-white mb-2">{title || "Génération de l'arbre de compétences"}</h3>
      <p className="text-slate-300 text-sm">{description || "Calcul des positions et des connexions..."}</p>
    </div>

    <div className="mt-4 w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
    </div>
  </div>
);
