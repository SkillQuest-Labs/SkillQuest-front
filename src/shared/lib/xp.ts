export function getXpMax(level: number): number {
  const raw = 100 * Math.pow(1.25, Math.max(level, 1) - 1);
  return Math.round(raw / 10) * 10;
}

export function levelFromTotalXp(totalXp: number): { level: number; xp: number; xpMax: number } {
  let level = 1;
  let remaining = Math.max(0, totalXp | 0);

  for (;;) {
    const cap = getXpMax(level);
    if (remaining >= cap) {
      remaining -= cap;
      level += 1;
      continue;
    }
    return { level, xp: remaining, xpMax: cap };
  }
}
