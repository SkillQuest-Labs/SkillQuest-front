import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useIntroModal } from "@/shared/hooks/useIntroModal";
import type { UserData, UserRole } from "@/shared/types/user.type";
import ProfileHud from "@/component/ProfileHud";
import { useUserProgress } from "@/shared/hooks/useUserProgress";
import { QuestHistory } from "@/component/QuestHistory";
import { useGetSkills } from "@/shared/services/skill/api-skill";

export const DashboardUser = () => {
  const { user } = useUser();

  const userId = user?.id ?? "";
  const fallbackUsername = user?.username ?? user?.firstName ?? "Aventurier";
  const { level, xpUser, xpMax = 0 } = useUserProgress(userId);

  const [, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) return;
    const role = (user.unsafeMetadata?.role as UserRole) ?? "apprenti";
    setUserData({
      username: fallbackUsername,
      role,
    });
  }, [user, fallbackUsername]);

  useIntroModal(userId, "v1");

  // 🔹 Récupérer les skills du user
  const { skills, loading: loadingSkills } = useGetSkills(userId);

  // 🔹 Prendre le premier skill trouvé
  const skillId = skills && skills.length > 0 ? skills[0].id : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex gap-6 px-6 py-8">
        {/* Colonne contenu */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-8">Welcome back</h1>

          {/* Historique des quêtes */}
          <div className="flex flex-col w-full max-w-4xl rounded-xl border border-slate-700 bg-slate-800/50 p-4 shadow mx-auto mb-6 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Historique des quêtes</h3>

            {loadingSkills ? (
              <p className="text-slate-400">Chargement des quêtes</p>
            ) : skillId ? (
              <QuestHistory skillId={skillId} />
            ) : (
              <p className="text-slate-500">Aucune Quêtes trouvée.</p>
            )}
          </div>
        </div>

        {/* Colonne HUD */}
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
