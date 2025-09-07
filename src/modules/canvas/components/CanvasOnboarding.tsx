import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

export const CanvasOnboarding = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("canvas_onboarding_done");
    if (!hasSeen) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("canvas_onboarding_done", "true");
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
      content: "Ajoutez une nouvelle quête en sélectionnant cet outil puis en cliquant sur le canvas.",
    },
    {
      target: '[data-tour="connect"]',
      content: "Reliez deux quêtes entre elles avec cet outil de lien.",
    },
    {
      target: '[data-tour="select"]',
      content: "Revenez au mode sélection pour déplacer ou modifier les quêtes.",
    },
    {
      target: '[data-tour="collapse"]',
      content: "Repliez toutes les quêtes pour avoir une vue d'ensemble.",
    },
    {
      target: '[data-tour="ai-generate"]',
      content: "Générez des idées de quêtes automatiquement grâce à l'IA.",
    },
    {
      target: '[data-tour="roadmap"]',
      content: "Accédez à la roadmap complète de vos compétences ici.",
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
      target: '[data-tour="canvas"]',
      content: "Ceci est votre zone de création. Cliquez ou faites glisser pour explorer et construire votre parcours.",
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{ options: { zIndex: 10000 } }}
    />
  );
};
