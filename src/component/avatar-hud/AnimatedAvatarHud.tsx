import { AvatarHud } from "@/component/avatar-hud/AvatarHud";
import { useUserProgress } from "@/shared/hooks/useUserProgress";
import { useAnimatedProgress } from "@/shared/hooks/useAnimatedProgress";

type Props = {
  userId: string;
  username: string;
  role: string;
  avatarUrl: string;
};

export default function AnimatedAvatarHud({ userId, username, role, avatarUrl }: Props) {
  const { level, xpUser, xpMax, totalXp } = useUserProgress(userId);

  // Animation "remplir → reset → surplus"
  const { animLevel, animXp, animCap } = useAnimatedProgress({
    level,
    xp: xpUser,
    xpMax,
    totalXp,
    animMs: 750, // doit rester > à la duration (700ms) de ta barre
  });

  return (
    <AvatarHud
      username={username}
      role={role}
      avatarUrl={avatarUrl}
      level={animLevel}
      xpUser={animXp}
      xpMax={animCap}
    />
  );
}
