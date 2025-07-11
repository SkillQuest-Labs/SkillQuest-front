import { useLayoutEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { useCanvasOnboardingStore } from "@/stores/onboarding-store";

interface Step {
  id: string;
  target: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: "create",
    target: '[data-tour-id="create"]',
    title: "Créer une quête",
    description: "Clique sur l'icône Plus pour ajouter une nouvelle quête.",
  },
  {
    id: "handle",
    target: '[data-tour-id="handle"]',
    title: "Les points de connexion",
    description: "Chaque quête possède des poignées pour la relier à d'autres.",
  },
  {
    id: "connect",
    target: '[data-tour-id="connect"]',
    title: "Lier des quêtes",
    description: "Active le mode connexion puis clique sur deux quêtes pour les relier.",
  },
  {
    id: "save",
    target: '[data-tour-id="save"]',
    title: "Sauvegarder ton travail",
    description: "Enregistre le canvas grâce au bouton Save.",
  },
];

export const CanvasOnboarding = () => {
  const [step, setStep] = useState(0);
  const { setCompleted } = useCanvasOnboardingStore();
  const [highlight, setHighlight] = useState<React.CSSProperties>();
  const [dialog, setDialog] = useState<React.CSSProperties>();

  const current = steps[step];

  useLayoutEffect(() => {
    const el = document.querySelector(current.target) as HTMLElement | null;
    if (!el) {
      setHighlight(undefined);
      setDialog(undefined);
      return;
    }

    const rect = el.getBoundingClientRect();

    setHighlight({
      top: rect.top - 6,
      left: rect.left - 6,
      width: rect.width + 12,
      height: rect.height + 12,
    });

    const DIALOG_WIDTH = 288; // w-72
    const DIALOG_HEIGHT = 160;

    let left = rect.left + rect.width / 2;
    left = Math.min(window.innerWidth - DIALOG_WIDTH / 2 - 12, Math.max(DIALOG_WIDTH / 2 + 12, left));

    let top = rect.bottom + 12;
    if (top + DIALOG_HEIGHT > window.innerHeight) {
      top = rect.top - DIALOG_HEIGHT - 12;
    }

    setDialog({
      top,
      left,
    });
  }, [current.target]);

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const skip = () => setCompleted(true);

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {highlight && (
        <div
          className="absolute rounded-xl border-4 border-pink-500 shadow-[0_0_20px_rgba(255,0,180,0.6)] animate-pulse"
          style={highlight}
        />
      )}
      {dialog && (
        <div
          className="absolute -translate-x-1/2 w-72 bg-[rgba(12,8,33,0.9)] border-2 border-pink-500 text-white rounded-xl p-4 space-y-3 shadow-xl pointer-events-auto"
          style={dialog}
        >
          <h3 className="text-lg font-bold text-pink-300">{current.title}</h3>
          <p className="text-sm leading-relaxed text-gray-100">{current.description}</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" onClick={skip}>
              Ignorer
            </Button>
            <Button size="sm" onClick={next}>
              {step < steps.length - 1 ? "Suivant" : "Terminer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
