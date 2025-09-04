import { useEffect, useState } from "react";
import type { UserClass } from "@/shared/lib/progression";

type Props = {
  show: boolean;
  userClass: UserClass;
  badge: string;
  onHide?: () => void;
  durationMs?: number;
};

export default function LevelUpToast({ show, userClass, badge, onHide, durationMs = 2200 }: Props) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onHide?.();
    }, durationMs);
    return () => clearTimeout(t);
  }, [show, durationMs, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-28 right-6 z-[60] pointer-events-none">
      <div className="relative px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-2xl backdrop-blur-md
                      animate-[pop_320ms_ease-out]">
        <div className="flex items-center gap-3">
          <img src={badge} alt={userClass} className="w-10 h-10 drop-shadow animate-[pulseGlow_1.2s_ease-in-out_infinite]" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-400">Changement de classe</span>
            <span className="text-base font-semibold text-slate-100">Vous êtes maintenant <span className="text-amber-300">{userClass}</span> !</span>
          </div>
        </div>
      </div>

      {/* Confetti ultra-simple (3 éclats) */}
      <div className="absolute -top-4 -left-2 w-2 h-2 bg-amber-400 rounded-full animate-[conf1_900ms_ease-out]"></div>
      <div className="absolute -top-3 left-8 w-2 h-2 bg-emerald-400 rounded-full animate-[conf2_1000ms_ease-out]"></div>
      <div className="absolute -top-2 left-16 w-2 h-2 bg-violet-400 rounded-full animate-[conf3_1100ms_ease-out]"></div>

      <style>{`
        @keyframes pop { 0%{transform:scale(.8);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes pulseGlow { 0%,100%{filter:drop-shadow(0 0 0 rgba(251,191,36,.0))} 50%{filter:drop-shadow(0 0 8px rgba(251,191,36,.6))} }
        @keyframes conf1 { 0%{transform:translate(0,0)} 100%{transform:translate(-12px,-24px);opacity:0} }
        @keyframes conf2 { 0%{transform:translate(0,0)} 100%{transform:translate(8px,-28px);opacity:0} }
        @keyframes conf3 { 0%{transform:translate(0,0)} 100%{transform:translate(16px,-22px);opacity:0} }
      `}</style>
    </div>
  );
}
