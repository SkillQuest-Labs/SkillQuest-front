// src/pages/dashboard/DashboardUser.tsx
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

import { useIntroModal } from "@/shared/hooks/useIntroModal";
import type { UserData, UserRoleType } from "@/shared/types/user.type";

import ProfileHud from "@/component/ProfileHud";
import { QuestHistory } from "@/component/QuestHistory";

import { useGetSkills } from "@/shared/services/skill/api-skill";
import { useUserProgressFromQuests } from "@/shared/hooks/useUserProgressFromQuests";

import { TrendingUp, Target, BarChart3 } from "lucide-react";
import { FortniteStatCard } from "@/modules/stats/components/FortniteStatCard";

export const DashboardUser = () => {
  const { user, isLoaded } = useUser();

  const userId = user?.id ?? "";
  const fallbackUsername = user?.username ?? user?.firstName ?? "Aventurier";

  const [, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) return;
    const role = (user.unsafeMetadata?.role as UserRoleType) ?? "apprenti";
    setUserData({
      username: fallbackUsername,
      role,
    });
  }, [user, fallbackUsername]);

  useIntroModal(userId, "v1");

  // 🔹 Récupérer les skills de l’utilisateur
  const { skills = [], loading: loadingSkills } = useGetSkills(isLoaded ? userId : "");
  const firstSkillId = skills.length > 0 ? ((skills[0] as any).id ?? (skills[0] as any).skillId ?? "") : "";

  // 🔹 Progression basée sur les quêtes
  const { level, xpUser, xpMax } = useUserProgressFromQuests(firstSkillId);

  // 🔹 Petites stats simplifiées
  const totalXp = skills.reduce((acc, s: any) => acc + (s.totalXp || 0), 0);
  const questsCompleted = skills.reduce((acc, s: any) => acc + (s.completedQuests || 0), 0);
  const skillsCompleted = skills.filter((s: any) => s.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex gap-6 px-6 py-8">
        {/* Colonne principale */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-8">Welcome back</h1>

          {/* 🔹 Mini section Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <FortniteStatCard
              title="XP Total"
              value={totalXp} // ton calcul existant
              icon={TrendingUp}
              gradient="indigo"
            />
            <FortniteStatCard
              title="Quêtes terminées"
              value={questsCompleted} // ton calcul existant
              icon={BarChart3}
              gradient="amber"
            />
            <FortniteStatCard
              title="Compétences validées"
              value={skillsCompleted} // ton calcul existant
              icon={Target}
              gradient="rose"
            />
          </div>

          {/* Historique des quêtes */}
          <div className="flex flex-col w-full max-w-6xl mx-auto rounded-xl border border-slate-700 bg-slate-800/50 p-4 shadow mb-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Historique des quêtes</h3>

            {!isLoaded || loadingSkills ? (
              <p className="text-slate-400">Chargement des quêtes…</p>
            ) : firstSkillId ? (
              <QuestHistory skillId={firstSkillId} />
            ) : (
              <p className="text-slate-500">Aucune quête trouvée.</p>
            )}
          </div>
        </div>

        {/* HUD Profil */}
        <ProfileHud
          userName={user?.username || user?.firstName || "Aventurier"}
          title={(user?.unsafeMetadata?.role as string) || "Aventurier"}
          level={level}
          xp={xpUser}
          xpToNext={xpMax}
        />
      </div>
    </div>
  );
};
