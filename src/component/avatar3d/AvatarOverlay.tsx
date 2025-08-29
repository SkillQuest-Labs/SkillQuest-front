import { Html } from "@react-three/drei";

export default function AvatarOverlay() {
  return (
    <Html fullscreen>
      <div style={{ width: "100%", height: "100%" }}>
        <iframe
          title="セリア＝クレール"
          src="https://sketchfab.com/models/60facf5107264e6f9d9f2071f9efca7c/embed"
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
      </div>
    </Html>
  );
}
