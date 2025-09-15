// src/component/intro/IntroRobotOverlay.tsx
import React, { useEffect, useRef, useState } from "react";
import SplineViewer from "@/shared/components/SplineViewer";

type Props = {
  splineUrl: string;
  lines: string[];
  storageKey: string;
  height?: string | number;
  onFinish?: () => void;
};

const IntroRobotOverlay: React.FC<Props> = ({
  splineUrl,
  lines,
  storageKey,
  height = "40vh",
  onFinish,
}) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const alreadyPlayed = localStorage.getItem(storageKey);
    if (!alreadyPlayed) {
      setVisible(true);
      localStorage.setItem(storageKey, "true");
    }
  }, [storageKey]);

  useEffect(() => {
    if (!visible || !videoRef.current) return;

    const playVideo = async () => {
      try {
        await videoRef.current?.play();
      } catch (err) {
        // Autoplay peut être bloqué → on ignore
        void err;
      }
    };

    playVideo();
  }, [step, visible]);

  const handleNext = () => {
    if (step < lines.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setVisible(false);
      onFinish?.();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 max-w-2xl w-full relative text-center">
        {/* Robot */}
        <div className="mb-4">
          <SplineViewer url={splineUrl} height={height} />
        </div>

        {/* Ligne de dialogue */}
        <p className="text-slate-200 mb-4">{lines[step]}</p>

        {/* Bouton suivant */}
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow"
        >
          {step < lines.length - 1 ? "Suivant" : "Terminer"}
        </button>

        {/* Vidéo associée (facultatif) */}
        <video
          ref={videoRef}
          src={`/voices/line-${step + 1}.mp4`}
          className="hidden"
          onEnded={handleNext}
          onError={() => {
            // Si une vidéo échoue, on passe direct à la suite
            handleNext();
          }}
        />
      </div>
    </div>
  );
};

export default IntroRobotOverlay;
