// src/shared/hooks/useStreakFromDates.ts
import { useMemo } from "react";
import { computeStreakFromDates } from "@/shared/utils/streak";

export function useStreakFromDates(dates: string[] = [], maxStreak = 7) {
  return useMemo(() => {
    const { currentStreak, activeDaySet } = computeStreakFromDates(dates);
    // on fabrique les pastilles pour les derniers `maxStreak` jours (aujourd’hui inclus)
    const days: Array<{ dayIndex: number; isActive: boolean; isCurrent: boolean; label: string }> = [];
    const today = new Date();

    for (let i = maxStreak - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const key = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
      const isToday = i === 0;
      days.push({
        dayIndex: maxStreak - i, // 1..maxStreak
        isActive: activeDaySet.has(key),
        isCurrent: isToday,
        label: d.toLocaleDateString("fr-FR", { weekday: "short" }),
      });
    }

    return { currentStreak, days };
  }, [dates, maxStreak]);
}
