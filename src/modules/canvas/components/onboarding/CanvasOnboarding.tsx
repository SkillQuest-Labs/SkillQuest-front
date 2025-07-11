import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useCanvasOnboardingStore } from "@/stores/onboarding-store";

const steps = [
  {
    title: "Créer une quête",
    description: 'Utilise l\'outil "Create Quest" pour ajouter une nouvelle quête sur le canvas.',
  },
  {
    title: "Lier des quêtes",
    description: 'Sélectionne le mode "Link Quests" puis clique sur deux quêtes pour les relier.',
  },
  {
    title: "Réduire ou agrandir",
    description: 'Le bouton "Collapse/Expand All" te permet de masquer ou d\'afficher les quêtes.',
  },
  {
    title: "Sauvegarder ton travail",
    description: "Clique sur le bouton Save pour enregistrer les modifications de ton canvas.",
  },
];

export const CanvasOnboarding = () => {
  const [step, setStep] = useState(0);
  const { setCompleted } = useCanvasOnboardingStore();

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const progress = Math.round(((step + 1) / steps.length) * 100);
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <Card className="max-w-md w-full space-y-4 text-center">
        <CardHeader>
          <CardTitle>{current.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{current.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <Button onClick={next} className="self-end">
            {step < steps.length - 1 ? "Suivant" : "Terminer"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
