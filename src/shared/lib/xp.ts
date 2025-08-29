// Progression quadratique basée sur le niveau (modifiable)
export function xpForLevel(level: number): number {
  const base = 100; // niveau 1 → 2
  return base * level ** 2;
}

// Déduit le niveau courant et le seuil suivant depuis un total d'XP
export function getLevelFromXp(totalXp: number): {
  level: number;
  currentXp: number;
  nextLevelXp: number;
} {
  let level = 1;
  let nextLevelXp = xpForLevel(level);

  while (totalXp >= nextLevelXp) {
    level++;
    nextLevelXp = xpForLevel(level);
  }

  return { level, currentXp: totalXp, nextLevelXp };
}
