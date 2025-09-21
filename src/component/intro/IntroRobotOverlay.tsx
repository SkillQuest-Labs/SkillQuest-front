import { useEffect, useRef, useState } from "react";
import SplineViewer from "@/shared/components/SplineViewer";

type VoiceLine = {
  id: string;
  src: string;
};

type Props = {
  splineUrl: string;
  lines: VoiceLine[];
  storageKey?: string;
  height?: string | number;
  onFinish?: () => void;
};

export default function IntroRobotOverlay({
  splineUrl,
  lines,
  storageKey = "intro_robot",
  height = "40vh",
  onFinish,
}: Props) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Vérifie si l’intro a déjà été vue
    const seen = localStorage.getItem(storageKey);
    if (seen === "true") {
      setSkipIntro(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!started || !videoRef.current) return;

    const video = videoRef.current;
    video.src = lines[index].src;
    video.play().catch((err) => {
      console.warn("Impossible de jouer la voice line:", err);
    });
  }, [index, started, lines]);

  const handleEnded = () => {
    if (index < lines.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      // Marque comme "vu"
      localStorage.setItem(storageKey, "true");
      setSkipIntro(true);
      onFinish?.();
    }
  };

  const handleStart = () => {
    setStarted(true);
    setIndex(0);
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, "true");
    setSkipIntro(true);
    onFinish?.();
  };

  if (skipIntro || !lines || lines.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center space-y-4">
        <SplineViewer url={splineUrl} height={height} />

        {!started ? (
          <div className="flex gap-4">
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold rounded-xl shadow-lg hover:scale-105 transition"
            >
              🚀 Commencer
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-3 bg-slate-700/70 text-white font-semibold rounded-xl shadow hover:bg-slate-600/80"
            >
              ⏭️ Passer
            </button>
          </div>
        ) : (
          <p className="text-slate-200 text-sm mt-2 animate-pulse">
            {index + 1}/{lines.length} – Lecture en cours...
          </p>
        )}
      </div>

      {/* Lecteur caché */}
      <video ref={videoRef} onEnded={handleEnded} playsInline preload="auto" className="hidden" />
    </div>
  );
}
