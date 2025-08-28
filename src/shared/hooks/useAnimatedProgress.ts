import { useEffect, useRef, useState } from "react";

type ProgressInput = {
  level: number;
  xp: number;
  xpMax: number;
  totalXp?: number;
  animMs?: number;
};

export function useAnimatedProgress({
  level,
  xp,
  xpMax,
  totalXp,
  animMs = 750,
}: ProgressInput) {
  const prev = useRef({ level, xp, xpMax, totalXp });

  const [animLevel, setAnimLevel] = useState(level);
  const [animXp, setAnimXp] = useState(xp);
  const [animCap, setAnimCap] = useState(xpMax);

  useEffect(() => {
    const p = prev.current;
    const leveledUp = level > p.level;

    if (!leveledUp) {
      setAnimLevel(level);
      setAnimCap(xpMax);
      setAnimXp(xp);
      prev.current = { level, xp, xpMax, totalXp };
      return;
    }

    // 1) remplir à 100% de l’ancien niveau
    setAnimCap(p.xpMax);
    setAnimXp(p.xpMax);

    const t1 = setTimeout(() => {
      // 2) reset au nouveau niveau
      setAnimLevel(level);
      setAnimCap(xpMax);
      setAnimXp(0);

      // 3) appliquer le surplus
      requestAnimationFrame(() => {
        const t2 = setTimeout(() => setAnimXp(xp), 50);
        return () => clearTimeout(t2);
      });
    }, animMs);

    prev.current = { level, xp, xpMax, totalXp };
    return () => clearTimeout(t1);
  }, [level, xp, xpMax, totalXp, animMs]);

  return { animLevel, animXp, animCap };
}
