import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { CarModel } from './CarModel';
import { Workshop } from './Workshop';
import { CameraRig } from './CameraRig';
import { ActivePart, THREE_CONFIG } from './config';
import { WebGLFallback } from './Fallback';

interface SceneProps {
  currentStation: 'hero' | 'services' | 'about' | 'booking' | 'footer';
  activePart: ActivePart;
}

export const Scene: React.FC<SceneProps> = ({ currentStation, activePart }) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [4.2, 1.9, 5.0], fov: 42 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Subtle Studio & Workshop Ambient & Key Lighting */}
          <ambientLight intensity={0.65} color="#cbd5e1" />
          
          {/* Main Key Spotlight on Vehicle Hood & Cockpit */}
          <spotLight
            position={[5, 7, 4]}
            angle={0.5}
            penumbra={0.7}
            intensity={2.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
            color="#ffffff"
          />

          {/* Automotive Rim / Fill Cool Blue Spotlight */}
          <spotLight
            position={[-6, 5, -3]}
            angle={0.6}
            penumbra={0.8}
            intensity={2.0}
            color="#38bdf8"
          />

          {/* Warm Accent Workshop Side Light */}
          <pointLight position={[3, 3, -2]} intensity={1.2} color="#f97316" distance={10} />

          {/* Under-Vehicle Contact Shadows for Grounding */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.75}
            scale={10}
            blur={1.8}
            far={3.5}
            resolution={512}
            color="#020408"
          />

          {/* Environment preset for reflections */}
          <Environment preset="city" />

          {/* Workshop Architecture & Hydraulic Lifts */}
          <Workshop />

          {/* High-Performance 3D Vehicle */}
          <CarModel activePart={activePart} />

          {/* Camera Motion System */}
          <CameraRig
            currentStation={currentStation}
            activePart={activePart}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>

      {/* Cinematic Vignette & Ambient Workshop Atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,10,16,0.85)_100%)]" />
      
      {/* Subtle bottom fade to seamlessly blend into lower sections */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-[#070a10] to-transparent" />
    </div>
  );
};
