import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, ArrowRight } from "lucide-react";
import type { Skill } from "@/shared/types/skill.type";
import { routes } from "@/routes/router.const";

interface RecentSkillsComponentProps {
  skills: Skill[];
  className?: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "text-green-400 bg-green-400/20 border-green-400";
    case "MEDIUM":
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400";
    case "HARD":
      return "text-red-400 bg-red-400/20 border-red-400";
    default:
      return "text-slate-400 bg-slate-400/20 border-slate-400";
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "Facile";
    case "MEDIUM":
      return "Moyen";
    case "HARD":
      return "Difficile";
    default:
      return "Inconnu";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "text-green-400 bg-green-400/20 border-green-400";
    case "IN_PROGRESS":
      return "text-blue-400 bg-blue-400/20 border-blue-400";
    case "NOT_STARTED":
      return "text-slate-400 bg-slate-400/20 border-slate-400";
    case "DRAFT":
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400";
    default:
      return "text-slate-400 bg-slate-400/20 border-slate-400";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "Terminé";
    case "IN_PROGRESS":
      return "En cours";
    case "NOT_STARTED":
      return "Non commencé";
    case "DRAFT":
      return "Brouillon";
    default:
      return "Inconnu";
  }
};

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
      <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <Star className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Derniers skills</h3>
        </div>
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Aucun skill trouvé</p>
          <p className="text-slate-500 text-xs mt-1">Créez votre premier skill pour commencer !</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-3 flex flex-col h-full ${className}`}>
      {/* En-tête */}
      <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
        <div className="p-1 rounded-md bg-blue-500/20 border border-blue-400/30">
          <Star className="w-3 h-3 text-blue-400" />
        </div>
        <h3 className="text-xs font-semibold text-white">Derniers skills</h3>
      </div>

      {/* Liste des skills - Prend l'espace disponible */}
      <div className="space-y-1 flex-1 min-h-0 overflow-y-auto">
        {recentSkills.map((skill, index) => (
          <div
            key={skill.id || index}
            className="group p-1.5 rounded-md bg-slate-700/30 border border-slate-600/20 hover:bg-slate-700/50 hover:border-slate-500/30 transition-all duration-200 cursor-pointer"
            onClick={() => navigate(routes.skillDetail.path.replace(":skillId", skill.id || ""))}
          >
            <div className="flex items-center justify-between">
              {/* Informations principales */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="text-xs font-medium text-white truncate flex-1">{skill.title}</h4>

                  {/* Badges de statut et difficulté */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span
                      className={`px-1 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(skill.status)}`}
                    >
                      {getStatusLabel(skill.status)}
                    </span>
                    <span
                      className={`px-1 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(skill.difficulty)}`}
                    >
                      {getDifficultyLabel(skill.difficulty)}
                    </span>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {skill.completedQuests || 0}/{skill.totalQuests || 0} quêtes
                  </div>
                  {skill.createdAt ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(skill.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Récent
                    </div>
                  )}
                </div>
              </div>

              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0 ml-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Lien vers tous les skills */}
      <div className="mt-2 pt-2 border-t border-slate-600/20 flex-shrink-0">
        <button
          className="w-full flex items-center justify-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => navigate(routes.skills.path)}
        >
          Voir tous les skills
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
