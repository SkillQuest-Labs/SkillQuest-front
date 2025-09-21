import { useMemo, useState, useEffect, useRef } from "react";

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
  const [showXpNotification, setShowXpNotification] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (previousXp && previousXp !== xp) {
      setIsAnimating(true);
      setShowXpNotification(true);
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

          setTimeout(() => {
            setShowXpNotification(false);
          }, 1000);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
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

  const xpGain = useMemo(() => {
    if (!previousXp || previousXp === xp) return 0;
    return xp - previousXp;
  }, [previousXp, xp]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`relative ${className} ${
        isVisible ? "animate-[slideInScale_0.4s_ease-out_forwards]" : "animate-[slideOutScale_0.3s_ease-in_forwards]"
      }`}
      style={{
        transformOrigin: "top center",
        animationFillMode: "forwards",
      }}
    >
      {showXpNotification && xpGain > 0 && (
        <div
          className={`absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-700/95 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium border border-slate-600/50 shadow-lg backdrop-blur-sm z-10 ${
            isAnimating ? "animate-[bounceIn_0.6s_ease-out_forwards]" : "animate-[fadeOutUp_0.5s_ease-in_forwards]"
          }`}
        >
          +{xpGain} XP
        </div>
      )}

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
