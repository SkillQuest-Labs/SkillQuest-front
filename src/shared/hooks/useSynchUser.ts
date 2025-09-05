import { useUser } from "@clerk/clerk-react";
import { useSynchUserApi } from "../services/user/api-user";
import { useEffect } from "react";
import type { UserRoleType } from "../types/user.type";

export const useSynchUser = () => {
  const { user } = useUser();
  const { synchUser } = useSynchUserApi();

  useEffect(() => {
    if (!user) return;

    const userPayload = {
      id: user.id,
      username: user.username || "",
      email: user.primaryEmailAddress?.emailAddress || "",
      role: user.unsafeMetadata?.role as UserRoleType,
    };

    synchUser(userPayload);
  }, [user, synchUser]);
};
