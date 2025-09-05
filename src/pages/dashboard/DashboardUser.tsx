import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import avatarImage from "@/assets/avatar.svg";
import AnimatedAvatarHud from "@/component/avatar-hud/AnimatedAvatarHud";
import SoloLevelingIntro from "@/shared/components/SoloLevelingIntro";
import { useIntroModal } from "@/shared/hooks/useIntroModal";
import type { UserData, UserRole } from "@/shared/types/user.type";

export const DashboardUser = () => {
  const { user } = useUser();

  // 1) Id et username de base (fallback si pas de username Clerk)
  const userId = user?.id;
  const fallbackUsername = user?.username ?? user?.firstName ?? "Aventurier";

  // 2) State affichage (username + role)
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) return;
    const role = (user.unsafeMetadata?.role as UserRole) ?? "apprenti";
    setUserData({
      username: fallbackUsername,
      role,
    });
  }, [user, fallbackUsername]);

  // 3) Intro modal (une seule fois par utilisateur)
  const { open, close } = useIntroModal(userId, "v1");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-3xl font-bold text-white">
          {`Welcome back ${userData?.role ?? ""} ${userData?.username ?? ""}`}
        </h1>
      </div>

      {/* HUD en bas à droite */}
      <AnimatedAvatarHud
        userId={userId ?? ""}                    // AnimatedAvatarHud attend une string
        username={userData?.username ?? fallbackUsername}
        role={userData?.role ?? "apprenti"}
        avatarUrl={avatarImage}
      />

      {/* Popup Solo Leveling au centre */}
      <SoloLevelingIntro
        open={open}
        username={userData?.username ?? fallbackUsername}
        onClose={close}
      />
    </div>
  );
};
