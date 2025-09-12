import { useUser } from "@clerk/clerk-react";
import { useIntroModal } from "@/shared/hooks/useIntroModal";
import ProfileHud from "@/component/ProfileHud";
import { useUserProgress } from "@/shared/hooks/useUserProgress";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { QuestHistory } from "@/component/QuestHistory";
import { StatsCard } from "@/modules/stats/components/StatsCard";
import { Award, Target, BarChart3 } from "lucide-react";

export const DashboardUser = () => {
  const { user, isLoaded } = useUser();

  const userId = user?.id ?? "";
  const userName = user?.username ?? user?.firstName ?? "Aventurier";
  const userRole = (user?.unsafeMetadata?.role as string) || "Aventurier";

  // HUD (niveau / xp)
  const { level, xpUser = 0, xpMax = 1 } = useUserProgress(userId);

  // Intro (si tu utilises l’overlay)
  useIntroModal(userId, "v1");

  // Récup skills utilisateur
  const { skills = [], loading: loadingSkills } = useGetSkills(isLoaded ? userId : "");

  // skillId pour l’historique (prend le 1er dispo)
  const firstSkillId = skills.length > 0 ? ((skills[0] as any).id ?? (skills[0] as any).skillId ?? "") : "";

  // Stats rapides
  const totalXp = skills.reduce((acc: number, s: any) => acc + (s.totalXp || 0), 0);
  const totalQuestCompleted = skills.reduce((acc: number, s: any) => acc + (s.completedQuests || 0), 0);
  const totalSkillCompleted = skills.filter((s: any) => s.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex gap-6 px-6 py-8">
        {/* Colonne principale */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-8">Welcome back</h1>

          {/* Historique des quêtes (compact, en haut) */}
          <div className="flex flex-col w-full max-w-4xl rounded-xl border border-slate-700 bg-slate-800/50 p-4 shadow mx-auto mb-6 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Historique des quêtes</h3>

            {!isLoaded || loadingSkills ? (
              <p className="text-slate-400">Chargement des quêtes…</p>
            ) : firstSkillId ? (
              <QuestHistory skillId={firstSkillId} />
            ) : (
              <p className="text-slate-500">Aucune quête trouvée.</p>
            )}
          </div>

          {/* Stats séparées, bien plus bas */}
          <div className="w-full max-w-4xl mx-auto mt-12">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Statistiques</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard title="XP Total" value={totalXp} icon={Award} color="blue" />
              <StatsCard title="Compétences validées" value={totalSkillCompleted} icon={Target} color="green" />
              <StatsCard title="Quêtes terminées" value={totalQuestCompleted} icon={BarChart3} color="orange" />
            </div>
          </div>
        </div>

        {/* HUD Profil (colonne droite) */}
        <ProfileHud userName={userName} title={userRole} level={level} xp={xpUser} xpToNext={xpMax} />
      </div>
    </div>
  );
};
