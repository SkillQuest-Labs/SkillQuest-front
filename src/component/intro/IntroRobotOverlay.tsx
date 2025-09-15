// src/component/intro/IntroRobotOverlay.tsx
import React, { useEffect, useRef, useState } from "react";
import SplineViewer from "@/shared/components/SplineViewer";

type Props = {
  userId: string;                 // ← requis pour le "show once" par utilisateur
  versionKey?: string;            // change-la pour ré-afficher à tout le monde (ex: "v1", "v2")
  splineUrl: string;              // scene.splinecode
  lines: string[];                // ex: ROBOT_INTRO_LINES.map(l => l.src)
  height?: string | number;
  onClose?: () => void;
};

function isVideoSrc(src: string) {
  const lower = src.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov");
}

const IntroRobotOverlay: React.FC<Props> = ({
  userId,
  versionKey = "v1",
  splineUrl,
  lines,
  height = "40vh",
  onClose,
}) => {
  // clé unique par utilisateur + version
  const storageKey = `intro_robot_${versionKey}:${userId || "anonymous"}`;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [needsGesture, setNeedsGesture] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentSrc = lines[step] ?? "";
  const isVideo = isVideoSrc(currentSrc);

  // Afficher UNE seule fois : si pas de trace → ouvrir, puis marquer comme "vu"
  useEffect(() => {
    if (!userId) return; // attendre userId (Clerk) si besoin
    try {
      const seen = localStorage.getItem(storageKey) === "1";
      if (!seen) {
        setOpen(true);
        localStorage.setItem(storageKey, "1");
      }
    } catch {
      // localStorage peut être indisponible (mode privé) → on ouvre quand même
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, versionKey]); // si version change, la clé change → se réaffichera une fois

  // Lecture de la ligne courante (autoplay best effort)
  useEffect(() => {
    if (!open || !currentSrc) return;

    const media = isVideo ? videoRef.current : audioRef.current;
    if (!media) return;

    media.currentTime = 0;
    const playPromise = media.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => setNeedsGesture(false))
        .catch(() => setNeedsGesture(true)); // autoplay bloqué
    }
  }, [open, currentSrc, isVideo]);

  const handleEnableSound = async () => {
    const media = isVideo ? videoRef.current : audioRef.current;
    if (!media) return;
    try {
      await media.play();
      setNeedsGesture(false);
    } catch {
      // si ça échoue, on laisse le bouton affiché
    }
  };

  const handleNext = () => {
    if (step < lines.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleClose = () => {
    const a = audioRef.current;
    const v = videoRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    if (v) { v.pause(); v.currentTime = 0; }
    setOpen(false);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-slate-700 bg-slate-900/80 shadow-2xl p-6">
        {/* Fermer */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 rounded-md px-2 py-1 text-slate-300 hover:text-white hover:bg-white/10"
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* Robot */}
        <div className="mb-4">
          <SplineViewer url={splineUrl} height={height} />
        </div>

        {/* Media dans le DOM (autoplay policy) */}
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentSrc}
            playsInline
            className="hidden"
            onEnded={() => {/* on ne close pas auto */}}
          />
        ) : (
          <audio
            ref={audioRef}
            src={currentSrc}
            className="hidden"
            onEnded={() => {/* on ne close pas auto */}}
          />
        )}

        {/* Contrôles */}
        <div className="flex items-center justify-center gap-3">
          {needsGesture && (
            <button
              onClick={handleEnableSound}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow"
            >
              Activer le son
            </button>
          )}

          {step < lines.length - 1 && (
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow"
            >
              Suivant
            </button>
          )}

          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-white/10"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroRobotOverlay;
