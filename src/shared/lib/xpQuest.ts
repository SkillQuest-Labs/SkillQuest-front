// Barème XP par difficulté de quête
const XP_BY_DIFFICULTY: Record<string, number> = {
  EASY: 100,
  MEDIUM: 200,
  HARD: 400,
};

export function getXpForQuestDifficulty(difficulty: unknown): number {
  const key = String(difficulty ?? "").toUpperCase();
  return XP_BY_DIFFICULTY[key] ?? 0;
}

// Normalise le statut "terminé"
export function isQuestDone(status: unknown): boolean {
  const s = String(status ?? "").toUpperCase();
  return s === "DONE" || s === "COMPLETED" || s === "FINISHED";
}

// Calcule l'XP d'une quête : priorité au champ xp, sinon par difficulté
export function computeQuestXp(quest: any): number {
  if (typeof quest?.xp === "number") return quest.xp;
  if (typeof quest?.xpReward === "number") return quest.xpReward;
  return getXpForQuestDifficulty(quest?.difficulty);
}

// Somme l'XP des quêtes DONE d'une skill (skill.quests | skill.tasks | skill.missions)
export function computeSkillXp(skill: any): number {
  const quests: any[] = skill?.quests ?? skill?.tasks ?? skill?.missions ?? [];

  return quests.filter((q) => isQuestDone(q?.status)).reduce((sum, q) => sum + computeQuestXp(q), 0);
}

// XP total utilisateur depuis un tableau de skills (chaque skill contient des quêtes)
export function computeTotalXpFromSkills(skills: any[]): number {
  return (skills ?? []).reduce((sum, sk) => sum + computeSkillXp(sk), 0);
}

// Variante si tu as déjà un tableau plat de quêtes au niveau utilisateur
export function computeTotalXpFromQuests(quests: any[]): number {
  return (quests ?? []).filter((q) => isQuestDone(q?.status)).reduce((sum, q) => sum + computeQuestXp(q), 0);
}
