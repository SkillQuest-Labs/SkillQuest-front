export const UserRole = {
  MENTOR: "mentor",
  APPRENTI: "apprenti",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export type UserData = {
  username: string;
  role: UserRoleType;
};

export interface UserProgress {
  totalXp: number;
  totalQuestCompleted: number;
  totalSkillCompleted: number;
  userCurrentLevel: number;
  xpThreshold: number;
  xpToNextLevel: number;
}
