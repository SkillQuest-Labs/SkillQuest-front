import React from "react";
import type { DojoEnvironment } from "../types/dojo.types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Play } from "lucide-react";

interface EnvironmentSelectorProps {
  environments: DojoEnvironment[];
  selectedEnvironment: DojoEnvironment;
  onSelectEnvironment: (environment: DojoEnvironment) => void;
  onLaunchDojo: () => void;
  canLaunch: boolean;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  environments,
  selectedEnvironment,
  onSelectEnvironment,
  onLaunchDojo,
  canLaunch,
}) => {
  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-white mb-1">Biomes Immersifs</h2>
        <p className="text-gray-400 text-xs">Choisissez l'environnement dans lequel vous souhaitez travailler</p>
      </div>

      {/* Bande horizontale avec défilement */}
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 pb-2 min-w-max">
          {environments.map((environment) => (
            <Card
              key={environment.id}
              className={`bg-slate-800/50 border-slate-700/50 transition-all cursor-pointer flex-shrink-0 ${
                selectedEnvironment.id === environment.id
                  ? "ring-2 ring-blue-500/50 bg-blue-900/20"
                  : "hover:bg-slate-700/50"
              }`}
              onClick={() => onSelectEnvironment(environment)}
            >
              <CardContent className="p-3 w-20 h-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700/50 flex items-center justify-center mb-1">
                  {environment.videoUrl.endsWith(".mp4") ? (
                    <video src={environment.videoUrl} className="w-full h-full object-cover" muted loop playsInline />
                  ) : (
                    <img src={environment.videoUrl} alt={environment.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <h3 className="text-white text-xs font-medium text-center truncate w-full">{environment.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bouton de lancement principal */}
      <div className="text-center pt-4">
        <Button
          onClick={onLaunchDojo}
          disabled={!canLaunch}
          size="sm"
          className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 disabled:opacity-50 px-6 py-2 text-sm"
        >
          <Play className="w-4 h-4 mr-2" />
          Lancer le Dojo Immersif
        </Button>
        {!canLaunch && (
          <p className="text-gray-400 text-xs mt-1">Sélectionnez des quêtes ou une session pour lancer le Dojo</p>
        )}
      </div>
    </div>
  );
};
