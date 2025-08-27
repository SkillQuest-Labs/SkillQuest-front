import avatarImage from "@/assets/avatar.svg";
//import { AvatarHud } from "@/component/avatar-hud/AvatarHud";
import AnimatedAvatarHud from "@/component/avatar-hud/AnimatedAvatarHud";
//import  AvatarScene  from "@/component/avatar-hud/AvatarScene";

export const DashboardUser = () => {
    const userId = "uuid-user-1234-5678-9012-345678901234";
  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-white">Dashboard user</h1>
      </div>
      <AnimatedAvatarHud
        userId={userId}
        username="Sora"
        role="Aventurier"
        avatarUrl={avatarImage}
      />
    </div>
  );
};
