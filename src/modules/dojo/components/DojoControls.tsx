import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Eye, EyeOff, Maximize, Minimize, Video, Image as ImageIcon } from "lucide-react";

interface DojoControlsProps {
  isImmersive: boolean;
  isBackgroundVisible: boolean;
  onToggleImmersive: () => void;
  onToggleBackground: () => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  currentEnvironment: {
    id: string;
    name: string;
    videoUrl: string;
  };
  onEnvironmentChange: (environmentId: string) => void;
  availableEnvironments: Array<{
    id: string;
    name: string;
    videoUrl: string;
  }>;
}

export const DojoControls: React.FC<DojoControlsProps> = ({
  isImmersive,
  isBackgroundVisible,
  onToggleImmersive,
  onToggleBackground,
  onCollapseAll,
  onExpandAll,
  currentEnvironment,
  onEnvironmentChange,
  availableEnvironments,
}) => {
  const isVideo = currentEnvironment.videoUrl.endsWith(".mp4");

  return (
    <Card className="bg-black/60 backdrop-blur-sm border-white/20 text-white fixed top-4 right-4 z-50">
      <CardContent className="p-4 space-y-3">
        {/* Mode immersif */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={onToggleImmersive}
            variant={isImmersive ? "default" : "outline"}
            size="sm"
            className={
              isImmersive
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                : "border-white/20 text-white hover:bg-white/10"
            }
          >
            {isImmersive ? <Minimize className="w-4 h-4 mr-1" /> : <Maximize className="w-4 h-4 mr-1" />}
            {isImmersive ? "Normal" : "Immersif"}
          </Button>
        </div>

        {/* Contrôle du fond */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={onToggleBackground}
            variant={isBackgroundVisible ? "default" : "outline"}
            size="sm"
            className={
              isBackgroundVisible
                ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                : "border-white/20 text-white hover:bg-white/10"
            }
          >
            {isBackgroundVisible ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
            Fond
          </Button>
        </div>

        {/* Contrôle des cartes */}
        <div className="flex space-x-1">
          <Button
            onClick={onCollapseAll}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 text-xs"
          >
            − Toutes
          </Button>
          <Button
            onClick={onExpandAll}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 text-xs"
          >
            + Toutes
          </Button>
        </div>

        {/* Sélecteur d'environnement */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400">Environnement:</div>
          <div className="flex flex-wrap gap-1">
            {availableEnvironments.map((env) => (
              <Button
                key={env.id}
                onClick={() => onEnvironmentChange(env.id)}
                variant={currentEnvironment.id === env.id ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  currentEnvironment.id === env.id
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
                    : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                {env.videoUrl.endsWith(".mp4") ? (
                  <Video className="w-3 h-3 mr-1" />
                ) : (
                  <ImageIcon className="w-3 h-3 mr-1" />
                )}
                {env.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Indicateur de type de média */}
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          {isVideo ? (
            <>
              <Video className="w-3 h-3" />
              <span>Vidéo</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3 h-3" />
              <span>Image</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
