import { useEffect, useMemo, useState } from "react";

type XpCelebrationOverlayProps = {
  visible: boolean;
  xpGain: number;
  level: number;
  onComplete?: () => void;
};

type ShardConfig = {
  top: string;
  left: string;
  delay: number;
  scale: number;
};

const SHARDS: ShardConfig[] = [
  { top: "24%", left: "30%", delay: 0, scale: 0.75 },
  { top: "20%", left: "65%", delay: 140, scale: 0.8 },
  { top: "44%", left: "78%", delay: 240, scale: 0.7 },
  { top: "60%", left: "24%", delay: 280, scale: 0.78 },
  { top: "70%", left: "52%", delay: 340, scale: 0.85 },
  { top: "34%", left: "18%", delay: 420, scale: 0.72 },
];

const XpCelebrationOverlay = ({ visible, xpGain, level, onComplete }: XpCelebrationOverlayProps) => {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      return;
    }

    const timeout = setTimeout(() => {
      setShouldRender(false);
      onComplete?.();
    }, 400);

    return () => clearTimeout(timeout);
  }, [visible, onComplete]);

  const isXpEarned = xpGain > 0;
  const primaryText = useMemo(
    () => (isXpEarned ? `+${Math.round(xpGain).toLocaleString()} XP` : "Session validée"),
    [isXpEarned, xpGain],
  );
  const headerLabel = useMemo(() => (isXpEarned ? "Progression" : "Succès"), [isXpEarned]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[70] flex items-center justify-center ${
        visible ? "animate-[overlayFadeIn_0.5s_ease-out_forwards]" : "animate-[overlayFadeOut_0.35s_ease-in_forwards]"
      }`}
    >
      {/* Overlay plus sombre et gamifié */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90 backdrop-blur-[3px]" />

      {/* Grille de particules d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-amber-300/30 animate-[floatParticle_6s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Cercle principal gamifié avec contenu centré */}
      <div className="relative flex h-64 w-64 items-center justify-center">
        {/* Aura externe plus intense */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/40 via-fuchsia-500/30 to-cyan-400/35 blur-[60px] opacity-95 animate-[overlayPulse_2s_ease-out_forwards]" />

        {/* Anneaux concentriques avec effet de pulsation */}
        <div className="absolute inset-0 rounded-full border-2 border-amber-200/80 opacity-95 animate-[xpRing_1.6s_ease-out_forwards]" />
        <div
          className="absolute inset-8 rounded-full border border-amber-100/60 opacity-80 animate-[xpRing_1.6s_ease-out_forwards]"
          style={{ animationDelay: "300ms" }}
        />
        <div
          className="absolute inset-16 rounded-full border border-amber-50/50 opacity-70 animate-[xpRing_1.6s_ease-out_forwards]"
          style={{ animationDelay: "600ms" }}
        />

        {/* Gradient de fond plus riche */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/20 via-transparent to-indigo-400/25" />

        {/* Effet de brillance rotatif */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[rotateGlow_4s_linear_infinite] opacity-70" />

        {/* Contenu centré dans le cercle */}
        <div className="relative flex flex-col items-center justify-center text-center space-y-2">
          {/* Texte "Bravo" */}
          <span className="text-3xl font-extrabold uppercase tracking-[0.3em] text-amber-50 drop-shadow-[0_4px_20px_rgba(251,191,36,0.6)] animate-[textGlow_2.5s_ease-in-out_infinite]">
            Bravo
          </span>

          {/* Message principal centré */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.5em] text-amber-200/90 animate-[fadeInUp_1s_ease-out_forwards]">
              {headerLabel}
            </span>

            <h2 className="bg-gradient-to-r from-amber-100 via-white to-fuchsia-200 bg-clip-text text-2xl font-black uppercase tracking-[0.2em] text-transparent drop-shadow-[0_6px_25px_rgba(15,23,42,0.7)] animate-[scaleIn_1.2s_ease-out_forwards]">
              {primaryText}
            </h2>

            {/* Badge niveau gamifié */}
            <div className="relative">
              <span className="rounded-full border-2 border-amber-300/80 bg-gradient-to-r from-slate-900/90 to-slate-800/90 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-amber-100 shadow-[0_10px_25px_rgba(251,191,36,0.4)] backdrop-blur-sm animate-[bounceIn_1.4s_ease-out_forwards]">
                Niveau {level}
              </span>
              {/* Effet de brillance sur le badge */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite] opacity-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Shards gamifiés avec plus d'effets */}
      {SHARDS.map((shard, index) => (
        <span
          key={`${shard.top}-${shard.left}-${index}`}
          className="pointer-events-none absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200/95 via-white/85 to-indigo-200/80 opacity-0 shadow-[0_0_30px_rgba(251,191,36,0.7)] animate-[xpShard_2.5s_ease-out_forwards]"
          style={{
            top: shard.top,
            left: shard.left,
            animationDelay: `${shard.delay}ms`,
            transform: `translate(-50%, -50%) scale(${shard.scale})`,
          }}
        />
      ))}

      {/* Particules supplémentaires pour plus d'effet gamifié */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`extra-particle-${i}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/70 opacity-0 animate-[sparkle_3s_ease-out_forwards]"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
            animationDelay: `${Math.random() * 3000}ms`,
          }}
        />
      ))}

      {/* Effet de confettis gamifié */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute h-2 w-2 rounded-full opacity-0 animate-[confetti_2s_ease-out_forwards]"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${30 + Math.random() * 40}%`,
            animationDelay: `${Math.random() * 1000}ms`,
            backgroundColor: ["#fbbf24", "#f59e0b", "#d97706", "#92400e", "#451a03"][Math.floor(Math.random() * 5)],
          }}
        />
      ))}
    </div>
  );
};

export default XpCelebrationOverlay;
