import { routes } from "@/routes/router.const";
import { Button } from "@/shared/components/ui/button";
import { BookOpen, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptySkills = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
      empty-card relative rounded-2xl
      p-8 overflow-hidden
      flex flex-col items-center text-center min-h-[260px] justify-between
    "
    >
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <div className="empty-icon relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/70 ring-1 ring-slate-700">
          <BookOpen className="h-8 w-8 text-slate-200" />
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-100">Aucun skill pour l'instant</h3>
          <p className="text-slate-400">
            Créez votre premier skill pour commencer à organiser vos compétences et suivre votre progression.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="empty-badge inline-flex items-center gap-1">
              <Target className="h-3.5 w-3.5" /> Objectifs clairs
            </span>
            <span className="empty-badge inline-flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Progression visible
            </span>
            <span className="empty-badge">Organisation</span>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={() => navigate(
            `${routes.canvas.path}?createSkill=true`
          )}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
        >
          Créer un skill
        </Button>
      </div>
    </div>
  );
};
