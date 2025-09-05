import { AvatarHud } from "@/component/avatar-hud/AvatarHud";
import { useUserProgress } from "@/shared/hooks/useUserProgress";
import { useAnimatedProgress } from "@/shared/hooks/useAnimatedProgress";
import LevelUpToast from "@/component/avatar-hud/LevelUpToast";

type Props = {
  userId: string;
  username: string;
  role: string;
  avatarUrl: string;
};

export default function AnimatedAvatarHud({ userId, username, role, avatarUrl }: Props) {
  const { level, xpUser, xpMax, totalXp, userClass, badge, isClassChange } = useUserProgress(userId);

  const { animLevel, animXp, animCap } = useAnimatedProgress({
    level,
    xp: xpUser,
    xpMax,
    totalXp,
  });

  return (
    <>
      <AvatarHud
        username={username}
        role={role}
        avatarUrl={avatarUrl}
        level={animLevel}
        xpUser={animXp}
        xpMax={animCap}
        userClass={userClass} // 👈 nouveau (voir ci-dessous)
        badgeSrc={badge} // 👈 nouveau (voir ci-dessous)
      />
      <LevelUpToast show={isClassChange} userClass={userClass} badge={badge} />
    </>
  );
}
