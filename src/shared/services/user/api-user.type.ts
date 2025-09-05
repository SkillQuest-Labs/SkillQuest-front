import { type UserRoleType } from "@/shared/types/user.type";

export type SynchUser = {
  id: string;
  username: string;
  email: string;
  role: UserRoleType;
};
