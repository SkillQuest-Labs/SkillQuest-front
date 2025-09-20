import React from "react";
import type { DojoEnvironment } from "../types/dojo.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Play, Clock, Star } from "lucide-react";

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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Environnements Immersifs</h2>
        <p className="text-gray-400 text-sm">Choisissez l'environnement dans lequel vous souhaitez travailler</p>
      </div>

      <div className="grid gap-4">
        {environments.map((environment) => (
          <Card
            key={environment.id}
            className={`bg-slate-800/50 border-slate-700/50 transition-all cursor-pointer ${
              selectedEnvironment.id === environment.id
                ? "ring-2 ring-blue-500/50 bg-blue-900/20"
                : "hover:bg-slate-700/50"
            }`}
            onClick={() => onSelectEnvironment(environment)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700/50 flex items-center justify-center">
                    {environment.videoUrl.endsWith(".mp4") ? (
                      <video src={environment.videoUrl} className="w-full h-full object-cover" muted loop playsInline />
                    ) : (
                      <img src={environment.videoUrl} alt={environment.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{environment.name}</CardTitle>
                    <CardDescription className="text-gray-400">{environment.description}</CardDescription>
                  </div>
                </div>
                {selectedEnvironment.id === environment.id && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Sélectionné</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Environnement immersif</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>Actif</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEnvironment(environment);
                    }}
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Prévisualiser
                  </Button>
                  {selectedEnvironment.id === environment.id && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLaunchDojo();
                      }}
                      size="sm"
                      disabled={!canLaunch}
                      className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Lancer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bouton de lancement principal */}
      <div className="text-center pt-4">
        <Button
          onClick={onLaunchDojo}
          disabled={!canLaunch}
          size="lg"
          className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 disabled:opacity-50 px-8 py-3 text-lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Lancer le Dojo Immersif
        </Button>
        {!canLaunch && (
          <p className="text-gray-400 text-sm mt-2">Sélectionnez des quêtes ou une session pour lancer le Dojo</p>
        )}
      </div>
    </div>
  );
};
