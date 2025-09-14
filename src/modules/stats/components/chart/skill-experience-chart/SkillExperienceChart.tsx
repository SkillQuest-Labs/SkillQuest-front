import { useGetSkills } from "@/shared/services/skill/api-skill";
import { useUser } from "@clerk/clerk-react";
import ReactECharts from "echarts-for-react";
import { getChartOption } from "./chart-option.const";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/routes/router.const";
import { useNavigate } from "react-router-dom";

export const SkillExperienceChart = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { skills: skillsData } = useGetSkills(userId || "");
  const chartOptions = getChartOption(skillsData);

  const navigate = useNavigate();

  const totalXp = skillsData.length > 0 ? skillsData.reduce((acc, skill) => acc + (skill.totalXp || 0), 0) : 0;

  const hasSkills = skillsData.length > 0;

  return (
    <div className="w-full h-full rounded-xl bg-[#131928] p-4 lg:p-6 shadow-lg flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <h3 className="text-base lg:text-lg font-semibold text-white mb-2">XP par Compétence</h3>
        <p className="text-xs lg:text-sm text-gray-400">Visualisation de votre expérience accumulée par compétence</p>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        {hasSkills && totalXp === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <div className="text-lg font-semibold text-slate-200 mb-1">Aucune expérience gagnée pour l'instant</div>
            <div className="text-sm text-slate-400 mb-4">
              Commencez à compléter des quêtes ou des sessions pour gagner de l'XP sur vos compétences.
              <br />
              Votre progression apparaîtra ici dès que vous aurez gagné de l'expérience !
            </div>
            <Button
              className="px-4 py-1.5 cursor-pointer rounded-md bg-slate-700 text-slate-200 font-normal hover:bg-slate-600 transition-colors duration-200"
              onClick={() => navigate(routes.skills.path)}
            >
              Explorer les quêtes
            </Button>
          </div>
        ) : hasSkills ? (
          <ReactECharts
            option={chartOptions}
            style={{ height: "100%", width: "100%" }}
            opts={{
              renderer: "svg",
              devicePixelRatio: window.devicePixelRatio || 2,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <div className="text-5xl mb-3 animate-bounce">📉</div>
            <div className="text-lg font-semibold text-slate-300 mb-1">Aucune compétence trouvée</div>
            <div className="text-sm text-slate-400 mb-4">
              Vous n'avez pas encore créé de compétences.
              <br />
              Ajoutez une compétence pour commencer à suivre votre progression !
            </div>
            <button
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-300 shadow"
              onClick={() => (window.location.href = "/skills")}
            >
              Ajouter une compétence
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
