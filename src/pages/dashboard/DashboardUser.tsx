import avatarImage from "@/assets/avatar.svg";
import { AvatarHud } from "@/component/avatar-hud/AvatarHud";
import SyncUser from "@/component/SyncUser";

export const DashboardUser = () => {
  return (
    <div>
      <SyncUser />
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-white">Dashboard user</h1>
      </div>
      <AvatarHud username="Sora" role="Aventurier" avatarUrl={avatarImage} level={15} xpUser={300} xpMax={500} />
    </div>
  );
};
