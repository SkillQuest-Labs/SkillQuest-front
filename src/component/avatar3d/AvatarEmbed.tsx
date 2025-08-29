import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Sketchfab: any;
  }
}

type Props = {
  modelId?: string;
  height?: number | string;
};

const AvatarEmbed: React.FC<Props> = ({ modelId = "60facf5107264e6f9d9f2071f9efca7c", height = "70vh" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    const ensureSDK = () =>
      new Promise<void>((resolve) => {
        if (window.Sketchfab) return resolve();
        const s = document.createElement("script");
        s.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    ensureSDK().then(() => {
      if (!containerRef.current) return;

      const client = new window.Sketchfab("1.12.1", containerRef.current);

      client.init(modelId, {
        autostart: 1,
        preload: 1,
        transparent: 1,
        ui_infos: 0,
        ui_controls: 0,
        ui_watermark: 0,
        ui_hint: 0,
        success: (viewerApi: any) => {
          viewerApi.addEventListener("viewerready", () => {
            setApi(viewerApi);
            try {
              viewerApi.start();
              viewerApi.setShowGrid(false);
            } catch (e) {
              console.warn("Sketchfab viewer start issue", e);
            }
          });
        },
        error: (e: any) => {
          console.error("Sketchfab init error", e);
        },
      });
    });
  }, [modelId]);

  // Exemple de commandes API (facultatif)
  const rotateCamera = () => {
    if (!api) return;
    api.setCameraLookAt(
      [0, 0, 2], // position caméra
      [0, 0, 0], // cible
      2, // durée en secondes
    );
  };

  const resetCamera = () => {
    if (!api) return;
    api.resetCamera(() => console.log("Caméra reset"));
  };

  return (
    <div style={{ width: "100%", height, background: "transparent" }}>
      {/* Sketchfab injecte le viewer ici */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Boutons de test */}
      <div style={{ marginTop: 10, display: "flex", gap: "10px" }}>
        <button onClick={rotateCamera}>Tourner caméra</button>
        <button onClick={resetCamera}>Reset caméra</button>
      </div>
    </div>
  );
};

export default AvatarEmbed;
