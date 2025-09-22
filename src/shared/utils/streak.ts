// src/shared/utils/streak.ts
const toYMD = (d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); // normalise à minuit UTC

export function computeStreakFromDates(
  isoDates: string[],
  today: Date = new Date(),
): { currentStreak: number; activeDaySet: Set<string> } {
  // Normalise toutes les dates au format YYYY-MM-DD (UTC)
  const set = new Set(
    isoDates.filter(Boolean).map((s) => {
      const d = new Date(s);
      const n = toYMD(d);
      return n.toISOString().slice(0, 10);
    }),
  );

  // On remonte jour par jour à partir d’aujourd’hui
  let streak = 0;
  let cursor = toYMD(today);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    // jour précédent
    cursor = toYMD(new Date(cursor.getTime() - 24 * 60 * 60 * 1000));
  }

  return { currentStreak: streak, activeDaySet: set };
}
