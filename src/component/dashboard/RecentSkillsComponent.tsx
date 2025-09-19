import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Star, Book } from "lucide-react";
import type { Skill } from "@/shared/types/skill.type";
import { routes } from "@/routes/router.const";

interface RecentSkillsComponentProps {
  skills: Skill[];
  className?: string;
}

export const RecentSkillsComponent = ({ skills, className = "" }: RecentSkillsComponentProps) => {
  const navigate = useNavigate();

  const recentSkills = useMemo(() => {
    // Filtrer les skills qui ont un titre
    const filteredSkills = skills.filter((skill) => skill.title);

    return filteredSkills
      .sort((a, b) => {
        // Si createdAt existe, trier par date, sinon garder l'ordre
        if (a.createdAt && b.createdAt) {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        }
        return 0; // Garder l'ordre original si pas de dates
      })
      .slice(0, 2); // Prendre les 2 plus récents
  }, [skills]);

  if (recentSkills.length === 0) {
    return (
      <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-4 sm:p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white">Derniers skills</h3>
        </div>
        <div className="text-center py-6 sm:py-8">
          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Aucun skill trouvé</p>
          <p className="text-slate-500 text-xs mt-1">Créez votre premier skill pour commencer !</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-3 ${className}`}>
      {/* En-tête compact */}
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Derniers skills</h3>
      </div>

      {/* Liste des skills simplifiée */}
      <div className="space-y-2">
        {recentSkills.map((skill, index) => (
          <div
            key={skill.id || index}
            className="group p-2 rounded-md bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
            onClick={() => navigate(routes.skillDetail.path.replace(":skillId", skill.id || ""))}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Book className="w-3 h-3 text-blue-400" />
                  <h4 className="text-xs font-medium text-white truncate">{skill.title}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-400">
                    {skill.completedQuests || 0}/{skill.totalQuests || 0} quêtes
                  </span>
                </div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Lien compact */}
      <div className="mt-3 pt-2 border-t border-slate-600/20">
        <button
          className="w-full flex items-center justify-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => navigate(routes.skills.path)}
        >
          Voir tous
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
