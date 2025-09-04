import avatarImage from "@/assets/avatar.svg";
import type { UserData, UserRole } from "@/shared/types/user.type";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import AnimatedAvatarHud from "@/component/avatar-hud/AnimatedAvatarHud";


export const DashboardUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const role = user?.unsafeMetadata?.role as UserRole;
      setUserData({
        username: user.username || "",
        role: role,
      });
    }
  }, [user]);

  const userId = user?.id ?? "";
  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-white">{`Welcome back ${userData?.role} ${userData?.username}`}</h1>
      </div>
      <AnimatedAvatarHud
        userId={userId}
        username={userData?.username ?? ""}
        role={userData?.role ?? ""}
        avatarUrl={avatarImage}
      />
    </div>
  );
};
