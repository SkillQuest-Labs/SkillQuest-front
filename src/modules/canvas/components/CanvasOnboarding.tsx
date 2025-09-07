import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useCanvasStore } from "@/stores/canvas/canvas-store";

export const CanvasOnboarding = () => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const cursorMode = useCanvasStore((s) => s.cursorMode);
  const nodeCount = useCanvasStore((s) => s.nodes.length);
  const edgeCount = useCanvasStore((s) => s.edges.length);

  useEffect(() => {
    const hasSeen = localStorage.getItem("canvas_onboarding_done");
    if (!hasSeen) {
      setRun(true);
    }
  }, []);

  useEffect(() => {
    if (!run) return;

    if (stepIndex === 1 && cursorMode === "create") {
      setStepIndex(2);
    }
    if (stepIndex === 2 && nodeCount >= 1) {
      setStepIndex(3);
    }
    if (stepIndex === 3 && nodeCount >= 2) {
      setStepIndex(4);
    }
    if (stepIndex === 4 && cursorMode === "connect") {
      setStepIndex(5);
    }
    if (stepIndex === 5 && edgeCount >= 1) {
      setStepIndex(6);
    }
  }, [cursorMode, nodeCount, edgeCount, stepIndex, run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("canvas_onboarding_done", "true");
      return;
    }

    if (type === "step:after" || type === "target:notFound") {
      setStepIndex(index + 1);
    }
  };

  const steps: Step[] = [
    {
      target: '[data-tour="toolbox"]',
      content:
        "La boîte à outils vous permet de créer et de relier des quêtes. Cliquer sur une icône change le mode du curseur.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="create"]',
      content: "Sélectionnez l'outil de création pour ajouter une quête.",
      spotlightClicks: true,
    },
    {
      target: '[data-tour="canvas"]',
      content: "Cliquez sur le canvas pour créer votre première quête.",
      spotlightClicks: true,
      placement: "center",
    },
    {
      target: '[data-tour="canvas"]',
      content: "Créez une deuxième quête pour pouvoir les relier.",
      spotlightClicks: true,
      placement: "center",
    },
    {
      target: '[data-tour="connect"]',
      content: "Passez à l'outil de connexion pour relier vos quêtes.",
      spotlightClicks: true,
    },
    {
      target: '[data-tour="canvas"]',
      content: "Cliquez sur deux quêtes pour créer un lien entre elles.",
      spotlightClicks: true,
      placement: "center",
    },
    {
      target: '[data-tour="minimap"]',
      content: "La mini-carte offre une vue globale du canvas.",
    },
    {
      target: '[data-tour="controls"]',
      content: "Utilisez ces contrôles pour zoomer ou ajuster la vue.",
    },
    {
      target: '[data-tour="roadmap"]',
      content: "Accédez à la roadmap complète de vos compétences ici.",
    },
    {
      target: '[data-tour="canvas"]',
      content: "Ceci est votre zone de création. Cliquez ou faites glisser pour explorer et construire votre parcours.",
      placement: "center",
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      showSkipButton
      disableOverlayClose
      spotlightClicks
      callback={handleJoyrideCallback}
      styles={{ options: { zIndex: 10000 } }}
    />
  );
};
