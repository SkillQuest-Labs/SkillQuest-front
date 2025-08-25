import avatarImage from "@/assets/avatar.svg";
import { AvatarHud } from "@/component/avatar-hud/AvatarHud";
import type { UserData, UserRole } from "@/shared/types/user.type";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export const DashboardUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const role = user?.unsafeMetadata?.role as UserRole;
      setUserData({
        firstname: user.firstName || "",
        role: role,
      });
    }
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-white">{`Welcome back ${userData?.role} ${userData?.firstname}`}</h1>
      </div>
      <AvatarHud
        username={userData?.firstname ?? ""}
        role={userData?.role ?? ""}
        avatarUrl={avatarImage}
        level={15}
        xpUser={300}
        xpMax={500}
      />
    </div>
  );
};
