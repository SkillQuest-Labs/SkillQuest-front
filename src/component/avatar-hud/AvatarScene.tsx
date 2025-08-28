import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import AvatarOverlay from './AvatarOverlay';

export default function AvatarScene() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [2, 1.5, 2.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />
        <Environment preset="city" />
        <OrbitControls enableDamping />
        <Suspense fallback={null}>
          {/* L’IFRAME est encapsulée dans <Html> → OK */}
          <AvatarOverlay />
        </Suspense>
      </Canvas>
    </div>
  );
}
