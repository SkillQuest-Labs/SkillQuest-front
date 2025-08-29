import { AvatarHud } from "@/component/avatar-hud/AvatarHud";
import { useUserProgress } from "@/shared/hooks/useUserProgress";
import { useUserProgressMock } from "@/shared/hooks/useUserProgressMock";
import { useAnimatedProgress } from "@/shared/hooks/useAnimatedProgress";

type Props = {
  userId: string;
  username: string;
  role: string;
  avatarUrl: string;
  isMock?: boolean;
};

export default function AnimatedAvatarHud({ userId, username, role, avatarUrl, isMock = false }: Props) {
  // ⚡ Toujours appeler les hooks
  const mockProgress = useUserProgressMock();
  const realProgress = useUserProgress(userId);

  // ⚡ Choisir les données après coup
  const { level, xpUser, xpMax, totalXp } = isMock ? mockProgress : realProgress;

  const { animLevel, animXp, animCap } = useAnimatedProgress({
    level,
    xp: xpUser,
    xpMax,
    totalXp,
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
