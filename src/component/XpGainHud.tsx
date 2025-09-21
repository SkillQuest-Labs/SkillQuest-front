import { useMemo, useState, useEffect, useRef } from "react";

type ParticleConfig = {
  id: string;
  offsetX: number;
  delay: number;
  size: number;
};

const XP_PARTICLES_TEMPLATE: Array<Omit<ParticleConfig, "id">> = [
  { offsetX: -76, delay: 0, size: 12 },
  { offsetX: -42, delay: 90, size: 14 },
  { offsetX: -8, delay: 160, size: 16 },
  { offsetX: 28, delay: 230, size: 13 },
  { offsetX: 62, delay: 300, size: 15 },
  { offsetX: 96, delay: 360, size: 12 },
];

type XpGainHudProps = {
  userName: string;
  title?: string;
  level: number;
  xp: number;
  xpToNext: number;
  avatarUrl?: string;
  className?: string;
  previousXp?: number;
  isVisible?: boolean;
};

const XpGainHud = ({
  userName,
  title = "Aventurier",
  level,
  xp,
  xpToNext,
  className = "",
  previousXp,
  isVisible = true,
}: XpGainHudProps) => {
  const [animatedXp, setAnimatedXp] = useState(() => previousXp || xp);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [burstActive, setBurstActive] = useState(false);
  const [particles, setParticles] = useState<ParticleConfig[]>([]);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 1500); // Attendre que l'animation de disparition se termine (1.5s)
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const animationRef = useRef<number | null>(null);
  const burstTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (previousXp && previousXp !== xp) {
      setIsAnimating(true);
      setBurstActive(true);
      setParticles(
        XP_PARTICLES_TEMPLATE.map((particle, index) => ({
          ...particle,
          id: `${Date.now()}-${index}`,
        })),
      );
      if (burstTimeoutRef.current) {
        clearTimeout(burstTimeoutRef.current);
      }
      burstTimeoutRef.current = setTimeout(() => {
        setBurstActive(false);
      }, 1200);
      const startXp = previousXp;
      const endXp = xp;
      const gain = endXp - startXp;
      const duration = 3500;
      const startTime = performance.now();

      const animate = (currentTime: DOMHighResTimeStamp) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const newXp = startXp + gain * easedProgress;
        setAnimatedXp(newXp);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setAnimatedXp(endXp);
          setIsAnimating(false);
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (burstTimeoutRef.current) {
        clearTimeout(burstTimeoutRef.current);
        burstTimeoutRef.current = null;
      }
    };
  }, [previousXp, xp]);

  useEffect(() => {
    if (!isAnimating && !previousXp) {
      setAnimatedXp(xp);
    }
  }, [xp, isAnimating, previousXp]);

  const pct = useMemo(() => {
    if (xpToNext <= 0 || !isFinite(xpToNext) || !isFinite(animatedXp)) {
      return 0;
    }
    return Math.min((animatedXp / xpToNext) * 100, 100);
  }, [animatedXp, xpToNext]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`relative ${className} ${
        isVisible
          ? "animate-[slideInFromBottom_0.6s_ease-out_forwards]"
          : "animate-[slideOutToBottom_1.5s_ease-in_forwards]"
      }`}
      style={{
        transformOrigin: "center center",
        animationFillMode: "forwards",
      }}
    >
      {burstActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-40 w-40">
            <div className="absolute inset-0 rounded-full border border-amber-300/40 bg-amber-200/10 blur-md" />
            <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-amber-500/35 via-pink-500/20 to-violet-500/30 blur-2xl opacity-70 animate-[xpAura_1.2s_ease-out_forwards]" />
            <div className="absolute inset-0 rounded-full border border-amber-400/60 opacity-80 animate-[xpRing_1s_ease-out_forwards]" />
            <div
              className="absolute inset-4 rounded-full border border-amber-200/40 opacity-60 animate-[xpRing_1s_ease-out_forwards]"
              style={{ animationDelay: "120ms" }}
            />
          </div>
        </div>
      )}

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200 via-rose-200 to-indigo-300 shadow-[0_0_18px_rgba(251,191,36,0.65)] animate-[xpParticle_1.8s_ease-out_forwards]"
          style={{
            left: `calc(50% + ${particle.offsetX}px)`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}

      <div
        className={`flex flex-col gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-600/30 min-w-[280px] transition-all duration-500 ${
          isAnimating ? "animate-[glowPulse_3.5s_ease-in-out_infinite] shadow-[0_20px_50px_rgba(251,191,36,0.3)]" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{userName}</h3>
            <span className="text-sm text-slate-400">({title})</span>
          </div>
          <div className="bg-blue-600/80 px-3 py-1 rounded-full border border-blue-400/40">
            <span className="text-sm font-semibold text-white">LVL {level}</span>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-3 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40">
            <div
              className="h-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-medium text-slate-300">
          <span>LVL {level}</span>
          <span>
            {Math.round(animatedXp).toLocaleString()} / {xpToNext.toLocaleString()} XP
          </span>
        </div>
      </div>
    </div>
  );
};

export default XpGainHud;
