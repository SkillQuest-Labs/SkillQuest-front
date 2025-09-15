// src/shared/components/SplineViewer.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

type SplineProps = React.HTMLAttributes<HTMLElement> & {
  url?: string;
  style?: React.CSSProperties;
};

const SplineElement = React.forwardRef<HTMLElement, SplineProps>((props, ref) =>
  React.createElement("spline-viewer", { ...props, ref }),
);
SplineElement.displayName = "SplineElement";

type SplineViewerProps = {
  url: string; // https://prod.spline.design/.../scene.splinecode
  height?: number | string; // ex "40vh" | 400
  className?: string; // tailwind etc.
};

const SplineViewer = React.forwardRef<HTMLDivElement, SplineViewerProps>(
  ({ url, height = "60vh", className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);

    // Charger le web component côté client uniquement
    useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          if (typeof window !== "undefined") {
            await import("@splinetool/viewer");
            if (mounted) setReady(true);
          }
        } catch (e) {
          console.error("[SplineViewer] failed to load viewer:", e);
        }
      })();
      return () => {
        mounted = false;
      };
    }, []);

    const style = useMemo<React.CSSProperties>(
      () => ({
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
      }),
      [height],
    );

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node as HTMLDivElement);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          containerRef.current = node;
        }}
        className={className}
        style={style}
      >
        {ready ? (
          <SplineElement
            key={url}
            url={url}
            style={{ width: "100%", height: "100%", border: "none", background: "transparent" }}
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <div className="text-slate-400 text-sm animate-pulse">Chargement du modèle 3D…</div>
          </div>
        )}
      </div>
    );
  },
);

SplineViewer.displayName = "SplineViewer";
export default SplineViewer;
