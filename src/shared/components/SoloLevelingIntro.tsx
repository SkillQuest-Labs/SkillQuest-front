import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  username?: string;
  onClose: (dontShowAgain?: boolean) => void;
};

export default function SoloLevelingIntro({
  open,
  username = "Aventurier",
  onClose,
}: Props) {
  const [visible, setVisible] = useState(open);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");

  // Texte d'intro (corrigé)
  const fullText =
    "Ceci est SkillQuest,une plateforme pédagogique gamifiée. Progresse par quêtes, " +
    "gagne de l’XP, monte de niveau et franchis des paliers de classe.";

  // 👉 Index + slice = pas de out-of-bounds, donc jamais 'undefined'
  const [idx, setIdx] = useState(0);
  const typedText = fullText.slice(0, idx);

  // Entrée/sortie
  useEffect(() => {
    if (open) {
      setVisible(true);
      setPhase("enter");
    } else {
      setPhase("exit");
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Typewriter (réinitialisé à chaque entrée)
  useEffect(() => {
    if (phase !== "enter") return;
    setIdx(0); // reset propre
    const id = setInterval(() => {
      setIdx((prev) => {
        if (prev >= fullText.length) {
          clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, 22);
    return () => clearInterval(id);
  }, [phase, fullText]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${
          phase === "enter" ? "animate-backdropIn" : "animate-backdropOut"
        } bg-black/70 backdrop-blur-[2px]`}
        onClick={() => onClose(false)}
      />

      {/* Flash bleu à l’ouverture */}
      {phase === "enter" && (
        <div className="absolute inset-0 bg-blue-400/40 animate-flash pointer-events-none" />
      )}

      {/* Panel */}
      <div
        className={`relative w-[92%] max-w-xl rounded-2xl overflow-hidden border border-slate-600/60 shadow-2xl
                    bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900
                    ${phase === "enter" ? "animate-panelIn" : "animate-panelOut"}`}
      >
        {/* Scanline subtile */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 -top-1 h-1 bg-white/10 blur-[2px] animate-scanline" />
        </div>

        <div className="p-6">
          <div className="text-xs tracking-widest text-slate-400 uppercase mb-2">Système</div>

          <h2 className="text-2xl font-extrabold text-slate-100 drop-shadow-[0_0_12px_rgba(59,130,246,0.25)]">
            Bienvenue, <span className="text-amber-300">{username ?? "Aventurier"}</span>
          </h2>

          {/* Texte “typewriter” fiable */}
          <p className="mt-3 text-slate-300 leading-relaxed min-h-[80px]">
            {typedText}
            <span className="animate-cursor">|</span>
          </p>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={() => onClose(true)}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-600/60 text-slate-200 hover:bg-slate-800/70 transition"
            >
              Ne plus me montrer
            </button>
            <button
              onClick={() => onClose(false)}
              className="px-3 py-1.5 text-sm rounded-md bg-amber-500/90 hover:bg-amber-400 text-slate-900 font-semibold shadow"
            >
              Commencer
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes backdropIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes backdropOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes panelIn {
          0% { transform: scale(.94) translateY(6px); opacity: 0; filter: blur(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes panelOut {
          0% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
          100% { transform: scale(.96) translateY(6px); opacity: 0; filter: blur(2px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%) }
          100% { transform: translateY(200%) }
        }
        @keyframes flash { 0% { opacity: .8 } 100% { opacity: 0 } }
        @keyframes cursor { 0%,49%{opacity:1} 50%,100%{opacity:0} }

        .animate-backdropIn { animation: backdropIn .25s ease-out forwards; }
        .animate-backdropOut{ animation: backdropOut .25s ease-in forwards; }
        .animate-panelIn    { animation: panelIn .30s cubic-bezier(.2,.65,.2,1) forwards; }
        .animate-panelOut   { animation: panelOut .25s ease-in forwards; }
        .animate-scanline   { animation: scanline 2.4s linear infinite; }
        .animate-flash      { animation: flash .5s ease-out forwards; }
        .animate-cursor     { animation: cursor 1s step-start infinite; }
      `}</style>
    </div>
  );
}
